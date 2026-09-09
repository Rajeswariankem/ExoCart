function Pagination({
  currentPage: controlledPage = 1,
  totalPages = 3,
  onPageChange,
}) {
  const currentPage = controlledPage;

  const changePage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    onPageChange?.(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-2 flex justify-center gap-2">
      <button
        type="button"
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-11 min-w-24 rounded-xl border border-slate-700 bg-[#081225] px-4 text-sm font-medium text-white transition-all duration-200 hover:border-green-500 hover:bg-slate-800 hover:text-green-300 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-[#081225] disabled:text-slate-500"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => changePage(page)}
            className={`h-11 w-11 shrink-0 rounded-xl border transition-all duration-200 ${
              isActive
                ? "border-transparent bg-[#22C55E] text-black hover:bg-[#4ade80]"
                : "border-slate-700 bg-[#0B1224] text-white hover:border-green-500 hover:bg-slate-800"
            } cursor-pointer font-medium`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => changePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-11 min-w-24 rounded-xl border border-slate-700 bg-[#081225] px-4 text-sm font-medium text-white transition-all duration-200 hover:border-green-500 hover:bg-slate-800 hover:text-green-300 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-[#081225] disabled:text-slate-500"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
