/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { TimeMotionRule } from "../manageData";
import { Search, Clock } from "lucide-react";

interface ManageTimeMotionRulesViewProps {
  rules: TimeMotionRule[];
  onAddRule: (rule: TimeMotionRule) => void;
  onDeleteRule: (id: string) => void;
}

export default function ManageTimeMotionRulesView({
  rules,
  onAddRule,
  onDeleteRule
}: ManageTimeMotionRulesViewProps) {
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Form states matching eleventh screenshot
  const [description, setDescription] = useState("");
  const [taskIssue, setTaskIssue] = useState("");
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState("Easy");

  const filtered = rules.filter((r) => {
    const s = search.toLowerCase();
    return (
      r.variable.toLowerCase().includes(s) ||
      r.taskIssue.toLowerCase().includes(s) ||
      r.level.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    // Build human-readable duration format
    const durationParts = [];
    if (days > 0) durationParts.push(`${days} day${days > 1 ? "s" : ""}`);
    if (hours > 0) durationParts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
    if (minutes > 0) durationParts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);
    if (seconds > 0) durationParts.push(`${seconds} sec${seconds > 1 ? "s" : ""}`);
    const durationStr = durationParts.join(", ") || "0 secs";

    const newRule: TimeMotionRule = {
      id: `tm-${Date.now()}`,
      variable: description,
      taskIssue: taskIssue || "General Issue Resolution",
      duration: durationStr,
      durationDays: days,
      durationHours: hours,
      durationMinutes: minutes,
      durationSeconds: seconds,
      level
    };

    onAddRule(newRule);

    // Reset Form
    setDescription("");
    setTaskIssue("");
    setDays(0);
    setHours(1);
    setMinutes(0);
    setSeconds(0);
    setLevel("Easy");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F9FAFB] font-sans">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-3xl font-extralight text-gray-800 tracking-tight">Time and Motion Rules</h2>
        <div className="text-xs text-gray-400 mt-1">Configure diagnostic timers (SLA thresholds) outlining ideal repair times for automated dispatcher evaluation.</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: List */}
        <div className="lg:col-span-2 bg-white rounded border border-gray-200/95 shadow-3xs overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-150 px-5 py-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest block">List</h3>
          </div>

          <div className="p-4 bg-white border-b border-gray-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-300 rounded px-2 py-0.5 focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>Rows</span>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-48 bg-white border border-gray-250 rounded pl-8 pr-3 py-1 text-xs focus:outline-none"
              />
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Table List */}
          <div className="overflow-x-auto text-xs text-gray-600">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-55 border-b border-gray-200 font-bold text-gray-700 tracking-wide">
                  <th className="p-3 pl-5">Variable</th>
                  <th className="p-3">Task/Issue</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Level</th>
                  {rules.length > 0 && <th className="p-3 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length > 0 ? (
                  paginated.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-3 pl-5 font-semibold text-[#E15B39]">{r.variable}</td>
                      <td className="p-3 text-gray-750">{r.taskIssue}</td>
                      <td className="p-3 font-mono font-bold text-slate-700 flex items-center space-x-1.5 py-4">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{r.duration}</span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.level === "Easy"
                              ? "bg-emerald-100 text-emerald-700"
                              : r.level === "Medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {r.level}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onDeleteRule(r.id)}
                          className="text-red-500 hover:text-red-700 font-bold uppercase text-[10px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400 italic">
                      No data found . . .
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 bg-white border-t border-gray-150 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none">
            <div className="text-gray-500">
              Showing {filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
              {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
            </div>

            <div className="flex items-center space-x-1 font-mono">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-2.5 py-1 rounded border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 transition text-[11px]"
              >
                First
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                className="px-2.5 py-1 rounded border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 transition text-[11px]"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded border font-semibold transition text-[11px] ${
                    currentPage === i + 1
                      ? "bg-[#E15B39] text-white border-[#E15B39]"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                className="px-2.5 py-1 rounded border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 transition text-[11px]"
              >
                Next
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-2.5 py-1 rounded border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 transition text-[11px]"
              >
                Last
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: New Form */}
        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-150 px-5 py-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">New</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5 text-sm font-semibold text-gray-750">
            {/* Description Variable */}
            <div className="space-y-1.5 col-span-3">
              <label className="text-gray-700 text-sm">Description / Variable</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., HP Print Head SLA"
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            {/* Task/Issue */}
            <div className="space-y-1.5 col-span-3">
              <label className="text-gray-700 text-sm">Task/Issue</label>
              <input
                type="text"
                required
                value={taskIssue}
                onChange={(e) => setTaskIssue(e.target.value)}
                placeholder="Specific operation e.g. Repair HP Printer"
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            {/* Durations inline selector */}
            <div className="space-y-1.5 col-span-3">
              <label className="text-gray-700 text-sm">Duration</label>
              <div className="grid grid-cols-4 gap-2 text-center text-sm">
                <div>
                  <input
                    type="number"
                    min={0}
                    value={days}
                    onChange={(e) => setDays(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-center bg-white border border-gray-300 rounded-lg py-2 px-2 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                  />
                  <div className="text-[10px] text-gray-450 mt-1 font-semibold">Day(s)</div>
                </div>
                <div>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                    className="w-full text-center bg-white border border-gray-300 rounded-lg py-2 px-2 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                  />
                  <div className="text-[10px] text-gray-450 mt-1 font-semibold">Hour(s)</div>
                </div>
                <div>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-full text-center bg-white border border-gray-300 rounded-lg py-2 px-2 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                  />
                  <div className="text-[10px] text-gray-450 mt-1 font-semibold">Minute(s)</div>
                </div>
                <div>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={seconds}
                    onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-full text-center bg-white border border-gray-300 rounded-lg py-2 px-2 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                  />
                  <div className="text-[10px] text-gray-450 mt-1 font-semibold">Second(s)</div>
                </div>
              </div>
            </div>

            {/* Level selection dropdown */}
            <div className="space-y-1.5 col-span-3">
              <label className="text-gray-700 text-sm">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-[#10b981] rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-[#3FC3EB] hover:bg-[#20b5e0] text-white px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm cursor-pointer transition uppercase"
            >
              Submit Time motion rule
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
