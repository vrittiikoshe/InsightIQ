import { Bell, Search } from "lucide-react";

function Topbar() {
  return (
    <div className="flex justify-between items-center w-full">

      <div className="relative">

        <Search
          className="absolute left-3 top-3 text-stone-400"
          size={18}
        />

        <input
          placeholder="Search documents..."
          className="w-96 rounded-xl border border-stone-200 py-2.5 pl-10 pr-4 outline-none"
        />

      </div>

      <div className="flex items-center gap-6">

        <Bell className="cursor-pointer" />

        <div className="flex items-center gap-3">

          <div className="h-11 w-11 rounded-full bg-[#65735B]" />

          <div>

            <p className="font-semibold">
              Vritti
            </p>

            <p className="text-xs text-stone-500">
              AI Analyst
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Topbar;