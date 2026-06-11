/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { TicketStatus, RecentActivity, TicketRef } from "../types";
import { Search, History, AlertCircle, Sparkles, Plus, Eye } from "lucide-react";

interface DashboardViewProps {
  tickets: TicketRef[];
  activities: RecentActivity[];
  onNavigate: (view: string) => void;
  onFilterStatus: (status: TicketStatus | null) => void;
  onAddLog: (logText: string, type: "system" | "ticket") => void;
}

export default function DashboardView({
  tickets,
  activities,
  onNavigate,
  onFilterStatus,
  onAddLog
}: DashboardViewProps) {
  const [activitySearch, setActivitySearch] = useState("");

  // Calculate live counts & distribution percentages
  const total = tickets.length;
  
  const getStatusCount = (status: TicketStatus) => {
    return tickets.filter((t) => t.status === status).length;
  };

  const statusConfigs = [
    { status: TicketStatus.Open, label: "Open", color: "#E15B39", lightColor: "#FDF2EE" },
    { status: TicketStatus.Acknowledged, label: "Acknowledged", color: "#4B5563", lightColor: "#F3F4F6" },
    { status: TicketStatus.Updated, label: "Updated", color: "#10B981", lightColor: "#ECFDF5" },
    { status: TicketStatus.Suspended, label: "Suspended", color: "#F59E0B", lightColor: "#FEF3C7" },
    { status: TicketStatus.Resolved, label: "Resolved", color: "#3B82F6", lightColor: "#EFF6FF" },
    { status: TicketStatus.Closed, label: "Closed", color: "#06B6D4", lightColor: "#ECFEFF" }
  ];

  // Search activities
  const filteredActivities = activities.filter((act) =>
    act.description.toLowerCase().includes(activitySearch.toLowerCase()) ||
    act.user.toLowerCase().includes(activitySearch.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F9FAFB] font-sans">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">Ticket Overview</h2>
          <p className="text-xs text-gray-400 mt-1">Live reporting aggregates and maintenance console activities.</p>
        </div>
        <button
          onClick={() => onNavigate("tickets_new")}
          className="flex items-center space-x-2 bg-[#E15B39] hover:bg-[#c94e30] py-2.5 px-5 rounded-lg text-white text-sm font-semibold shadow-sm transition duration-150 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Ticket</span>
        </button>
      </div>

      {/* Six Status Circular Progress Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {statusConfigs.map((cfg) => {
          const count = getStatusCount(cfg.status);
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
          
          // Let's check if the percent is >0 to render specific color outline
          const isActiveRing = percent > 0;

          return (
            <div
              key={cfg.status}
              onClick={() => {
                onFilterStatus(cfg.status);
                onNavigate("tickets_list");
              }}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center justify-center space-y-4 group relative overflow-hidden"
              title={`View all ${cfg.label} tickets`}
            >
              {/* Subtle hover background effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* SVG Circular Ring with exact styling */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 144 144">
                  {/* Track circle / Back layer */}
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  {/* Filled progress circle */}
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke={isActiveRing ? cfg.color : "#E2E8F0"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={
                      2 * Math.PI * 58 * (1 - percent / 100)
                    }
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Internal numbers */}
                <div className="absolute text-center">
                  <span className="text-3xl font-bold font-mono tracking-tight text-gray-800">
                    {percent}%
                  </span>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                    {cfg.label}
                  </p>
                </div>
              </div>

              {/* Under-ring metadata */}
              <div className="flex items-center space-x-1.5 bg-gray-50 px-2.5 py-1 rounded text-xs text-gray-500 font-medium border border-gray-100 shadow-2xs group-hover:bg-white group-hover:border-gray-200 transition">
                <span>{count} {count === 1 ? "Ticket" : "Tickets"}</span>
                <span className="text-gray-300">|</span>
                <span className="text-[10px] text-blue-500 hover:underline">Inspect</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activities Section */}
      <div className="bg-white rounded-xl border border-gray-150 shadow-sm p-6 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-[#E15B39]" />
            <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
          </div>
          <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
            Total Logs: {activities.length}
          </span>
        </div>

        {/* Search Row */}
        <div className="relative mb-5 flex items-center">
          <input
            type="text"
            id="activity-search-input"
            value={activitySearch}
            onChange={(e) => setActivitySearch(e.target.value)}
            placeholder="Search activities..."
            className="w-full bg-white text-gray-700 text-sm pl-11 pr-16 py-3 rounded-lg border border-gray-300 outline-none hover:border-gray-400 focus:outline-[#10b981] focus:border-[#E15B39] transition shadow-2xs"
          />
          <Search className="absolute left-4 w-4.5 h-4.5 text-gray-400 pointer-events-none" />
          {activitySearch && (
            <button
              onClick={() => setActivitySearch("")}
              className="absolute right-4 text-xs font-semibold text-gray-500 hover:text-gray-700 bg-gray-150 hover:bg-gray-200 rounded-md px-2 py-1 transition cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* List of activity elements */}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gradient-to-r from-white to-gray-50/30 hover:to-gray-50/80 transition-all font-sans text-xs"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0 flex items-center justify-center">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        activity.type === "ticket"
                          ? "bg-orange-500"
                          : activity.type === "call"
                          ? "bg-blue-500"
                          : activity.type === "sms"
                          ? "bg-purple-500"
                          : "bg-green-500"
                      }`}
                    />
                  </div>
                  <span className="text-gray-700 font-medium truncate">
                    {activity.description}
                  </span>
                </div>
                <div className="flex items-center space-x-3 shrink-0 text-gray-400 font-mono text-[10px]">
                  <span>by {activity.user}</span>
                  <span className="text-gray-300">|</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs flex flex-col items-center justify-center space-y-2 border border-dashed border-gray-200 rounded-lg">
              <AlertCircle className="w-6 h-6 text-gray-300" />
              <span>No activity logs matched your filter.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
