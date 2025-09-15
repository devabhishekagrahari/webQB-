import { usePaperData } from "../../context/appProvider";
import PaperSummary from "./components/paperSummary";
import { QuestionList } from "./components/QuestionList/QuestionList";

export default function GeneratePaper(){
  const paperData = usePaperData();
  return (     
    <div className="flex flex-row w-full overflow-y-auto gap-4">
      <div className="flex-1 max-w-[45%]">
        <PaperSummary {...paperData} />
      </div>
      <div className="flex-1">
        <QuestionList mode="compact" />
      </div>
    </div>
  );
}