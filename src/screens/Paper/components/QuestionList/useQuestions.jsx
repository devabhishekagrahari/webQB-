import { useEffect, useState } from "react";
import BASE_URL from "../../../../utils/api";

export function useQuestions(filters) {
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [unitSchemes, setUnitSchemes]=useState([]);
  const [dropdowns, setDropdowns] = useState({
    units: [],
    chapters: [],
    subChapters: [],
    subSubChapters: [],
  });

  // Fetch all questions once
  const fetchInitialQuestionsAndSchemes = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("User not authenticated");

    // Fetch questions and unit schemes in parallel
    const [questionsRes, schemesRes] = await Promise.all([
      fetch(`${BASE_URL}/questions`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${BASE_URL}/getUnitSchemes`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    if (!questionsRes.ok)
      throw new Error(`Failed to fetch questions: ${questionsRes.status}`);
    if (!schemesRes.ok)
      throw new Error(`Failed to fetch unit schemes: ${schemesRes.status}`);

    const [questionsData, schemesData] = await Promise.all([
      questionsRes.json(),
      schemesRes.json(),
    ]);

    // Ensure arrays
    const questionsArray = Array.isArray(questionsData) ? questionsData : [];
    const schemesArray = schemesData.chapterSchemes || [];

    setAllQuestions(questionsArray);
    setUnitSchemes(schemesArray);

    // Extract units from both questions and schemes
    const questionUnits = questionsArray.map((q) => q.unit).filter(Boolean);

    const schemeUnits = schemesArray.flatMap(
      (scheme) => scheme.units?.map((u) => u.name).filter(Boolean) || []
    );

    // Merge and deduplicate
    const mergedUnits = Array.from(new Set([...questionUnits, ...schemeUnits]));

    setDropdowns((prev) => ({
      ...prev,
      units: mergedUnits,
    }));
  } catch (err) {
    console.error("❌ Error fetching initial data:", err);
  } finally {
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
    const chapterSet = new Set();
    const subChapterSet = new Set();
    const subSubChapterSet = new Set();
    const typeOfQuestion = new Set();
    allQuestions.forEach((q) => {
      if (filters.unit && q.unit === filters.unit) chapterSet.add(q.chapter);
      if (filters.chapter && q.chapter === filters.chapter)
        subChapterSet.add(q.subChapter);
      if (filters.subChapter && q.subChapter === filters.subChapter)
        subSubChapterSet.add(q.subSubChapter);
      if (q.type) typeOfQuestion.add(q.type);
    });
    unitSchemes?.forEach((scheme) => {
      scheme.units?.forEach((unit) => {
        if (unit.name === filters.unit) {
          unit.chapters?.forEach((ch) => {
            chapterSet.add(ch.name);
            if (filters.chapter === ch.name) {
              ch.subChapters?.forEach((sub) => {
                subChapterSet.add(sub.name);
                if (filters.subChapter === sub.name) {
                  sub.subSubChapters?.forEach((s) =>
                    subSubChapterSet.add(s.name)
                  );
                }
              });
            }
          });
        }
      });
    });

    setDropdowns((prev) => ({
      ...prev,
      chapters: Array.from(chapterSet),
      subChapters: Array.from(subChapterSet),
      subSubChapters: Array.from(subSubChapterSet),
      typeOfQuestion: Array.from(typeOfQuestion),
    }));
  }, [filters.unit, filters.chapter, filters.subChapter]);

  useEffect(() => {
    fetchInitialQuestionsAndSchemes();
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
