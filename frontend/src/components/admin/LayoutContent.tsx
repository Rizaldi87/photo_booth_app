import axios from "axios";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import type { Layout } from "../../types/LayouOutType";
import AdminModal from "./AdminModal";
import LayoutForm from "./LayoutForm";
import LayoutPreview from "../LayoutPreview";
import toast from "react-hot-toast";
import LoadingBar from "../LoadingBar";

type ModalMode = "create" | "edit" | "delete";

export default function LayoutContent() {
  const [layouts, setLayouts] = useState<Layout[]>([]);

  const [modalActive, setModalActive] = useState(Boolean);

  const [modalMode, setModalMode] = useState<ModalMode>("create");

  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const handleCreate = async (data: Partial<Layout>) => {
    try {
      const response = await axios.post("api/layouts", data);

      if (modalActive) {
        setModalActive(false);
      }
      toast.success(response.data.message);
      await fetchLayout();
      console.log("Layout created:", response.data);
    } catch (error) {
      toast.error("Failed to create Layout");
      console.error("Failed to create layout:", error);
    }
  };

  const handleUpdate = async (data: Partial<Layout>) => {
    try {
      const res = await axios.put(`api/layouts/${selectedLayout?.id}`, data);
      if (modalActive) {
        setModalActive(false);
      }
      toast.success(res.data.message);
      await fetchLayout();
      console.log(`layout ${selectedLayout?.name} updated: `, res.data);
    } catch (error) {
      toast.error("Failed to update Layout");
      console.error("Failed to update layout:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`api/layouts/${selectedLayout?.id}`);

      if (modalActive) {
        setModalActive(false);
      }
      toast.success(res.data.message);
      fetchLayout();
      console.log("Layout deleted:", res.data);
    } catch (error) {
      toast.error("Failed to delete Layout");
      console.error("Failed to delete layout:", error);
    }
  };

  const fetchLayout = async () => {
    try {
      const res = await axios.get("/api/layouts");

      console.log(res.data);
      setLayouts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchLayout();
  }, []);

  return (
    <div className="relative p-16 ">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col gap-4 font-mono">
          <span className="text-xs text-[#C9A84C] tracking-widest">MANAGE</span>
          <h1 className="text-white text-5xl">Photo Layouts</h1>
          <span className="text-[#555250]">Configure grid types, pricing, and availability.</span>
        </div>

        <button
          onClick={() => {
            setSelectedLayout(null);
            setModalMode("create");
            setModalActive(true);
            // setFormContent("Add Layout",)
          }}
          className="p-3 flex items-center gap-2 bg-[#C9A84C] text-center cursor-pointer"
        >
          <FaPlus /> New Layout
        </button>
      </div>
      <div className="relative mt-6 flex items-center gap-2 h-full flex-wrap">
        {isLoading ? (
          <LoadingBar />
        ) : (
          layouts.map((layout) => (
            <div key={layout.id} className="bg-[#161616] p-4 flex flex-col justify-between w-64 gap-4 rounded-sm border border-gray-500">
              <div className="flex items-start justify-between">
                <LayoutPreview row={layout.row} column={layout.column} />
                <div className={`bg-[#0E1F16] px-2 border border-[#2A5C40] ${layout.isActive ? "text-[#3aab6b]" : "text-[#2A5C40]"}`}>{layout.isActive ? "Active" : "Inactive"}</div>
              </div>
              <div className="text-white text-xl font-sans">{layout.name}</div>
              <div className="flex items-center gap-1 text-[#555250]">
                <div>{layout.description}</div>-<div>Rp. {layout.price}</div>
              </div>
              {/* <div>{layout.photo_count}</div> */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedLayout(layout);
                    setModalMode("edit");
                    setModalActive(true);
                  }}
                  className="
                  px-4 py-2
                  border border-[#C9A84C]
                  text-[#C9A84C]
                  bg-[#1E1A12]
                  text-sm
                  rounded-xs
                  cursor-pointer
                  transition-all duration-200
                  hover:bg-[#C9A84C]
                  hover:text-white
                "
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setSelectedLayout(layout);
                    setModalMode("delete");
                    setModalActive(true);
                  }}
                  className="
                  px-4 py-2
                  border border-[#c94c4c]
                  text-[#c94c4c]
                  bg-[#1e1212]
                  text-sm
                  rounded-xs
                  cursor-pointer
                  transition-all duration-200
                  hover:bg-[#c94c4c]
                  hover:text-white 
                "
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalActive && (
        <AdminModal title={modalMode === "create" ? "Add Layout" : modalMode === "edit" ? "Edit Layout" : "Delete Layout"} setModalActive={setModalActive}>
          {modalMode === "delete" ? (
            <div className="space-y-4">
              <p className="text-gray-300">Delete "{selectedLayout?.name}" ?</p>

              <button
                onClick={handleDelete}
                className="
                  px-4 py-2
                  bg-red-500
                  text-white
                "
              >
                Delete
              </button>
            </div>
          ) : (
            <LayoutForm
              initialData={selectedLayout ?? undefined}
              onSubmit={(data) => {
                if (modalMode === "create") {
                  handleCreate(data);
                } else {
                  handleUpdate(data);
                }
              }}
            />
          )}
        </AdminModal>
      )}
    </div>
  );
}
