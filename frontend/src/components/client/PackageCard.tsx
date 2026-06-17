import type { PackageColorType, PackageType } from "../../types/PackageType";

type PackageCardProps = {
  packageData: PackageType;
  colorVariant: PackageColorType;
  isSelected?: boolean;
  onSelect: (pkg: PackageType) => void;
};

export default function PackageCard({ packageData, colorVariant, isSelected, onSelect }: PackageCardProps) {
  return (
    <div
      onClick={() => onSelect(packageData)}
      className={`
        relative overflow-hidden
        rounded-3xl
        bg-white
        border
        p-8
        shadow-lg
        ${colorVariant.shadow}
        ${colorVariant.border}
        hover:-translate-y-2
         ${isSelected ? "scale-[1.04] ring-4 ring-offset-2" : "hover:-translate-y-2 hover:scale-[1.02]"}
        transition-all duration-300
        cursor-pointer
      `}
    >
      {/* badge */}
      {packageData.badge && (
        <div className="absolute top-5 right-5">
          <span
            className={`
              ${colorVariant.badge}
              text-xs
              font-bold
              px-4 py-1
              rounded-full
            `}
          >
            {packageData.badge}
          </span>
        </div>
      )}

      {isSelected && (
        <div className="absolute left-5 top-5">
          <div
            className={`
                px-4 py-1 rounded-full
                text-xs font-bold
                text-white
                bg-linear-to-r
                ${colorVariant.gradient}
            `}
          >
            Selected
          </div>
        </div>
      )}

      {/* title */}
      <div className="text-center">
        <h3 className="text-3xl font-black text-gray-800">{packageData.name}</h3>

        <p className="text-gray-400 mt-2">{packageData.subTitle}</p>
      </div>

      {/* price */}
      <div className="mt-8 text-center">
        <h2
          className={`
            text-5xl
            font-black
            bg-linear-to-r
            ${colorVariant.gradient}
            bg-clip-text
            text-transparent
          `}
        >
          Rp {packageData.price.toLocaleString("id-ID")}
        </h2>

        <p className="text-gray-500 mt-2 text-sm">per session</p>
      </div>

      {/* divider */}
      <div
        className={`
          my-8 h-px
          bg-linear-to-r
          from-transparent
          ${colorVariant.divider}
          to-transparent
        `}
      ></div>

      {/* features */}
      <ul className="space-y-4">
        {packageData.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-gray-700">
            <div
              className={`
                w-3 h-3
                rounded-full
                ${colorVariant.dot}
              `}
            ></div>

            {feature}
          </li>
        ))}
      </ul>

      {/* button */}
      <button
        onClick={() => onSelect(packageData)}
        className={`
          mt-8
          w-full
          py-4
          rounded-2xl
          bg-linear-to-r
          ${colorVariant.gradient}
          text-white
          font-bold
          hover:scale-[1.02]
          active:scale-95
          transition-all duration-300
           ${isSelected ? "scale-[1.02] shadow-2xl" : "hover:scale-[1.02]"}
        `}
      >
        {isSelected ? "Selected Package ✓" : "Select Package"}
      </button>
    </div>
  );
}
