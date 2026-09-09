function StatCard({ title, value, icon }) {
  return (
    <div className="bg-[#081225] border border-slate-800 rounded-2xl p-5 hover:border-green-500/30 transition hover:scale-[1.02]">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-2">
            {value}
          </h2>
        </div>

        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;