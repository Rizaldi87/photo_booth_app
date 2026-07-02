import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AdminModal from "./AdminModal";
import type { Frame } from "../../types/FrameType";
import FrameEditor from "./FrameEditor";
import axios from "axios";
import toast from "react-hot-toast";
import FramePreview from "../FramePreview";
import LoadingBar from "../LoadingBar";

type ModalMode = "create" | "edit" | "delete";

export default function FrameContent() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modalMode, setModalMode] = useState<ModalMode>("create");

  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

  const [modalActive, setModalActive] = useState(Boolean);

  const handleCreate = async (data: Partial<Frame>) => {
    try {
      console.log(data);
      const res = await axios.post("api/frames", data);
      if (modalActive) {
        setModalActive(false);
      }
      toast.success(res.data.message);
      await fetchFrames();
      console.log("Frame created:", res.data);
    } catch (error) {
      toast.error("Failed to create Frame");
      console.error("Failed to create Frame:", error);
    }
  };

  const handleUpdate = async (data: Partial<Frame>) => {
    try {
      const res = await axios.put(`/api/frames/${selectedFrame?.id}`, data);

      if (modalActive) {
        setModalActive(false);
      }
      toast.success(res.data.message);
      await fetchFrames();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`api/frames/${selectedFrame?.id}`);
      if (modalActive) {
        setModalActive(false);
      }
      toast.success(res.data.message);
      await fetchFrames();
      console.log("Frame created:", res.data);
    } catch (error) {
      toast.error("Failed to create Frame");
      console.error("Failed to create Frame:", error);
    }
  };

  const fetchFrames = async () => {
    try {
      const res = await axios.get("/api/frames");

      setFrames(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadFrames = async () => {
      await fetchFrames();
    };

    loadFrames();
  }, []);

  return (
    <div className="relative p-16 ">
      <div className="w-full flex items-center justify-between">
        <div className="flex flex-col gap-4 font-mono">
          <span className="text-xs text-[#C9A84C] tracking-widest">LIBRARY</span>
          <h1 className="text-white text-5xl">Frame Library</h1>
          <span className="text-[#555250]">Upload and manage photo booth frames and overlays.</span>
        </div>

        <button
          onClick={() => {
            // setSelectedLayout(null);
            setSelectedFrame(null);
            setModalMode("create");
            setModalActive(true);
          }}
          className="p-3 flex items-center gap-2 bg-[#C9A84C] text-center cursor-pointer"
        >
          <FaPlus /> New Frame
        </button>
      </div>
      <div className="relative mt-6 flex items-center gap-2 h-full">
        {isLoading ? (
          <LoadingBar />
        ) : (
          // display all frames
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-8 items-center align-middle">
            {frames.map((frame) => (
              <div
                key={frame.id}
                className="
        bg-[#161616]
        border border-[#292929]
        rounded-md
        p-4
        flex flex-col
        gap-3
      "
              >
                <div className="flex justify-center">
                  <FramePreview frame={frame} />
                </div>

                <div className="text-white font-medium">{frame.name}</div>

                <div className="flex gap-2 ">
                  <button
                    onClick={() => {
                      setSelectedFrame(frame);
                      setModalMode("edit");
                      setModalActive(true);
                    }}
                    className="px-3 py-2 border border-[#C9A84C] text-[#C9A84C] transition-all duration-200
                    cursor-pointer
                  hover:bg-[#C9A84C]
                  hover:text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedFrame(frame);
                      setModalMode("delete");
                      setModalActive(true);
                    }}
                    className="px-3 py-2 border border-red-500 text-red-500 cursor-pointer transition-all duration-200
                  hover:bg-[#c94c4c]
                  hover:text-white "
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalActive && (
        <AdminModal title={modalMode === "create" ? "Add Frame" : modalMode === "edit" ? "Edit Frame" : "Delete Frame"} setModalActive={setModalActive}>
          {modalMode === "delete" ? (
            <div className="space-y-4">
              <p className="text-gray-300">Delete "{selectedFrame?.name}" ?</p>

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
            <FrameEditor
              key={selectedFrame?.id ?? "new"}
              initialData={selectedFrame ?? undefined}
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
