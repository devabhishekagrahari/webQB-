import AddQuestionForm from "./components/addQuestion";
import CurriculumEditor from "./components/curriculum";
import PaperSummary from "./components/paperSummary";

export default function GeneratePaper(){
      const paperData = {
    templateName: "Template: Bio-Chemistry 2025",
    paperName: "Midterm Assessment",
    totalMarks: 100,
    sections: [
      {
        name: "Section A",
        marks: 30,
        questionCount: 3,
        questionNumbers: [1, 2, 3],
      },
      {
        name: "Section B",
        marks: 40,
        questionCount: 4,
        questionNumbers: [4, 5, 6, 7],
      },
      {
        name: "Section C",
        marks: 30,
        questionCount: 3,
        questionNumbers: [8, 9, 10],
      },
    ],
  };
   return (     
      <div className="flex flex-row min-w-screen gap-4 items-start overflow-auto  p-4">
      <div className="flex-1">
        <PaperSummary {...paperData} />
      </div>
      <div className="flex-1">
        <CurriculumEditor />
      </div>
      <div className="flex-1">
        <AddQuestionForm/>
      </div>
    </div>
   )
}