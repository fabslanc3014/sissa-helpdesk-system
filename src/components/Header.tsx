/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Menu, ChevronDown, User, Shield, Key, Sparkles } from "lucide-react";

interface HeaderProps {
  currentAgent: string;
  onAgentChange: (agent: string) => void;
  userEmail: string;
}

export default function Header({
  currentAgent,
  onAgentChange,
  userEmail
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const agentsList = ["Endless Waltz", "Admin Support", "Support Desk 02", "System Autopilot"];

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      {/* Left items */}
      <div className="flex items-center space-x-3">
        <button
          id="header-hamburger"
          className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          onClick={() => alert("Sidebar collapse toggled (Visual only)")}
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-gray-700 font-semibold tracking-wide text-xs uppercase font-sans">
          I686 ONLINE SHOP
        </span>
      </div>

      {/* Right items / Agent User Dropdown */}
      <div className="relative">
        <div
          id="header-profile"
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 py-1.5 px-3 rounded-lg transition-colors"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {/* Circular miniature picture */}
          <div className="w-7 h-7 rounded-full bg-orange-100 text-[#E15B39] font-bold flex items-center justify-center text-xs border border-orange-200">
            {currentAgent.split(" ").map((w) => w[0]).join("")}
          </div>
          <span className="text-sm font-medium text-gray-700 select-none">
            {currentAgent}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
        </div>

        {/* Dropdown Menu Overlay */}
        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-20 cursor-default"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2.5 w-64 bg-white rounded-lg border border-gray-100 shadow-xl z-30 py-2.5 transform origin-top-right transition-all">
              {/* User email info */}
              <div className="px-4 py-2 border-b border-gray-100 pb-3">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Logged In Account</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{userEmail}</p>
                <div className="flex items-center space-x-1.5 mt-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                  <p className="text-[11px] text-green-600 font-medium font-mono">Status: Connected</p>
                </div>
              </div>

              {/* Agent Switching Options */}
              <div className="px-4 pt-3 pb-1">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">Switch Operator Identity</p>
                <div className="space-y-1">
                  {agentsList.map((agent) => (
                    <button
                      key={agent}
                      onClick={() => {
                        onAgentChange(agent);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded transition ${
                        currentAgent === agent
                          ? "bg-[#E15B39]/10 text-[#E15B39] font-semibold"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {agent}
                    </button>
                  ))}
                </div>
              </div>

              {/* Utility actions */}
              <div className="border-t border-gray-150 mt-3 pt-2.5 px-2">
                <button
                  onClick={() => alert("This support station is connected to Cloud Workspace Secure Access.")}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-900 rounded hover:bg-gray-50 text-left transition"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Security Status Check</span>
                </button>
                <button
                  onClick={() => alert("System keys generated. Session remains active.")}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-900 rounded hover:bg-gray-50 text-left transition"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Workspace Credentials</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
