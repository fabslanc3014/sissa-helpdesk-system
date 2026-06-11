/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { WarrantyRecord } from "../types";
import { Search, Plus, ShieldCheck, AlertTriangle, Calendar, Award } from "lucide-react";

interface AssetsWarrantiesViewProps {
  warranties: WarrantyRecord[];
  onAddWarranty: (warranty: WarrantyRecord) => void;
}

export default function AssetsWarrantiesView({
  warranties,
  onAddWarranty
}: AssetsWarrantiesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [coverageFilter, setCoverageFilter] = useState("All");
  const [isAdding, setIsAdding] = useState(false);

  // New Warranty Form Fields
  const [tag, setTag] = useState("");
  const [assetName, setAssetName] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [purchase, setPurchase] = useState("");
  const [covered, setCovered] = useState("Full Covered (Parts+Labor)");
  const [expiration, setExpiration] = useState("");

  const handleAddWarrantySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag.trim() || !assetName.trim() || !serialNo.trim()) {
      alert("Please fill in specific tag, asset identifier, and serial key.");
      return;
    }

    const defaultPurchase = purchase || new Date().toISOString().split("T")[0];
    const defaultExpiration = expiration || new Date(Date.now() + 365 * 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const newWarranty: WarrantyRecord = {
      id: `new-w-${Date.now()}`,
      tag: tag.trim().toUpperCase(),
      asset: assetName.trim(),
      serialNo: serialNo.trim().toUpperCase(),
      purchase: defaultPurchase,
      covered: covered.trim(),
      expiration: defaultExpiration
    };

    onAddWarranty(newWarranty);
    setIsAdding(false);

    // Reset Form fields
    setTag("");
    setAssetName("");
    setSerialNo("");
    setPurchase("");
    setCovered("Full Covered (Parts+Labor)");
    setExpiration("");

    alert("Warranty declaration archived successfully.");
  };

  const filteredWarranties = warranties.filter((w) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      w.tag.toLowerCase().includes(query) ||
      w.asset.toLowerCase().includes(query) ||
      w.serialNo.toLowerCase().includes(query) ||
      w.covered.toLowerCase().includes(query);

    const isExpired = new Date(w.expiration) < new Date();
    let matchesCoverage = true;
    if (coverageFilter === "Active") {
      matchesCoverage = !isExpired;
    } else if (coverageFilter === "Expired") {
      matchesCoverage = isExpired;
    }

    return matchesSearch && matchesCoverage;
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB] font-sans">
      {/* Title */}
      <div className="border-b border-gray-200 pb-5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extralight text-gray-800 tracking-tight">Warranty Records</h2>
          <p className="text-xs text-gray-400 mt-1">Audit active service contracts, dealer agreements, and coverage protection timelines.</p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-[#E15B39] hover:bg-[#c94e30] py-2 px-4 rounded text-white text-xs font-semibold shadow-sm transition duration-150 cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Warranty Cover</span>
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Active Coverages</p>
            <p className="text-2xl font-bold font-mono text-gray-800 mt-1">
              {warranties.filter((w) => new Date(w.expiration) >= new Date()).length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Expired Contracts</p>
            <p className="text-2xl font-bold font-mono text-gray-800 mt-1">
              {warranties.filter((w) => new Date(w.expiration) < new Date()).length}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-xs flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Ledger Size</p>
            <p className="text-2xl font-bold font-mono text-gray-800 mt-1">{warranties.length}</p>
          </div>
        </div>
      </div>

      {/* Main Table View container */}
      <div className="bg-white rounded-lg border border-gray-250 shadow-sm overflow-hidden">
        {/* Table header operations */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-gray-800">Assigned Warranties Table</h3>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search Tag, Asset, Serial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-xs text-gray-700 pl-8 pr-3 py-1.5 rounded border border-gray-250 focus:outline-none focus:border-[#E15B39]"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Filter selection */}
            <select
              value={coverageFilter}
              onChange={(e) => setCoverageFilter(e.target.value)}
              className="bg-white border border-gray-250 py-1.5 px-3 rounded text-xs text-gray-600 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Inventory list */}
        <div className="overflow-x-auto text-xs text-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 font-semibold text-gray-500 text-[10px] uppercase tracking-wider select-none">
                <th className="p-4 pl-6">Equipment Tag</th>
                <th className="p-4">Asset Details</th>
                <th className="p-4">Serial Code</th>
                <th className="p-4">Acquisition Date</th>
                <th className="p-4">Contract / Coverage Tier</th>
                <th className="p-4">Expiration Limit</th>
                <th className="p-4 pr-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {filteredWarranties.length > 0 ? (
                filteredWarranties.map((item) => {
                  const limitDate = new Date(item.expiration);
                  const isExpired = limitDate < new Date();

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/40 transition">
                      <td className="p-4 pl-6 font-mono font-bold text-gray-700 select-all">{item.tag}</td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-900">{item.asset}</span>
                      </td>
                      <td className="p-4 font-mono text-gray-500 select-all">{item.serialNo}</td>
                      <td className="p-4 text-gray-600 font-medium font-sans">
                        {item.purchase}
                      </td>
                      <td className="p-4 font-medium text-gray-800">
                        <span className="bg-orange-50 text-orange-700 border border-orange-100/60 px-2 py-0.5 rounded font-semibold text-[10px]">
                          {item.covered}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 font-medium font-mono">
                        {item.expiration}
                      </td>
                      <td className="p-4 pr-6 text-center select-none">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded font-bold text-[10px] uppercase ${
                            !isExpired
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {!isExpired ? "Active" : "Expired"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400 select-none">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertTriangle className="w-6 h-6 text-gray-300" />
                      <span>No warranty records located matching filters.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warranty add declaration drawer overlay */}
      {isAdding && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-20 cursor-default animate-fade-in"
            onClick={() => setIsAdding(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl z-30 flex flex-col border-l border-gray-200 animate-slide-in p-8 space-y-7">
            <div className="flex items-center justify-between border-b pb-4 shrink-0">
              <h3 className="text-base font-bold uppercase tracking-wider text-gray-500">Register Warranty Coverage</h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-sm font-semibold text-gray-400 hover:text-gray-800"
              >
                Dismiss Form
              </button>
            </div>

            <form onSubmit={handleAddWarrantySubmit} className="flex-1 overflow-y-auto pr-1 space-y-6 text-sm text-gray-650">
              {/* Asset Tag */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-800">Official Tag Code</label>
                <input
                  type="text"
                  placeholder="e.g. SIS-LPT-8022"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-[#10b981] rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] font-mono"
                />
              </div>

              {/* Asset Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-800">Item Detail / Name</label>
                <input
                  type="text"
                  placeholder="e.g. HP ProBook Laptop Pro"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                />
              </div>

              {/* Serial No */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-800">Serial Code</label>
                <input
                  type="text"
                  placeholder="e.g. HP-8891-AAX"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] font-mono"
                />
              </div>

              {/* Purchase Date */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-800 flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Purchase Date</span>
                </label>
                <input
                  type="date"
                  value={purchase}
                  onChange={(e) => setPurchase(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                />
              </div>

              {/* Coverage Tier */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-800">Coverage details / Protection tier</label>
                <select
                  value={covered}
                  onChange={(e) => setCovered(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none cursor-pointer"
                >
                  <option value="Full Covered (Parts+Labor)">Full Covered (Parts+Labor)</option>
                  <option value="Standard (Parts only)">Standard (Parts only)</option>
                  <option value="Enterprise Bronze Care">Enterprise Bronze Care</option>
                  <option value="Active Warranty (Labor only)">Active Warranty (Labor only)</option>
                  <option value="Cisco SmartNet 8x5xNBD">Cisco SmartNet 8x5xNBD</option>
                  <option value="No Cover">No Cover</option>
                </select>
              </div>

              {/* Exp Limit */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-800 flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-gray-400 animate-pulse" />
                  <span>Expiration Date</span>
                </label>
                <input
                  type="date"
                  value={expiration}
                  onChange={(e) => setExpiration(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E15B39] hover:bg-[#c94e30] text-white font-semibold py-3 px-6 rounded-lg text-sm transition cursor-pointer"
              >
                Record Warranty Declaration
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
