import { useState } from "react";
import { usePaperData } from "../../../../context/appProvider";
import { useQuestions } from "./useQuestions";
import { QuestionFilters } from "./QuestionFilters";
import { QuestionRow } from "./QuestionRow";

export function QuestionList({ mode = "full" }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    unit: "",
    chapter: "",
    subChapter: "",
    subSubChapter: "",
    createdBy: "admin@example.com",
    type: "MCQ",
  });
  const { sections, setSections, selectedQuestions, setSelectedQuestions } = usePaperData();
  const { questions, dropdowns } = useQuestions(filters);
  const [openQuestionId, setOpenQuestionId] = useState(null);

  const toggleQuestion = (id) => setOpenQuestionId((prev) => (prev === id ? null : id));

  function handleAddQuestion(q) {
    const sectionNames = sections.map((s) => s.name);
    const sectionName = prompt(`Select section: ${sectionNames.join(", ")}`);
    const selectedSectionIndex = sections.findIndex((s) => s.name === sectionName);

    if (selectedSectionIndex !== -1 && !sections[selectedSectionIndex].questions.find((item) => item._id === q._id)) {
      const updatedSections = [...sections];
      const section = updatedSections[selectedSectionIndex];
      section.questionCount += 1;
      section.questions.push({ ...q });
      section.marks = section.sectionMarks * section.questionCount;
      setSections(updatedSections);
    } else {
      alert("Either no section selected or question already exists in the section.");
      return;
    }

    if (!selectedQuestions.find((item) => item._id === q._id)) {
      setSelectedQuestions([...selectedQuestions, { ...q }]);
    }
  }

  return (
    <div className="p-6 w-full flex flex-col rounded-2xl bg-white shadow-sm">
      <QuestionFilters
        filters={filters}
        setFilters={setFilters}
        dropdowns={dropdowns}
        search={search}
        setSearch={setSearch}
      />
      <div className="overflow-x-auto max-h-[650px] overflow-y-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="p-3"><input type="checkbox" /></th>
              <th className="p-3">ID</th>
              <th className="p-3 text-left">Question</th>
              <th className="p-3">Type</th>
              <th className="p-3">Difficulty</th>
              <th className="p-3">Category</th>
              {mode === "full" && (
                <>
                  <th className="p-3">Last Modified</th>
                  <th className="p-3">Actions</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {questions
              .filter(
                (q) =>
                  q.questionText.toLowerCase().includes(search.toLowerCase()) ||
                  q._id.toLowerCase().includes(search.toLowerCase())
              )
              .map((q, i) => (
                <QuestionRow
                  key={q._id}
                  q={q}
                  index={i}
                  isOpen={openQuestionId === q._id}
                  toggle={toggleQuestion}
                  handleAddQuestion={handleAddQuestion}
                  mode={mode}
                />
              ))}
            {questions.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center p-4 text-gray-500">
                  No questions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
