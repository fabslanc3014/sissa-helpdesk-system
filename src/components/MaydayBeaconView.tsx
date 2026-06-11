/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TicketRef, TicketStatus } from "../types";
import { MapPin, Search, Navigation, Plus, Minus, AlertCircle, RefreshCw } from "lucide-react";

interface MaydayBeaconViewProps {
  tickets: TicketRef[];
  onNavigate: (view: string) => void;
  onFilterStatus: (status: TicketStatus | null) => void;
}

interface MapMarker {
  id: string;
  ticketId: string;
  title: string;
  x: number; // percentage width on map grid
  y: number; // percentage height on map grid
  status: TicketStatus;
  urgency: string;
  desc: string;
}

export default function MaydayBeaconView({ tickets, onNavigate, onFilterStatus }: MaydayBeaconViewProps) {
  const [activeFilter, setActiveFilter] = useState<TicketStatus | "All">("All");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Hardcode coordinates representing different branches in Manila area
  const locationsMap: { [key: string]: { x: number; y: number } } = {
    "Manila Head Office": { x: 38, y: 55 },
    "Quezon City Branch": { x: 50, y: 25 },
    "Makati Tech District": { x: 42, y: 75 },
    "Pasig Warehouse": { x: 62, y: 58 },
    "Ortigas Customer Center": { x: 55, y: 48 }
  };

  // Compile map markers based on active tickets database
  const markers: MapMarker[] = tickets
    .map((t) => {
      const coords = locationsMap[t.location] || { x: 50, y: 50 };
      return {
        id: `marker-${t.id}`,
        ticketId: t.id,
        title: t.title,
        x: coords.x,
        y: coords.y,
        status: t.status,
        urgency: t.priority,
        desc: `${t.brand} device reported in ${t.location}`
      };
    })
    .filter((m) => activeFilter === "All" || m.status === activeFilter);

  // Handle map container mouse dragging to simulate panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => {
    setZoomLevel((z) => Math.min(z + 0.2, 2.5));
  };

  const zoomOut = () => {
    setZoomLevel((z) => Math.max(z - 0.2, 0.7));
  };

  const resetMap = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedMarker(null);
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.Open:
        return "#E15B39"; // Red-orange
      case TicketStatus.Acknowledged:
        return "#4B5563"; // Charcoal
      case TicketStatus.Updated:
        return "#10B981"; // Emerald
      case TicketStatus.Suspended:
        return "#F59E0B"; // Gold
      case TicketStatus.Resolved:
        return "#3B82F6"; // Blue
      case TicketStatus.Closed:
        return "#06B6D4"; // Cyan
      default:
        return "#10B981";
    }
  };

  const statusTags = [
    { label: "Open", status: TicketStatus.Open, bg: "bg-[#E15B39]" },
    { label: "Acknowledged", status: TicketStatus.Acknowledged, bg: "bg-gray-500" },
    { label: "Updated", status: TicketStatus.Updated, bg: "bg-emerald-500" },
    { label: "Suspended", status: TicketStatus.Suspended, bg: "bg-amber-500" },
    { label: "Resolved", status: TicketStatus.Resolved, bg: "bg-blue-500" },
    { label: "Closed", status: TicketStatus.Closed, bg: "bg-cyan-500" },
    { label: "All", status: "All", bg: "bg-green-600" }
  ];

  return (
    <div className="flex-1 overflow-hidden p-8 bg-[#F9FAFB] font-sans flex flex-col h-screen">
      {/* Header Panel matching Screenshot 5 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 select-none shrink-0">
        <div>
          <h2 className="text-4xl font-extralight text-gray-800 tracking-tight flex items-center">
            Beacon
          </h2>
          <p className="text-xs text-gray-400 mt-1">Real-time geographic lookup of active hardware diagnostic alerts.</p>
        </div>

        {/* Status filtering tags row */}
        <div className="flex flex-wrap items-center gap-1.5 self-end md:self-center">
          {statusTags.map((tag) => (
            <button
              key={tag.label}
              onClick={() => {
                setActiveFilter(tag.status as any);
                setSelectedMarker(null);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer transition ${
                activeFilter === tag.status
                  ? `${tag.bg} text-white`
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Box Layout - Matches Ticket Locations container */}
      <div className="flex-1 mt-6 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
        
        {/* Map panel heading */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 shrink-0 flex items-center justify-between text-xs font-semibold text-gray-700">
          <span>Ticket Locations</span>
          <span className="text-[10px] text-gray-400 font-mono">Center: Manila, Luzon (SLA Geo-Sync)</span>
        </div>

        {/* Embedded Interactive Vector Map Window */}
        <div
          id="manila-map-viewport"
          className="flex-1 relative bg-[#2C3437] overflow-hidden cursor-move "
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* MAP WATERMARK - Looks EXACTLY like screenshot 5 */}
          <div className="absolute inset-0 grid grid-cols-2 lg:grid-cols-3 pointer-events-none select-none p-12 opacity-15 text-white font-bold font-mono text-[14px]">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center rotate-[-15deg] uppercase">
                For development purposes only
              </div>
            ))}
          </div>

          {/* Map Layer Group (Draggable and Zoomable) */}
          <div
            className="absolute inset-0 transition-transform duration-75 origin-center"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              width: "100%",
              height: "100%"
            }}
          >
            {/* SVG Manila Outline drawings - creating highly technical dark road outlines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 800" fill="none">
              {/* Manila Bay blue segment */}
              <path
                d="M 0,0 L 250,0 Q 220,150 180,300 T 260,610 Q 150,750 0,800 Z"
                fill="#1C2427"
                opacity="0.9"
              />
              
              {/* Pasig River winding */}
              <path
                d="M 220,400 Q 320,380 390,440 T 520,460 T 630,520 T 780,500 T 950,580 T 1000,560"
                stroke="#222B2E"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 220,400 Q 320,380 390,440 T 520,460 T 630,520 T 780,500 T 950,580 T 1000,560"
                stroke="#1B80A5"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />

              {/* Major Roads grid - Manila style */}
              {/* Epifanio de los Santos Ave (EDSA) wrapping around eastern side */}
              <path
                d="M 420,0 Q 480,180 500,280 T 580,420 T 680,680 T 480,800"
                stroke="#3E4F54"
                strokeWidth="3.5"
                fill="none"
                opacity="0.55"
              />
              <path
                d="M 420,0 Q 480,180 500,280 T 580,420 T 680,680 T 480,800"
                stroke="#4AC38B"
                strokeWidth="1"
                fill="none"
                opacity="0.4"
                strokeDasharray="4,4"
              />

              {/* Taft Avenue & Quirino */}
              <path
                d="M 240,400 L 280,680"
                stroke="#3E4F54"
                strokeWidth="2"
                fill="none"
                opacity="0.5"
              />
              <path
                d="M 280,680 L 400,750"
                stroke="#3E4F54"
                strokeWidth="2.5"
                fill="none"
                opacity="0.5"
              />

              {/* McKinley & Katipunan */}
              <path
                d="M 680,100 L 580,420"
                stroke="#3E4F54"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
              />

              {/* Recto / Espana Blvd */}
              <path
                d="M 220,380 L 410,240"
                stroke="#3E4F54"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
              />

              {/* Minor grid lines */}
              <line x1="120" y1="200" x2="380" y2="200" stroke="#333D41" strokeWidth="1" opacity="0.3" />
              <line x1="300" y1="500" x2="600" y2="500" stroke="#333D41" strokeWidth="1" opacity="0.3" />
              <line x1="500" y1="650" x2="800" y2="650" stroke="#333D41" strokeWidth="1" opacity="0.3" />
              <line x1="450" y1="120" x2="450" y2="350" stroke="#333D41" strokeWidth="1" opacity="0.3" />

              {/* Geographic Region labels */}
              <text x="320" y="110" fill="#4B5E63" fontSize="14" fontWeight="600" letterSpacing="1">Caloocan</text>
              <text x="500" y="130" fill="#4B5E63" fontSize="16" fontWeight="700" letterSpacing="2">Quezon City</text>
              <text x="260" y="220" fill="#4B5E63" fontSize="12" fontWeight="500">Malabon</text>
              <text x="210" y="470" fill="#4B5E63" fontSize="16" fontWeight="700" letterSpacing="2">Manila</text>
              <text x="440" y="520" fill="#5A7279" fontSize="14" fontWeight="600" letterSpacing="1.5">Mandaluyong City</text>
              <text x="530" y="380" fill="#5A7279" fontSize="11" fontWeight="600">San Juan</text>
              <text x="440" y="650" fill="#4B5E63" fontSize="15" fontWeight="700" letterSpacing="2">Makati City</text>
              <text x="610" y="460" fill="#4B5E63" fontSize="15" fontWeight="600" letterSpacing="1.5">Pasig</text>
              <text x="700" y="380" fill="#4B5E63" fontSize="13" fontWeight="500">Antipolo</text>
              <text x="630" y="620" fill="#4B5E63" fontSize="11" fontWeight="550">Pateros</text>
              <text x="320" y="780" fill="#4B5E63" fontSize="14" fontWeight="600" letterSpacing="1">Pasay City</text>
            </svg>

            {/* Clickable Map Location Pin Markers */}
            {markers.map((marker) => {
              const markerColor = getStatusColor(marker.status);
              const isSelected = selectedMarker?.id === marker.id;

              return (
                <div
                  key={marker.id}
                  style={{
                    position: "absolute",
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    transform: "translate(-50%, -100%)",
                    transformOrigin: "bottom center"
                  }}
                  className="z-10 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMarker(marker);
                  }}
                >
                  <MapPin
                    className="w-8 h-8 filter drop-shadow-md hover:scale-125 transition-transform"
                    fill={markerColor}
                    stroke="#FFF"
                    strokeWidth={1.5}
                  />
                  {/* Subtle pulsing animation rings around primary support markers */}
                  <span
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full opacity-35 animate-ping -z-10"
                    style={{ backgroundColor: markerColor }}
                  />
                </div>
              );
            })}
          </div>

          {/* Interactive Floating Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-1.5 z-10 select-none">
            <button
              onClick={zoomIn}
              className="p-2 bg-[#212324] text-white hover:bg-gray-800 rounded-lg shadow-md border border-gray-700 transition cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              className="p-2 bg-[#212324] text-white hover:bg-gray-800 rounded-lg shadow-md border border-gray-700 transition cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={resetMap}
              className="p-2 bg-[#212324] text-white hover:bg-gray-800 rounded-lg shadow-md border border-gray-700 transition text-xs font-mono font-bold cursor-pointer"
              title="Recenter Map View"
            >
              RST
            </button>
          </div>

          {/* Help Overlay Guide */}
          <div className="absolute top-4 left-4 bg-[#212324]/85 text-xs text-slate-300 p-2.5 rounded border border-gray-700/60 font-medium max-w-xs pointer-events-none select-none">
            <p className="font-semibold text-white flex items-center space-x-1.5 uppercase font-mono tracking-wider text-[10px]">
              <Navigation className="w-3 h-3 text-[#E15B39]" />
              <span>Diagnostic Geo-Terminal</span>
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-gray-400">
              Drag on the viewport space to pan locations. Scroll or use panel controls to zoom. Click pins to review branch dispatch details.
            </p>
          </div>

          {/* Floating Marker detail overlay card */}
          {selectedMarker && (
            <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-sm bg-[#212324] border border-gray-700 text-white p-4 rounded-lg shadow-2xl z-10 animate-slide-in relative select-none">
              <button
                onClick={() => setSelectedMarker(null)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white rounded-full transition"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex items-start space-x-3 mt-1">
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: getStatusColor(selectedMarker.status) }}
                />
                <div className="space-y-1.5 flex-1">
                  <h4 className="text-sm font-bold text-white tracking-tight">{selectedMarker.title}</h4>
                  <p className="text-xs text-gray-400">{selectedMarker.desc}</p>
                  
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 pt-1 border-t border-gray-800">
                    <span>Priority: <span className="text-amber-500 uppercase">{selectedMarker.urgency}</span></span>
                    <span>Status: <span className="text-slate-200 uppercase font-bold">{selectedMarker.status}</span></span>
                  </div>

                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      onClick={() => {
                        // Navigate to list and filter by this ticket
                        onFilterStatus(null);
                        onNavigate("tickets_list");
                      }}
                      className="bg-[#E15B39] hover:bg-[#c94e30] transition text-white font-semibold rounded text-[10px] px-3 py-1.5 cursor-pointer uppercase font-mono tracking-wider"
                    >
                      Open Full Ticket Details
                    </button>
                    <button
                      onClick={() => setSelectedMarker(null)}
                      className="bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition rounded text-[10px] px-2.5 py-1.5 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
