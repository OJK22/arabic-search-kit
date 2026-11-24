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
} from "arabic-search-kit";

normalizeArabicSearchText("إدارةُ المكتبة"); // "ادارة المكتبة"

tokenizeArabicSearchText("مُدير المكتبة");
// ["مدير", "المكتبة"]

const matches = createArabicSearchMatcher("إدارة مكتبة");
matches("مكتبة عامة للإدارة"); // true
```

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

```bash
npm install
npm test
npm run build
```

## Scope and limitations

This is a deterministic text-normalization utility, not a morphological analyzer, stemmer, spell checker, transliterator, or replacement for a search engine. Matching is token-based and exact after normalization. Evaluate the optional ta marbuta folding against your own corpus before enabling it.

## Contributing

Focused bug reports and pull requests are welcome. Include a failing example and a regression test for normalization changes. Avoid changing default normalization rules without documenting their effect on false positives.

## License

MIT. See [LICENSE](./LICENSE).
