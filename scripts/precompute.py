#!/usr/bin/env python3
"""
Pre-compute semantic similarities for EduSemantix.
Uses spaCy fr_core_news_lg (500K word vectors, 300d).
"""

import json
import os
import sys
import numpy as np

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

    # Build vocabulary from the vector table
    print("Building vocabulary from vector keys...")
    vocab_words = []
    vocab_vecs = []
    seen = set()

    for key in vectors.keys():
        try:
            word = nlp.vocab.strings[key]
        except KeyError:
            continue
        # Filter: alphabetic, 2+ chars, no duplicates, lowercase
        if not word.isalpha() or len(word) < 2:
            continue
        lower = word.lower()
        if lower in seen:
            continue
        seen.add(lower)

        vec = vectors[key]
        norm = np.linalg.norm(vec)
        if norm < 1e-6:
            continue

        vocab_words.append(lower)
        vocab_vecs.append(vec / norm)

    vocab_vecs = np.array(vocab_vecs, dtype=np.float32)
    print(f"  {len(vocab_words)} valid words")

    # Target words (one per day, ~1 month)
    target_words = [
        "collaborateur", "stratégie", "communication", "marketing",
        "campagne", "créativité", "innovation", "leadership",
        "influence", "audience", "engagement", "performance",
        "branding", "storytelling", "digitalisation", "transformation",
        "événement", "publication", "tendance", "algorithme",
        "conversion", "référencement", "positionnement", "notoriété",
        "fidélisation", "communauté", "entreprise", "management",
        "recrutement", "formation"
    ]

    out_dir = os.path.join(os.path.dirname(__file__), "..", "data", "words")
    os.makedirs(out_dir, exist_ok=True)

    valid_targets = []

    for target_text in target_words:
        print(f"\nProcessing: {target_text}")

        # Find target vector
        target_lower = target_text.lower()
        if target_lower not in seen:
            # Try getting vector via nlp()
            doc = nlp(target_text)
            if not doc.has_vector or np.linalg.norm(doc.vector) < 1e-6:
                print(f"  SKIP: no vector for '{target_text}'")
                continue
            target_vec = doc.vector / np.linalg.norm(doc.vector)
        else:
            idx = vocab_words.index(target_lower)
            target_vec = vocab_vecs[idx]

        # Cosine similarity with all vocab (dot product since normalized)
        similarities = vocab_vecs @ target_vec  # shape: (N,)

        # Scale to percentage-like range (-100 to 100)
        similarities = similarities * 100

        # Build results, excluding target word itself
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

        # Save
        data = {"word": target_text, "vocab": vocab_dict}
        path = os.path.join(out_dir, f"{target_text.replace('é', 'e').replace('è', 'e').replace('ê', 'e').replace('à', 'a').replace('î', 'i').replace('ô', 'o').replace('û', 'u')}.json")
        # Actually, just use the word directly
        safe_name = "".join(c for c in target_text if c.isalnum() or c in "-_")
        path = os.path.join(out_dir, f"{safe_name}.json")

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
    print(f"Total vocabulary per word: {len(vocab_words)}")
    print(f"Files saved to: {out_dir}")


if __name__ == "__main__":
    main()
