// src/context/PaperContext.jsx
import { createContext, useContext, useState } from "react";

const PaperContext = createContext();

export const PaperProvider = ({ children }) => {
  const [templateName, setTemplateName] = useState("Default Template");
  const [paperName, setPaperName] = useState("Sample Paper");
  const [totalMarks, setTotalMarks] = useState(100);
  const [sections, setSections] = useState([
    {
      name: "Section A",
      marks: 40,
      questionCount: 4,
      questionNumbers: [1, 2, 3, 4],
      questionNumbersRaw: "1,2,3,4"
    },
    {
      name: "Section B", 
      marks: 30, 
      questionCount: 3, 
      questionNumbers: [5,6,7],
      questionNumbersRaw: "5,6,7"
    }
  ]);

  return (
    <PaperContext.Provider
      value={{
        templateName,
        setTemplateName,
        paperName,
        setPaperName,
        totalMarks,
        setTotalMarks,
        sections,
        setSections,
      }}
    >
      {children}
    </PaperContext.Provider>
  );
};

export const usePaper = () => useContext(PaperContext);
