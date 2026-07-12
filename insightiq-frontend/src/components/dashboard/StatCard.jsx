import { ArrowUpRight } from "lucide-react";

function StatCard({
  title,
  value,
  subtitle,
  icon,
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-lg transition-all">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-sm text-stone-500">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>

          <p className="mt-3 text-sm text-[#65735B]">
            {subtitle}
          </p>

        </div>

        <div className="h-14 w-14 rounded-2xl bg-[#65735B]/10 flex items-center justify-center">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatCard;