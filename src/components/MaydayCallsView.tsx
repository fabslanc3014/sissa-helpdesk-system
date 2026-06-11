/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { CallLog } from "../types";
import { Phone, PhoneCall, PhoneMissed, Search, Clock, Play, Volume2, User, HelpCircle } from "lucide-react";

interface MaydayCallsViewProps {
  calls: CallLog[];
  onNavigate: (view: string) => void;
}

export default function MaydayCallsView({ calls, onNavigate }: MaydayCallsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const filteredCalls = calls.filter((c) =>
    c.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phoneNumber.includes(searchTerm) ||
    (c.transcription && c.transcription.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const simulatePlayAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      if (prog > 100) {
        clearInterval(interval);
        setIsPlayingAudio(false);
        setAudioProgress(0);
      } else {
        setAudioProgress(prog);
      }
    }, 200);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB] font-sans">
      {/* Page Title Header matching Screenshot 6 */}
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h2 className="text-4xl font-extralight text-gray-800 tracking-tight">Calls</h2>
        <p className="text-xs text-gray-400 mt-1">Recorded telecommunication streams and VoIP support logs.</p>
      </div>

      {/* Main calls table card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        
        {/* Card Header matching Screenshot 6 layout */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3.5 flex items-center justify-between text-sm font-semibold text-gray-850">
          <span>List</span>
          <span className="text-[10px] text-gray-400 font-mono">Dialer Pool Sync: Online</span>
        </div>

        {/* Filters and search area toolbar */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              id="calls-search"
              placeholder="Search caller name, phone number, transcripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-gray-700 text-xs pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
            />
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
          </div>

          {/* Pagination widgets on exact right matching Screenshot 6 */}
          <div className="flex items-center space-x-1 select-none text-xs text-gray-500 font-medium">
            <button
              onClick={() => alert("Already on first page")}
              className="px-2.5 py-1.5 border border-gray-200 rounded hover:bg-gray-100 bg-white transition cursor-pointer"
            >
              First
            </button>
            <button className="px-3.5 py-1.5 bg-[#E15B39] text-white rounded font-bold">
              1
            </button>
            <button
              onClick={() => alert("Already on last page")}
              className="px-2.5 py-1.5 border border-gray-200 rounded hover:bg-gray-100 bg-white transition cursor-pointer"
            >
              Last
            </button>
          </div>
        </div>

        {/* Content list of calls */}
        <div className="divide-y divide-gray-150">
          {filteredCalls.length > 0 ? (
            filteredCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCall(call)}
                className="p-5 hover:bg-gray-50/30 transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-4 min-w-0">
                  <div className="shrink-0">
                    {call.status === "Answered" ? (
                      <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-100">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                        <PhoneMissed className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 tracking-tight group-hover:text-[#E15B39] transition">
                      {call.callerName}
                    </h4>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{call.phoneNumber}</p>
                    {call.transcription && (
                      <p className="text-[11px] text-gray-400 mt-1 italic truncate max-w-xl">
                        "{call.transcription}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs text-gray-500 font-mono shrink-0">
                  <div className="text-right">
                    <p className="font-semibold text-gray-700">{call.duration !== "00:00" ? call.duration : "No pickup"}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(call.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      call.status === "Answered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {call.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-400 text-xs flex flex-col items-center justify-center space-y-2">
              <PhoneMissed className="w-8 h-8 text-gray-300" />
              <p className="font-medium text-gray-700">No support calls located</p>
              <p className="text-[11px]">Filtered log queries return empty datasets.</p>
            </div>
          )}
        </div>
      </div>

      {/* Voice Call transcript detail popup modal */}
      {selectedCall && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-20 cursor-default animate-fade-in"
            onClick={() => setSelectedCall(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl z-30 flex flex-col border-l border-gray-200 animate-slide-in p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Caller Audio Feed</h3>
              <button
                onClick={() => setSelectedCall(null)}
                className="text-xs font-semibold text-gray-400 hover:text-gray-800"
              >
                Dismiss
              </button>
            </div>

            {/* Caller card profile style */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-150">
              <div className="w-12 h-12 bg-[#2E3033] text-white font-bold text-center flex items-center justify-center rounded-full text-sm shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-800 text-sm truncate">{selectedCall.callerName}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedCall.phoneNumber}</p>
                <p className="text-[10px] text-gray-400 font-mono mt-1">Logged: {new Date(selectedCall.timestamp).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Media Player Box Simulation */}
            {selectedCall.status === "Answered" && (
              <div className="bg-[#212324] text-white p-5 rounded-lg border border-gray-800 space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center space-x-1.5">
                    <Volume2 className="w-4 h-4 text-[#E15B39]" />
                    <span>voip_recording_{selectedCall.id}.mp3</span>
                  </span>
                  <span>{selectedCall.duration}</span>
                </div>

                {/* Progress Visualizer */}
                <div className="relative">
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#E15B39] h-full transition-all duration-300"
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                </div>

                {/* Simulated Spectrogram Graph Oscillating Lines */}
                <div className="h-10 flex items-end justify-between space-x-0.5 px-2">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const rndHeight = isPlayingAudio ? Math.floor(Math.random() * 32) + 4 : 6;
                    return (
                      <span
                        key={i}
                        className="bg-[#E15B39] w-1.5 rounded-t-sm transition-all duration-200"
                        style={{ height: `${rndHeight}px` }}
                      />
                    );
                  })}
                </div>

                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={simulatePlayAudio}
                  className="w-full bg-[#E15B39] hover:bg-[#c94e30] py-2 px-4 rounded text-xs text-white font-semibold flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 shrink-0" />
                  <span>{isPlayingAudio ? "Pause Recording" : "Playback Client Voice Recording"}</span>
                </button>
              </div>
            )}

            {/* Transcription text block */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Transcript Text</h4>
              <div className="p-4 bg-gray-50 border border-gray-150 rounded text-xs text-gray-700 leading-relaxed font-sans shadow-3xs">
                {selectedCall.transcription ? (
                  `"${selectedCall.transcription}"`
                ) : (
                  <p className="italic text-gray-400 text-center">Voice connection timed out or missed (No media stream available).</p>
                )}
              </div>
            </div>

            {/* Quick response dispatch actions */}
            {selectedCall.status === "Answered" && (
              <div className="pt-4 border-t border-gray-150 space-y-2">
                <button
                  onClick={() => {
                    alert("Generating draft ticket matching transcript elements...");
                    setSelectedCall(null);
                    onNavigate("tickets_new");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-4 rounded transition text-center cursor-pointer"
                >
                  Convert Call transcript to Support Ticket
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
