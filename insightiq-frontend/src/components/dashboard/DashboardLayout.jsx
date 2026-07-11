function DashboardLayout({ sidebar, topbar, children }) {
  return (
    <div className="min-h-screen bg-[#F7F7F4] flex">

      <aside className="w-72 border-r border-stone-200 bg-white">
        {sidebar}
      </aside>

      <main className="flex-1 flex flex-col">

        <header className="h-20 border-b border-stone-200 bg-white px-8 flex items-center">
          {topbar}
        </header>

        <section className="flex-1 p-8 overflow-auto">
          {children}
        </section>

      </main>

    </div>
  );
}

export default DashboardLayout;