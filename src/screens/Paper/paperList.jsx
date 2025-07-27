import React, { useEffect, useState } from "react";

export default function ViewPapers() {
  const [papers, setPapers] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [editing, setEditing] = useState(false);
  const [downloading, setDownloading] = useState(false);

const savePaperLocally = (newPaper) => {
  try {
    if (!newPaper || typeof newPaper !== "object") return;

    const existing = JSON.parse(localStorage.getItem("papers")) || [];

    // Match by both templateName + paperName
    const filtered = existing.filter((p) => {
      if (newPaper.templateName && newPaper.paperName) {
        return !(
          p.templateName === newPaper.templateName &&
          p.paperName === newPaper.paperName
        );
      }
      // fallback: compare full object
      return JSON.stringify(p) !== JSON.stringify(newPaper);
    });

    const updated = [newPaper, ...filtered];
    localStorage.setItem("papers", JSON.stringify(updated));
  } catch (err) {
    console.error("❌ Failed to save paper locally:", err);
  }
};

  const getLocalPapers = () => {
    try {
      const data = localStorage.getItem("papers");
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error("❌ Failed to read papers from localStorage:", err);
      return [];
    }
  };

  useEffect(() => {
    const loadPapers = async () => {
      try {
        const localPapers = getLocalPapers();
        if (localPapers.length > 0) {
          setPapers(localPapers);
          return;
        }

        const res = await fetch("https://qbvault1.onrender.com/api/papers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setPapers(data);
      } catch (err) {
        console.error("❌ Error loading papers:", err);
      }
    };

    loadPapers();
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
    savePaperLocally(selectedPaper);
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

  const downloadPdf = async (selectedPaper) => {
    if (!selectedPaper || !selectedPaper.sections) {
      console.error("❌ Invalid selectedPaper:", selectedPaper);
      return;
    }

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    doc.setFontSize(16);
    const title = `Paper Name: ${selectedPaper.paperName}`;
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 10);
    doc.setFontSize(12);
    const subtitle = `Created By: ${selectedPaper.createdBy}`;
    doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 20);
    doc.text(`Total Marks: ${selectedPaper.totalMarks}`, 10, 30);

    let y = 50;

    selectedPaper.sections.forEach((section, secIndex) => {
      doc.setFontSize(14);
      doc.text(`Section ${section.name} - Marks: ${section.sectionMarks}`, 10, y);
      y += 10;

      section.questions.forEach((q, qIndex) => {
        if (y > 270) {
          doc.addPage();
          y = 10;
        }

        doc.setFontSize(12);
        doc.text(`${secIndex + 1}.${qIndex + 1}) ${q.questionText}`, 10, y);
        y += 7;

        q.options.forEach((opt, optIndex) => {
          doc.text(`   ${String.fromCharCode(65 + optIndex)}. ${opt}`, 15, y);
          y += 6;
        });

        doc.setTextColor(0);
        y += 10;
      });

      y += 5;
    });
    doc.text(`Created At: ${new Date(selectedPaper.createdAt).toLocaleString()}`, 10, 40);

    doc.save(`${selectedPaper.paperName.replace(/\s+/g, "_")}.pdf`);
  };

  const downloadWord = (selectedPaper) => {
    if (!selectedPaper || !selectedPaper.sections) {
      console.error("❌ Invalid selectedPaper:", selectedPaper);
      return;
    }

    let content = "";

    content += `\n\n\t\t\t${selectedPaper.templateName.toUpperCase()}\n`;
    content += `\t\t\t${selectedPaper.paperName.toUpperCase()}\n`;
    content += `\t\t\tTotal Marks: ${selectedPaper.totalMarks}\n\n`;

    selectedPaper.sections.forEach((section, secIndex) => {
      content += `Section ${section.name}\t\tMarks: ${section.sectionMarks}\n`;
      content += "---------------------------------------------\n";

      section.questions.forEach((q, qIndex) => {
        content += `${secIndex + 1}.${qIndex + 1}) ${q.questionText}\n`;

        q.options.forEach((opt, optIndex) => {
          content += `   ${String.fromCharCode(65 + optIndex)}. ${opt}\n`;
        });

        content += "\n";
      });

      content += "\n";
    });

    const blob = new Blob([content], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedPaper.paperName.replace(/\s+/g, "_")}_Exam.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          <button
            className="mt-2 px-3 py-1 !bg-yellow-500 text-white rounded ml-2"
            onClick={async () => {
              setDownloading(true);
              await downloadPdf(selectedPaper);
              setDownloading(false);
            }}
            disabled={!selectedPaper}
          >
            {downloading ? "Downloading..." : "Download Pdf"}
          </button>
          <button
            className="mt-2 ml-2 px-3 py-1 !bg-blue-500 text-white rounded"
            onClick={() => downloadWord(selectedPaper)}
          >
            Download Word
          </button>

          {editing && (
            <form
              className="space-y-4 mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                regeneratePaper();
              }}
            >
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
                    value={Array.isArray(section.sectionMarks) ? section.sectionMarks[0] : section.sectionMarks}
                    onChange={(e) => handleSectionChange(sIdx, "sectionMarks", [Number(e.target.value)])}
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
                        onChange={(e) =>
                          handleQuestionChange(sIdx, qIdx, "options", e.target.value.split(",").map((opt) => opt.trim()))
                        }
                      />
                      <label className="block text-sm font-medium">Correct Answer</label>
                      <input
                        className="border p-1 w-full mb-1 text-sm"
                        value={q.correctAnswer}
                        onChange={(e) => handleQuestionChange(sIdx, qIdx, "correctAnswer", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ))}
              <button type="submit" className="mt-4 px-4 py-2 !bg-green-600 text-white rounded">
                🔄 Regenerate Paper
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}