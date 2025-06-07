import { useState } from "react";
import Header from "./basic/header";
import Sidebar from "./basic/sidebar";

export default function BaseLayout({children}){
    const [isOpen , setIsOpen]= useState(false);
    const toggleSidebar =() => {setIsOpen((prev)=> !prev);}
      return (
    <div className="min-h-screen fixed min-w-screen flex  bg-zinc-100 dark:bg-zinc-950">
    <Header toggleSidebar={toggleSidebar}/>
    {isOpen && <Sidebar />}
    
      <main
        className={"flex min-w-screen max-h-screen max-w-screen min-h-screen p-4 bg-white pt-[60px] "}
      >
        {children}
      </main>
    </div>
  );
}