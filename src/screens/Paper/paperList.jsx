import React, { useEffect, useState } from "react";

export default function ViewPapers() {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch("https://qbvault1.onrender.com/api/papers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setPapers(data))
      .catch((err) => console.error("❌ Fetch Error:", err));
  }, []);

  const groupedPapers = papers.reduce((acc, paper) => {
    const key = paper.templateName || "Untitled";
    if (!acc[key]) acc[key] = [];
    acc[key].push(paper);
    return acc;
  }, {});

  const handleSectionChange = (sectionIndex, field, value) => {
    const updatedSections = [...selectedPaper.sections];
    updatedSections[sectionIndex] = {
      ...updatedSections[sectionIndex],
      [field]: value,
    };
    setSelectedPaper({ ...selectedPaper, sections: updatedSections });
  };

  const handleQuestionChange = (sectionIndex, questionIndex, field, value) => {
    const updatedSections = [...selectedPaper.sections];
    const updatedQuestions = [...updatedSections[sectionIndex].questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value,
    };
    updatedSections[sectionIndex].questions = updatedQuestions;
    setSelectedPaper({ ...selectedPaper, sections: updatedSections });
  };

  const regeneratePaper = async () => {
    try {
      const res = await fetch("https://qbvault1.onrender.com/api/papers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPaper),
      });
      const data = await res.json();
      alert("✅ Paper updated successfully!");
      console.log("Updated:", data);
    } catch (err) {
      alert("❌ Update failed");
      console.error(err);
    }
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto w-full">
      <h2 className="text-xl font-bold">📄 Papers</h2>
      <div className="space-y-2">
        {Object.keys(groupedPapers).map((template) => (
          <div key={template}>
            <h3 className="text-lg font-semibold">📂 {template}</h3>
            <ul className="pl-4 list-disc">
              {groupedPapers[template].map((paper) => (
                <li
                  key={paper._id}
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => {
                    setSelectedPaper(paper);
                    setEditing(false);
                  }}
                >
                  {paper.paperName}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedPaper && (
        <div className="border p-4 rounded bg-gray-100">
          <h3 className="text-xl font-semibold">
            📄 {selectedPaper.paperName} ({selectedPaper.templateName})
          </h3>

          <button
            className="mt-2 px-3 py-1 !bg-yellow-500 text-white rounded"
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Cancel Edit" : "Edit"}
          </button>

          {editing &&
            <form className="space-y-4 mt-4" onSubmit={(e) => { e.preventDefault(); regeneratePaper(); }}>
              {selectedPaper.sections.map((section, sIdx) => (
                <div key={sIdx} className="border p-4 bg-white rounded">
                  <label className="block font-medium">Section Name</label>
                  <input
                    className="border p-1 w-full mb-2"
                    value={section.name}
                    onChange={(e) => handleSectionChange(sIdx, "name", e.target.value)}
                  />
                  <label className="block font-medium">Section Marks</label>
                  <input
                    className="border p-1 w-full mb-2"
                    value={section.sectionMarks}
                    onChange={(e) => handleSectionChange(sIdx, "sectionMarks", e.target.value)}
                  />
                  <label className="block font-medium">Questions</label>
                  {section.questions.map((q, qIdx) => (
                    <div key={q._id} className="border p-2 mb-2 rounded">
                      <label className="block text-sm font-medium">Question Text</label>
                      <input
                        className="border p-1 w-full mb-1 text-sm"
                        value={q.questionText}
                        onChange={(e) => handleQuestionChange(sIdx, qIdx, "questionText", e.target.value)}
                      />
                      <label className="block text-sm font-medium">Options (comma separated)</label>
                      <input
                        className="border p-1 w-full mb-1 text-sm"
                        value={q.options.join(", ")}
                        onChange={(e) => handleQuestionChange(sIdx, qIdx, "options", e.target.value.split(",").map(opt => opt.trim()))}
                      />
                      <label className="block text-sm font-medium">Correct Answer</label>
                      <input
                        className="border p-1 w-full mb-1 text-sm"
                        value={q.correctAnswer}
                        onChange={(e) => handleQuestionChange(sIdx, qIdx, "correctAnswer", e.target.value)}
                      />
                      <label className="block text-sm font-medium">Marks</label>
                      <input
                        type="number"
                        className="border p-1 w-full text-sm"
                        value={section.sectionMarks}
                        onChange={(e) => handleSectionChange(sIdx, "marks", Number(e.target.value))}
                      />
                    </div>
                  ))}
                </div>
              ))}
              <button
                type="submit"
                className="mt-4 px-4 py-2 !bg-green-600 text-white rounded"
              >
                🔄 Regenerate Paper
              </button>
            </form>
          }
        </div>
      )}
    </div>
  );
}
