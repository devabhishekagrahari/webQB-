// src/components/CurriculumEditor.jsx

import { usePaperData } from "../../../context/appProvider";


export default function CurriculumEditor() {
  const { curriculum, setCurriculum } = usePaperData();

  const setDeepValue = (path, value) => {
    const updated = structuredClone(curriculum); // Safe deep clone
    let current = updated;

    for (let i = 0; i < path.length - 1; i++) {
      const { key, index } = path[i];
      current = index !== null ? current[key]?.[index] : current[key];
    }

    const last = path[path.length - 1];
    if (last.index !== null) {
      current[last.key][last.index] = value;
    } else {
      current[last.key] = value;
    }

    setCurriculum(updated);
  };

  return (
    <div className="p-4 max-w-[280px]">
      {curriculum.map((unit, unitIndex) => (
        <div key={unitIndex} className="mb-6 border rounded p-3 shadow">
          <input
            type="text"
            value={unit.unitName}
            onChange={(e) =>
              setDeepValue(
                [{ key: unitIndex, index: null }, { key: "unitName", index: null }],
                e.target.value
              )
            }
            className="font-bold text-lg w-full border-b pb-1"
          />

          {unit.chapters?.map((chapter, chIndex) => (
            <div key={chIndex} className="ml-4 mt-3">
              <input
                type="text"
                value={chapter.chapterName}
                onChange={(e) =>
                  setDeepValue(
                    [
                      { key: unitIndex, index: null },
                      { key: "chapters", index: chIndex },
                      { key: "chapterName", index: null },
                    ],
                    e.target.value
                  )
                }
                className="font-semibold text-base w-full border-b pb-1"
              />

              {chapter.subChapters?.map((subChapter, subChIndex) => (
                <div key={subChIndex} className="ml-4 mt-2">
                  <input
                    type="text"
                    value={subChapter.subChapterName}
                    onChange={(e) =>
                      setDeepValue(
                        [
                          { key: unitIndex, index: null },
                          { key: "chapters", index: chIndex },
                          { key: "subChapters", index: subChIndex },
                          { key: "subChapterName", index: null },
                        ],
                        e.target.value
                      )
                    }
                    className="w-full border-b pb-1"
                  />

                  {subChapter.subSubChapters?.map((subSubChapter, subSubChIndex) => (
                    <div key={subSubChIndex} className="ml-4 mt-2">
                      <input
                        type="text"
                        value={subSubChapter.subSubChapterName}
                        onChange={(e) =>
                          setDeepValue(
                            [
                              { key: unitIndex, index: null },
                              { key: "chapters", index: chIndex },
                              { key: "subChapters", index: subChIndex },
                              { key: "subSubChapters", index: subSubChIndex },
                              { key: "subSubChapterName", index: null },
                            ],
                            e.target.value
                          )
                        }
                        className="w-full border-b pb-1"
                      />

                      {subSubChapter.categories?.map((category, catIndex) => (
                        <div key={catIndex} className="ml-4 mt-2">
                          <input
                            type="text"
                            value={category.categoryName}
                            onChange={(e) =>
                              setDeepValue(
                                [
                                  { key: unitIndex, index: null },
                                  { key: "chapters", index: chIndex },
                                  { key: "subChapters", index: subChIndex },
                                  { key: "subSubChapters", index: subSubChIndex },
                                  { key: "categories", index: catIndex },
                                  { key: "categoryName", index: null },
                                ],
                                e.target.value
                              )
                            }
                            className="w-full border-b pb-1"
                          />

                          {category.subCategories?.map((subCat, subCatIndex) => (
                            <div key={subCatIndex} className="ml-4 mt-1">
                              <input
                                type="text"
                                value={subCat}
                                onChange={(e) =>
                                  setDeepValue(
                                    [
                                      { key: unitIndex, index: null },
                                      { key: "chapters", index: chIndex },
                                      { key: "subChapters", index: subChIndex },
                                      { key: "subSubChapters", index: subSubChIndex },
                                      { key: "categories", index: catIndex },
                                      { key: "subCategories", index: subCatIndex },
                                    ],
                                    e.target.value
                                  )
                                }
                                className="w-full border-b pb-1 text-sm text-gray-600"
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
