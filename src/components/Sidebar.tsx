/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  LayoutDashboard,
  Ticket,
  AlertTriangle,
  FileSpreadsheet,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Search,
  Laptop
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export default function Sidebar({
  activeView,
  onNavigate,
  searchTerm,
  onSearchChange
}: SidebarProps) {
  // Navigation categories and expand states
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({
    tickets: activeView.startsWith("tickets_"),
    mayday: activeView.startsWith("mayday_"),
    assets: activeView.startsWith("assets_"),
    reports: activeView.startsWith("reports_"),
    manage: activeView.startsWith("manage_")
  });

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const isChildActive = (prefix: string) => {
    return activeView.startsWith(prefix);
  };

  const navItemClass = (isActive: boolean) =>
    `flex items-center justify-between w-full px-4 py-3 text-[15px] font-medium transition-colors duration-150 rounded cursor-pointer ${isActive
      ? "bg-[#E15B39] text-white"
      : "text-gray-300 hover:bg-[#34373a] hover:text-white"
    }`;

  const subItemClass = (isActive: boolean) =>
    `flex items-center w-full py-2.5 pl-8 pr-4 text-[14px] font-medium transition-colors duration-150 rounded cursor-pointer ${isActive
      ? "bg-[#212324] text-[#E15B39] font-semibold border-l-2 border-[#E15B39] underline"
      : "text-gray-400 hover:bg-[#252729] hover:text-white"
    }`;

  return (
    <div className="w-64 bg-[#2E3033] flex flex-col h-screen text-white select-none border-r border-[#212324] shrink-0">
      {/* Brand Header */}
      <div className="p-4 flex items-center space-x-3 bg-[#252729]">
        <div className="relative">
          {/* Circular green tech-support asset illustration */}
          <div className="w-11 h-11 rounded-full border-2 border-white/20 shadow-md overflow-hidden">
            <img
              src="/static/images/logo.png"
              alt="SISSA Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#2E3033] rounded-full"></span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center uppercase font-sans">
            SISSA
          </h1>
          <p className="text-[10px] text-gray-400 tracking-wider">HELPDESK SYSTEM</p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="px-4 py-3 bg-[#242628]">
        <div className="relative flex items-center">
          <input
            type="text"
            id="sidebar-search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#18191B] text-gray-200 text-xs pl-8 pr-3 py-2 rounded border border-gray-700/30 focus:outline-none focus:border-[#E15B39]/50 placeholder-gray-500 transition-all duration-150"
          />
          <Search className="absolute left-2.5 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800">
        {/* Dashboard Link */}
        <div
          id="nav-dashboard"
          className={navItemClass(activeView === "dashboard")}
          onClick={() => onNavigate("dashboard")}
        >
          <span className="flex items-center space-x-3">
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </span>
        </div>

        {/* Tickets Accordion */}
        <div className="space-y-0.5">
          <div
            id="nav-tickets-toggle"
            className={navItemClass(isChildActive("tickets_"))}
            onClick={() => toggleMenu("tickets")}
          >
            <span className="flex items-center space-x-3">
              <Ticket className="w-4 h-4 shrink-0" />
              <span>Tickets</span>
            </span>
            {expandedMenus.tickets ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedMenus.tickets && (
            <div className="space-y-0.5 mt-0.5">
              <div
                id="nav-tickets-list"
                className={subItemClass(activeView === "tickets_list")}
                onClick={() => onNavigate("tickets_list")}
              >
                <span className="mr-2">»</span> List
              </div>
              <div
                id="nav-tickets-new"
                className={subItemClass(activeView === "tickets_new")}
                onClick={() => onNavigate("tickets_new")}
              >
                <span className="mr-2">»</span> New
              </div>
            </div>
          )}
        </div>

        {/* Mayday Accordion */}
        <div className="space-y-0.5">
          <div
            id="nav-mayday-toggle"
            className={navItemClass(isChildActive("mayday_"))}
            onClick={() => toggleMenu("mayday")}
          >
            <span className="flex items-center space-x-3">
              <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse text-[#E15B39]" />
              <span>Mayday</span>
            </span>
            {expandedMenus.mayday ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedMenus.mayday && (
            <div className="space-y-0.5 mt-0.5">
              <div
                id="nav-mayday-feeds"
                className={subItemClass(activeView === "mayday_feeds")}
                onClick={() => onNavigate("mayday_feeds")}
              >
                <span className="mr-2">»</span> Feeds
              </div>
              <div
                id="nav-mayday-beacon"
                className={subItemClass(activeView === "mayday_beacon")}
                onClick={() => onNavigate("mayday_beacon")}
              >
                <span className="mr-2">»</span> Beacon
              </div>
              <div
                id="nav-mayday-calls"
                className={subItemClass(activeView === "mayday_calls")}
                onClick={() => onNavigate("mayday_calls")}
              >
                <span className="mr-2">»</span> Calls
              </div>
              <div
                id="nav-mayday-sms"
                className={subItemClass(activeView === "mayday_sms")}
                onClick={() => onNavigate("mayday_sms")}
              >
                <span className="mr-2">»</span> SMS
              </div>
            </div>
          )}
        </div>

        {/* Assets Accordion */}
        <div className="space-y-0.5">
          <div
            id="nav-assets-toggle"
            className={navItemClass(isChildActive("assets_"))}
            onClick={() => toggleMenu("assets")}
          >
            <span className="flex items-center space-x-3">
              <Laptop className="w-4 h-4 shrink-0" />
              <span>Assets</span>
            </span>
            {expandedMenus.assets ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedMenus.assets && (
            <div className="space-y-0.5 mt-0.5">
              <div
                id="nav-assets-list"
                className={subItemClass(activeView === "assets_list")}
                onClick={() => onNavigate("assets_list")}
              >
                <span className="mr-2">»</span> List
              </div>
              <div
                id="nav-assets-warranties"
                className={subItemClass(activeView === "assets_warranties")}
                onClick={() => onNavigate("assets_warranties")}
              >
                <span className="mr-2">»</span> Warranties
              </div>
            </div>
          )}
        </div>

        {/* Reports Accordion */}
        <div className="space-y-0.5">
          <div
            id="nav-reports-toggle"
            className={navItemClass(isChildActive("reports_"))}
            onClick={() => toggleMenu("reports")}
          >
            <span className="flex items-center space-x-3">
              <FileSpreadsheet className="w-4 h-4 shrink-0" />
              <span>Reports</span>
            </span>
            {expandedMenus.reports ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedMenus.reports && (
            <div className="space-y-0.5 mt-0.5">
              <div
                id="nav-reports-sissa-status"
                className={subItemClass(activeView === "reports_sissa_status")}
                onClick={() => onNavigate("reports_sissa_status")}
              >
                <span className="mr-2">»</span> SISSA Status
              </div>
              <div
                id="nav-reports-agent-status"
                className={subItemClass(activeView === "reports_agent_status")}
                onClick={() => onNavigate("reports_agent_status")}
              >
                <span className="mr-2">»</span> Agent Status
              </div>
              <div
                id="nav-reports-personnel-status"
                className={subItemClass(activeView === "reports_personnel_status")}
                onClick={() => onNavigate("reports_personnel_status")}
              >
                <span className="mr-2">»</span> Personnel Status
              </div>
              <div
                id="nav-reports-export-personnel"
                className={subItemClass(activeView === "reports_export_personnel")}
                onClick={() => onNavigate("reports_export_personnel")}
              >
                <span className="mr-2">»</span> Export Personnel Status
              </div>
              <div
                id="nav-reports-export-company"
                className={subItemClass(activeView === "reports_export_company")}
                onClick={() => onNavigate("reports_export_company")}
              >
                <span className="mr-2">»</span> Export Company Status
              </div>
              <div
                id="nav-reports-personnel-tickets"
                className={subItemClass(activeView === "reports_personnel_tickets")}
                onClick={() => onNavigate("reports_personnel_tickets")}
              >
                <span className="mr-2">»</span> Personnel Tickets
              </div>
              <div
                id="nav-reports-company-tickets"
                className={subItemClass(activeView === "reports_company_tickets")}
                onClick={() => onNavigate("reports_company_tickets")}
              >
                <span className="mr-2">»</span> Company Tickets
              </div>
            </div>
          )}
        </div>

        {/* Manage Accordion */}
        <div className="space-y-0.5">
          <div
            id="nav-manage-toggle"
            className={navItemClass(isChildActive("manage_"))}
            onClick={() => toggleMenu("manage")}
          >
            <span className="flex items-center space-x-3">
              <Settings className="w-4 h-4 shrink-0" />
              <span>Manage</span>
            </span>
            {expandedMenus.manage ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
          {expandedMenus.manage && (
            <div className="space-y-0.5 mt-0.5">
              <div
                id="nav-manage-users"
                className={subItemClass(activeView === "manage_users")}
                onClick={() => onNavigate("manage_users")}
              >
                <span className="mr-2">»</span> Users
              </div>
              <div
                id="nav-manage-emails"
                className={subItemClass(activeView === "manage_emails")}
                onClick={() => onNavigate("manage_emails")}
              >
                <span className="mr-2">»</span> Emails
              </div>
              <div
                id="nav-manage-sms-templates"
                className={subItemClass(activeView === "manage_sms_templates")}
                onClick={() => onNavigate("manage_sms_templates")}
              >
                <span className="mr-2">»</span> SMS Templates
              </div>
              <div
                id="nav-manage-companies"
                className={subItemClass(activeView === "manage_companies")}
                onClick={() => onNavigate("manage_companies")}
              >
                <span className="mr-2">»</span> Companies
              </div>
              <div
                id="nav-manage-locations"
                className={subItemClass(activeView === "manage_locations")}
                onClick={() => onNavigate("manage_locations")}
              >
                <span className="mr-2">»</span> Locations
              </div>
              <div
                id="nav-manage-location-dispatch"
                className={subItemClass(activeView === "manage_location_dispatch")}
                onClick={() => onNavigate("manage_location_dispatch")}
              >
                <span className="mr-2">»</span> Location Dispatch
              </div>
              <div
                id="nav-manage-departments"
                className={subItemClass(activeView === "manage_departments")}
                onClick={() => onNavigate("manage_departments")}
              >
                <span className="mr-2">»</span> Departments
              </div>
              <div
                id="nav-manage-brands"
                className={subItemClass(activeView === "manage_brands")}
                onClick={() => onNavigate("manage_brands")}
              >
                <span className="mr-2">»</span> Brands
              </div>
              <div
                id="nav-manage-time-motion"
                className={subItemClass(activeView === "manage_time_motion")}
                onClick={() => onNavigate("manage_time_motion")}
              >
                <span className="mr-2">»</span> Time and Motion
              </div>
              <div
                id="nav-manage-ticket-services"
                className={subItemClass(activeView === "manage_ticket_services")}
                onClick={() => onNavigate("manage_ticket_services")}
              >
                <span className="mr-2">»</span> Ticket Service Types
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer System Version */}
      <div className="p-3 bg-[#242628] border-t border-gray-700/30">
        <div
          id="nav-logout"
          onClick={() => alert("Logging out... (Session Cleared & Reset)")}
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-400 hover:text-[#E15B39] hover:bg-[#34373a] rounded cursor-pointer transition-colors"
        >
          <span className="flex items-center space-x-2">
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </span>
          <span className="text-[9px] font-normal bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">v1.2.6</span>
        </div>
      </div>
    </div>
  );
}
