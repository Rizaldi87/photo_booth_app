import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import type { Layout } from "../../types/LayouOutType";

type LayoutFormData = Partial<Layout>;

type Props = {
  initialData?: LayoutFormData;

  onSubmit: (data: LayoutFormData) => void;
};

export default function LayoutForm({ initialData, onSubmit }: Props) {
  const { register, handleSubmit, reset, control } = useForm<LayoutFormData>({
    defaultValues: {
      row: 1,
      column: 1,
    },
  });

  useEffect(() => {
    reset(
      initialData ?? {
        name: "",
        description: "",
        price: 0,
        isActive: true,
      },
    );
  }, [initialData, reset]);

  const column = Number(
    useWatch({
      control,
      name: "column",
    }) || 1,
  );
  const row = Number(
    useWatch({
      control,
      name: "row",
    }) || 1,
  );

  const PREVIEW_W = 192;
  const FRAME_PAD = 12;
  const SLOT_GAP = 12;

  const innerW = PREVIEW_W - FRAME_PAD * 2;
  const slotH = innerW * (3 / 4); // atau ratio layout kamu
  const PREVIEW_H = FRAME_PAD * 2 + row * slotH + SLOT_GAP * (row - 1);
  return (
    <div className="flex items-stretch gap-8 w-full">
      <form id="layout-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-80 shrink-0 grow-0 h-full">
        {/* Layout Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#C9A84C]">Layout Name</label>

          <input
            {...register("name")}
            placeholder="e.g. Classic Strip"
            className="
              w-full
              rounded-md
              border border-[#C9A84C]/20
              bg-[#0F0C08]
              px-4 py-3
              text-white
              outline-none
              transition-all
              placeholder:text-gray-500
              focus:border-[#C9A84C]
              focus:ring-2
              focus:ring-[#C9A84C]/20
            "
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#C9A84C]">Description</label>

          <textarea
            {...register("description")}
            rows={3}
            placeholder="Describe this layout..."
            className="
              w-full
              resize-none
              rounded-md
              border border-[#C9A84C]/20
              bg-[#0F0C08]
              px-4 py-3
              text-white
              outline-none
              transition-all
              placeholder:text-gray-500
              focus:border-[#C9A84C]
              focus:ring-2
              focus:ring-[#C9A84C]/20
            "
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#C9A84C]">Price</label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">Rp</span>

            <input
              type="number"
              {...register("price", {
                valueAsNumber: true,
              })}
              placeholder="50000"
              className="
                w-full
                rounded-md
                border border-[#C9A84C]/20
                bg-[#0F0C08]
                py-3 pl-12 pr-4
                text-white
                outline-none
                transition-all
                placeholder:text-gray-500
                focus:border-[#C9A84C]
                focus:ring-2
                focus:ring-[#C9A84C]/20
              "
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#C9A84C]">Grid</label>

          <div className="flex gap-3">
            <input
              type="number"
              {...register("column", { valueAsNumber: true, min: 1, max: 3 })}
              min={1}
              max={2}
              placeholder="Column"
              className="
                w-full
                rounded-md
                border border-[#C9A84C]/20
                bg-[#0F0C08]
                py-3 px-2
                text-white
                outline-none
                transition-all
                placeholder:text-gray-500
                focus:border-[#C9A84C]
                focus:ring-2
                focus:ring-[#C9A84C]/20
              "
            />
            <input
              type="number"
              {...register("row", { valueAsNumber: true, min: 1, max: 4 })}
              min={1}
              max={3}
              placeholder="Row"
              className="
                w-full
                rounded-md
                border border-[#C9A84C]/20
                bg-[#0F0C08]
                py-3 px-2
                text-white
                outline-none
                transition-all
                placeholder:text-gray-500
                focus:border-[#C9A84C]
                focus:ring-2
                focus:ring-[#C9A84C]/20
              "
            />
          </div>
          <input
            type="number"
            {...register("photo_count", { valueAsNumber: true, min: 1 })}
            min={1}
            value={column * row}
            disabled
            placeholder="Column"
            className="
                w-full
                rounded-md
                border border-[#C9A84C]/20
                bg-[#0F0C08]
                py-3 px-2
                text-white
                outline-none
                transition-all
                placeholder:text-gray-500
                focus:border-[#C9A84C]
                focus:ring-2
                focus:ring-[#C9A84C]/20
              "
          />
        </div>

        {/* Status */}
        <div className="rounded-md border border-[#C9A84C]/20 bg-[#0F0C08] p-4">
          <label className="flex cursor-pointer items-center justify-between">
            <div>
              <p className="font-medium text-white">Active Layout</p>

              <p className="text-sm text-gray-400">Enable this layout for customers</p>
            </div>

            <input
              type="checkbox"
              {...register("isActive")}
              className="
                h-5 w-5
                accent-[#C9A84C]
                cursor-pointer
              "
            />
          </label>
        </div>
      </form>
      {/* layout preview */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-full shrink-0">
          <div
            style={{
              width: "fit-content",
              height: PREVIEW_H,
              padding: FRAME_PAD,
              background: "#0F0C08",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${column}, 1fr)`, gridTemplateRows: `repeat(${row}, 1fr)`, gap: SLOT_GAP }}>
              {Array.from({ length: row * column }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: innerW,
                    height: slotH,
                    border: "1px solid #C9A84C",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-center gap-3 pt-2 min-w-150 items-center">
          <button
            form="layout-form"
            type="submit"
            className="
              rounded-md
              border border-[#C9A84C]
              bg-[#C9A84C]
              px-5 py-3
              font-medium
              text-[#18140E]
              transition-all
              hover:scale-[1.02]
              hover:shadow-[0_0_20px_rgba(201,168,76,0.35)]
            "
          >
            {initialData?.id ? "Update Layout" : "Create Layout"}
          </button>
        </div>
      </div>
    </div>
  );
}
