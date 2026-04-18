"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui";
import {
  adminDashboardSummary,
  complaints,
  menus,
  rooms,
  tenantDashboardSummary,
  transactions,
} from "@/mockData/mockData";

type Role = "TENANT" | "ADMIN";

const TENANT_NAV_ITEMS = [
  "Dashboard",
  "Room Rent Info",
  "Payment Gateway",
  "Meal System",
  "Discussion Board",
  "Complaint Form",
];

const ADMIN_NAV_ITEMS = [
  "Dashboard",
  "User & Role Management",
  "Room Allocation",
  "Financial Reports",
  "Meal Setup",
  "Complaint Management",
];

export function DashboardShell() {
  const [activeRole, setActiveRole] = useState<Role>("TENANT");

  const dashboardStats = useMemo(() => {
    if (activeRole === "TENANT") {
      return [
        { label: "Current Room", value: tenantDashboardSummary.roomId },
        { label: "Rent Due", value: `৳${tenantDashboardSummary.currentDue}` },
        { label: "Today Menu", value: tenantDashboardSummary.todayMenuDay },
        { label: "Meal Items", value: `${tenantDashboardSummary.todaysMealMenu.length} items` },
      ];
    }

    return [
      { label: "Total Users", value: String(adminDashboardSummary.totalUsers) },
      { label: "Tenant Count", value: String(adminDashboardSummary.tenantCount) },
      { label: "Pending Complaints", value: String(adminDashboardSummary.pendingComplaints) },
      { label: "Available Rooms", value: String(adminDashboardSummary.availableRooms) },
    ];
  }, [activeRole]);

  const primaryList = activeRole === "TENANT" ? transactions.slice(0, 4) : complaints.slice(0, 4);
  const secondaryList = activeRole === "TENANT" ? menus.slice(0, 3) : rooms.slice(0, 3);
  const navItems = activeRole === "TENANT" ? TENANT_NAV_ITEMS : ADMIN_NAV_ITEMS;

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Smart Digital Hostel Ecosystem</p>
            <h1 className="mt-1 text-2xl font-bold text-white">Base Dashboard Navigation</h1>
            <p className="mt-2 text-sm text-slate-300">
              Switch between Tenant and Admin views. All data below is mocked JSON and API-ready.
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-white/20 bg-slate-900 p-1">
            <RoleButton label="Tenant Dashboard" role="TENANT" activeRole={activeRole} onClick={setActiveRole} />
            <RoleButton label="Admin Dashboard" role="ADMIN" activeRole={activeRole} onClick={setActiveRole} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card title={`${activeRole} Portal Navigation`} subtitle="Feature map for the selected role">
          <ul className="space-y-2 text-sm text-slate-200">
            {navItems.map((item) => (
              <li key={item} className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dashboardStats.map((stat) => (
              <Card key={stat.label} title={stat.value} subtitle={stat.label}>
                <p className="text-xs text-slate-400">Mock dashboard metric</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card
              title={activeRole === "TENANT" ? "Recent Transactions" : "Latest Complaints"}
              subtitle={activeRole === "TENANT" ? "Room rent + meal token history" : "Needs admin action"}
            >
              <ul className="space-y-2 text-sm text-slate-200">
                {primaryList.map((item) => (
                  <li key={item.id} className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2">
                    {activeRole === "TENANT"
                      ? `${item.id} · ${item.paymentPurpose} · ${item.paymentMethod} · ৳${item.amount}`
                      : `${item.id} · ${item.title} · ${item.complaintStatus}`}
                  </li>
                ))}
              </ul>
            </Card>

            <Card
              title={activeRole === "TENANT" ? "Daily Meal Menu" : "Room Availability"}
              subtitle={activeRole === "TENANT" ? "Configured by day and meal type" : "Quick occupancy check"}
            >
              <ul className="space-y-2 text-sm text-slate-200">
                {secondaryList.map((item) => (
                  <li key={item.id} className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2">
                    {activeRole === "TENANT"
                      ? `${item.day} · ${item.mealType} · ${item.items.join(", ")}`
                      : `${item.id} · ${item.floor} · ${item.roomType} · ${item.available ? "Available" : "Occupied"}`}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

function RoleButton({
  label,
  role,
  activeRole,
  onClick,
}: {
  label: string;
  role: Role;
  activeRole: Role;
  onClick: (role: Role) => void;
}) {
  const isActive = activeRole === role;

  return (
    <button
      type="button"
      onClick={() => onClick(role)}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
        isActive ? "bg-cyan-400 text-slate-950" : "text-slate-200 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}
