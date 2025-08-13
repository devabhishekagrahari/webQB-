// src/components/AddQuestionForm.jsx
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { usePaperData } from "../../../context/appProvider";

export default function AddQuestionForm({ createdBy = "admin@example.com" }) {
  const { questions, setQuestions } = usePaperData();

  const [formData, setFormData] = useState({
    question: "",
    options: [""],
    imageUrl: "",
    answer: "",
    posMarks: 1,
    negMarks: 0,
    unit: "",
    chapter: "",
    subChapter: "",
    subSubChapter: "",
    typeOfQuestion: "MCQ",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((f) => ({ ...f, options: newOptions }));
  };

  const addOption = () => {
    setFormData((f) => ({ ...f, options: [...f.options, ""] }));
  };

  const [allQuestions, setAllQuestions] = useState([]);
  const [dropdowns, setDropdowns] = useState({
    units: [],
    chapters: [],
    subChapters: [],
    subSubChapters: [],
  });

  useEffect(() => {
    const fetchAllQuestions = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("🔑 Token:", token);
        if (!token) {
          console.error("No token found. User might not be logged in.");
          return;
        }

        const res = await fetch("https://qbvault1.onrender.com/api/questions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok)
          throw new Error(`Failed to fetch questions: ${res.status}`);

        const data = await res.json();
        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          return;
        }

        setAllQuestions(data);
        setDropdowns((prev) => ({
          ...prev,
          units: [...new Set(data.map((q) => q.unit))],
        }));
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchAllQuestions();
  }, []);

  useEffect(() => {
    const chapterSet = new Set();
    const subChapterSet = new Set();
    const subSubChapterSet = new Set();

    allQuestions.forEach((q) => {
      if (formData.unit && q.unit === formData.unit) chapterSet.add(q.chapter);
      if (formData.chapter && q.chapter === formData.chapter)
        subChapterSet.add(q.subChapter);
      if (formData.subChapter && q.subChapter === formData.subChapter)
        subSubChapterSet.add(q.subSubChapter);
    });

    setDropdowns((prev) => ({
      ...prev,
      chapters: Array.from(chapterSet),
      subChapters: Array.from(subChapterSet),
      subSubChapters: Array.from(subSubChapterSet),
    }));
  }, [formData.unit, formData.chapter, formData.subChapter]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Validate form
    if (!formData.question.trim()) {
      alert("Question text is required.");
      return;
    }
    if (!formData.answer.trim()) {
      alert("Correct answer is required.");
      return;
    }
    if (formData.options.filter((o) => o.trim() !== "").length < 2) {
      alert("Please provide at least two valid options.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to add a question.");
      return;
    }

    // 2️⃣ Prepare new question object
    const newQuestion = {
      id: uuidv4(),
      questionText: formData.question.trim(),
      options: formData.options.map((o) => o.trim()).filter((o) => o !== ""),
      imageUrl: formData.imageUrl?.trim() || null,
      correctAnswer: formData.answer.trim(),
      posMarks: Number(formData.posMarks) || 0,
      negMarks: Number(formData.negMarks) || 0,
      unit: formData.unit.trim(),
      chapter: formData.chapter.trim(),
      subChapter: formData.subChapter?.trim() || null,
      subSubChapter: formData.subSubChapter?.trim() || null,
      type: formData.typeOfQuestion,
      createdBy: createdBy || "admin@example.com",
      timestamp: new Date().toISOString(),
    };

    console.log("📝 New question data:", newQuestion);

    // 3️⃣ API call
    try {
      const response = await fetch(
        "https://qbvault1.onrender.com/api/questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newQuestion),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server responded with ${response.status}: ${errorText}`
        );
      }

      const result = await response.json();
      console.log("✅ Question added to backend:", result);

      // 4️⃣ Update state
      // setQuestions(prev => [...prev, result.questions]);
      alert("✅ Question added successfully.");

      // 5️⃣ Reset form
      setFormData({
        ...formData,
        question: "",
        options: [""],
        imageUrl: "",
        answer: "",
        posMarks: 1,
        negMarks: 0,
      });
    } catch (err) {
      console.error("❌ Failed to add question:", err);
      alert(`Failed to add question: ${err.message}`);
    }
  };

  return (
    <div className="mt-4 px-4 md:px-10">
      <div className="rbg-white rounded-lg shadow border">
        <h2 className="text-xl font-bold text-white bg-teal-500 px-6 py-3">
          Add Question
        </h2>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto max-h-[80vh]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="flex flex-col space-y-4">
              <label className="font-semibold bg-teal-300 border border-teal-800 p-2 rounded-xl">
                Question
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  placeholder="Question"
                  className="w-full mt-1 p-2 border rounded bg-white"
                  required
                />
              </label>

              <label className="font-semibold bg-teal-300 border border-teal-800 p-2 rounded-xl">Options
              {formData.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="w-full border p-2 bg-white rounded"
                />
              ))}
              </label>

              {/* ⛔️ Button style untouched */}
              <button
                type="button"
                onClick={addOption}
                className="!bg-teal-500 text-white underline  p-2 w-fit"
              >
                + Add Option
              </button>
              <label className="font-semibold bg-teal-300 border border-teal-800 p-2 rounded-xl">Answers
              <input
                type="text"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                placeholder="Correct Answer"
                className="w-full border p-2 bg-white rounded"
                required
              /></label>
              <label className="font-semibold bg-teal-300 border border-teal-800 p-2 rounded-xl">Image URL
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Image URL (optional)"
                className="w-full border p-2  bg-white rounded"
              /></label>
              <label className="font-semibold bg-teal-300 border border-teal-800 p-2 rounded-xl">Marking
              <input
                type="number"
                name="posMarks"
                value={formData.posMarks}
                onChange={handleChange}
                placeholder="Positive Marks"
                className="w-full border p-2 bg-white rounded"
              /></label>
              <label className="font-semibold bg-teal-300 border border-teal-800 p-2 rounded-xl">Negative Marking
              <input
                type="number"
                name="negMarks"
                value={formData.negMarks}
                onChange={handleChange}
                placeholder="Negative Marks (optional)"
                className="w-full border p-2 rounded bg-white"
              /></label>
            </div>

            {/* Right Column */}
            <div className="flex flex-col space-y-4">
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Unit</option>
                {dropdowns.units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>

              <select
                name="chapter"
                value={formData.chapter}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Chapter</option>
                {dropdowns.chapters.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                name="subChapter"
                value={formData.subChapter}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Sub-Chapter</option>
                {dropdowns.subChapters.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                name="subSubChapter"
                value={formData.subSubChapter}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Sub-Sub-Chapter</option>
                {dropdowns.subSubChapters.map((ss) => (
                  <option key={ss} value={ss}>
                    {ss}
                  </option>
                ))}
              </select>

              <select
                name="typeOfQuestion"
                value={formData.typeOfQuestion}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="MCQ">MCQ</option>
                <option value="Short Answer">Short Answer</option>
                <option value="True/False">True/False</option>
              </select>

              {/* ⛔️ Button style untouched */}
              <button
                type="submit"
                className="!bg-teal-600 text-white px-4 py-2 rounded p-2 w-fit"
              >
                Add Question
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
