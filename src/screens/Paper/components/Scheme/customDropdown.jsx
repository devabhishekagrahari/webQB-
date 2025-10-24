import { useState, useRef, useEffect } from "react";
import { Trash2, ChevronDown, Edit, Search, Check } from "lucide-react";

export default function CustomDropdown({
  type,
  value,
  onChange,
  options = [],
  onDelete,
  onEdit,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(0);
  const [newName, setNewName] = useState("");
  const dropdownRef = useRef(null);

  const handleSelect = (opt) => {
    onChange(opt); // pass full object
    setOpen(false);
    setSearch("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options by search term (case-insensitive)
  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className="relative w-full unit-dropdown">
      <button
        type="button"
        className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 flex justify-between items-center"
        onClick={() => setOpen((prev) => !prev)}
      >
        {value?.name || "Select Value"} {/* display name if value is object */}
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-md max-h-72 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-2 p-2 border-b border-gray-200">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-sm text-gray-700"
            />
          </div>

          {/* Option List */}
          <div className="max-h-56 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt._id} // use _id as key
                  className="flex justify-between items-center px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(opt)}
                >
                  {editingId === opt._id ? (
                    <input
                      type="text"
                      placeholder="Set New Value"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onClick={(e) => e.stopPropagation()} // 👈 prevent row click
                      onFocus={(e) => e.stopPropagation()} // 👈 prevent dropdown close
                      className="w-full outline-none text-sm text-gray-700"
                    />
                  ) : (
                    <span className="truncate max-w-[70%]">{opt.name}</span>
                  )}
                  <div className="flex items-center gap-2">
                    {editingId === opt._id ? (
                      <Check
                        size={16}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(0);
                          onEdit(type, opt._id, newName);
                        }}
                      />
                    ) : (
                      <Edit
                        size={16}
                        className="text-gray-500 hover:text-blue-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewName(opt.name);
                          setEditingId(opt._id);
                        }}
                      />
                    )}

                    <Trash2
                      size={16}
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(type, opt._id);
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-gray-400 text-sm">No matching units</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
