export interface ArabicSearchOptions {
  /** Fold أ, إ, آ, and ٱ into ا. Defaults to true. */
  normalizeAlef?: boolean;
  /** Fold ى into ي. Defaults to true. */
  normalizeAlefMaqsura?: boolean;
  /** Fold ة into ه. Defaults to false because this can create false positives. */
  normalizeTaMarbuta?: boolean;
  /** Fold Persian ک and ی into Arabic ك and ي. Defaults to true. */
  normalizePersianCharacters?: boolean;
  /** Replace punctuation and symbols with spaces. Defaults to true. */
  removePunctuation?: boolean;
}

const ARABIC_MARKS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/gu;
const PUNCTUATION_AND_SYMBOLS = /[\p{P}\p{S}]+/gu;

/**
 * Normalize Arabic text for tolerant search.
 *
 * This is a search helper, not a linguistic transliterator. It deliberately
 * does not merge letters such as ع and ا, so distinct words remain distinct.
 */
export function normalizeArabicSearchText(
  input: string,
  options: ArabicSearchOptions = {},
): string {
  const {
    normalizeAlef = true,
    normalizeAlefMaqsura = true,
    normalizeTaMarbuta = false,
    normalizePersianCharacters = true,
    removePunctuation = true,
  } = options;

  let value = input.normalize("NFKC").replace(/[\u0640]/gu, "").replace(ARABIC_MARKS, "");

  if (normalizeAlef) value = value.replace(/[أإآٱ]/gu, "ا");
  if (normalizeAlefMaqsura) value = value.replace(/ى/gu, "ي");
  if (normalizeTaMarbuta) value = value.replace(/ة/gu, "ه");
  if (normalizePersianCharacters) {
    value = value.replace(/ک/gu, "ك").replace(/ی/gu, "ي");
  }
  if (removePunctuation) value = value.replace(PUNCTUATION_AND_SYMBOLS, " ");

  return value.replace(/\s+/gu, " ").trim();
}

/** Split normalized Arabic text into non-empty search tokens. */
export function tokenizeArabicSearchText(
  input: string,
  options: ArabicSearchOptions = {},
): string[] {
  const normalized = normalizeArabicSearchText(input, options);
  return normalized ? normalized.split(" ") : [];
}

/**
 * Create a lightweight matcher that requires every query token to occur in
 * the candidate text. Token order is not significant.
 */
export function createArabicSearchMatcher(
  query: string,
  options: ArabicSearchOptions = {},
): (candidate: string) => boolean {
  const queryTokens = tokenizeArabicSearchText(query, options);
  if (queryTokens.length === 0) return () => false;

  return (candidate: string): boolean => {
    const candidateTokens = new Set(tokenizeArabicSearchText(candidate, options));
    return queryTokens.every((token) => candidateTokens.has(token));
  };
}
