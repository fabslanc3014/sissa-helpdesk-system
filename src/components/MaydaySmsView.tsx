/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SMSMessage } from "../types";
import { MessageSquare, Search, Send, Clock, User, ArrowLeft, Shield } from "lucide-react";

interface MaydaySmsViewProps {
  smsList: SMSMessage[];
  onReplyToSms: (id: string, text: string) => void;
}

export default function MaydaySmsView({ smsList, onReplyToSms }: MaydaySmsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSms, setSelectedSms] = useState<SMSMessage | null>(null);
  const [draftReplyText, setDraftReplyText] = useState("");

  const filteredSMS = smsList.filter((sms) =>
    sms.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sms.phoneNumber.includes(searchTerm) ||
    sms.messageText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSms || !draftReplyText.trim()) return;

    onReplyToSms(selectedSms.id, draftReplyText.trim());

    // Update local modal view state so it displays immediately inside the thread
    const updatedSMS = {
      ...selectedSms,
      replies: [
        ...selectedSms.replies,
        {
          sender: "Endless Waltz",
          text: draftReplyText.trim(),
          timestamp: new Date().toISOString()
        }
      ]
    };

    setSelectedSms(updatedSMS);
    setDraftReplyText("");
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB] font-sans">
      {/* Page Title Header matching Screenshot 7 */}
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h2 className="text-4xl font-extralight text-gray-800 tracking-tight">Messages</h2>
        <p className="text-xs text-gray-400 mt-1">SMS communications inbox and SMS gateway broadcasts terminal.</p>
      </div>

      {/* Main SMS Container Card matching Messages list container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Card Header matching Screenshot 7 */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3.5 flex items-center justify-between text-sm font-semibold text-gray-800">
          <span>Inbox</span>
          <span className="text-[10px] text-gray-400 font-mono">Gateway Service: Connected</span>
        </div>

        {/* Search controls row */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              id="sms-search-box"
              placeholder="Search sender, mobile phone numbers, message content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-gray-700 text-xs pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
            />
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
          </div>

          {/* Pagination widgets on exact right matching Screenshot 7 */}
          <div className="flex items-center space-x-1 text-xs text-gray-500 font-medium">
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

        {/* Content list of SMS cards */}
        <div className="divide-y divide-gray-150">
          {filteredSMS.length > 0 ? (
            filteredSMS.map((sms) => {
              const hasReplied = sms.replies.length > 0;

              return (
                <div
                  key={sms.id}
                  onClick={() => setSelectedSms(sms)}
                  className="p-5 hover:bg-gray-50/30 transition flex items-start justify-between cursor-pointer group"
                >
                  <div className="flex items-start space-x-4 min-w-0">
                    <div className="shrink-0 mt-0.5">
                      <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-gray-800 tracking-tight group-hover:text-[#E15B39] transition">
                          {sms.senderName}
                        </h4>
                        {!hasReplied && (
                          <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" title="Requires reply" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{sms.phoneNumber}</p>
                      <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2.5 rounded border border-gray-100 max-w-2xl leading-relaxed">
                        {sms.messageText}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 shrink-0 text-xs text-gray-500 font-mono select-none">
                    <span>{new Date(sms.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    
                    {hasReplied ? (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">
                        Replied
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded animate-pulse">
                        Unanswered
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-gray-400 text-xs flex flex-col items-center justify-center space-y-2">
              <MessageSquare className="w-8 h-8 text-gray-300" />
              <p className="font-medium text-gray-700">No support SMS records found</p>
              <p className="text-[11px]">No active text messages correspond to your search parameter.</p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Chat overlay thread */}
      {selectedSms && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-20 cursor-default animate-fade-in"
            onClick={() => setSelectedSms(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl z-20 flex flex-col border-l border-gray-200 animate-slide-in">
            {/* Header chat room */}
            <div className="p-4 bg-[#232527] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedSms(null)}
                  className="p-1 hover:bg-white/10 rounded text-gray-300 hover:text-white sm:hidden"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white">{selectedSms.senderName}</h3>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{selectedSms.phoneNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSms(null)}
                className="text-xs font-semibold text-gray-400 hover:text-white"
              >
                Dismiss Thread
              </button>
            </div>

            {/* Chat Thread Messages Box */}
            <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-4">
              {/* Informative advice banner */}
              <div className="bg-blue-50 border border-blue-100 p-2.5 rounded text-[11px] text-blue-700 flex items-start space-x-2 select-none">
                <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Conversations are synchronized with SISSA GSM Gateway. SMS charges will be billed internally.</span>
              </div>

              {/* Sender original incoming SMS */}
              <div className="flex flex-col items-start space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide px-2">
                  {selectedSms.senderName}
                </span>
                <div className="bg-white text-gray-800 p-3.5 rounded-2xl rounded-tl-none shadow-3xs border border-gray-250/30 max-w-sm text-xs leading-relaxed">
                  {selectedSms.messageText}
                </div>
                <span className="text-[9px] font-mono text-gray-400 px-2 pt-0.5">
                  {new Date(selectedSms.timestamp).toLocaleTimeString() || "Today"}
                </span>
              </div>

              {/* Replied SMS elements thread */}
              {selectedSms.replies.map((reply, index) => (
                <div key={index} className="flex flex-col items-end space-y-1">
                  <span className="text-[10px] font-bold text-[#E15B39] uppercase tracking-wide px-2">
                    {reply.sender} (Operator)
                  </span>
                  <div className="bg-[#E15B39] text-white p-3.5 rounded-2xl rounded-tr-none shadow-3xs max-w-sm text-xs leading-relaxed">
                    {reply.text}
                  </div>
                  <span className="text-[9px] font-mono text-gray-400 px-2 pt-0.5">
                    {new Date(reply.timestamp).toLocaleTimeString() || "Just now"}
                  </span>
                </div>
              ))}
            </div>

            {/* Reply inputs in chat footer */}
            <form onSubmit={handleSubmitReply} className="p-4 bg-white border-t border-gray-150 shrink-0 flex items-center space-x-3">
              <input
                type="text"
                value={draftReplyText}
                onChange={(e) => setDraftReplyText(e.target.value)}
                placeholder="Compose secure SMS reply broadcast..."
                required
                className="flex-1 bg-gray-50 text-gray-800 text-sm py-3 px-5 rounded-full border border-gray-300 hover:border-gray-400 outline-none focus:outline-none focus:border-[#E15B39] focus:bg-white transition"
              />
              <button
                type="submit"
                className="bg-[#E15B39] hover:bg-[#c94e30] p-3.5 rounded-full text-white shadow-md transition cursor-pointer shrink-0"
                title="Send SMS"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
