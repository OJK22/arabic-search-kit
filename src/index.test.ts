import { describe, expect, it } from "vitest";
import {
  createArabicSearchMatcher,
  normalizeArabicSearchText,
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
});
