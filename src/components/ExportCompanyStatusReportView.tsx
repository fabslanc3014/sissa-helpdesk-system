/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { TicketRef, TicketStatus } from "../types";
import { COMPANIES } from "../data";
import { Briefcase, Calendar, FileText } from "lucide-react";

interface ExportCompanyStatusReportViewProps {
  tickets: TicketRef[];
}

export default function ExportCompanyStatusReportView({ tickets }: ExportCompanyStatusReportViewProps) {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState<any[] | null>(null);
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

  const handleGenerate = () => {
    setValidationError("");
    
    // Validate: if no company selected, show validation message
    if (!selectedCompany) {
      setValidationError("Please select a company to generate the report.");
      return;
    }

    // Filter companies list based on selection
    const targetCompanies = selectedCompany === "ALL" ? COMPANIES : [selectedCompany];

    // Generate stats for each target company
    const rows = targetCompanies.map((companyName) => {
      // Find all tickets for this company
      const companyTickets = tickets.filter(
        (t) => t.company === companyName && isTicketInDateRange(t, startDate, endDate)
      );

      let openCount = 0;
      let acknowledgedCount = 0;
      let resolvedCount = 0;
      let closedCount = 0;
      let otherCount = 0;

      companyTickets.forEach((t) => {
        if (t.status === TicketStatus.Open) {
          openCount++;
        } else if (t.status === TicketStatus.Acknowledged) {
          acknowledgedCount++;
        } else if (t.status === TicketStatus.Resolved) {
          resolvedCount++;
        } else if (t.status === TicketStatus.Closed) {
          closedCount++;
        } else {
          otherCount++;
        }
      });

      // Realistic mock mapping for average response time specific to company
      let avgResponseTime = "1.4 Days";
      if (companyName === "I686 Online Shop") avgResponseTime = "1.1 Days";
      else if (companyName === "SISSA Corp Philippines") avgResponseTime = "1.5 Days";
      else if (companyName === "Avasia Online Services") avgResponseTime = "1.2 Days";
      else if (companyName === "HP Authorized Services") avgResponseTime = "1.8 Days";
      else if (companyName === "Makati Logistics Hub") avgResponseTime = "1.6 Days";

      return {
        companyName,
        total: companyTickets.length,
        open: openCount,
        acknowledged: acknowledgedCount,
        resolved: resolvedCount,
        closed: closedCount,
        other: otherCount,
        avgResponseTime: companyTickets.length > 0 ? avgResponseTime : "-"
      };
    });

    setReportData(rows);
    setIsGenerated(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB] font-sans">
      {/* Page Title */}
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h2 className="text-4xl font-bold text-gray-805 tracking-tight animate-fade-in font-sans">Company Status</h2>
        <p className="text-xs text-gray-500 mt-1">
          Detailed corporate telemetry, caseload weights, and average SLA compliance speeds.
        </p>
      </div>

      {/* Report Form Card */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Generate Report</h3>
        </div>

        {/* 3-field Form Layout (Label aligned left, horizontal row with 16px to 24px spacing) */}
        <div className="space-y-5 max-w-xl">
          {/* 1. Company Selection Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-1/3 text-sm font-semibold text-gray-700 select-none pb-1.5 sm:pb-0">
              Company
            </label>
            <div className="sm:w-2/3">
              <select
                id="export-company-report-select"
                value={selectedCompany}
                onChange={(e) => {
                  setSelectedCompany(e.target.value);
                  setValidationError("");
                }}
                className="w-full bg-white border border-gray-300 rounded-[#10b981] rounded-lg py-2.5 px-4 text-sm text-gray-805 outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] cursor-pointer transition"
              >
                <option value="">Select Company</option>
                <option value="ALL">Show All Companies</option>
                {COMPANIES.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Start Date */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-1/3 text-sm font-semibold text-gray-700 select-none pb-1.5 sm:pb-0">
              Start date
            </label>
            <div className="sm:w-2/3">
              <input
                id="export-company-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-805 outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] transition"
              />
            </div>
          </div>

          {/* 3. End Date */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-1/3 text-sm font-semibold text-gray-700 select-none pb-1.5 sm:pb-0">
              End date
            </label>
            <div className="sm:w-2/3">
              <input
                id="export-company-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-805 outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] transition"
              />
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="max-w-xl text-xs text-red-650 bg-red-50 border border-red-200 rounded p-3 font-semibold">
            {validationError}
          </div>
        )}

        {/* Action Button: "Generate" only (Cyan) */}
        <div className="pt-2">
          <button
            id="btn-company-export-generate"
            type="button"
            onClick={handleGenerate}
            className="px-6 py-2.5 text-sm font-semibold rounded-lg text-center transition cursor-pointer shadow-sm active:scale-98 bg-[#00BCD4] hover:bg-[#00A3B5] text-white uppercase"
          >
            Generate
          </button>
        </div>

        {/* Report Output Area (large white space below button within card) */}
        <div className="border-t border-gray-100 pt-6 mt-6">
          {isGenerated && reportData ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-650 uppercase tracking-widest flex items-center">
                  <FileText className="w-4 h-4 text-[#00BCD4] mr-2" />
                  Company Metrics for {selectedCompany === "ALL" ? "All Active Companies" : selectedCompany}
                  {startDate && endDate && ` (${startDate} to ${endDate})`}
                  {startDate && !endDate && ` (Since ${startDate})`}
                  {!startDate && endDate && ` (Until ${endDate})`}
                </span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-150">
                  Companies count: {reportData.length}
                </span>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-3xs overflow-hidden">
                <div className="overflow-x-auto text-xs text-gray-700">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-500 uppercase text-[10px] tracking-wider select-none">
                        <th className="p-3 pl-6">Company Name</th>
                        <th className="p-3 font-bold text-gray-800">Total Tickets</th>
                        <th className="p-3 text-red-650 font-bold">Open</th>
                        <th className="p-3 text-amber-650">Acknowledged</th>
                        <th className="p-3 text-emerald-650">Resolved</th>
                        <th className="p-3 text-cyan-650">Closed</th>
                        <th className="p-3 text-[#00BCD4] font-bold pr-6">Avg. Response Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {reportData.map((row) => (
                        <tr
                          key={row.companyName}
                          className="hover:bg-gray-55/50 transition bg-white"
                        >
                          <td className="p-3 pl-6 font-semibold text-gray-900 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-cyan-50 border border-cyan-150 flex items-center justify-center text-cyan-600">
                              <Briefcase className="w-3.5 h-3.5" />
                            </span>
                            <span>{row.companyName}</span>
                          </td>
                          <td className="p-3 font-mono font-bold text-gray-800">
                            {row.total ? (
                              <span className="bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-[10.5px]">
                                {row.total}
                              </span>
                            ) : (
                              <span className="text-gray-400">0</span>
                            )}
                          </td>
                          <td className="p-3 font-mono font-bold text-red-600">
                            {row.open || "-"}
                          </td>
                          <td className="p-3 font-mono text-amber-600">
                            {row.acknowledged || "-"}
                          </td>
                          <td className="p-3 font-mono text-emerald-600">
                            {row.resolved || "-"}
                          </td>
                          <td className="p-3 font-mono text-cyan-600">
                            {row.closed || "-"}
                          </td>
                          <td className="p-3 font-mono font-bold text-cyan-600 pr-6">
                            {row.avgResponseTime}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400 select-none min-h-[160px]">
              <Calendar className="w-10 h-10 text-gray-300 stroke-1 mb-2 animate-pulse" />
              <p className="text-xs font-semibold">Company status report content preview will compile here</p>
              <p className="text-[10px] text-gray-400 mt-1">
                Select a company and optional date limits above then hit "Generate" to visualize response metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
