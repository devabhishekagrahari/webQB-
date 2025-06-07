// src/context/curriculumContext.jsx

import { createContext, useContext, useState } from "react";

const CurriculumContext = createContext();

export const useCurriculum = () => useContext(CurriculumContext);

export const CurriculumProvider = ({ children }) => {
  const [curriculum, setCurriculum] = useState([
    {
      unitName: "Unit 1",
      chapters: [
        {
          chapterName: "Chapter 1",
          subChapters: [
            {
              subChapterName: "Sub Chapter 1",
              subSubChapters: [
                {
                  subSubChapterName: "Sub Sub Chapter 1",
                  categories: [
                    {
                      categoryName: "Category 1",
                      subCategories: ["Sub Category 1", "Sub Category 2"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  const updateCurriculum = (newData) => {
    setCurriculum(newData);
  };

  return (
    <CurriculumContext.Provider value={{ curriculum, setCurriculum, updateCurriculum }}>
      {children}
    </CurriculumContext.Provider>
  );
};
