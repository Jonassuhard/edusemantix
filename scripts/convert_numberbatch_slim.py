#!/usr/bin/env python3
"""
Convert ConceptNet Numberbatch to slim binary format.
Filters to ~350K most useful French words to fit in 512MB RAM.
"""
import gzip
import json
import os
import re
import numpy as np

TARGET_DIM = 100
MAX_WORDS = 350000  # ~133 MB vectors + ~5 MB index = ~138 MB RAM

STOPWORDS = set("""
le la les un une des de du au aux en dans par pour sur avec sans
ce ces cette cet son sa ses mon ma mes ton ta tes notre nos votre vos leur leurs
je tu il elle on nous vous ils elles me te se lui
qui que quoi dont où quel quelle quels quelles
et ou mais ni car donc si
ne pas plus très bien aussi
être avoir faire aller dire pouvoir vouloir devoir savoir voir
est sont était été sera serait fait font va vont dit peut
même tout toute tous toutes autre autres
""".split())

def word_quality_score(word):
    """Score a word's usefulness for a word game. Higher = keep."""
    w = word.lower()
    score = 0

    # Prefer common word lengths (3-12 chars)
    if 3 <= len(w) <= 12:
        score += 10
    elif len(w) <= 15:
        score += 5
    elif len(w) > 20:
        score -= 20

    # Penalize likely conjugations/derivations (long suffixes)
    conj_suffixes = ['eraient', 'assions', 'assiez', 'erions', 'issons',
                     'issent', 'irions', 'iraient', 'issions', 'erait',
                     'erons', 'eront', 'eriez', 'asses', 'assent',
                     'issez', 'irent', 'èrent', 'aient', 'ions']
    for suf in conj_suffixes:
        if w.endswith(suf) and len(w) > len(suf) + 3:
            score -= 15
            break

    # Penalize participles/gerunds
    if w.endswith('ant') and len(w) > 5:
        score -= 5
    if w.endswith('ants') and len(w) > 6:
        score -= 8

    # Prefer base forms (no -s, -es, -ées, -és plurals)
    if w.endswith('s') and len(w) > 4:
        score -= 3

    # Bonus for likely base/common words
    if len(w) <= 8:
        score += 5

    # Penalize words with rare character sequences (likely technical)
    if re.search(r'[kxwz]{2}', w):
        score -= 10

    return score

def is_valid_word(word):
    w = word.lower()
    if len(w) < 2 or len(w) > 25:
        return False
    if not re.match(r'^[a-zàâäéèêëïîôùûüÿçœæ](?:[a-zàâäéèêëïîôùûüÿçœæ\-\']*[a-zàâäéèêëïîôùûüÿçœæ])?$', w):
        return False
    if w in STOPWORDS:
        return False
    if re.search(r'(.)\1{3,}', w):
        return False
    return True


def main():
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    gz_path = os.path.join(data_dir, "numberbatch-19.08.txt.gz")

    # ── Step 1: Read all French vectors ──
    print("Reading ConceptNet Numberbatch (French)...")
    all_words = []
    all_vecs = []
    all_scores = []
    seen = set()
    total = 0
    fr = 0

    with gzip.open(gz_path, 'rt', encoding='utf-8') as f:
        f.readline()  # skip header
        for line in f:
            total += 1
            if total % 500000 == 0:
                print(f"  {total} lines, {fr} French...", end='\r')

            parts = line.strip().split(' ')
            if len(parts) < 10:
                continue

            if not parts[0].startswith('/c/fr/'):
                continue

            word = parts[0][6:].replace('_', '-').lower()
            if ' ' in word or word in seen or not is_valid_word(word):
                continue

            try:
                vec = np.array([float(x) for x in parts[1:]], dtype=np.float32)
            except ValueError:
                continue

            norm = np.linalg.norm(vec)
            if norm < 1e-6:
                continue

            seen.add(word)
            all_words.append(word)
            all_vecs.append(vec / norm)
            all_scores.append(word_quality_score(word))
            fr += 1

    print(f"\n  Total: {fr} French words from {total} lines")

    # ── Step 1b: Load schedule words (must be included) ──
    schedule_path = os.path.join(data_dir, "schedule.json")
    schedule_words = set()
    if os.path.exists(schedule_path):
        with open(schedule_path, "r") as f:
            for day in json.load(f):
                for w in day:
                    schedule_words.add(w.lower())
    print(f"  Schedule words to force-include: {len(schedule_words)}")

    # ── Step 2: Keep top N by quality score, force-include schedule words ──
    if fr > MAX_WORDS:
        print(f"\nFiltering {fr} → {MAX_WORDS} words by quality...")
        # Force-include schedule words
        forced_indices = []
        other_indices = []
        for i, w in enumerate(all_words):
            if w in schedule_words:
                forced_indices.append(i)
            else:
                other_indices.append(i)
        # Fill remaining slots with best-scoring words
        other_scores = [(i, all_scores[i]) for i in other_indices]
        other_scores.sort(key=lambda x: x[1], reverse=True)
        remaining = MAX_WORDS - len(forced_indices)
        top_other = [i for i, _ in other_scores[:remaining]]
        indices = sorted(forced_indices + top_other)
        words = [all_words[i] for i in indices]
        raw_vecs = np.array([all_vecs[i] for i in indices], dtype=np.float32)
        print(f"  Forced: {len(forced_indices)}, quality-filtered: {len(top_other)}")
    else:
        words = all_words
        raw_vecs = np.array(all_vecs, dtype=np.float32)

    print(f"  Kept {len(words)} words, {raw_vecs.shape[1]}d")

    # ── Step 3: PCA reduction ──
    from sklearn.decomposition import PCA
    print(f"\nPCA {raw_vecs.shape[1]}d → {TARGET_DIM}d...")
    pca = PCA(n_components=TARGET_DIM)
    reduced = pca.fit_transform(raw_vecs).astype(np.float32)
    print(f"  Explained variance: {pca.explained_variance_ratio_.sum():.1%}")

    # Re-normalize
    norms = np.linalg.norm(reduced, axis=1, keepdims=True)
    norms[norms < 1e-8] = 1
    reduced = reduced / norms

    # Sort alphabetically
    pairs = sorted(zip(words, reduced.tolist()), key=lambda x: x[0])
    words = [p[0] for p in pairs]
    vecs = np.array([p[1] for p in pairs], dtype=np.float32)

    # ── Step 4: Save ──
    index_data = {"dim": TARGET_DIM, "count": len(words), "words": words}
    index_path = os.path.join(data_dir, "vectors.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index_data, f, ensure_ascii=False, separators=(',', ':'))

    vec_path = os.path.join(data_dir, "vectors.bin")
    vecs.tofile(vec_path)
    vec_size = os.path.getsize(vec_path)

    # Split for GitHub (<100MB per file)
    if vec_size > 90_000_000:
        half = len(words) // 2
        path_a = os.path.join(data_dir, "vectors_a.bin")
        path_b = os.path.join(data_dir, "vectors_b.bin")
        vecs[:half].tofile(path_a)
        vecs[half:].tofile(path_b)
        print(f"  Split: {os.path.getsize(path_a)/1e6:.1f} + {os.path.getsize(path_b)/1e6:.1f} MB")

    idx_mb = os.path.getsize(index_path) / 1e6
    vec_mb = vec_size / 1e6
    print(f"\n  Index: {idx_mb:.1f} MB ({len(words)} words)")
    print(f"  Vectors: {vec_mb:.1f} MB")
    print(f"  Estimated RAM: ~{(idx_mb + vec_mb) * 1.2:.0f} MB")

    # ── Step 5: Quality check ──
    word_idx = {w: i for i, w in enumerate(words)}

    def top_n(target, n=10):
        if target not in word_idx:
            return []
        v = vecs[word_idx[target]]
        scores = np.dot(vecs, v)
        top = np.argsort(scores)[::-1][1:n+1]
        return [(words[i], float(scores[i]) * 100) for i in top]

    print(f"\n{'='*50}")
    print("QUALITY CHECK — Numberbatch associations:")
    print('='*50)

    targets = ["tortue", "croissant", "chocolat", "café", "football",
               "épopée", "bureau", "lune", "dragon", "musique",
               "restaurant", "ordinateur", "photocopieuse"]
    for t in targets:
        top = top_n(t, 8)
        if top:
            print(f"\n  {t}:")
            for w, s in top:
                print(f"    {w}: {s:.1f}")
        else:
            print(f"\n  {t}: NOT FOUND ❌")

    # Schedule words check
    with open(os.path.join(data_dir, "schedule.json"), "r") as f:
        schedule = json.load(f)

    missing = []
    for day in schedule:
        for w in day:
            if w not in word_idx:
                missing.append(w)

    print(f"\nSchedule: {len(missing)} missing words out of {sum(len(d) for d in schedule)}")
    if missing:
        print(f"  Missing: {', '.join(missing[:30])}...")


if __name__ == "__main__":
    main()
