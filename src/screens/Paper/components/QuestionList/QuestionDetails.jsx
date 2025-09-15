export function QuestionDetails({ q, handleAddQuestion }) {
  return (
    <tr className="bg-gray-50">
      <td colSpan={9} className="p-4 text-gray-700">
        {q.imageUrl && <img src={q.imageUrl} alt="question" className="max-w-xs mb-2 rounded-lg shadow-sm" />}
        <div><strong>Options:</strong> {q.options?.join(", ")}</div>
        <div><strong>Answer:</strong> {q.correctAnswer}</div>
        <div><strong>Marks:</strong> +{q.posMarks} / -{q.negMarks}</div>
        <div><strong>Unit:</strong> {q.unit}</div>
        <div><strong>Chapter:</strong> {q.chapter}</div>
        <div><strong>Sub-Chapter:</strong> {q.subChapter}</div>
        <div><strong>Sub-Sub-Chapter:</strong> {q.subSubChapter}</div>
        <div><strong>Created By:</strong> {q.createdBy}</div>
        <div><strong>Timestamp:</strong> {new Date(q.timestamp).toLocaleString()}</div>
        <button
          className="mt-2 text-teal-600 font-semibold hover:underline"
          onClick={() => handleAddQuestion(q)}
        >
          ➕ Add Question
        </button>
      </td>
    </tr>
  );
}
