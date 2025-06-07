import{Link} from "react-router-dom";

export default function Header({toggleSidebar}){
    return(
        <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-10 bg-gradient-to-br from-teal-400 via-teal-500 to-teal-400 ">
        <button
            onClick={toggleSidebar}
            className=" text-xl text-white h-9 !bg-teal-500 shadow-2xl hover:bg-teal-100 p-2 rounded focus:outline-none "
        >
      ☰
        </button>
           <h3 className="text-3xl  text-white  font-bold">🛡️ Bio-Chem-Vault</h3>
        </div>
    )
}