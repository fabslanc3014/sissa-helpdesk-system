/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TicketRef, TicketStatus, TicketPriority } from "../types";
import { Search, User, ShieldAlert, Clock, RefreshCw, X, MessageSquare, Plus, Check } from "lucide-react";

interface TicketsListViewProps {
  tickets: TicketRef[];
  currentAgent: string;
  onUpdateTicket: (updated: TicketRef) => void;
  filteredStatus: TicketStatus | null;
  onClearFilteredStatus: () => void;
}

export default function TicketsListView({
  tickets,
  currentAgent,
  onUpdateTicket,
  filteredStatus,
  onClearFilteredStatus
}: TicketsListViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSegmentFilter, setActiveSegmentFilter] = useState<"All" | "My" | "Service" | "Unclaimed" | "Unassigned">("All");
  const [statusDropdownFilter, setStatusDropdownFilter] = useState<string>("All");
  const [selectedTicket, setSelectedTicket] = useState<TicketRef | null>(null);
  const [limit, setLimit] = useState(5);

  // Remarks draft state
  const [newRemarkText, setNewRemarkText] = useState("");

  const handleSegmentClick = (segment: "All" | "My" | "Service" | "Unclaimed" | "Unassigned") => {
    setActiveSegmentFilter(segment);
    onClearFilteredStatus(); // clear specific rings filter if clicking tag
  };

  // Filter computation
  const filteredTickets = tickets.filter((t) => {
    // 1. Text Search Filter
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      (t.id ? t.id.includes(query) : false) ||
      (t.title ? t.title.toLowerCase().includes(query) : false) ||
      (t.brand ? t.brand.toLowerCase().includes(query) : false) ||
      (t.requester ? t.requester.toLowerCase().includes(query) : false) ||
      (t.description ? t.description.toLowerCase().includes(query) : false);

    // 2. Segment Filter
    let matchesSegment = true;
    if (activeSegmentFilter === "My") {
      matchesSegment = t.agent === currentAgent;
    } else if (activeSegmentFilter === "Unclaimed") {
      matchesSegment = (t.agent || "").toLowerCase() === "unclaimed";
    } else if (activeSegmentFilter === "Unassigned") {
      matchesSegment = (t.agent || "").toLowerCase() === "unclaimed" || (t.agent || "").toLowerCase() === "unassigned";
    } else if (activeSegmentFilter === "Service") {
      matchesSegment = (t.title ? t.title.toLowerCase().includes("repair") : false) || (t.tags || []).includes("No quick response");
    }

    // 3. Status Ring or Dropdown Filter
    let matchesStatus = true;
    if (filteredStatus) {
      matchesStatus = t.status === filteredStatus;
    } else if (statusDropdownFilter !== "All") {
      matchesStatus = t.status === statusDropdownFilter;
    }

    return matchesSearch && matchesSegment && matchesStatus;
  });

  const visibleTickets = filteredTickets.slice(0, limit);

  const loadMore = () => {
    setLimit((prev) => prev + 5);
  };

  // Save edits from the popup drawer
  const saveTicketFieldChange = (field: keyof TicketRef, value: any) => {
    if (!selectedTicket) return;
    const updated = { ...selectedTicket, [field]: value };
    setSelectedTicket(updated);
    onUpdateTicket(updated);
  };

  const addRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newRemarkText.trim()) return;
    const updated = {
      ...selectedTicket,
      remarks: [...(selectedTicket.remarks || []), `[${currentAgent}]: ${newRemarkText.trim()}`]
    };
    setSelectedTicket(updated);
    onUpdateTicket(updated);
    setNewRemarkText("");
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB] font-sans relative">
      {/* Top Title & Filters Segment */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5 mb-6">
        <div>
          <h2 className="text-4xl font-extralight text-gray-800 tracking-tight flex items-center">
            Tickets List
            {(filteredStatus || statusDropdownFilter !== "All" || activeSegmentFilter !== "All") && (
              <span className="ml-3 text-xs bg-[#E15B39]/10 text-[#E15B39] px-2.5 py-1 rounded font-semibold animate-pulse">
                Active Filter
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-400 mt-1">Manage, triage, and response logs for SISSA Online Shop hardware dispatches.</p>
        </div>

        {/* Action tags matching screenshots exactly */}
        <div className="flex flex-wrap items-center gap-1.5 self-end md:self-center">
          <button
            onClick={() => handleSegmentClick("My")}
            className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition ${
              activeSegmentFilter === "My" ? "bg-[#12B886] text-white" : "bg-white text-[#12B886] border border-gray-200 hover:bg-gray-50"
            }`}
          >
            My Tickets
          </button>
          
          <button
            onClick={() => handleSegmentClick("Service")}
            className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition ${
              activeSegmentFilter === "Service" ? "bg-[#F36D43] text-white" : "bg-white text-[#F36D43] border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Service
          </button>

          <button
            onClick={() => handleSegmentClick("Unclaimed")}
            className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition ${
              activeSegmentFilter === "Unclaimed" ? "bg-[#00C2FF] text-white" : "bg-white text-[#00C2FF] border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Unclaimed
          </button>

          <button
            onClick={() => handleSegmentClick("Unassigned")}
            className={`px-3 py-1.5 text-xs font-semibold rounded cursor-pointer transition ${
              activeSegmentFilter === "Unassigned" ? "bg-[#2A7DFB] text-white" : "bg-white text-[#2A7DFB] border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Unassigned
          </button>

          {/* Status filter selection box */}
          <div className="relative">
            <select
              value={filteredStatus || statusDropdownFilter}
              onChange={(e) => {
                setStatusDropdownFilter(e.target.value);
                if (filteredStatus) onClearFilteredStatus();
              }}
              className="bg-white border border-gray-250 py-1.5 px-3 rounded text-xs text-gray-700 outline-none hover:bg-gray-50 cursor-pointer"
            >
              <option value="All">All statuses</option>
              <option value={TicketStatus.Open}>Open</option>
              <option value={TicketStatus.Acknowledged}>Acknowledged</option>
              <option value={TicketStatus.Updated}>Updated</option>
              <option value={TicketStatus.Suspended}>Suspended</option>
              <option value={TicketStatus.Resolved}>Resolved</option>
              <option value={TicketStatus.Closed}>Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary Search bar in header */}
      <div className="relative mb-6">
        <input
          type="text"
          id="tickets-filter-search"
          placeholder="Search brand, ticket code, client, or terms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white text-gray-700 text-xs px-4 py-3 pr-10 rounded border border-gray-200 shadow-2xs focus:outline-none focus:border-[#E15B39]"
        />
        <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
      </div>

      {/* Listing Panel */}
      <div className="space-y-4">
        {visibleTickets.length > 0 ? (
          visibleTickets.map((ticket) => {
            // Determine vertical urgency color accent
            const isUrgent = (ticket.tags || []).includes("Overdue by 9 days") || ticket.priority === TicketPriority.High;
            const borderAccentColor = isUrgent ? "border-r-4 border-red-500" : "border-r-4 border-gray-200";

            return (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`bg-white group overflow-hidden rounded border border-gray-200 hover:border-[#E15B39]/40 hover:shadow-md transition-all p-5 flex flex-col sm:flex-row justify-between items-start gap-4 cursor-pointer relative ${borderAccentColor}`}
              >
                {/* Visual Avatar on left side */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shrink-0 self-center">
                    <User className="w-5 h-5" />
                  </div>

                  <div>
                    {/* ID and title clickable line */}
                    <h3 className="text-sm font-semibold text-[#E15B39] tracking-tight group-hover:underline">
                      {ticket.title}
                    </h3>

                    {/* Metadata lines */}
                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      <p className="font-mono text-gray-700 font-medium">Brand: {ticket.brand}</p>
                      <p>From {ticket.requester}</p>
                      <p className="text-[10px] text-gray-400 font-mono">By {ticket.agent === "Unclaimed" ? "Operator Logs" : ticket.agent}</p>
                    </div>
                  </div>
                </div>

                {/* Status elements on exact right section */}
                <div className="flex flex-col items-start sm:items-end text-xs text-gray-500 space-y-2 select-none self-stretch justify-between sm:text-right">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-700">Priority: {ticket.priority}</p>
                    <p className="text-[10px] text-gray-400">Created: {ticket.createdDaysAgo} days ago</p>
                    <p className="font-mono font-medium">Agent: <span className={ticket.agent === "Unclaimed" ? "text-gray-400 font-bold" : "text-blue-600 font-bold"}>{ticket.agent}</span></p>
                  </div>

                  {/* Badges row & Status word */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:justify-end mt-2">
                    {(ticket.tags || []).map((tg) => (
                      <span
                        key={tg}
                        className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                          (tg || "").includes("Overdue")
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}
                      >
                        {tg}
                      </span>
                    ))}
                    <span className="font-bold text-gray-800 ml-1.5 uppercase font-mono tracking-wider">
                      {ticket.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 text-center text-gray-400 text-xs border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center space-y-2">
            <ShieldAlert className="w-8 h-8 text-gray-300" />
            <p className="font-medium text-gray-700">No support tickets found</p>
            <p className="text-[11px]">Query term, filters, or dropdown status return zero active records in database.</p>
          </div>
        )}
      </div>

      {/* Load More button */}
      {filteredTickets.length > limit && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={loadMore}
            className="bg-[#00C2FF] hover:bg-[#00a8dd] text-white text-xs font-semibold py-2 px-6 rounded shadow-sm transition cursor-pointer"
          >
            Load more tickets
          </button>
        </div>
      )}

      {/* Ticket Details Drawer / Popup */}
      {selectedTicket && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-20 cursor-default animate-fade-in"
            onClick={() => setSelectedTicket(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl z-30 flex flex-col border-l border-gray-200 animate-slide-in">
            {/* Drawer Header */}
            <div className="p-4 bg-[#2E3033] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="bg-[#E15B39] text-white text-[10px] font-bold uppercase rounded px-2 py-0.5">
                  Ticket Detail
                </span>
                <span className="font-mono text-sm font-bold">{selectedTicket.title}</span>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 rounded hover:bg-white/10 text-gray-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Core Attributes */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-150 space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Description</h4>
                  <p className="text-xs text-gray-700 mt-1.5 leading-relaxed bg-white p-3 rounded border border-gray-150 shadow-3xs">
                    {selectedTicket.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-400 font-medium">Requester Profile</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{selectedTicket.requester}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Corporate Company</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{selectedTicket.company}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Deployment Location</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{selectedTicket.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium font-mono">Reference ID</span>
                    <p className="font-mono text-gray-800 font-semibold mt-0.5">{selectedTicket.referenceNo || "NOT SUPPLIED"}</p>
                  </div>
                </div>
              </div>

              {/* Status & Priority Triage Controls */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-800 border-b pb-2">Triage Support Parameters</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Status Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-650 mb-1.5">Interactive Status</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => saveTicketFieldChange("status", e.target.value as TicketStatus)}
                      className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-700 outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                    >
                      <option value={TicketStatus.Open}>Open</option>
                      <option value={TicketStatus.Acknowledged}>Acknowledged</option>
                      <option value={TicketStatus.Updated}>Updated</option>
                      <option value={TicketStatus.Suspended}>Suspended</option>
                      <option value={TicketStatus.Resolved}>Resolved</option>
                      <option value={TicketStatus.Closed}>Closed</option>
                    </select>
                  </div>

                  {/* Priority Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-650 mb-1.5">Set Urgency Level</label>
                    <select
                      value={selectedTicket.priority}
                      onChange={(e) => saveTicketFieldChange("priority", e.target.value as TicketPriority)}
                      className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-700 outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                    >
                      <option value={TicketPriority.Low}>Low</option>
                      <option value={TicketPriority.Medium}>Medium</option>
                      <option value={TicketPriority.High}>High</option>
                    </select>
                  </div>

                  {/* Agent Assign */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-650 mb-1.5">Assigned Agent</label>
                    <select
                      value={selectedTicket.agent}
                      onChange={(e) => saveTicketFieldChange("agent", e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-700 outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                    >
                      <option value="Unclaimed">Unclaimed</option>
                      <option value="Endless Waltz">Endless Waltz</option>
                      <option value="Admin Support">Admin Support</option>
                      <option value="Support Desk 02">Support Desk 02</option>
                      <option value="System Autopilot">System Autopilot</option>
                    </select>
                  </div>

                  {/* Hardware Brand */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-650 mb-1.5">Asset Brand</label>
                    <input
                      type="text"
                      value={selectedTicket.brand}
                      onChange={(e) => saveTicketFieldChange("brand", e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-700 outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                    />
                  </div>
                </div>
              </div>

              {/* Remarks logs */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-gray-800 border-b pb-2 flex items-center space-x-2">
                  <MessageSquare className="w-4.5 h-4.5 text-gray-400" />
                  <span>Technical Remarks logs</span>
                </h3>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 space-y-2 max-h-44 overflow-y-auto">
                  {(selectedTicket.remarks || []).length > 0 ? (
                    (selectedTicket.remarks || []).map((rmk, idx) => (
                      <div key={idx} className="p-2.5 bg-white rounded-md border border-gray-100 text-sm text-gray-600">
                        {rmk}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic text-center py-2.5">No technical remarks logged yet.</p>
                  )}
                </div>

                <form onSubmit={addRemark} className="flex gap-2.5">
                  <input
                    type="text"
                    value={newRemarkText}
                    onChange={(e) => setNewRemarkText(e.target.value)}
                    placeholder="Type technical update remark..."
                    className="flex-1 border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-700 outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                  />
                  <button
                    type="submit"
                    className="bg-[#E15B39] hover:bg-[#c94e30] py-2.5 px-4 rounded-lg text-white text-sm font-semibold cursor-pointer shrink-0"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Action bar in drawer footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center space-x-2">
              <button
                onClick={() => {
                  saveTicketFieldChange("status", TicketStatus.Resolved);
                  setSelectedTicket(null);
                  alert("Ticket solved & resolved!");
                }}
                className="flex-1 flex items-center justify-center space-x-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-3 rounded cursor-pointer transition shadow-2xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark as Resolved</span>
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold py-2 px-3 rounded cursor-pointer transition text-center"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
