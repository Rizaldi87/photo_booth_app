import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { Frame } from "../../types/FrameType";

type frameEditorData = Partial<Frame>;

type Props = {
  initialData?: frameEditorData;

  onSubmit: (data: frameEditorData) => void;
};

export default function FrameEditor({ initialData, onSubmit }: Props) {
  const { register, handleSubmit, reset, control } = useForm<frameEditorData>({
    defaultValues: {
      name: "Frame Name",
      backgroundColor: "#ffffff",
      borderColor: "#C9A84C",
      borderWidth: 6,
      titleText: "PHOTO BOOTH",
      bottomText: "PixelBooth",
      fontSize: 14,
    },
  });
  useEffect(() => {
    reset(
      initialData ?? {
        name: "Frame Name",
        backgroundColor: "#ffffff",
        borderColor: "#C9A84C",
        borderWidth: 6,
        titleText: "PHOTO BOOTH",
        bottomText: "PixelBooth",
        fontSize: 14,
      },
    );
  }, [initialData, reset]);

  const borderWidth = useWatch({
    control,
    name: "borderWidth",
  });

  const backgroundColor = useWatch({
    control,
    name: "backgroundColor",
  });

  const borderColor = useWatch({
    control,
    name: "borderColor",
  });

  const titleText = useWatch({
    control,
    name: "titleText",
  });

  const fontSize = useWatch({
    control,
    name: "fontSize",
  });

  const bottomText = useWatch({
    control,
    name: "bottomText",
  });

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="h-[65vh] bg-black text-white flex overflow-hidden">
        {/* LEFT PANEL */}
        <aside className="w-44 shrink-0 border-r border-[#292929] bg-[#111111] flex flex-col">
          <div className="p-3 border-b border-[#292929]">
            <h2 className="text-[#C9A84C] font-mono tracking-widest text-xs">ELEMENTS</h2>
          </div>

          <div className="p-3 flex flex-col gap-2">
            <button className="p-2 text-xs bg-[#1E1A12] border border-[#C9A84C] text-[#C9A84C]">+ Add Text</button>

            <button className="p-2 text-xs bg-[#1E1A12] border border-[#C9A84C] text-[#C9A84C]">+ Add Image</button>

            <button className="p-2 text-xs bg-[#1E1A12] border border-[#C9A84C] text-[#C9A84C]">+ Add Shape</button>
          </div>

          <div className="border-t border-[#292929] p-3">
            <h3 className="text-[#C9A84C] font-mono text-xs mb-2">LAYERS</h3>

            <div className="space-y-1">
              <div className="bg-[#181818] p-2 text-xs border border-[#292929]">Background</div>

              <div className="bg-[#181818] p-2 text-xs border border-[#292929]">Logo</div>

              <div className="bg-[#181818] p-2 text-xs border border-[#292929]">Title Text</div>
            </div>
          </div>
        </aside>
        {/* CENTER */}
        <main className="flex-1 flex items-center justify-center bg-[#0B0B0B] p-4">
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-[#555250]">FRAME PREVIEW</span>

            <div
              style={{
                backgroundColor,
                borderWidth,
                borderColor,
              }}
              className="p-2 border-solid"
            >
              <div className="w-37.5 flex flex-col gap-2">
                <div
                  style={{
                    fontSize,
                  }}
                  className="text-center text-black font-bold"
                >
                  {titleText}
                </div>

                <div className="grid grid-cols-2 gap-1">
                  <div className="aspect-3/4 border border-dashed border-gray-400" />
                  <div className="aspect-3/4 border border-dashed border-gray-400" />
                  <div className="aspect-3/4 border border-dashed border-gray-400" />
                  <div className="aspect-3/4 border border-dashed border-gray-400" />
                </div>

                <div
                  style={{
                    fontSize,
                  }}
                  className="text-center text-black "
                >
                  {bottomText}
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* RIGHT PANEL */}
        <aside className="w-52 shrink-0 border-l border-[#292929] bg-[#111111] overflow-y-auto">
          <div className="p-3 border-b border-[#292929]">
            <h2 className="text-[#C9A84C] font-mono tracking-widest text-xs">PROPERTIES</h2>
          </div>

          <div className="p-3 flex flex-col gap-3">
            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Frame Name</label>

              <input
                {...register("name")}
                className="
                w-full
                text-xs
                bg-[#0F0C08]
                border border-[#C9A84C]/20
                rounded
                px-2 py-1.5
              "
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Background</label>

              <input type="color" {...register("backgroundColor")} className="w-full h-8" />
            </div>

            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Border Color</label>

              <input type="color" {...register("borderColor")} className="w-full h-8" />
            </div>

            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Border Width</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="30"
                  defaultValue="10"
                  {...register("borderWidth", {
                    valueAsNumber: true,
                  })}
                  className="w-full"
                />
                <span className="text-[10px] text-gray-400">{borderWidth}px</span>
              </div>
            </div>

            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Title Text</label>

              <input
                {...register("titleText")}
                className="
                w-full
                text-xs
                bg-[#0F0C08]
                border border-[#C9A84C]/20
                rounded
                px-2 py-1.5
              "
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Bottom Text</label>

              <input
                {...register("bottomText")}
                className="
                w-full
                text-xs
                bg-[#0F0C08]
                border border-[#C9A84C]/20
                rounded
                px-2 py-1.5
              "
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Font Size</label>

              <input
                type="number"
                {...register("fontSize", {
                  valueAsNumber: true,
                })}
                defaultValue={24}
                className="
                w-full
                text-xs
                bg-[#0F0C08]
                border border-[#C9A84C]/20
                rounded
                px-2 py-1.5
              "
              />
            </div>

            <button
              type="submit"
              className="
              mt-2
              bg-[#C9A84C]
              text-black
              text-sm
              font-medium
              py-2
              rounded
            "
            >
              Save Frame
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}
