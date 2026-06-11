/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { Company } from "../manageData";
import { Search } from "lucide-react";

interface ManageCompaniesViewProps {
  companies: Company[];
  onAddCompany: (comp: Company) => void;
  onDeleteCompany: (id: string) => void;
}

export default function ManageCompaniesView({
  companies,
  onAddCompany,
  onDeleteCompany
}: ManageCompaniesViewProps) {
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Form states
  const [type, setType] = useState("Provider");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");

  const filtered = companies.filter((c) => {
    const s = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(s) ||
      c.type.toLowerCase().includes(s) ||
      c.contactPerson.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newComp: Company = {
      id: `comp-${Date.now()}`,
      name,
      type,
      address,
      contactPerson,
      contactNo,
      email
    };

    onAddCompany(newComp);

    // Reset Form
    setName("");
    setAddress("");
    setContactPerson("");
    setContactNo("");
    setEmail("");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F9FAFB] font-sans">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-3xl font-extralight text-gray-800 tracking-tight">Companies</h2>
        <div className="text-xs text-gray-400 mt-1">Configure client business accounts, partners, and supplier vendors profiles.</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column - List */}
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

          {/* Table List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-55 border-b border-gray-200 font-bold text-gray-700 tracking-wide">
                  <th className="p-3 pl-5">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Contact No</th>
                  <th className="p-3">Contact Person</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {paginated.length > 0 ? (
                  paginated.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-3 pl-5 font-semibold text-[#E15B39]">{c.name}</td>
                      <td className="p-3 text-gray-500">{c.type}</td>
                      <td className="p-3 text-gray-700">{c.contactNo || <span className="text-gray-300 italic">None</span>}</td>
                      <td className="p-3 text-gray-700">{c.contactPerson || <span className="text-gray-300 italic">None</span>}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onDeleteCompany(c.id)}
                          disabled={companies.length <= 1}
                          className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:pointer-events-none font-bold uppercase text-[10px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-400 italic">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer with stats & pagination */}
          <div className="p-4 bg-white border-t border-gray-150 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none">
            <div className="text-gray-500">
              Showing {filtered.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
              {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
            </div>

            <div className="flex items-center space-x-1 font-mono">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="px-2.5 py-1 rounded border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition text-[11px]"
              >
                First
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                className="px-2.5 py-1 rounded border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition text-[11px]"
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
                className="px-2.5 py-1 rounded border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition text-[11px]"
              >
                Next
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="px-2.5 py-1 rounded border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition text-[11px]"
              >
                Last
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - New form */}
        <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-150 px-5 py-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">New</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5 text-sm font-semibold text-gray-750">
            {/* Type */}
            <div className="space-y-1.5 col-span-3">
              <label className="text-gray-700 text-sm">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-[#10b981] rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              >
                <option value="Provider">Provider</option>
                <option value="Client">Client</option>
              </select>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-gray-700 text-sm">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Company Name"
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-gray-700 text-sm">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Physical Office Address"
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            {/* Contact Person */}
            <div className="space-y-1.5">
              <label className="text-gray-700 text-sm">Contact Person</label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            {/* Contact No */}
            <div className="space-y-1.5">
              <label className="text-gray-700 text-sm">Contact No</label>
              <input
                type="text"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                placeholder="+63 xxxx xxxx"
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-gray-700 text-sm">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="procurement@corp.com"
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#3FC3EB] hover:bg-[#20b5e0] text-white px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm cursor-pointer transition uppercase"
            >
              Submit Company
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
