import { usePaperData } from "../../context/appProvider";
import PaperSummary from "./components/paperSummary";
import { QuestionList } from "./components/questionList";

export default function GeneratePaper(){
  const paperData = usePaperData();
   return (     
      <div className="flex flex-row min-w-screen pr-10  overflow-auto ">
      <div >
        <PaperSummary { ...paperData}/>
      </div>
      <div className="flex-1">
        <QuestionList/>
      </div>
    </div>
   )
}