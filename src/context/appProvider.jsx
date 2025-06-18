// src/context/AppContext.jsx
import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {

const [allQuestions, setAllQuestions] = useState([]);       // your fetched pool
const [selectedQuestions, setSelectedQuestions] = useState([]);
const [templateName, setTemplateName] = useState("");
const [paperName, setPaperName] = useState("");
const [totalMarks, setTotalMarks] = useState(0);
const [sections, setSections] = useState([]); // Array of section objects
  return (
    <AppContext.Provider
      value={{

        // Paper
        templateName,
        setTemplateName,
        paperName,
        setPaperName,
        totalMarks,
        setTotalMarks,
        sections,
        setSections,

        allQuestions,
        setAllQuestions,
        selectedQuestions,
        setSelectedQuestions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the combined context
export const usePaperData = () => useContext(AppContext);
