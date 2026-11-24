import { describe, expect, it } from "vitest";
import {
  createArabicSearchMatcher,
  normalizeArabicSearchText,
  rankArabicSearchResults,
  scoreArabicSearchMatch,
  tokenizeArabicSearchText,
} from "./index.js";

describe("normalizeArabicSearchText", () => {
  it("normalizes alef variants", () => {
    expect(normalizeArabicSearchText("أحمد، إسلام، آمال، ٱدم")).toBe("احمد اسلام امال ادم");
  });

  it("removes diacritics and tatweel", () => {
    expect(normalizeArabicSearchText("مُحَمَّــد")).toBe("محمد");
  });

  it("normalizes Persian yeh and kaf", () => {
    expect(normalizeArabicSearchText("يك کتاب")).toBe("يك كتاب");
  });

  it("does not fold ta marbuta by default", () => {
    expect(normalizeArabicSearchText("مكتبة")).toBe("مكتبة");
  });

  it("can optionally fold ta marbuta", () => {
    expect(normalizeArabicSearchText("مكتبة", { normalizeTaMarbuta: true })).toBe("مكتبه");
  });

  it("does not collapse semantically different initial letters", () => {
    expect(normalizeArabicSearchText("علم")).not.toBe(normalizeArabicSearchText("ألم"));
  });

  it("normalizes whitespace and punctuation", () => {
    expect(normalizeArabicSearchText("  كتابٌ...   جديد! ")).toBe("كتاب جديد");
  });
});

describe("tokenizeArabicSearchText", () => {
  it("returns normalized tokens", () => {
    expect(tokenizeArabicSearchText("إدارةُ المكتبة")).toEqual(["ادارة", "المكتبة"]);
  });

  it("returns an empty array for empty input", () => {
    expect(tokenizeArabicSearchText("   ")).toEqual([]);
  });
});

describe("createArabicSearchMatcher", () => {
  it("matches all query terms regardless of order", () => {
    const matches = createArabicSearchMatcher("إدارة مكتبة");
    expect(matches("مكتبة عامة، إدارة")).toBe(true);
  });

  it("does not match when a query term is missing", () => {
    const matches = createArabicSearchMatcher("إدارة مكتبة");
    expect(matches("مكتبة عامة")).toBe(false);
  });

  it("does not match an empty query", () => {
    expect(createArabicSearchMatcher("   ")("أي نص")).toBe(false);
  });

  it("does not require duplicate query terms more than once", () => {
    expect(createArabicSearchMatcher("كتاب كتاب")("كتاب")).toBe(true);
  });
});

describe("scoreArabicSearchMatch", () => {
  it("returns full coverage when every query token exists", () => {
    expect(scoreArabicSearchMatch("إدارة مكتبة", "مكتبة عامة، إدارة")).toBe(1);
  });

  it("returns partial coverage when only some query tokens exist", () => {
    expect(scoreArabicSearchMatch("إدارة مكتبة", "مكتبة عامة")).toBe(0.5);
  });

  it("returns zero for no overlap or an empty query", () => {
    expect(scoreArabicSearchMatch("إدارة", "تاريخ")).toBe(0);
    expect(scoreArabicSearchMatch("   ", "أي نص")).toBe(0);
  });
});

describe("rankArabicSearchResults", () => {
  const books = [
    { title: "تاريخ فلسطين" },
    { title: "إدارة المكتبات العامة" },
    { title: "مكتبة الإدارة الحديثة" },
    { title: "علوم الحاسوب" },
  ];

  it("ranks the most complete token matches first and omits non-matches", () => {
    const ranked = rankArabicSearchResults(books, "إدارة مكتبة", (book) => book.title);
    expect(ranked.map(({ item }) => item.title)).toEqual([
      "إدارة المكتبات العامة",
      "مكتبة الإدارة الحديثة",
    ]);
    expect(ranked.map(({ score }) => score)).toEqual([0.5, 0.5]);
  });

  it("returns an empty list for an empty query", () => {
    expect(rankArabicSearchResults(books, " ", (book) => book.title)).toEqual([]);
  });

  it("preserves input order for equal scores", () => {
    const items = [{ title: "كتاب أول" }, { title: "كتاب ثان" }];
    const ranked = rankArabicSearchResults(items, "كتاب", (item) => item.title);
    expect(ranked.map(({ item }) => item.title)).toEqual(["كتاب أول", "كتاب ثان"]);
  });
});
