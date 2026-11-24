# Arabic Search Kit

A small, dependency-free Arabic text normalization and token matcher for JavaScript and TypeScript.

Arabic search can miss relevant results when the same word is entered with different alef forms, diacritics, tatweel, or Persian keyboard characters. This package provides predictable normalization helpers without pretending to perform full Arabic linguistic analysis.

## Features

- Normalize أ, إ, آ, and ٱ to ا
- Remove common Arabic diacritics and tatweel
- Normalize Persian ک and ی to Arabic ك and ي
- Optionally normalize ى to ي (enabled by default)
- Optionally fold ة into ه (disabled by default to reduce false positives)
- Tokenize normalized text
- Match all query terms without requiring the same word order
- Score partial matches by query-token coverage
- Rank search results while preserving input order for ties
- TypeScript declarations included

The normalizer intentionally does **not** merge distinct letters such as ع and ا.

## Install

The package is prepared for npm publishing. Until a release is published, install from Git:

```bash
npm install github:OJK22/books.-v2
```

## Usage

```ts
import {
  normalizeArabicSearchText,
  tokenizeArabicSearchText,
  createArabicSearchMatcher,
  scoreArabicSearchMatch,
  rankArabicSearchResults,
} from "arabic-search-kit";

normalizeArabicSearchText("إدارةُ المكتبة"); // "ادارة المكتبة"

tokenizeArabicSearchText("مُدير المكتبة");
// ["مدير", "المكتبة"]

const matches = createArabicSearchMatcher("إدارة مكتبة");
matches("مكتبة عامة للإدارة"); // true

scoreArabicSearchMatch("إدارة مكتبة", "مكتبة عامة");
// 0.5

const results = rankArabicSearchResults(
  [
    { title: "تاريخ فلسطين" },
    { title: "إدارة المكتبات العامة" },
    { title: "مكتبة الإدارة الحديثة" },
  ],
  "إدارة مكتبة",
  (book) => book.title,
);
// Results containing matching query tokens, ordered by token coverage.
```

## API

| Function | Purpose |
| --- | --- |
| `normalizeArabicSearchText(text, options?)` | Normalize Arabic text for consistent comparison |
| `tokenizeArabicSearchText(text, options?)` | Return normalized, non-empty tokens |
| `createArabicSearchMatcher(query, options?)` | Create a predicate requiring every unique query token |
| `scoreArabicSearchMatch(query, candidate, options?)` | Return matched unique query-token fraction from 0 to 1 |
| `rankArabicSearchResults(items, query, getText, options?)` | Rank items by token coverage; omit zero-score items |

## Options

| Option | Default | Behavior |
| --- | --- | --- |
| `normalizeAlef` | `true` | Fold أ, إ, آ, ٱ into ا |
| `normalizeAlefMaqsura` | `true` | Fold ى into ي |
| `normalizeTaMarbuta` | `false` | Fold ة into ه |
| `normalizePersianCharacters` | `true` | Fold Persian ک and ی |
| `removePunctuation` | `true` | Replace punctuation and symbols with spaces |

Example:

```ts
normalizeArabicSearchText("مكتبة", { normalizeTaMarbuta: true });
// "مكتبه"
```

## Development

Requires Node.js 18 or newer.

```bash
npm install
npm test
npm run build
```

## Scope and limitations

This is a deterministic text-normalization utility, not a morphological analyzer, stemmer, spell checker, transliterator, or replacement for a search engine. Matching is token-based and exact after normalization; it does not understand synonyms, roots, grammatical forms, or semantic similarity. The ranking score measures query-token coverage only, not linguistic relevance. Evaluate the optional ta marbuta folding carefully because it can introduce false positives.

## Security and privacy

The package processes strings in memory and makes no network requests. Do not put private library records, personal information, or production data in public issues or test fixtures.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Changes should include Arabic examples and tests, and should explain any trade-off that could increase false positives.

## License

MIT. See [LICENSE](./LICENSE).
