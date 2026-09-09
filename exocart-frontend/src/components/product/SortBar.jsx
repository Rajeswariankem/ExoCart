import { ChevronDown } from "lucide-react";

function SortBar({ selectedSort, onSortChange }) {
  return (
    <div className="flex justify-end p-2">
      <div className="relative w-44">
        <select
          value={selectedSort}
          onChange={(event) => onSortChange?.(event.target.value)}
          className="
            appearance-none
            w-full
            bg-[#081225]
            text-white
            border
            border-slate-700
            rounded-lg
            pl-4
            pr-10
            py-2
            text-sm
            outline-none
            hover:border-green-500
            focus:border-green-500
            transition
            cursor-pointer
          "
        >
          <option value="Popular">Popular</option>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="Price Low to High">Price: Low to High</option>
          <option value="Price High to Low">Price: High to Low</option>
          <option value="Name A-Z">Name A-Z</option>
          <option value="Name Z-A">Name Z-A</option>
        </select>

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}

export default SortBar;
