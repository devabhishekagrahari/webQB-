import { FilePlus, FileText, PlusCircle, Search } from "lucide-react";
import {Link} from "react-router-dom";

export default function Sidebar(){
    return(
        <div className="flex pt-20 top-0 left-0 flex-col min-h-screen max-w-[150px] min-w-[150px] bg-gradient-to-r from-teal-200 via-teal-300 to-teal-400">
                <nav className="flex flex-col space-y-4 p-4 text-zinc-800 font-semibold">
        
        <Link to='/generate-paper' className="flex bg-white rounded-xl p-4 !text-teal-600 items-center space-x-2 hover:text-teal-900">
          <FilePlus size={20} />
          Generate
        </Link>

        <Link to="/view-paper" className="flex bg-white rounded-xl p-4 !text-teal-600 items-center space-x-2 hover:text-teal-900">
          <FileText size={20} />
          <span>View Paper</span>
        </Link>

        <Link to="/add-question" className="flex bg-white rounded-xl p-4 !text-teal-600 items-center space-x-2 hover:text-teal-900">
          <PlusCircle size={20} />
          <span>Add Question</span>
        </Link>

        <Link to="/view-question" className="flex bg-white rounded-xl p-4 !text-teal-600 items-center space-x-2 hover:text-teal-900">
          <Search size={20} />
          <span>View Questions</span>
        </Link>
                <Link to="/dashboard" className="flex bg-white rounded-xl p-4 !text-teal-600 items-center space-x-2 hover:text-teal-900">
          <Search size={20} />
          <span>Dashboard</span>
        </Link>
        </nav>
        </div>
    )
}