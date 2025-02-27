import { Circle, Mars, Venus } from "lucide-react";

const GenderFilter = ({ selectedGenderFilter, title, onGenderChange }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">{title}</h1>

      <div className="flex gap-4">
        {/* All Products Button */}
        <button
          onClick={() => onGenderChange("all")}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all relative group ${
            selectedGenderFilter === "all"
              ? "bg-emerald-100"
              : "hover:bg-gray-100"
          }`}
          aria-label="View all products"
        >
          <Circle
            className={`w-6 h-6 ${
              selectedGenderFilter === "all"
                ? "text-emerald-600 stroke-2"
                : "text-gray-500"
            }`}
            fill={
              selectedGenderFilter === "all"
                ? "rgba(16, 185, 129, 0.2)"
                : "none"
            }
          />
        </button>

        {/* Men Button */}
        <button
          onClick={() => onGenderChange("e")}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all relative group ${
            selectedGenderFilter === "e" ? "bg-blue-100" : "hover:bg-gray-100"
          }`}
          aria-label="View men's products"
        >
          <Mars
            className={`w-6 h-6 ${
              selectedGenderFilter === "e"
                ? "text-blue-600 stroke-2"
                : "text-gray-500"
            }`}
          />
        </button>

        {/* Women Button */}
        <button
          onClick={() => onGenderChange("k")}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-all relative group ${
            selectedGenderFilter === "k" ? "bg-pink-100" : "hover:bg-gray-100"
          }`}
          aria-label="View women's products"
        >
          <Venus
            className={`w-6 h-6 ${
              selectedGenderFilter === "k"
                ? "text-pink-600 stroke-2"
                : "text-gray-500"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default GenderFilter;
