import { usePaper } from "../../../context/paperContext";

export default function PaperSummary() {
  const {
    templateName,
    setTemplateName,
    paperName,
    setPaperName,
    totalMarks,
    setTotalMarks,
    sections,
    setSections,
  } = usePaper();

  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...sections];
    if (field === "questionNumbers") {
      updatedSections[index].questionNumbersRaw = value;
      const parsed = value
        .split(",")
        .map((num) => parseInt(num.trim()))
        .filter((num) => !isNaN(num));
      updatedSections[index].questionNumbers = parsed;
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
      marks: 0,
      questionCount: 0,
      questionNumbersRaw: "",
      questionNumbers: [],
    };
    setSections([...sections, newSection]);
  };

  return (
    <div className="bg-white shadow-md max-w-[500px] rounded-xl p-6 m-4 border border-gray-200">
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
              <th className="border px-4 py-2 text-left">Marks</th>
              <th className="border px-4 py-2 text-left">No. of Questions</th>
              <th className="border px-4 py-2 text-left">Question Nos.</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section, index) => (
              <tr key={index} className="hover:bg-teal-50">
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
                    type="number"
                    className="w-full px-2 py-1 border rounded"
                    value={section.marks}
                    onChange={(e) => handleSectionChange(index, "marks", e.target.value)}
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    className="w-full px-2 py-1 border rounded"
                    value={section.questionCount}
                    onChange={(e) =>
                      handleSectionChange(index, "questionCount", e.target.value)
                    }
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded"
                    placeholder="e.g. 1, 2, 3"
                    value={section.questionNumbersRaw}
                    onChange={(e) =>
                      handleSectionChange(index, "questionNumbers", e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleAddSection}
        className="mt-2 flex px-4 py-2 text-xl !bg-teal-600 text-white rounded hover:bg-teal-700 transition"
      >
       + Add Section
      </button>
    </div>
  );
}
