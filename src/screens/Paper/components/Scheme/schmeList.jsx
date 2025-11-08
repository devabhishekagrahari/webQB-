import { useEffect, useState } from "react";
import BASE_URL from "../../../../utils/api";
import CustomDropdown from "./customDropdown";
const SchemeList = () => {
  const [change, setChange] = useState(true);
  const [scheme, setSchemes] = useState([]);
  const [allUnits, setUnits] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subChapters, setSubChapters] = useState([]);
  const [subSubChapters, setSubSubChapters] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState({ name: "", _id: 0 });
  const [selectedChapterId, setSelectedChapterId] = useState({
    name: "",
    _id: 0,
  });
  const [selectedSubChapterId, setSelectedSubChapterId] = useState({
    name: "",
    _id: 0,
  });
  const [selectedSubSubChapterId, setSelectedSubSubChapterId] = useState({
    name: "",
    _id: 0,
  });
  console.log("scheme", scheme);
  console.log("allUnits", allUnits);
  console.log("selectedUnitId", selectedUnitId);
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await fetch(`${BASE_URL}/getUnitSchemes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok)
          throw new Error(`Failed to fetch unit schemes: ${res.status}`);
        const data = await res.json();

        const allUnits =
          data.chapterSchemes?.flatMap(
            (scheme) =>
              scheme.units?.map((u) => ({
                name: u.name,
                _id: u._id,
              })) || []
          ) || [];
        setUnits(allUnits);
        setSchemes(data.chapterSchemes);
      } catch (err) {
        console.error("❌ Error loading unit schemes:", err);
      }
    };
    loadInitialData();
  }, []);
  useEffect(() => {
    // Find the unit object matching selectedUnitId
    const selectedUnit = scheme[0]?.units?.find(
      (u) => u._id === selectedUnitId._id
    );
    console.log("selectedUnit", selectedUnit);
    // Get its chapters, or empty array if not found
    const filterChapter = selectedUnit?.chapters || [];
    setChapters(filterChapter);

    const selectedChapter = filterChapter?.find(
      (c) => c._id === selectedChapterId._id
    );
    const filterSubChapter = selectedChapter?.subChapters || [];
    setSubChapters(filterSubChapter);

    const selectedSubChapter = filterSubChapter?.find(
      (s) => s._id === selectedSubChapterId._id
    );
    const filterSubSubChapter = selectedSubChapter?.subSubChapters || [];
    setSubSubChapters(filterSubSubChapter);

    setChange(false);
  }, [change, scheme, selectedUnitId, selectedChapterId, selectedSubChapterId]);

  const onDelete = async (type, id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const res = await fetch(`${BASE_URL}/deleteSchemeElement`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [type]: id,
          group: "Bio-Chem-Vault",
        }),
      });

      if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);
      setChange(true);
      console.log("Deleted successfully");
      alert("Deleted Successfully");
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  // const onEdit = async () => {
  //   try {
  //     const payload = {
  //       groups: "Bio-Chem-Vault",
  //       units: [
  //         {
  //           name: selectedUnitId.name,
  //           Chapters: [
  //             {
  //               name: selectedChapterId.name,
  //               subChapters: [
  //                 {
  //                   name: selectedSubChapterId.name,
  //                   subSubChapters: [
  //                     {
  //                       name: selectedSubSubChapterId.name,
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     };
  //     console.log("payload",payload);
  //     const token = localStorage.getItem("token");
  //     if (!token) throw new Error("User not authenticated");
  //     const res = await fetch(`${BASE_URL}/updateUnitScheme`, {
  //       method: "PUT",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });
  //     console.log("res", res);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  const onEdit = async (type, id, newName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      if (!newName?.trim()) throw new Error("New name cannot be empty");

      const res = await fetch(`${BASE_URL}/editSchemeElementName`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group: "Bio-Chem-Vault",
          type, // "unit" | "chapter" | "subChapter"
          id, // element _id
          newName, // updated name string
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `Failed to edit: ${res.status}`);
      }

      const data = await res.json();
      console.log(`${type} updated successfully:`, data);

      // trigger re-render / refetch if needed
      setChange(true);
      window.location.reload(); // optional — can replace with more efficient state update
    } catch (e) {
      console.error("Edit error:", e.message);
      alert(e.message);
    }
  };

  return (
    <div className="p-6 w-full flex flex-col rounded-2xl bg-white shadow-md">
      <div className="text-xl font-bold text-gray-800 pb-4 gap-2">Master Schema Edit/Update/Delete</div>
      <CustomDropdown
        options={allUnits}
        value={selectedUnitId}
        onChange={setSelectedUnitId}
        type={"unitId"}
        onDelete={onDelete}
        onEdit={onEdit}
      />
      <CustomDropdown
        options={chapters}
        value={selectedChapterId}
        onChange={setSelectedChapterId}
        type={"chapterId"}
        onDelete={onDelete}
        onEdit={onEdit}
      />
      <CustomDropdown
        options={subChapters}
        value={selectedSubChapterId}
        onChange={setSelectedSubChapterId}
        type={"subChapterId"}
        onDelete={onDelete}
        onEdit={onEdit}
      />
      <CustomDropdown
        options={subSubChapters}
        value={selectedSubSubChapterId}
        onChange={setSelectedSubSubChapterId}
        type={"subSubChapterId"}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </div>
  );
};
export default SchemeList;
