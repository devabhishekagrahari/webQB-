 import { useEffect } from "react";

export default function PaperSummary({
  selectedQuestions,
  templateName,
  setTemplateName,
  paperName,
  setPaperName,
  totalMarks,
  setTotalMarks,
  sections,
  setSections,
}) {
    useEffect(() => {
    const total = sections.reduce((acc, section) => acc + (section.marks || 0), 0);
    setTotalMarks(total);
  }, [sections]);

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    if (field === "sectionMarks") {
      updatedSections[index].questionNumbersRaw = value;
      const parsed = value
        .split(",")
        .map((num) => parseInt(num.trim()))
        .filter((num) => !isNaN(num));
      updatedSections[index].sectionMarks = parsed;
    } else if (field === "marks" || field === "questionCount") {
      updatedSections[index][field] = parseInt(value);
    } else {
      updatedSections[index][field] = value;
    }
    setSections(updatedSections);
  };

  const handleAddSection = () => {
    const newSection = {
      name: "",
      sectionMarks: 0,
      questionCount:0,
      questions: [], // 👈 track questions assigned to this section
    };
    setSections([...sections, newSection]);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const paperData = {
    templateName,
    paperName,
    totalMarks,
    sections,
  };

  console.log("📤 Submitted Paper Data:", paperData);

  try {
    const response = await fetch("https://qbvault1.onrender.com/api/papers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paperData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Failed to save paper:", result);
      alert(`❌ Error: ${result.error || "Something went wrong"}`);
    } else {
      console.log("✅ Paper saved:", result);
      alert("✅ Paper created successfully!");
    }
  } catch (error) {
    console.error("🚨 Network error while saving paper:", error);
    alert("🚨 Network error. Please try again later.");
  }
};


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md max-w-[600px] rounded-xl p-6 m-4 border border-gray-200"
    >
      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">🧾 Template Name:</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">📄 Paper Name:</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={paperName}
          onChange={(e) => setPaperName(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-1">🎯 Total Marks:</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={totalMarks}
          onChange={(e) => setTotalMarks(parseInt(e.target.value))}
        />
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-teal-100 text-teal-800 uppercase tracking-wider">
            <tr>
              <th className="border px-4 py-2 text-left">Section</th>
              <th className="border px-4 py-2 text-left">Section Marks</th>
              <th className="border px-4 py-2 text-left">No. of Questions</th>
              <th className="border px-4 py-2 text-left">Total Section Marks</th>            
              <th className="border px-4 py-2 text-left">Assigned Questions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section, index) => (
              <tr key={index} className="hover:bg-teal-50 align-top">
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded"
                    value={section.name}
                    onChange={(e) => handleSectionChange(index, "name", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded"
                    placeholder="1"
                    value={section.sectionMarks}
                    onChange={(e) =>
                      handleSectionChange(index, "sectionMarks", e.target.value)
                    }
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border rounded"
                    value={section.questionCount}
                    readOnly
                    onChange={(e) =>
                      handleSectionChange(index, "questionCount", e.target.value)
                    }
                  />
                </td>

                <td className="border px-2 py-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border rounded"
                    value={section.marks}
                    readOnly
                    onChange={(e) => handleSectionChange(index, "marks", e.target.value)}
                  />
                </td>
                
                <td className="border px-2 py-1 max-w-[200px] overflow-auto">
                  {section.questions?.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {section.questions.map((q, i) => (
                        <li key={i} className="text-xs">
                          {q.questionText.slice(0, 60)}...
                          <span className="ml-1 text-gray-500">+{q.posMarks}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400 italic">No questions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={handleAddSection}
          className="mt-2 flex px-4 py-2 text-xl !bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        >
          + Add Section
        </button>

        <button
          type="submit"
          className="mt-2 flex px-4 py-2 text-xl !bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          💾 Save Paper
        </button>
      </div>
    </form>
  );
}
