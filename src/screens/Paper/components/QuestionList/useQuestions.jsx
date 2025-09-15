
import { useEffect, useState } from "react";
import BASE_URL from '../../../../utils/api';

export function useQuestions(filters) {
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [dropdowns, setDropdowns] = useState({
    units: [],
    chapters: [],
    subChapters: [],
    subSubChapters: [],
  });

  const fetchFilteredQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BASE_URL}/questions/filter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(filters),
        }
      );
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("❌ Error fetching filtered questions:", err);
    }
  };

  const fetchAllQuestions = async () => {
    try {
      const res = await fetch(`${BASE_URL}/questions`);
      const data = await res.json();
      setAllQuestions(data);
      const units = [...new Set(data.map((q) => q.unit))];
      setDropdowns((prev) => ({ ...prev, units }));
    } catch (err) {
      console.error("❌ Error fetching all questions:", err);
    }
  };

  useEffect(() => {
    fetchAllQuestions();
    fetchFilteredQuestions();
  }, []);

  useEffect(() => {
    fetchFilteredQuestions();
  }, [filters.unit, filters.chapter, filters.subChapter, filters.subSubChapter]);

  useEffect(() => {
    const chapterSet = new Set();
    const subChapterSet = new Set();
    const subSubChapterSet = new Set();
    allQuestions.forEach((q) => {
      if (filters.unit && q.unit === filters.unit) chapterSet.add(q.chapter);
      if (filters.chapter && q.chapter === filters.chapter)
        subChapterSet.add(q.subChapter);
      if (filters.subChapter && q.subChapter === filters.subChapter)
        subSubChapterSet.add(q.subSubChapter);
    });
    setDropdowns((prev) => ({
      ...prev,
      chapters: Array.from(chapterSet),
      subChapters: Array.from(subChapterSet),
      subSubChapters: Array.from(subSubChapterSet),
    }));
  }, [filters.unit, filters.chapter, filters.subChapter]);

  return { questions, dropdowns };
}
