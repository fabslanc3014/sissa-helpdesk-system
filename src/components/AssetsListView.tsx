/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { HardwareAsset } from "../types";
import { Laptop, Search, Plus, Filter, AlertTriangle, ShieldCheck, HardDrive } from "lucide-react";

interface AssetsListViewProps {
  assets: HardwareAsset[];
  onAddAsset: (asset: HardwareAsset) => void;
}

export default function AssetsListView({ assets, onAddAsset }: AssetsListViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  
  // Adding modal fields helper
  const [isAdding, setIsAdding] = useState(false);
  const [tag, setTag] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [loc, setLoc] = useState("Manila Head Office");
  const [owner, setOwner] = useState("");
  const [cost, setCost] = useState("₱30,000");

  const handleAddNewAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag.trim() || !name.trim() || !brand.trim() || !serial.trim()) {
      alert("Please fill in specific tag, asset identifier, manufacturer, and serial key.");
      return;
    }

    const newAsset: HardwareAsset = {
      id: `new-ast-${Date.now()}`,
      tag: tag.trim().toUpperCase(),
      assetName: name.trim(),
      brand: brand.trim(),
      model: model.trim() || "Generic",
      serialNo: serial.trim(),
      purchaseDate: new Date().toISOString().split("T")[0],
      location: loc,
      coveredAmount: cost.trim().startsWith("₱") ? cost.trim() : `₱${cost.trim()}`,
      expirationDate: new Date(Date.now() + 365 * 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      assignedUser: owner.trim() || "Unclaimed",
      status: "Active"
    };

    onAddAsset(newAsset);
    setIsAdding(false);
    
    // Clear forms
    setTag("");
    setName("");
    setBrand("");
    setModel("");
    setSerial("");
    setOwner("");
    setCost("₱30,000");

    alert("Hardware entry recorded in central database ledger.");
  };

  const filteredAssets = assets.filter((ast) => {
    const matchesSearch =
      ast.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ast.assignedUser.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === "All" || ast.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB] font-sans">
      {/* Title */}
      <div className="border-b border-gray-200 pb-5 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-extralight text-gray-800 tracking-tight">Assets Audit</h2>
          <p className="text-xs text-gray-400 mt-1">Management and assignment logs for company-owned hardware items.</p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-[#E15B39] hover:bg-[#c94e30] py-1.5 px-4 rounded text-white text-xs font-semibold shadow-sm transition duration-150 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Equipment</span>
        </button>
      </div>

      {/* Main card audit list */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Table header matches style matching Messages Inbox typo placeholder in screenshots */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-gray-800">Assets Inventory Register</h3>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Tag search */}
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                id="asset-inbox-search"
                placeholder="Search Tag, Title, Serial..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-xs text-gray-700 pl-8 pr-3 py-1.5 rounded border border-gray-250 focus:outline-none focus:border-[#E15B39]"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border border-gray-250 py-1.5 px-3 rounded text-xs text-gray-600 focus:outline-none cursor-pointer"
            >
              <option value="All">All statuses</option>
              <option value="Active">Active</option>
              <option value="In Repair">In Repair</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
        </div>

        {/* Assets Listing Table view */}
        <div className="overflow-x-auto text-xs font-sans text-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 font-semibold text-gray-500 text-[10px] uppercase tracking-wider select-none">
                <th className="p-4 pl-6">Core Tag</th>
                <th className="p-4">Asset Details / Brand</th>
                <th className="p-4">Serial Key</th>
                <th className="p-4">Deployment Zone</th>
                <th className="p-4">Assigned User</th>
                <th className="p-4">Covered Sum</th>
                <th className="p-4 pr-6 text-center">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50/40 transition">
                    <td className="p-4 pl-6 font-mono font-bold text-gray-700 select-all">{asset.tag}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-gray-900">{asset.assetName}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{asset.brand} • {asset.model}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-gray-500 select-all">{asset.serialNo}</td>
                    <td className="p-4 text-gray-600 font-medium">{asset.location}</td>
                    <td className="p-4">
                      <span className="font-medium text-blue-600">{asset.assignedUser}</span>
                    </td>
                    <td className="p-4 font-mono font-medium">{asset.coveredAmount}</td>
                    <td className="p-4 pr-6 text-center select-none">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded font-bold text-[10px] ${
                          asset.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : asset.status === "In Repair"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400 select-none">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertTriangle className="w-6 h-6 text-gray-300" />
                      <span>No hardware assets located in audit filter tables.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset register modal */}
      {isAdding && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-20 cursor-default animate-fade-in"
            onClick={() => setIsAdding(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl z-30 flex flex-col border-l border-gray-200 animate-slide-in p-8 space-y-7">
            <div className="flex items-center justify-between border-b pb-4 shrink-0">
              <h3 className="text-base font-bold uppercase tracking-wider text-gray-500">Equipment Record File</h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-sm font-semibold text-gray-400 hover:text-gray-800"
              >
                Dismiss Form
              </button>
            </div>

            {/* Add Asset Form components */}
            <form onSubmit={handleAddNewAssetSubmit} className="flex-1 overflow-y-auto pr-1 space-y-6 text-sm text-gray-650">
              {/* Asset Tag */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-800">Official Tag Code</label>
                <input
                  type="text"
                  placeholder="e.g. SIS-LPT-9981"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                />
              </div>

              {/* Asset Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-800">Item Name Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. HP ProBook Desk-X"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                />
              </div>

              {/* Layout Manufacturers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-800">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. HP, Lenovo"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-800">Model</label>
                  <input
                    type="text"
                    placeholder="e.g. 440 G8"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                  />
                </div>
              </div>

              {/* Serial number */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-800">Serial Key (SN)</label>
                <input
                  type="text"
                  placeholder="Unique manufacturer barcode"
                  value={serial}
                  onChange={(e) => setSerial(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] font-mono"
                />
              </div>

              {/* Location selection */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-800">Deployed Hub</label>
                <select
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none cursor-pointer"
                >
                  <option value="Manila Head Office">Manila Head Office</option>
                  <option value="Quezon City Branch">Quezon City Branch</option>
                  <option value="Makati Tech District">Makati Tech District</option>
                  <option value="Pasig Warehouse">Pasig Warehouse</option>
                  <option value="Ortigas Customer Center">Ortigas Customer Center</option>
                </select>
              </div>

              {/* Cost of asset */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-800">Assigned Employee</label>
                  <input
                    type="text"
                    placeholder="e.g. Lance Fabregas"
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-800">Estimated Value (₱)</label>
                  <input
                    type="text"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-sm transition cursor-pointer"
              >
                Submit Asset Registration
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
