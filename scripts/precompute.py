#!/usr/bin/env python3
"""
Pre-compute semantic similarities for EduSemantix.
Uses spaCy fr_core_news_lg (500K word vectors, 300d).
Filters vocabulary to real, common French words only.
"""

import json
import os
import sys
import re
import numpy as np

# Common French stopwords/function words to exclude
STOPWORDS = set("""
le la les un une des de du au aux en dans par pour sur avec sans
ce ces cette cet son sa ses mon ma mes ton ta tes notre nos votre vos leur leurs
je tu il elle on nous vous ils elles me te se lui y
qui que quoi dont où quel quelle quels quelles
et ou mais ni car donc si
ne pas plus très bien aussi
être avoir faire aller dire pouvoir vouloir devoir savoir voir
est sont était été sera serait fait font va vont dit peut
même tout toute tous toutes autre autres
ici là encore trop peu assez beaucoup
entre comme après avant pendant depuis vers
celui celle ceux celles
alors ainsi donc puis ensuite
chaque quelque plusieurs certain certains certaine certaines
aucun aucune
dont lequel laquelle lesquels lesquelles
jamais toujours souvent parfois déjà
""".split())

def is_valid_word(word):
    """Filter to keep only real, usable French words."""
    w = word.lower()
    # Too short or too long
    if len(w) < 3 or len(w) > 25:
        return False
    # Must be alphabetic (allow accents and hyphens)
    if not re.match(r'^[a-zàâäéèêëïîôùûüÿçœæ](?:[a-zàâäéèêëïîôùûüÿçœæ\-]*[a-zàâäéèêëïîôùûüÿçœæ])?$', w):
        return False
    # Skip stopwords
    if w in STOPWORDS:
        return False
    # Skip abbreviations and junk patterns
    if re.match(r'^(dr|mr|mme|mlle|st|ste|av|vol|pp|cf|no|oct|nov|déc|janv|févr|avr|juill|sept|xd|xdd|apr|mm)$', w):
        return False
    # Skip words that look like typos/encoding artifacts
    if any(c in w for c in 'ãâ€™ﬂ'):
        return False
    # Skip words with repeated patterns suggesting encoding issues
    if re.search(r'(.)\1{3,}', w):
        return False
    return True


def main():
    try:
        import spacy
    except ImportError:
        print("pip install spacy")
        sys.exit(1)

    print("Loading French model (fr_core_news_lg)...")
    nlp = spacy.load("fr_core_news_lg")

    vectors = nlp.vocab.vectors
    print(f"Vector table shape: {vectors.shape}")

    # Build clean vocabulary
    print("Building filtered vocabulary...")
    vocab_words = []
    vocab_vecs = []
    seen = set()

    for key in vectors.keys():
        try:
            word = nlp.vocab.strings[key]
        except KeyError:
            continue

        lower = word.lower()
        if lower in seen:
            continue
        if not is_valid_word(lower):
            continue
        seen.add(lower)

        vec = vectors[key]
        norm = np.linalg.norm(vec)
        if norm < 1e-6:
            continue

        vocab_words.append(lower)
        vocab_vecs.append(vec / norm)

    vocab_vecs = np.array(vocab_vecs, dtype=np.float32)
    print(f"  {len(vocab_words)} valid words after filtering")

    # Target words — DIFFICULT & DIVERSE (rien à voir entre eux)
    target_words = [
        # Objets du quotidien
        "parapluie", "réfrigérateur", "escalier", "miroir",
        "bougie", "horloge", "serviette", "ceinture",
        # Nature & animaux
        "papillon", "volcan", "corail", "hérisson",
        "avalanche", "orchidée", "méduse", "caméléon",
        # Nourriture
        "croissant", "moutarde", "champignon", "cannelle",
        "anchois", "brioche", "ratatouille", "pistache",
        # Science & espace
        "satellite", "microscope", "molécule", "gravité",
        "galaxie", "fossile", "pendule", "oxygène",
        # Histoire & culture
        "cathédrale", "gladiateur", "pharaon", "samurai",
        "labyrinthe", "calligraphie", "mosaïque", "troubadour",
        # Émotions & abstraits
        "nostalgie", "vertige", "silence", "crépuscule",
        "paradoxe", "éphémère", "harmonie", "mystère",
        # Objets insolites
        "trampoline", "kaléidoscope", "boussole", "sablier",
        "toboggan", "catapulte", "origami", "télescope",
        # Métiers inattendus
        "apiculteur", "marionnettiste", "souffleur", "funambule",
        "forgeron", "cartographe", "horloger", "artificier",
        # Lieux
        "phare", "grotte", "oasis", "archipel",
        "catacombes", "observatoire", "aquarium", "citadelle",
        # Bonus difficiles
        "métamorphose", "ventriloque", "contrebande", "naufrage",
        "stratagème", "prestidigitation", "vagabond", "épopée",
    ]

    out_dir = os.path.join(os.path.dirname(__file__), "..", "data", "words")
    os.makedirs(out_dir, exist_ok=True)

    # Clean old files
    import glob
    for f in glob.glob(os.path.join(out_dir, "*.json")):
        os.remove(f)

    valid_targets = []

    for target_text in target_words:
        print(f"\nProcessing: {target_text}")

        target_lower = target_text.lower()

        # Get target vector
        if target_lower in seen:
            idx = vocab_words.index(target_lower)
            target_vec = vocab_vecs[idx]
        else:
            doc = nlp(target_text)
            if not doc.has_vector or np.linalg.norm(doc.vector) < 1e-6:
                print(f"  SKIP: no vector for '{target_text}'")
                continue
            target_vec = doc.vector / np.linalg.norm(doc.vector)

        # Cosine similarity with all vocab
        similarities = vocab_vecs @ target_vec
        similarities = similarities * 100  # Scale to percentage

        # Build results excluding target
        results = []
        for i, (word, sim) in enumerate(zip(vocab_words, similarities)):
            if word == target_lower:
                continue
            results.append((word, float(sim)))

        # Sort by similarity descending
        results.sort(key=lambda x: x[1], reverse=True)

        # Assign ranks (top 1000 get a rank)
        vocab_dict = {}
        for rank_idx, (word, sim) in enumerate(results):
            rank = 999 - rank_idx if rank_idx < 1000 else None
            vocab_dict[word] = [round(sim, 2), rank]

        # Keep top 50K — covers all common French words
        top_items = list(vocab_dict.items())[:50000]
        vocab_dict = dict(top_items)

        # Save with safe filename
        safe_name = target_text.replace('é', 'e').replace('è', 'e').replace('ê', 'e')
        safe_name = safe_name.replace('à', 'a').replace('â', 'a')
        safe_name = safe_name.replace('î', 'i').replace('ï', 'i')
        safe_name = safe_name.replace('ô', 'o').replace('û', 'u').replace('ù', 'u')
        safe_name = safe_name.replace('ç', 'c').replace('œ', 'oe')
        path = os.path.join(out_dir, f"{safe_name}.json")

        data = {"word": target_text, "vocab": vocab_dict}
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

        top5 = results[:5]
        print(f"  {len(vocab_dict)} words, top 5: {', '.join(f'{w} ({s:.1f})' for w, s in top5)}")

        file_size = os.path.getsize(path) / 1024
        print(f"  File size: {file_size:.0f} KB")

        valid_targets.append(target_text)

    # Update schedule
    schedule_path = os.path.join(out_dir, "..", "schedule.json")
    with open(schedule_path, "w", encoding="utf-8") as f:
        json.dump(valid_targets, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"Done! Generated data for {len(valid_targets)} words.")
    print(f"Vocabulary per word: ~{len(vocab_words)} filtered words")
    print(f"Files saved to: {out_dir}")


if __name__ == "__main__":
    main()
