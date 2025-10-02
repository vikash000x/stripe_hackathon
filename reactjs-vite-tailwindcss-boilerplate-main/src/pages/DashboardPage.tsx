import React, { useEffect, useState } from "react";
import CandidateTable, { Candidate } from "../components/CandidateTable";
import SearchSortBar from "../components/SearchSortBar";
import Pagination from "../components/Pagination";

const DashboardPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("score_desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://stripe-hackathon.onrender.com/api/interviewer/dashboard?search=${search}&sort=${sort}&page=${page}`
      );
      const data = await res.json();
      setCandidates(data.data || []);
      setTotalPages(Math.ceil((data.data?.length || 1) / 10)); // fake pagination if backend doesn't support
    } catch (err) {
      console.error("Error loading candidates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [search, sort, page]);

  return (
   <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-6 md:p-10 transition-all">
  {/* Header Section */}
  <div className="mb-8 text-center md:text-left">
    <h1 className="text-3xl md:text-4xl font-extrabold text-amber-800 tracking-tight flex items-center gap-2 justify-center md:justify-start">
      🎯 Interviewer Dashboard
    </h1>
    <div className="w-24 h-1 bg-amber-600 rounded-full mt-2 mx-auto md:mx-0"></div>
    <p className="text-gray-600 mt-2 text-sm md:text-base">
      Manage candidates, review applications, and track progress.
    </p>
  </div>

  {/* Search + Sort Bar */}
  <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-xl p-4 mb-6 border border-amber-100 transition hover:shadow-lg">
    <SearchSortBar
      search={search}
      sort={sort}
      onSearchChange={setSearch}
      onSortChange={setSort}
    />
  </div>

  {/* Candidate Table */}
  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-red overflow-hidden transition hover:shadow-2xl">
    <CandidateTable data={candidates} loading={loading} />
  </div>

  {/* Pagination */}
  <div className="mt-8 flex justify-center">
    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
  </div>
</div>

  );
};

export default DashboardPage;
