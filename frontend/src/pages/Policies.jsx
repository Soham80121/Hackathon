import { useState } from "react";
import UploadPolicy from "../components/UploadPolicy";
import PolicyTable from "../components/PolicyTable";

export default function Policies() {
  const [refresh, setRefresh] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="w-full">
      {user.role === "admin" && (
        <UploadPolicy onUploadSuccess={() => setRefresh(r => r + 1)} />
      )}
      <PolicyTable refreshTrigger={refresh} />
    </div>
  );
}
