import { useEffect, useState } from "react";
import BASE_URL from "../../../../utils/api";

export function useQuestions(filters) {
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [dropdowns, setDropdowns] = useState({
    units: [],
    chapters: [],
    subChapters: [],
    subSubChapters: [],
  });

  // Fetch all questions once
  const fetchAllQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!Array.isArray(data)) return;

      setAllQuestions(data);

      // Populate units (top-level)
      const units = [...new Set(data.map((q) => q.unit).filter(Boolean))];
      setDropdowns((prev) => ({ ...prev, units }));
    } catch (err) {
      console.error("❌ Error fetching all questions:", err);
    }
  };

  // Fetch questions filtered by API
  const fetchFilteredQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/questions/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(filters),
      });
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("❌ Error fetching filtered questions:", err);
    }
  };

  // Update cascading dropdowns based on parent selections
  useEffect(() => {
    if (!allQuestions.length) return;

    let chapters = [];
    let subChapters = [];
    let subSubChapters = [];

    // Filter chapters based on selected unit
    if (filters.unit) {
      chapters = [
        ...new Set(
          allQuestions
            .filter((q) => q.unit === filters.unit)
            .map((q) => q.chapter)
            .filter(Boolean)
        ),
      ];
    } else {
      chapters = [
        ...new Set(allQuestions.map((q) => q.chapter).filter(Boolean)),
      ];
    }

    // Filter subChapters based on selected chapter
    if (filters.chapter) {
      subChapters = [
        ...new Set(
          allQuestions
            .filter((q) => q.chapter === filters.chapter)
            .map((q) => q.subChapter)
            .filter(Boolean)
        ),
      ];
    } else {
      subChapters = [
        ...new Set(allQuestions.map((q) => q.subChapter).filter(Boolean)),
      ];
    }

    // Filter subSubChapters based on selected subChapter
    if (filters.subChapter) {
      subSubChapters = [
        ...new Set(
          allQuestions
            .filter((q) => q.subChapter === filters.subChapter)
            .map((q) => q.subSubChapter)
            .filter(Boolean)
        ),
      ];
    } else {
      subSubChapters = [
        ...new Set(allQuestions.map((q) => q.subSubChapter).filter(Boolean)),
      ];
    }

    setDropdowns((prev) => ({
      ...prev,
      chapters,
      subChapters,
      subSubChapters,
    }));
  }, [filters.unit, filters.chapter, filters.subChapter, allQuestions]);

  useEffect(() => {
    fetchAllQuestions();
    fetchFilteredQuestions();
  }, []);

  useEffect(() => {
    fetchFilteredQuestions();
  }, [
    filters.unit,
    filters.chapter,
    filters.subChapter,
    filters.subSubChapter,
  ]);

  return { questions, dropdowns };
}
