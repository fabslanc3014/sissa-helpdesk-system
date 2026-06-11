/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { TicketRef, TicketStatus, TicketPriority } from "../types";
import { REQUESTERS } from "../data";
import { User, Calendar, FileText, CheckCircle, AlertCircle, Clock, PauseCircle, RefreshCw } from "lucide-react";

interface PersonnelTicketsReportViewProps {
  tickets: TicketRef[];
}

export default function PersonnelTicketsReportView({ tickets }: PersonnelTicketsReportViewProps) {
  const [selectedPersonnel, setSelectedPersonnel] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | "ALL">("Open" as any);
  const [reportTickets, setReportTickets] = useState<TicketRef[] | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Helper to filter tickets by a date range
  const isTicketInDateRange = (ticket: TicketRef, start: string, end: string) => {
    if (!ticket.createdAt) return true;
    const ticketDate = ticket.createdAt.split("T")[0]; // "YYYY-MM-DD"
    
    if (start && ticketDate < start) return false;
    if (end && ticketDate > end) return false;
    return true;
  };

  const handleExport = () => {
    setValidationError("");
    
    // Validate that a personnel selection has been made
    if (!selectedPersonnel) {
      setValidationError("Please select a personnel member to export the report.");
      return;
    }

    // Filter tickets
    const filtered = tickets.filter((t) => {
      // 1. Filter by Personnel
      const matchesPersonnel = selectedPersonnel === "ALL" || t.requester === selectedPersonnel;
      
      // 2. Filter by Date range
      const matchesDate = isTicketInDateRange(t, startDate, endDate);
      
      // 3. Filter by Status
      const matchesStatus = selectedStatus === "ALL" || t.status === selectedStatus;

      return matchesPersonnel && matchesDate && matchesStatus;
    });

    setReportTickets(filtered);
    setIsGenerated(true);
  };

  // Helper to render status badges elegantly
  const renderStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.Open:
        return (
          <span className="flex items-center space-x-1 text-red-600 bg-red-50 border border-red-100 rounded px-2 py-0.5 w-fit font-bold font-sans text-[10px]">
            <AlertCircle className="w-3 h-3 text-red-500" />
            <span>Open</span>
          </span>
        );
      case TicketStatus.Acknowledged:
        return (
          <span className="flex items-center space-x-1 text-amber-700 bg-amber-50 border border-amber-100 rounded px-2 py-0.5 w-fit font-bold font-sans text-[10px]">
            <Clock className="w-3 h-3 text-amber-500" />
            <span>Acknowledged</span>
          </span>
        );
      case TicketStatus.Updated:
        return (
          <span className="flex items-center space-x-1 text-blue-700 bg-blue-50 border border-blue-100 rounded px-2 py-0.5 w-fit font-bold font-sans text-[10px]">
            <RefreshCw className="w-3 h-3 text-blue-500" />
            <span>Updated</span>
          </span>
        );
      case TicketStatus.Suspended:
        return (
          <span className="flex items-center space-x-1 text-gray-700 bg-gray-50 border border-gray-150 rounded px-2 py-0.5 w-fit font-bold font-sans text-[10px]">
            <PauseCircle className="w-3 h-3 text-gray-500" />
            <span>Suspended</span>
          </span>
        );
      case TicketStatus.Resolved:
        return (
          <span className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2 py-0.5 w-fit font-bold font-sans text-[10px]">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Resolved</span>
          </span>
        );
      case TicketStatus.Closed:
        return (
          <span className="flex items-center space-x-1 text-cyan-700 bg-cyan-50 border border-cyan-100 rounded px-2 py-0.5 w-fit font-bold font-sans text-[10px]">
            <CheckCircle className="w-3 h-3 text-cyan-500" />
            <span>Closed</span>
          </span>
        );
      default:
        return <span className="text-[10px] text-gray-500">{status}</span>;
    }
  };

  // Helper to render priority badge
  const renderPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.High:
        return <span className="text-red-700 font-bold bg-red-100 px-1.5 py-0.5 rounded text-[10px]">HIGH</span>;
      case TicketPriority.Medium:
        return <span className="text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">MED</span>;
      case TicketPriority.Low:
        return <span className="text-green-700 font-bold bg-green-100 px-1.5 py-0.5 rounded text-[10px]">LOW</span>;
      default:
        return <span className="text-gray-500">{priority}</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB] font-sans">
      {/* Page Title */}
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h2 className="text-4xl font-bold text-gray-805 tracking-tight animate-fade-in font-sans">Personnel Tickets</h2>
        <p className="text-xs text-gray-500 mt-1">
          Generate structured personnel ticket reports with configurable status routing queries.
        </p>
      </div>

      {/* Report Form Card */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Generate Report</h3>
        </div>

        {/* 4-field Form Layout (Label aligned left, horizontal row with 16-24px spacing) */}
        <div className="space-y-5 max-w-xl">
          {/* 1. Personnel Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-1/3 text-sm font-semibold text-gray-770 select-none pb-1.5 sm:pb-0">
              Personnel
            </label>
            <div className="sm:w-2/3">
              <select
                id="report-tickets-personnel-select"
                value={selectedPersonnel}
                onChange={(e) => {
                  setSelectedPersonnel(e.target.value);
                  setValidationError("");
                }}
                className="w-full bg-white border border-gray-300 rounded-[#10b981] rounded-lg py-2.5 px-4 text-sm text-gray-805 outline-none hover:border-gray-400 focus:outline-[#10b981] focus:border-[#E15B39] cursor-pointer transition"
              >
                <option value="">Select Personnel</option>
                <option value="ALL">Show All Personnel</option>
                {REQUESTERS.map((person) => (
                  <option key={person} value={person}>
                    {person}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Start Date */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-1/3 text-sm font-semibold text-gray-770 select-none pb-1.5 sm:pb-0">
              Start date
            </label>
            <div className="sm:w-2/3">
              <input
                id="report-tickets-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-805 outline-none hover:border-gray-400 focus:outline-[#10b981] focus:border-[#E15B39] transition"
              />
            </div>
          </div>

          {/* 3. End Date */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-1/3 text-sm font-semibold text-gray-770 select-none pb-1.5 sm:pb-0">
              End date
            </label>
            <div className="sm:w-2/3">
              <input
                id="report-tickets-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-805 outline-none hover:border-gray-400 focus:outline-[#10b981] focus:border-[#E15B39] transition"
              />
            </div>
          </div>

          {/* 4. Status - Dropdown Select (Default selected value: "Open") */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-1/3 text-sm font-semibold text-gray-750 select-none pb-1.5 sm:pb-0">
              Status
            </label>
            <div className="sm:w-2/3">
              <select
                id="report-tickets-status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="w-full bg-white border border-gray-300 rounded-[#10b981] rounded-lg py-2.5 px-4 text-sm text-gray-805 outline-none hover:border-gray-400 focus:outline-[#10b981] focus:border-[#E15B39] cursor-pointer transition"
              >
                <option value="ALL">Show All Statuses</option>
                <option value="Open">Open</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Updated">Updated</option>
                <option value="Suspended">Suspended</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="max-w-xl text-xs text-red-650 bg-red-50 border border-red-200 rounded p-3 font-semibold">
            {validationError}
          </div>
        )}

        {/* Action Button: "Export" only (Cyan) */}
        <div className="pt-2">
          <button
            id="btn-personnel-tickets-export"
            type="button"
            onClick={handleExport}
            className="px-6 py-2.5 text-sm font-semibold rounded-lg text-center transition cursor-pointer shadow-sm active:scale-98 bg-[#00BCD4] hover:bg-[#00A3B5] text-white uppercase"
          >
            Export
          </button>
        </div>

        {/* Report Output Area */}
        <div className="border-t border-gray-100 pt-6 mt-6">
          {isGenerated && reportTickets ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-650 uppercase tracking-widest flex items-center">
                  <FileText className="w-4 h-4 text-[#00BCD4] mr-2" />
                  Tickets Registry for {selectedPersonnel === "ALL" ? "All Active Personnel" : selectedPersonnel}
                  {selectedStatus !== "ALL" && ` [Status: ${selectedStatus}]`}
                </span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-150">
                  Tickets count: {reportTickets.length}
                </span>
              </div>

              {reportTickets.length > 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 shadow-3xs overflow-hidden">
                  <div className="overflow-x-auto text-xs text-gray-700 text-left">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-55 border-b border-gray-200 font-semibold text-gray-500 uppercase text-[10px] tracking-wider select-none">
                          <th className="p-3 pl-6">ID / Ref</th>
                          <th className="p-3">Title & Issue</th>
                          <th className="p-3">Company</th>
                          <th className="p-3">Requester</th>
                          <th className="p-3">Priority</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 pr-6 text-right">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-150">
                        {reportTickets.map((t) => (
                          <tr
                            key={t.id}
                            className="hover:bg-gray-55/50 transition bg-white"
                          >
                            <td className="p-3 pl-6 font-mono font-bold text-[#E15B39]">
                              {t.referenceNo || `#SIS-${t.id}`}
                            </td>
                            <td className="p-3 max-w-[240px]">
                              <p className="font-semibold text-gray-900 truncate">{t.title}</p>
                              <p className="text-[10px] text-gray-400 truncate">{t.description}</p>
                            </td>
                            <td className="p-3 text-gray-600 font-medium">{t.company}</td>
                            <td className="p-3 text-gray-700 font-medium">{t.requester}</td>
                            <td className="p-3 font-mono">{renderPriorityBadge(t.priority)}</td>
                            <td className="p-3 font-mono">{renderStatusBadge(t.status)}</td>
                            <td className="p-3 text-gray-500 font-mono text-right pr-6">
                              {t.createdAt?.split("T")[0] || `${t.createdDaysAgo}d ago`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-gray-450 select-none bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                  <AlertCircle className="w-8 h-8 text-gray-300 stroke-1.25 mb-1.5" />
                  <p className="text-xs font-semibold">No matching support inquiries found</p>
                  <p className="text-[10px] text-gray-400">
                    No tickets found matching the specified parameters under {selectedPersonnel === "ALL" ? "All Personnel" : selectedPersonnel}.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400 select-none min-h-[160px]">
              <Calendar className="w-10 h-10 text-gray-300 stroke-1 mb-2 animate-pulse" />
              <p className="text-xs font-semibold">Personnel ticket logs status ready for compilation</p>
              <p className="text-[10px] text-gray-400 mt-1">
                Configure ticket metadata parameters above then choose "Export" to map registry.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
