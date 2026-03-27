#!/usr/bin/env python3
"""
Export spaCy French word vectors to compact binary format.
Reduces dimensions via PCA for deployment on free hosting.
"""

import json
import os
import sys
import re
import numpy as np

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

def is_valid_word(word):
    w = word.lower()
    if len(w) < 3 or len(w) > 25:
        return False
    if not re.match(r'^[a-zàâäéèêëïîôùûüÿçœæ](?:[a-zàâäéèêëïîôùûüÿçœæ\-]*[a-zàâäéèêëïîôùûüÿçœæ])?$', w):
        return False
    if w in STOPWORDS:
        return False
    if re.match(r'^(dr|mr|mme|mlle|st|ste|av|vol|pp|cf|no|oct|nov|déc|janv|févr|avr|juill|sept|xd|xdd|apr|mm|hui|ci)$', w):
        return False
    if re.search(r'(.)\1{3,}', w):
        return False
    return True


def main():
    import spacy
    from sklearn.decomposition import PCA

    TARGET_DIM = 100  # Reduce from 300 to 100 dimensions

    print("Loading French model...")
    nlp = spacy.load("fr_core_news_lg")
    vectors = nlp.vocab.vectors
    print(f"Vector table: {vectors.shape}")

    print("Building filtered vocabulary...")
    words = []
    raw_vecs = []
    seen = set()

    for key in vectors.keys():
        try:
            word = nlp.vocab.strings[key]
        except KeyError:
            continue

        lower = word.lower()
        if lower in seen or not is_valid_word(lower):
            continue
        seen.add(lower)

        vec = vectors[key].astype(np.float32)
        norm = np.linalg.norm(vec)
        if norm < 1e-6:
            continue

        words.append(lower)
        raw_vecs.append(vec / norm)

    raw_vecs = np.array(raw_vecs, dtype=np.float32)
    print(f"  {len(words)} valid words, {raw_vecs.shape[1]}d")

    # PCA reduction
    print(f"Reducing {raw_vecs.shape[1]}d → {TARGET_DIM}d via PCA...")
    pca = PCA(n_components=TARGET_DIM)
    reduced = pca.fit_transform(raw_vecs).astype(np.float32)
    explained = pca.explained_variance_ratio_.sum()
    print(f"  Explained variance: {explained:.1%}")

    # Re-normalize after PCA
    norms = np.linalg.norm(reduced, axis=1, keepdims=True)
    norms[norms < 1e-8] = 1
    reduced = reduced / norms

    # Sort alphabetically
    pairs = sorted(zip(words, reduced.tolist()), key=lambda x: x[0])
    words = [p[0] for p in pairs]
    vecs = np.array([p[1] for p in pairs], dtype=np.float32)

    out_dir = os.path.join(os.path.dirname(__file__), "..", "data")

    # Save word index
    index_data = {
        "dim": TARGET_DIM,
        "count": len(words),
        "words": words
    }
    index_path = os.path.join(out_dir, "vectors.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index_data, f, ensure_ascii=False, separators=(',', ':'))
    index_size = os.path.getsize(index_path) / 1024 / 1024
    print(f"  Index: {index_size:.1f} MB")

    # Save binary vectors
    vec_path = os.path.join(out_dir, "vectors.bin")
    vecs.tofile(vec_path)
    vec_size = os.path.getsize(vec_path) / 1024 / 1024
    print(f"  Vectors: {vec_size:.1f} MB")
    print(f"  Total: {index_size + vec_size:.1f} MB")

    # Verify similarity quality
    print("\nQuality check — similarity examples:")
    word_idx = {w: i for i, w in enumerate(words)}

    def sim(w1, w2):
        if w1 not in word_idx or w2 not in word_idx:
            return None
        v1 = vecs[word_idx[w1]]
        v2 = vecs[word_idx[w2]]
        return float(np.dot(v1, v2)) * 100

    pairs_test = [
        ("chat", "chien"), ("chat", "voiture"),
        ("restaurant", "cuisine"), ("restaurant", "mathématiques"),
        ("football", "basketball"), ("football", "philosophie"),
    ]
    for w1, w2 in pairs_test:
        s = sim(w1, w2)
        if s is not None:
            print(f"  {w1} ↔ {w2}: {s:.1f}")

    # Verify common words
    print("\nCommon words check:")
    test_words = ["travail", "maison", "chat", "ordinateur", "musique",
                  "amour", "soleil", "chocolat", "restaurant", "bureau"]
    for w in test_words:
        print(f"  {w}: {'✓' if w in word_idx else '✗ MISSING'}")

    print(f"\n{'='*50}")
    print(f"Done! {len(words)} words × {TARGET_DIM}d = {vec_size:.0f} MB")
    print(f"Every French word typed will get a real-time score!")


if __name__ == "__main__":
    main()
