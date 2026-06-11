/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { MaydayFeed } from "../types";
import { Bell, AlertTriangle, Info, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";

interface MaydayFeedsViewProps {
  feeds: MaydayFeed[];
}

export default function MaydayFeedsView({ feeds: initialFeeds }: MaydayFeedsViewProps) {
  const [feeds, setFeeds] = useState<MaydayFeed[]>(initialFeeds);
  const [limit, setLimit] = useState(4);

  const visibleFeeds = feeds.slice(0, limit);

  const loadMore = () => {
    setLimit((p) => p + 4);
  };

  const triggerMockFeedAlert = () => {
    const alertTitles = [
      "Router Cluster Overheat Danger",
      "Makati Hub Wireless Access Point drops offline",
      "Backup database node reporting disk full warnings",
      "SLA threshold warning for ticket #2605261"
    ];
    const alertMsgs = [
      "Core temperature sensors for Cisco router cabinet in Makati exceeded threshold (82°C). High fan operations engaged.",
      "The secondary wireless router SSID I686-STAFF lost binding with core VLAN. Support technicians contacted.",
      "Archival snapshots storage group reached 92.5% usage capacity. Automatic garbage collection processes executed.",
      "HP laptop repair request is overdue by 9 days and needs supervisor response dispatch immediately."
    ];

    const idx = Math.floor(Math.random() * alertTitles.length);

    const newFeed: MaydayFeed = {
      id: `mock-feed-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title: alertTitles[idx],
      message: alertMsgs[idx],
      severity: idx === 0 || idx === 3 ? "danger" : idx === 2 ? "warning" : "info",
      source: "Automated Operator System"
    };

    setFeeds((prev) => [newFeed, ...prev]);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB] font-sans">
      {/* Page Title Header */}
      <div className="border-b border-gray-200 pb-5 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-extralight text-gray-800 tracking-tight">Mayday</h2>
          <p className="text-xs text-gray-400 mt-1">System dispatcher telemetry and real-time network anomaly logs.</p>
        </div>

        <button
          onClick={triggerMockFeedAlert}
          className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 py-1.5 px-3.5 rounded text-white text-xs font-semibold shadow-sm transition cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>Simulate Emergency Feed</span>
        </button>
      </div>

      {/* Main Table Card wrapper */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header matches Screenshot 4 title bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Feeds</h3>
          <span className="text-[10px] font-mono text-gray-400 bg-gray-200/50 px-2.5 py-0.5 rounded">
            Monitoring active APM feeds and hardware sensors
          </span>
        </div>

        {/* List of feeds */}
        <div className="divide-y divide-gray-150">
          {visibleFeeds.map((feed) => (
            <div
              key={feed.id}
              className="p-6 hover:bg-gray-50/50 transition-colors flex items-start space-x-4"
            >
              <div className="shrink-0 mt-0.5">
                {feed.severity === "danger" ? (
                  <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                ) : feed.severity === "warning" ? (
                  <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                    <Info className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-800">{feed.title}</h4>
                  <span className="text-[10px] font-mono text-gray-400">
                    {new Date(feed.timestamp).toLocaleTimeString() || "Live Feed"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed max-w-4xl">{feed.message}</p>
                <div className="flex items-center space-x-2.5 pt-1 text-[10px] text-gray-400 font-mono">
                  <span>Source: {feed.source}</span>
                  <span>•</span>
                  <span>Level: <span className="uppercase font-bold">{feed.severity}</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more feeds button matching visual style exactly */}
        {feeds.length > limit && (
          <div className="p-4 border-t border-gray-150 flex justify-center bg-gray-50/50">
            <button
              onClick={loadMore}
              className="bg-[#00C2FF] hover:bg-[#00a8dd] text-white text-xs font-semibold py-2 px-6 rounded shadow-sm cursor-pointer transition"
            >
              Load more feeds
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
