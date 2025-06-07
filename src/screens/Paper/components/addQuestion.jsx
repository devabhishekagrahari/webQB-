// src/components/AddQuestionForm.jsx
import { useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { useQuestion } from "../../../context/questionContext";

export default function AddQuestionForm({ createdBy = "admin@example.com" }) {
  const { addQuestion } = useQuestion();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuestion = {
      id: uuidv4(),
      question: formData.question,
      options: formData.options.filter((o) => o.trim() !== ""),
      imageUrl: formData.imageUrl || null,
      answer: formData.answer,
      posMarks: Number(formData.posMarks),
      negMarks: formData.negMarks ? Number(formData.negMarks) : 0,
      unit: formData.unit,
      chapter: formData.chapter,
      subChapter: formData.subChapter || null,
      subSubChapter: formData.subSubChapter || null,
      typeOfQuestion: formData.typeOfQuestion,
      createdBy,
      timestamp: new Date().toISOString(),
    };

    addQuestion(newQuestion);
    alert("Question added.");
    setFormData({
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
  };

  return (
  <div>
  <h2 className="text-xl flex w-full   !bg-teal-500 sticky top-0 border stroke-1 p-2 text-white  font-bold">Add Question</h2>
    <form onSubmit={handleSubmit} className="p-4 max-h-[500px] flex  flex-col overflow-auto border rounded space-y-4 max-w-xl">
      
        
      <input
        type="text"
        name="question"
        value={formData.question}
        onChange={handleChange}
        placeholder="Question"
        className="w-full p-2 border "
        required
      />

      {formData.options.map((opt, i) => (
        <input
          key={i}
          type="text"
          value={opt}
          onChange={(e) => handleOptionChange(i, e.target.value)}
          placeholder={`Option ${i + 1}`}
          className="w-full border p-2"
        />
      ))}
      <button type="button" onClick={addOption} className="!bg-teal-500 text-white underline">
        + Add Option
      </button>

      <input
        type="text"
        name="answer"
        value={formData.answer}
        onChange={handleChange}
        placeholder="Correct Answer"
        className="w-full border p-2"
        required
      />

      <input
        type="text"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="Image URL (optional)"
        className="w-full border p-2"
      />

      <input
        type="number"
        name="posMarks"
        value={formData.posMarks}
        onChange={handleChange}
        placeholder="Positive Marks"
        className="w-full border p-2"
      />

      <input
        type="number"
        name="negMarks"
        value={formData.negMarks}
        onChange={handleChange}
        placeholder="Negative Marks (optional)"
        className="w-full border p-2"
      />

      <input
        type="text"
        name="unit"
        value={formData.unit}
        onChange={handleChange}
        placeholder="Unit"
        className="w-full border p-2"
        required
      />
      <input
        type="text"
        name="chapter"
        value={formData.chapter}
        onChange={handleChange}
        placeholder="Chapter"
        className="w-full border p-2"
        required
      />
      <input
        type="text"
        name="subChapter"
        value={formData.subChapter}
        onChange={handleChange}
        placeholder="Sub-Chapter (optional)"
        className="w-full border p-2"
      />
      <input
        type="text"
        name="subSubChapter"
        value={formData.subSubChapter}
        onChange={handleChange}
        placeholder="Sub-Sub-Chapter (optional)"
        className="w-full border p-2"
      />

      <select
        name="typeOfQuestion"
        value={formData.typeOfQuestion}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="MCQ">MCQ</option>
        <option value="ShortAnswer">Short Answer</option>
        <option value="TrueFalse">True/False</option>
      </select>

      <button type="submit" className="!bg-teal-600 text-white px-4 py-2 rounded">
        Add Question
      </button>
    </form>
   </div>
  );
}
