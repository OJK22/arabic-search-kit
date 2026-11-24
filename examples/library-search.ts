import { rankArabicSearchResults } from "../src/index.js";

interface Book {
  id: number;
  title: string;
  author: string;
}

const books: Book[] = [
  { id: 1, title: "مدخل إلى علوم الحاسوب", author: "أحمد خالد" },
  { id: 2, title: "إدارة المكتبات العامة", author: "سلمى محمود" },
  { id: 3, title: "تاريخ فلسطين الحديث", author: "محمد ناصر" },
  { id: 4, title: "فهرسة الكتب والمراجع", author: "ليلى عادل" },
];

const query = "ادارة المكتبات";

const results = rankArabicSearchResults(
  books,
  query,
  (book) => `${book.title} ${book.author}`,
);

for (const result of results) {
  console.log({
    id: result.item.id,
    title: result.item.title,
    score: result.score,
  });
}
