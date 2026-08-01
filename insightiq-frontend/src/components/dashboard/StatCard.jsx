function StatCard({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <div
      className="
        bg-white
        dark:bg-slate-900
        border
        border-stone-200
        dark:border-slate-700
        rounded-2xl
        p-6
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-stone-500 dark:text-slate-400">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3 text-stone-900 dark:text-white">
            {value}
          </h2>

          <p className="mt-3 text-sm text-[#65735B] dark:text-green-400">
            {subtitle}
          </p>

        </div>

        <div
          className="
            h-14
            w-14
            rounded-2xl
            bg-[#65735B]/10
            dark:bg-[#65735B]/20
            flex
            items-center
            justify-center
          "
        >
          {icon}
        </div>

      </div>
    </div>
  );
}

export default StatCard; 