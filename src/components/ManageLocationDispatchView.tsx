/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { DispatchRule } from "../manageData";
import { Search, Plus, Trash2, MapPin, Users, CornerDownLeft } from "lucide-react";

interface ManageLocationDispatchViewProps {
  rules: DispatchRule[];
  companies: string[];
  locations: string[];
  personnels: string[];
  onAddRule: (rule: DispatchRule) => void;
  onDeleteRule: (id: string) => void;
}

export default function ManageLocationDispatchView({
  rules,
  companies,
  locations,
  personnels,
  onAddRule,
  onDeleteRule
}: ManageLocationDispatchViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Form states matching eighth screenshot
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState(companies[0] || "i686 Online Shop");
  const [selectedLocation, setSelectedLocation] = useState(locations[0] || "Head Office");
  const [selectedUser, setSelectedUser] = useState("Select Personnel");

  // Dynamic dynamic lists displayed in the right column of the new form (eighth screenshot)
  const [activeLocations, setActiveLocations] = useState<string[]>(["Head Office"]);
  const [activePersonnels, setActivePersonnels] = useState<string[]>(["Alex Pasia", "Endless Waltz"]);

  const filtered = rules.filter((r) => {
    const s = search.toLowerCase();
    return r.name.toLowerCase().includes(s) || r.description.toLowerCase().includes(s);
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAddLocationToList = () => {
    if (selectedLocation && !activeLocations.includes(selectedLocation)) {
      setActiveLocations((prev) => [...prev, selectedLocation]);
    }
  };

  const handleRemoveLocationFromList = (locToRemove: string) => {
    setActiveLocations((prev) => prev.filter((l) => l !== locToRemove));
  };

  const handleAddPersonnelToList = () => {
    if (selectedUser && selectedUser !== "Select Personnel" && !activePersonnels.includes(selectedUser)) {
      setActivePersonnels((prev) => [...prev, selectedUser]);
    }
  };

  const handleRemovePersonnelFromList = (persToRemove: string) => {
    setActivePersonnels((prev) => prev.filter((p) => p !== persToRemove));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRule: DispatchRule = {
      id: `rule-${Date.now()}`,
      name,
      description,
      company,
      location: selectedLocation,
      user: activePersonnels[0] || "Unassigned",
      locationsList: [...activeLocations],
      personnelsList: [...activePersonnels]
    };

    onAddRule(newRule);

    // Reset Form
    setName("");
    setDescription("");
    setActiveLocations(["Head Office"]);
    setActivePersonnels(["Alex Pasia", "Endless Waltz"]);
    setShowForm(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F9FAFB] font-sans">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
        <div>
          <h2 className="text-3xl font-extralight text-gray-800 tracking-tight font-sans">Location Dispatch Rules</h2>
          <div className="text-xs text-gray-400 mt-1">Configure automated assignments linking client accounts regions to designated repair squads.</div>
        </div>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-1.5 bg-[#00c0ef] hover:bg-[#00acd6] px-4 py-1.5 rounded text-white text-xs font-semibold shadow-xs"
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
        /* Seventh Screenshot List */
        <div className="bg-white rounded border border-gray-200/95 shadow-3xs overflow-hidden">
          <div className="p-4 bg-white border-b border-gray-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-gray-300 rounded px-2 py-0.5"
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

          <div className="overflow-x-auto text-xs text-gray-600">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-700 tracking-wide">
                  <th className="p-3 pl-5">Name</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Assigned Locations</th>
                  <th className="p-3">Target Responders</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length > 0 ? (
                  paginated.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-3 pl-5 font-semibold text-[#E15B39]">{r.name}</td>
                      <td className="p-3 text-gray-700">{r.description}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {r.locationsList?.map((loc) => (
                            <span key={loc} className="bg-slate-100 text-slate-700 font-semibold rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wide">
                              {loc}
                            </span>
                          )) || <span className="text-gray-300 italic">None</span>}
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-gray-500">
                        {r.personnelsList?.join(", ") || r.user}
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
                      No matching records found.
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
      ) : (
        /* Eighth Screenshot: New Dual Column Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Panel: Basic settings form */}
          <div className="lg:col-span-2 bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-150 px-5 py-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">New Rule Parameters</h3>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5 text-sm font-semibold text-gray-750">
              {/* Name */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-gray-700 text-right text-sm">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter rule name"
                  className="col-span-2 bg-white border border-gray-300 rounded-[#10b981] rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                />
              </div>

              {/* Description */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-gray-700 text-right text-sm">Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Problem status e.g., Repair"
                  className="col-span-2 bg-white border border-gray-300 rounded-[#10b981] rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                />
              </div>

              {/* Company */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-gray-700 text-right text-sm">Company</label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="col-span-2 bg-white border border-gray-300 rounded-[#10b981] rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] cursor-pointer"
                >
                  {companies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location selectors with helper inline "Add" button */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-gray-700 text-right text-sm">Location</label>
                <div className="col-span-2 flex space-x-2">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="flex-1 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] cursor-pointer"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddLocationToList}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-5 rounded-lg font-semibold cursor-pointer text-sm shrink-0 transition"
                    title="Add location to active group list"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* User Selector with helper inline "Add" button */}
              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-gray-700 text-right text-sm">Select User</label>
                <div className="col-span-2 flex space-x-2">
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="flex-1 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] cursor-pointer"
                  >
                    <option value="Select Personnel">Select Personnel</option>
                    {personnels.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddPersonnelToList}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-5 rounded-lg font-semibold cursor-pointer text-sm shrink-0 transition"
                    title="Add user to active personnel lists"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div></div>
                <div className="col-span-2">
                  <button
                    type="submit"
                    className="bg-[#3FC3EB] hover:bg-[#20b5e0] text-white px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm cursor-pointer transition uppercase"
                  >
                    Submit Rule
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Mini Tables (Locations & Personnels) matching screenshot 8 */}
          <div className="space-y-6">
            {/* Associated Locations segment */}
            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-150 px-4 py-2.5 flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-700 uppercase flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#E15B39]" />
                  <span>Locations</span>
                </h4>
              </div>

              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {activeLocations.length > 0 ? (
                  activeLocations.map((loc) => (
                    <div key={loc} className="px-4 py-3 flex items-center justify-between text-xs text-gray-700 bg-white">
                      <span className="font-semibold text-gray-800">{loc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLocationFromList(loc)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-0.5 rounded text-[10px] font-semibold transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center italic text-gray-400 text-xs">No locations selected yet.</p>
                )}
              </div>
            </div>

            {/* Associated Personnels segment */}
            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-150 px-4 py-2.5 flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-700 uppercase flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>Personnels</span>
                </h4>
              </div>

              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {activePersonnels.length > 0 ? (
                  activePersonnels.map((pers) => (
                    <div key={pers} className="px-4 py-3 flex items-center justify-between text-xs text-gray-700 bg-white">
                      <span className="font-semibold text-gray-800">{pers}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePersonnelFromList(pers)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-0.5 rounded text-[10px] font-semibold transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-center italic text-gray-400 text-xs">No personels added yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
