function DashboardLayout({ sidebar, topbar, children }) {
  return (
    <div className="min-h-screen flex bg-[#F7F7F4] dark:bg-[#0F172A] transition-colors duration-300">

      <aside className="w-72 border-r border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors duration-300">
        {sidebar}
      </aside>

      <main className="flex-1 flex flex-col">

        <header className="h-20 px-8 flex items-center border-b border-stone-200 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors duration-300">
          {topbar}
        </header>

        <section className="flex-1 overflow-auto p-8 bg-[#F7F7F4] dark:bg-[#0F172A] transition-colors duration-300">
          {children}
        </section>

      </main>

    </div>
  );
}

export default DashboardLayout;