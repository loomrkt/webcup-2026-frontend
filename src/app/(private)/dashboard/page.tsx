"use client";

import { CitizenDashboard } from "@/widgets/citizen-dashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <CitizenDashboard />
    </div>
  );
}