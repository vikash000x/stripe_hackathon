import React from "react";

interface Props {
  search: string;
  sort: string;
  onSearchChange: (v: string) => void;
  onSortChange: (v: string) => void;
}

const SearchSortBar: React.FC<Props> = ({
  search,
  sort,
  onSearchChange,
  onSortChange,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
    {/* Search Input */}
    <input
      type="text"
      placeholder="Search by name or email..."
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-amber-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all placeholder-gray-400"
    />

    {/* Sort Select */}
    <select
      value={sort}
      onChange={(e) => onSortChange(e.target.value)}
      className="px-4 py-2 rounded-xl border border-amber-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all bg-white"
    >
      <option value="score_desc">Score: High → Low</option>
      <option value="score_asc">Score: Low → High</option>
    </select>
  </div>
);

export default SearchSortBar;
