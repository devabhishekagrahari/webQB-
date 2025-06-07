// src/context/QuestionContext.jsx
import { createContext, useContext, useState } from "react";

const QuestionContext = createContext();

export function useQuestion() {
  return useContext(QuestionContext);
}

export function QuestionProvider({ children }) {
  const [questions, setQuestions] = useState([]);

  const addQuestion = (newQuestion) => {
    setQuestions((prev) => [...prev, newQuestion]);
  };

  return (
    <QuestionContext.Provider value={{ questions, addQuestion }}>
      {children}
    </QuestionContext.Provider>
  );
}
