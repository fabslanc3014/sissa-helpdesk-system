/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { ManageUser } from "../manageData";
import { User, Plus, Search, ChevronLeft, ChevronRight, CornerDownLeft } from "lucide-react";

interface ManageUsersViewProps {
  users: ManageUser[];
  companies: string[];
  departments: string[];
  onAddUser: (user: ManageUser) => void;
  onDeleteUser: (id: string) => void;
}

export default function ManageUsersView({
  users,
  companies,
  departments,
  onAddUser,
  onDeleteUser
}: ManageUsersViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Form states matching screenshots
  const [role, setRole] = useState("Client");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("i686 Online Shop");
  const [department, setDepartment] = useState("System Administration");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");

  const filtered = users.filter((u) => {
    const s = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(s) ||
      u.firstname.toLowerCase().includes(s) ||
      u.lastname.toLowerCase().includes(s) ||
      u.company.toLowerCase().includes(s) ||
      u.role.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newUser: ManageUser = {
      id: `u-${Date.now()}`,
      username,
      firstname,
      lastname,
      company,
      role,
      department,
      contactNo,
      email
    };
    onAddUser(newUser);
    // Reset Form
    setUsername("");
    setPassword("");
    setFirstname("");
    setLastname("");
    setContactNo("");
    setEmail("");
    setShowForm(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F9FAFB] font-sans">
      {/* Title & Top Bar */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
        <div>
          <h2 className="text-3xl font-extralight text-gray-800 tracking-tight">Users</h2>
          <div className="text-xs text-gray-400 mt-1">Management of administration, team personnel, and client accounts.</div>
        </div>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-1.5 bg-[#00c0ef] hover:bg-[#00acd6] px-4 py-1.5 rounded text-white text-xs font-semibold shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        ) : (
          <button
            onClick={() => setShowForm(false)}
            className="flex items-center space-x-1.5 bg-gray-500 hover:bg-gray-600 px-3 py-1.5 rounded text-white text-xs font-semibold shadow-xs transition"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>Back to List</span>
          </button>
        )}
      </div>

      {!showForm ? (
        <div className="bg-white rounded border border-gray-200/90 shadow-3xs overflow-hidden">
          {/* Table Control Headers */}
          <div className="p-4 bg-white border-b border-gray-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-305 rounded px-2 py-1 focus:outline-none focus:border-[#E15B39]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>Rows</span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search..."
                className="w-48 sm:w-64 bg-white border border-gray-250 rounded pl-8 pr-3 py-1 text-xs focus:outline-none focus:border-[#E15B39]"
              />
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-700 tracking-wide">
                  <th className="w-16 p-3 text-center"></th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Firstname</th>
                  <th className="p-3">Lastname</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {paginated.length > 0 ? (
                  paginated.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mx-auto text-gray-400">
                          <User className="w-4 h-4" />
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-[#E15B39]">
                        {u.username || <span className="text-gray-300 italic">None</span>}
                      </td>
                      <td className="p-3 text-gray-700">{u.firstname || <span className="text-gray-300 italic">None</span>}</td>
                      <td className="p-3 text-gray-700">{u.lastname || <span className="text-gray-300 italic">None</span>}</td>
                      <td className="p-3 text-gray-500">{u.company}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            u.role === "Administrator"
                              ? "bg-purple-100 text-purple-700"
                              : u.role === "Personnel"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onDeleteUser(u.id)}
                          className="text-red-500 hover:text-red-700 text-[10px] font-bold tracking-tight uppercase"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400 italic">
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
      ) : (
        /* New User Form matching Screen 2 exactly */
        <div className="max-w-2xl bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-150 px-5 py-3">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">New</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5 text-sm font-semibold text-gray-750">
            {/* Role dropdown */}
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-gray-700 text-right text-sm">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              >
                <option value="Administrator">Administrator</option>
                <option value="Personnel">Personnel</option>
                <option value="Client">Client</option>
              </select>
            </div>

            {/* Username */}
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-gray-700 text-right text-sm">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter unique username"
                className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-gray-700 text-right text-sm">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            {/* Company dropdown */}
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-gray-700 text-right text-sm">Company</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              >
                {companies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Department dropdown */}
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-gray-700 text-right text-sm">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Firstname */}
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-gray-700 text-right text-sm">Firstname</label>
              <input
                type="text"
                required
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="First name"
                className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            {/* Lastname */}
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-gray-700 text-right text-sm">Lastname</label>
              <input
                type="text"
                required
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Last name"
                className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            {/* Contact number */}
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-gray-700 text-right text-sm">Contact No</label>
              <input
                type="text"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                placeholder="+63 9xx xxx xxxx"
                className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            {/* Email Address */}
            <div className="grid grid-cols-3 items-center gap-4">
              <label className="text-gray-700 text-right text-sm">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
              />
            </div>

            {/* Submit Bar */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t">
              <div></div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="bg-[#3FC3EB] hover:bg-[#20b5e0] text-white px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm cursor-pointer transition uppercase"
                >
                  Submit Registration
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
