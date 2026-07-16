import DashboardLayout from "../components/dashboard/DashboardLayout";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import RecentDocuments from "../components/dashboard/RecentDocuments";

import { useState } from "react";

function Documents() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      topbar={
        <Topbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      }
    >
      <h1 className="text-5xl font-bold">
        Documents
      </h1>

      <p className="mt-3 text-stone-500">
        View and manage all your uploaded documents.
      </p>

      <RecentDocuments searchQuery={searchQuery} />
    </DashboardLayout>
  );
}

export default Documents;