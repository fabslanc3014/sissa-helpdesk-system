/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { SmsTemplate } from "../manageData";
import { Search, Plus } from "lucide-react";

interface ManageSmsTemplatesViewProps {
  templates: SmsTemplate[];
  onAddTemplate: (temp: SmsTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export default function ManageSmsTemplatesView({
  templates,
  onAddTemplate,
  onDeleteTemplate
}: ManageSmsTemplatesViewProps) {
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Form State
  const [keyword, setKeyword] = useState("");

  const filtered = templates.filter((t) => {
    const s = search.toLowerCase();
    return t.name.toLowerCase().includes(s) || t.webhookUrl.toLowerCase().includes(s) || t.keyword.toLowerCase().includes(s);
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    const newTemp: SmsTemplate = {
      id: `sms-t-${Date.now()}`,
      name: keyword.toUpperCase(),
      webhookUrl: "https://api.avasiaonline.com/sms/dispatch",
      keyword: keyword.toLowerCase()
    };

    onAddTemplate(newTemp);
    setKeyword("");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F9FAFB] font-sans">
      {/* Header Title */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-3xl font-extralight text-gray-800 tracking-tight">SMS Templates</h2>
        <div className="text-xs text-gray-400 mt-1">Configure keywords webhook pathways driven by inbound SMS decoders.</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: List (takes 2 sections) */}
        <div className="lg:col-span-2 bg-white rounded border border-gray-200 shadow-3xs overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-150 px-5 py-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">List</h3>
          </div>

          {/* Table Controls */}
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

          {/* Table list */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-55 border-b border-gray-200 font-bold text-gray-700 tracking-wide">
                  <th className="p-3 pl-5">Name</th>
                  <th className="p-3">Webhook URL</th>
                  {templates.length > 0 && <th className="p-3 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {paginated.length > 0 ? (
                  paginated.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-3 pl-5 font-semibold text-[#E15B39]">{t.name}</td>
                      <td className="p-3 font-mono text-gray-500">{t.webhookUrl}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onDeleteTemplate(t.id)}
                          className="text-red-500 hover:text-red-700 font-bold uppercase text-[10px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-10 text-center text-gray-400 italic">
                      No data found . . .
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
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

        {/* Right Column: New Template (takes 1 section) */}
        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-150 px-5 py-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">New</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5 text-sm font-semibold text-gray-750">
            <div className="space-y-1.5">
              <label className="text-gray-700 block text-sm">Keyword</label>
              <input
                type="text"
                required
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., REPAIR"
                className="w-full bg-white border border-gray-300 rounded-[#10b981] rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#3FC3EB] hover:bg-[#20b5e0] text-white px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm cursor-pointer transition uppercase"
            >
              Submit Template
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
