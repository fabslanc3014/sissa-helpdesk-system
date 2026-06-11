/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { TicketRef, TicketStatus } from "../types";
import { Calendar, FileSpreadsheet, Download, RefreshCw, Layers } from "lucide-react";

interface SISSAStatusReportViewProps {
  tickets: TicketRef[];
}

export default function SISSAStatusReportView({ tickets }: SISSAStatusReportViewProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState<any[] | null>(null);
  const [isGenerated, setIsGenerated] = useState(false);

  // Helper helper to get list of YYYY-MM-DD dates between range inclusive
  const getDatesInRange = (startStr: string, endStr: string) => {
    const dates: string[] = [];
    if (!startStr || !endStr) return [];
    
    let current = new Date(startStr);
    const end = new Date(endStr);
    
    if (isNaN(current.getTime()) || isNaN(end.getTime()) || current > end) {
      return [];
    }
    
    // Safety constraint: limit to max 90 days to avoid UI bottleneck
    let watchdog = 0;
    while (current <= end && watchdog < 90) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, "0");
      const dd = String(current.getDate()).padStart(2, "0");
      dates.push(`${yyyy}-${mm}-${dd}`);
      current.setDate(current.getDate() + 1);
      watchdog++;
    }
    return dates;
  };

  const handleGenerate = () => {
    if (!startDate || !endDate) {
      alert("Please select both a start date and an end date to generate the report.");
      return;
    }
    
    const dates = getDatesInRange(startDate, endDate);
    if (dates.length === 0) {
      alert("Invalid date range. Ensure the start date is before or equal to the end date.");
      return;
    }

    // Dynamic generation from actual support ticket registries
    const rows = dates.map((dateStr) => {
      const dayTickets = tickets.filter((t) => {
        if (!t.createdAt) return false;
        return t.createdAt.startsWith(dateStr);
      });

      let openCount = 0;
      let acknowledgedCount = 0;
      let resolvedCount = 0;
      let closedCount = 0;
      let otherCount = 0;

      dayTickets.forEach((t) => {
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

      return {
        date: dateStr,
        open: openCount,
        acknowledged: acknowledgedCount,
        resolved: resolvedCount,
        closed: closedCount,
        other: otherCount,
        total: dayTickets.length
      };
    });

    setReportData(rows);
    setIsGenerated(true);
  };

  const handleDownload = () => {
    if (!startDate || !endDate) {
      alert("Please select both a start date and an end date to download the report.");
      return;
    }

    const dates = getDatesInRange(startDate, endDate);
    if (dates.length === 0) {
      alert("Invalid date range specified.");
      return;
    }

    // Build real CSV format dynamic ledger
    const headers = ["Date", "Open", "Acknowledged", "Resolved", "Closed", "Other", "Total"];
    const csvContent = [];
    csvContent.push(headers.join(","));

    dates.forEach((dateStr) => {
      const dayTickets = tickets.filter((t) => t.createdAt && t.createdAt.startsWith(dateStr));
      let open = 0, ack = 0, res = 0, cls = 0, oth = 0;

      dayTickets.forEach((t) => {
        if (t.status === TicketStatus.Open) open++;
        else if (t.status === TicketStatus.Acknowledged) ack++;
        else if (t.status === TicketStatus.Resolved) res++;
        else if (t.status === TicketStatus.Closed) cls++;
        else oth++;
      });

      const row = [
        dateStr,
        open,
        ack,
        res,
        cls,
        oth,
        dayTickets.length
      ];
      csvContent.push(row.join(","));
    });

    const blob = new Blob([csvContent.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sissa_status_report_${startDate}_to_${endDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB] font-sans">
      {/* Page Title */}
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h2 className="text-4xl font-bold text-gray-805 tracking-tight">SISSA Status</h2>
        <p className="text-xs text-gray-500 mt-1">
          Detailed support metrics ledger and SLA tracking telemetry.
        </p>
      </div>

      {/* Report Form Card */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-8 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Generate Report</h3>

        {/* Date Inputs Form */}
        <div className="space-y-4 max-w-xl">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-1/3 text-sm font-semibold text-gray-700 select-none pb-1.5 sm:pb-0">
              Start date
            </label>
            <div className="sm:w-2/3">
              <input
                id="report-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-800 outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] transition"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="sm:w-1/3 text-sm font-semibold text-gray-700 select-none pb-1.5 sm:pb-0">
              End date
            </label>
            <div className="sm:w-2/3">
              <input
                id="report-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-800 outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] transition"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons (side by side, equal size, horizontal layout) */}
        <div className="flex items-center gap-4 pt-2">
          <button
            id="btn-report-generate"
            type="button"
            onClick={handleGenerate}
            className="px-6 py-2.5 text-sm font-semibold rounded-lg text-center transition cursor-pointer shadow-sm active:scale-98 bg-[#00BCD4] hover:bg-[#00A3B5] text-white uppercase"
          >
            Generate
          </button>
          <button
            id="btn-report-download"
            type="button"
            onClick={handleDownload}
            className="px-6 py-2.5 text-sm font-semibold rounded-lg text-center transition cursor-pointer shadow-sm active:scale-98 bg-[#00BCD4] hover:bg-[#00A3B5] text-white uppercase"
          >
            Download
          </button>
        </div>

        {/* Report Output Area (large white space below buttons within card) */}
        <div className="border-t border-gray-100 pt-6 mt-6">
          {isGenerated && reportData ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-650 uppercase tracking-widest flex items-center">
                  <FileSpreadsheet className="w-4 h-4 text-[#00BCD4] mr-2" />
                  Report Results for {startDate} to {endDate}
                </span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-150">
                  Total Date Rows: {reportData.length}
                </span>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-3xs overflow-hidden">
                <div className="overflow-x-auto text-xs text-gray-700">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-500 uppercase text-[10px] tracking-wider select-none">
                        <th className="p-3 pl-6">Date</th>
                        <th className="p-3 text-red-650 font-bold">Open</th>
                        <th className="p-3 text-amber-650">Acknowledged</th>
                        <th className="p-3 text-emerald-650">Resolved</th>
                        <th className="p-3 text-cyan-650">Closed</th>
                        <th className="p-3 text-gray-500">Other</th>
                        <th className="p-3 font-bold pr-6">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {reportData.map((row) => {
                        const hasActivity = row.total > 0;
                        return (
                          <tr
                            key={row.date}
                            className={`hover:bg-gray-50/50 transition ${
                              hasActivity ? "bg-cyan-50/10" : ""
                            }`}
                          >
                            <td className="p-3 pl-6 font-mono font-medium text-gray-905">
                              {row.date}
                            </td>
                            <td className="p-3 font-mono font-bold text-red-600">
                              {row.open || "-"}
                            </td>
                            <td className="p-3 font-mono font-medium text-amber-600">
                              {row.acknowledged || "-"}
                            </td>
                            <td className="p-3 font-mono font-medium text-emerald-600">
                              {row.resolved || "-"}
                            </td>
                            <td className="p-3 font-mono font-medium text-cyan-600">
                              {row.closed || "-"}
                            </td>
                            <td className="p-3 font-mono text-gray-400">
                              {row.other || "-"}
                            </td>
                            <td className="p-3 font-mono font-bold text-gray-800 pr-6">
                              {row.total ? (
                                <span className="bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-[10.5px]">
                                  {row.total}
                                </span>
                              ) : (
                                "0"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-gray-400 select-none min-h-[160px]">
              <Calendar className="w-10 h-10 text-gray-300 stroke-1 mb-2 animate-pulse" />
              <p className="text-xs font-semibold">Report content preview will compile here</p>
              <p className="text-[10px] text-gray-400 mt-1">
                Fill the start and end date parameters above then select "Generate" to construct logs index.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
