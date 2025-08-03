import { useEffect, useState } from "react";
import { usePaperData } from "../../../context/appProvider";

export function QuestionList() {
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [openQuestionId, setOpenQuestionId] = useState(null);
  const [filters, setFilters] = useState({
    unit: "",
    chapter: "",
    subChapter: "",
    subSubChapter: "",
    createdBy: "admin@example.com",
    type: "MCQ",
  });
  const { selectedQuestions, setSelectedQuestions, sections, setSections } = usePaperData();
  const [dropdowns, setDropdowns] = useState({
    units: [],
    chapters: [],
    subChapters: [],
    subSubChapters: [],
  });

  function handleAddQuestion(q) {
    const sectionNames = sections.map((s) => s.name);
    const sectionName = prompt(`Select section: ${sectionNames.join(", ")}`);
    const selectedSectionIndex = sections.findIndex((s) => s.name === sectionName);
    

    if (selectedSectionIndex !== -1 && !sections[selectedSectionIndex].questions.find((item) => item._id === q._id)) {
      const updatedSections = [...sections];
      const section = updatedSections[selectedSectionIndex];
      console.log("selected section", section)
      section.questionCount += 1;
      section.questions.push({ ...q });
      section.marks =section.sectionMarks * section.questionCount;
      setSections(updatedSections);
    }else{
      alert("Either no section selected or question already exists in the section.");
      return;
    }

    if (!selectedQuestions.find((item) => item._id === q._id)) {
      setSelectedQuestions([...selectedQuestions, { ...q }]);
    }
  }

  const fetchFilteredQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://qbvault1.onrender.com/api/questions/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,"Authorization": `Bearer ${token}`},
        body: JSON.stringify(filters),
      });
      if (!res.ok) throw new Error("Failed to fetch filtered questions");
      const data = await res.json();
     
      setQuestions(data);
    } catch (err) {
      console.error("❌ Error fetching filtered questions:", err);
    }
  };

  const fetchAllQuestions = async () => {
    try {
      const res = await fetch("https://qbvault1.onrender.com/api/questions");
      const data = await res.json();
      setAllQuestions(data);
      // localStorage.setItem("questions", JSON.stringify(data));
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
    const chapterSet = new Set();
    const subChapterSet = new Set();
    const subSubChapterSet = new Set();
    allQuestions.forEach((q) => {
      if (filters.unit && q.unit === filters.unit) chapterSet.add(q.chapter);
      if (filters.chapter && q.chapter === filters.chapter) subChapterSet.add(q.subChapter);
      if (filters.subChapter && q.subChapter === filters.subChapter) subSubChapterSet.add(q.subSubChapter);
    });
    setDropdowns((prev) => ({
      ...prev,
      chapters: Array.from(chapterSet),
      subChapters: Array.from(subChapterSet),
      subSubChapters: Array.from(subSubChapterSet),
    }));
  }, [filters.unit, filters.chapter, filters.subChapter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchFilteredQuestions();
  }, [filters.unit, filters.chapter, filters.subChapter, filters.subSubChapter]);

  const toggleQuestion = (_id) => {
    setOpenQuestionId((prevId) => (prevId === _id ? null : _id));
  };

  return (
    <div className="p-6 m-4 w-full flex border rounded-2xl shadow border-teal-500 flex-col mx-auto">
      <h2 className="text-xl font-bold mb-4">📋 Question List</h2>

      <div className="mb-6 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <select name="unit" value={filters.unit} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Unit</option>
            {dropdowns.units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <select name="chapter" value={filters.chapter} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Chapter</option>
            {dropdowns.chapters.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="subChapter" value={filters.subChapter} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Sub Chapter</option>
            {dropdowns.subChapters.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="subSubChapter" value={filters.subSubChapter} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Sub Sub Chapter</option>
            {dropdowns.subSubChapters.map((ss) => <option key={ss} value={ss}>{ss}</option>)}
          </select>
        </div>
      </div>

      <div className="w-full flex flex-col max-h-[700px] overflow-y-auto mx-auto">
        {questions.length === 0 && <p className="text-center text-gray-500">No questions found.</p>}
        {questions.map((q) => (
          <div key={q._id} className="border p-4 mb-4 rounded shadow-sm bg-white">
            <div className="cursor-pointer font-semibold text-blue-700" onClick={() => toggleQuestion(q._id)}>
              {q.questionText}
            </div>
            {openQuestionId === q._id && (
              <div className="mt-2 text-gray-800 space-y-2">
                {q.imageUrl && <img src={q.imageUrl} alt="question" className="max-w-xs" />}
                <div><strong>Options:</strong> {q.options.join(", ")}</div>
                <div><strong>Answer:</strong> {q.correctAnswer}</div>
                <div><strong>Marks:</strong> +{q.posMarks} / -{q.negMarks}</div>
                <div><strong>Type:</strong> {q.type}</div>
                <div><strong>Unit:</strong> {q.unit}</div>
                <div><strong>Chapter:</strong> {q.chapter}</div>
                <div><strong>Sub-Chapter:</strong> {q.subChapter}</div>
                <div><strong>Sub-Sub-Chapter:</strong> {q.subSubChapter}</div>
                <div><strong>Created By:</strong> {q.createdBy}</div>
                <div><strong>Timestamp:</strong> {new Date(q.timestamp).toLocaleString()}</div>
                <button className="cursor-pointer font-semibold text-blue-700" onClick={() => handleAddQuestion(q)}>
                  Add Question
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
