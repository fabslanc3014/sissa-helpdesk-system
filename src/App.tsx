/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import TicketsListView from "./components/TicketsListView";
import NewTicketView from "./components/NewTicketView";
import MaydayFeedsView from "./components/MaydayFeedsView";
import MaydayBeaconView from "./components/MaydayBeaconView";
import MaydayCallsView from "./components/MaydayCallsView";
import MaydaySmsView from "./components/MaydaySmsView";
import AssetsListView from "./components/AssetsListView";
import AssetsWarrantiesView from "./components/AssetsWarrantiesView";
import SISSAStatusReportView from "./components/SISSAStatusReportView";
import AgentStatusReportView from "./components/AgentStatusReportView";
import PersonnelStatusReportView from "./components/PersonnelStatusReportView";
import ExportPersonnelStatusReportView from "./components/ExportPersonnelStatusReportView";
import ExportCompanyStatusReportView from "./components/ExportCompanyStatusReportView";
import PersonnelTicketsReportView from "./components/PersonnelTicketsReportView";
import CompanyTicketsReportView from "./components/CompanyTicketsReportView";

// Management components
import ManageUsersView from "./components/ManageUsersView";
import ManageEmailsView from "./components/ManageEmailsView";
import ManageSmsTemplatesView from "./components/ManageSmsTemplatesView";
import ManageCompaniesView from "./components/ManageCompaniesView";
import ManageLocationsView from "./components/ManageLocationsView";
import ManageLocationDispatchView from "./components/ManageLocationDispatchView";
import ManageDepartmentsView from "./components/ManageDepartmentsView";
import ManageBrandsView from "./components/ManageBrandsView";
import ManageTimeMotionRulesView from "./components/ManageTimeMotionRulesView";
import ManageTicketServiceTypesView from "./components/ManageTicketServiceTypesView";

import {
  initialTickets,
  initialActivities,
  initialFeeds,
  initialCalls,
  initialSMS,
  initialAssets,
  initialWarranties
} from "./data";

import {
  initialManageUsers,
  initialEmailSettings,
  initialSmsTemplates,
  initialCompanies,
  initialLocations,
  initialDispatchRules,
  initialDepartments,
  initialBrands,
  initialTimeMotionRules,
  initialTicketServiceTypes
} from "./manageData";

import { TicketRef, TicketStatus, RecentActivity, HardwareAsset, WarrantyRecord } from "./types";
import { 
  FileSpreadsheet, 
  Settings, 
  Code,
  Sliders, 
  Terminal, 
  Database, 
  ShieldCheck, 
  Download, 
  Printer, 
  TrendingUp, 
  Hash, 
  CheckCircle,
  Clock,
  User,
  AlertCircle
} from "lucide-react";

export default function App() {
  const [tickets, setTickets] = useState<TicketRef[]>(initialTickets);
  const [activities, setActivities] = useState<RecentActivity[]>(initialActivities);
  const [assets, setAssets] = useState<HardwareAsset[]>(initialAssets);
  const [warranties, setWarranties] = useState<WarrantyRecord[]>(initialWarranties);
  const [calls, setCalls] = useState(initialCalls);
  const [smsList, setSmsList] = useState(initialSMS);

  // Manage view states
  const [manageUsers, setManageUsers] = useState(initialManageUsers);
  const [emailSettings, setEmailSettings] = useState(initialEmailSettings);
  const [smsTemplates, setSmsTemplates] = useState(initialSmsTemplates);
  const [manageCompanies, setManageCompanies] = useState(initialCompanies);
  const [manageLocations, setManageLocations] = useState(initialLocations);
  const [dispatchRules, setDispatchRules] = useState(initialDispatchRules);
  const [manageDepartments, setManageDepartments] = useState(initialDepartments);
  const [manageBrands, setManageBrands] = useState(initialBrands);
  const [timeMotionRules, setTimeMotionRules] = useState(initialTimeMotionRules);
  const [ticketServiceTypes, setTicketServiceTypes] = useState(initialTicketServiceTypes);

  const [activeView, setActiveView] = useState("dashboard");
  const [filteredStatus, setFilteredStatus] = useState<TicketStatus | null>(null);
  const [currentAgent, setCurrentAgent] = useState("Endless Waltz");
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  const userEmail = "fabregaslance3144@gmail.com";

  useEffect(() => {
    // Fetch all initial data from Postgres via full-stack backend APIs
    fetch("/api/tickets").then(r => r.json()).then(data => { if (Array.isArray(data)) setTickets(data); }).catch(console.error);
    fetch("/api/activities").then(r => r.json()).then(data => { if (Array.isArray(data)) setActivities(data); }).catch(console.error);
    fetch("/api/assets").then(r => r.json()).then(data => { if (Array.isArray(data)) setAssets(data); }).catch(console.error);
    fetch("/api/warranties").then(r => r.json()).then(data => { if (Array.isArray(data)) setWarranties(data); }).catch(console.error);
    fetch("/api/calls").then(r => r.json()).then(data => { if (Array.isArray(data)) setCalls(data); }).catch(console.error);
    fetch("/api/sms").then(r => r.json()).then(data => { if (Array.isArray(data)) setSmsList(data); }).catch(console.error);
    
    fetch("/api/manage/users").then(r => r.json()).then(data => { if (Array.isArray(data)) setManageUsers(data); }).catch(console.error);
    fetch("/api/manage/email-settings").then(r => r.json()).then(data => { if (data && data.email) setEmailSettings(data); }).catch(console.error);
    fetch("/api/manage/sms-templates").then(r => r.json()).then(data => { if (Array.isArray(data)) setSmsTemplates(data); }).catch(console.error);
    fetch("/api/manage/companies").then(r => r.json()).then(data => { if (Array.isArray(data)) setManageCompanies(data); }).catch(console.error);
    fetch("/api/manage/locations").then(r => r.json()).then(data => { if (Array.isArray(data)) setManageLocations(data); }).catch(console.error);
    fetch("/api/manage/rules").then(r => r.json()).then(data => { if (Array.isArray(data)) setDispatchRules(data); }).catch(console.error);
    fetch("/api/manage/departments").then(r => r.json()).then(data => { if (Array.isArray(data)) setManageDepartments(data); }).catch(console.error);
    fetch("/api/manage/brands").then(r => r.json()).then(data => { if (Array.isArray(data)) setManageBrands(data); }).catch(console.error);
    fetch("/api/manage/time-motion").then(r => r.json()).then(data => { if (Array.isArray(data)) setTimeMotionRules(data); }).catch(console.error);
    fetch("/api/manage/ticket-services").then(r => r.json()).then(data => { if (Array.isArray(data)) setTicketServiceTypes(data); }).catch(console.error);
  }, []);

  // System Config/Settings States
  const [slaLimit, setSlaLimit] = useState("48 Hours");
  const [alertPhone, setAlertPhone] = useState("+63 908 443 6612");
  const [techMail, setTechMail] = useState("lance.sissa@gmail.com");

  // State code tabs inside legacy system reference inspector
  const [activeCodeTab, setActiveCodeTab] = useState<"index" | "function" | "mustache" | "idiorm">("index");

  // State handlers to bubble changes
  const handleAddTicket = (newTicket: TicketRef) => {
    // The ticket is written to postgres inside NewTicketView.tsx
    // So we just update the client-side state setTickets and log activity here
    setTickets((prev) => [newTicket, ...prev]);
    handleAddActivityLog(`New Ticket ${newTicket.id} was created by operator`, "ticket");
  };

  const handleUpdateTicket = (updatedTicket: TicketRef) => {
    fetch(`/api/tickets/${updatedTicket.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTicket)
    })
    .then(r => r.json())
    .then(saved => setTickets((prev) => prev.map((t) => (t.id === saved.id ? saved : t))))
    .catch(console.error);

    handleAddActivityLog(`Ticket #${updatedTicket.id} details updated in database`, "ticket");
  };

  const handleAddAsset = (newAsset: HardwareAsset) => {
    fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAsset)
    })
    .then(r => r.json())
    .then(saved => setAssets((prev) => [saved, ...prev]))
    .catch(console.error);

    handleAddActivityLog(`Asset ${newAsset.tag} registered in equipment bank`, "asset");
  };

  const handleAddWarranty = (newWarranty: WarrantyRecord) => {
    fetch("/api/warranties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWarranty)
    })
    .then(r => r.json())
    .then(saved => setWarranties((prev) => [saved, ...prev]))
    .catch(console.error);

    handleAddActivityLog(`Warranty logged for ${newWarranty.tag} serial ${newWarranty.serialNo}`, "asset");
  };

  const handleReplyToSms = (id: string, text: string) => {
    const replyObj = {
      sender: currentAgent,
      text,
      timestamp: new Date().toISOString()
    };
    fetch(`/api/sms/${id}/reply`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(replyObj)
    })
    .then(r => r.json())
    .then(updatedSms => {
      setSmsList((prev) => prev.map((sms) => (sms.id === id ? updatedSms : sms)));
    })
    .catch(console.error);

    handleAddActivityLog(`SMS response broadcast sent to ${id}`, "sms");
  };

  const handleAddActivityLog = (logText: string, type: "system" | "ticket" | "asset" | "sms" | "call") => {
    const newActivity: RecentActivity = {
      id: `act-${Date.now()}`,
      timestamp: "Just now",
      description: logText,
      type,
      user: currentAgent
    };
    fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newActivity)
    })
    .then(r => r.json())
    .then(saved => setActivities((prev) => [saved, ...prev]))
    .catch(console.error);
  };

  const handleAddManageUser = (u: any) => {
    fetch("/api/manage/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(u)
    })
    .then(r => r.json())
    .then(saved => setManageUsers((prev) => [...prev, saved]))
    .catch(console.error);

    handleAddActivityLog(`New user '${u.username || u.email}' added to system registry.`, "system");
  };

  const handleDeleteManageUser = (id: string) => {
    fetch(`/api/manage/users/${id}`, { method: "DELETE" })
    .then(() => setManageUsers((prev) => prev.filter((u) => u.id !== id)))
    .catch(console.error);

    handleAddActivityLog(`User removed from system registry.`, "system");
  };

  const handleSaveEmailSettings = (s: any) => {
    fetch("/api/manage/email-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s)
    })
    .then(r => r.json())
    .then(saved => setEmailSettings(saved))
    .catch(console.error);

    handleAddActivityLog("Email server configurations updated in database.", "system");
  };

  const handleAddSmsTemplate = (t: any) => {
    fetch("/api/manage/sms-templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t)
    })
    .then(r => r.json())
    .then(saved => setSmsTemplates((prev) => [...prev, saved]))
    .catch(console.error);

    handleAddActivityLog(`SMS keyword template '${t.name}' registered.`, "system");
  };

  const handleDeleteSmsTemplate = (id: string) => {
    fetch(`/api/manage/sms-templates/${id}`, { method: "DELETE" })
    .then(() => setSmsTemplates((prev) => prev.filter((t) => t.id !== id)))
    .catch(console.error);

    handleAddActivityLog(`SMS template removed.`, "system");
  };

  const handleAddCompany = (c: any) => {
    fetch("/api/manage/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c)
    })
    .then(r => r.json())
    .then(saved => setManageCompanies((prev) => [...prev, saved]))
    .catch(console.error);

    handleAddActivityLog(`Company account '${c.name}' registered.`, "system");
  };

  const handleDeleteCompany = (id: string) => {
    fetch(`/api/manage/companies/${id}`, { method: "DELETE" })
    .then(() => setManageCompanies((prev) => prev.filter((c) => c.id !== id)))
    .catch(console.error);

    handleAddActivityLog(`Company account removed.`, "system");
  };

  const handleAddLocation = (l: any) => {
    fetch("/api/manage/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(l)
    })
    .then(r => r.json())
    .then(saved => setManageLocations((prev) => [...prev, saved]))
    .catch(console.error);

    handleAddActivityLog(`Enterprise location '${l.name}' added.`, "system");
  };

  const handleDeleteLocation = (id: string) => {
    fetch(`/api/manage/locations/${id}`, { method: "DELETE" })
    .then(() => setManageLocations((prev) => prev.filter((l) => l.id !== id)))
    .catch(console.error);

    handleAddActivityLog(`Enterprise location removed from registry.`, "system");
  };

  const handleAddRule = (r: any) => {
    fetch("/api/manage/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r)
    })
    .then(r => r.json())
    .then(saved => setDispatchRules((prev) => [...prev, { ...saved, locationsList: saved.locationsList || [], personnelsList: saved.personnelsList || [] }]))
    .catch(console.error);

    handleAddActivityLog(`Location Dispatch Rule '${r.name}' established.`, "system");
  };

  const handleDeleteRule = (id: string) => {
    fetch(`/api/manage/rules/${id}`, { method: "DELETE" })
    .then(() => setDispatchRules((prev) => prev.filter((r) => r.id !== id)))
    .catch(console.error);

    handleAddActivityLog(`Dispatch rule deleted.`, "system");
  };

  const handleAddDepartment = (d: any) => {
    fetch("/api/manage/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(d)
    })
    .then(r => r.json())
    .then(saved => setManageDepartments((prev) => [...prev, saved]))
    .catch(console.error);

    handleAddActivityLog(`Support department '${d.name}' registered.`, "system");
  };

  const handleDeleteDepartment = (id: string) => {
    fetch(`/api/manage/departments/${id}`, { method: "DELETE" })
    .then(() => setManageDepartments((prev) => prev.filter((d) => d.id !== id)))
    .catch(console.error);

    handleAddActivityLog(`Department removed.`, "system");
  };

  const handleAddBrand = (b: any) => {
    fetch("/api/manage/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(b)
    })
    .then(r => r.json())
    .then(saved => setManageBrands((prev) => [...prev, saved]))
    .catch(console.error);

    handleAddActivityLog(`Hardware brand model '${b.name}' added under '${b.department}'.`, "system");
  };

  const handleDeleteBrand = (id: string) => {
    fetch(`/api/manage/brands/${id}`, { method: "DELETE" })
    .then(() => setManageBrands((prev) => prev.filter((b) => b.id !== id)))
    .catch(console.error);

    handleAddActivityLog(`Brand removed from system inventory index.`, "system");
  };

  const handleAddTimeMotionRule = (r: any) => {
    fetch("/api/manage/time-motion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(r)
    })
    .then(r => r.json())
    .then(saved => setTimeMotionRules((prev) => [...prev, saved]))
    .catch(console.error);

    handleAddActivityLog(`Time and Motion duration check rule '${r.variable}' defined.`, "system");
  };

  const handleDeleteTimeMotionRule = (id: string) => {
    fetch(`/api/manage/time-motion/${id}`, { method: "DELETE" })
    .then(() => setTimeMotionRules((prev) => prev.filter((r) => r.id !== id)))
    .catch(console.error);

    handleAddActivityLog(`Time and Motion rule parameter deleted.`, "system");
  };

  const handleAddTicketServiceType = (t: any) => {
    fetch("/api/manage/ticket-services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(t)
    })
    .then(r => r.json())
    .then(saved => setTicketServiceTypes((prev) => [...prev, saved]))
    .catch(console.error);

    handleAddActivityLog(`Support classification service type '${t.name}' registered.`, "system");
  };

  const handleDeleteTicketServiceType = (id: string) => {
    fetch(`/api/manage/ticket-services/${id}`, { method: "DELETE" })
    .then(() => setTicketServiceTypes((prev) => prev.filter((t) => t.id !== id)))
    .catch(console.error);

    handleAddActivityLog(`Support service type removed from system parameters.`, "system");
  };

  // Render main viewport dynamically based on sidebar's activeView route
  const renderViewContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <DashboardView
            tickets={tickets}
            activities={activities}
            onNavigate={setActiveView}
            onFilterStatus={setFilteredStatus}
            onAddLog={(text, type) => handleAddActivityLog(text, type)}
          />
        );

      case "tickets_list":
        return (
          <TicketsListView
            tickets={tickets}
            currentAgent={currentAgent}
            onUpdateTicket={handleUpdateTicket}
            filteredStatus={filteredStatus}
            onClearFilteredStatus={() => setFilteredStatus(null)}
          />
        );

      case "tickets_new":
        return (
          <NewTicketView
            onAddTicket={handleAddTicket}
            onNavigate={setActiveView}
          />
        );

      case "mayday_feeds":
        return <MaydayFeedsView feeds={initialFeeds} />;

      case "mayday_beacon":
        return (
          <MaydayBeaconView
            tickets={tickets}
            onNavigate={setActiveView}
            onFilterStatus={setFilteredStatus}
          />
        );

      case "mayday_calls":
        return <MaydayCallsView calls={calls} onNavigate={setActiveView} />;

      case "mayday_sms":
        return <MaydaySmsView smsList={smsList} onReplyToSms={handleReplyToSms} />;

      case "assets_list":
        return <AssetsListView assets={assets} onAddAsset={handleAddAsset} />;

      case "assets_warranties":
        return <AssetsWarrantiesView warranties={warranties} onAddWarranty={handleAddWarranty} />;

      // Reports - SISSA STATUS
      case "reports_sissa_status":
        return <SISSAStatusReportView tickets={tickets} />;

      // Reports - AGENT WORKLOAD STATUS
      case "reports_agent_status":
        return <AgentStatusReportView tickets={tickets} />;

      // Reports - PERSONNEL AUDIT
      case "reports_personnel_status":
        return <PersonnelStatusReportView tickets={tickets} />;

      case "reports_export_personnel":
        return <ExportPersonnelStatusReportView tickets={tickets} />;

      case "reports_export_company":
        return <ExportCompanyStatusReportView tickets={tickets} />;

      case "reports_personnel_tickets":
        return <PersonnelTicketsReportView tickets={tickets} />;

      case "reports_company_tickets":
        return <CompanyTicketsReportView tickets={tickets} />;

      case "manage_settings":
        return (
          <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB] font-sans space-y-8">
            <div className="border-b border-gray-200 pb-5 flex justify-between items-start">
              <div>
                <h2 className="text-4xl font-extralight text-gray-800 tracking-tight">Support Settings</h2>
                <p className="text-xs text-gray-400 mt-1">Configure general, security, and diagnostic variables for SISSA.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Form Controls parameters */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
                <h3 className="text-sm font-semibold text-gray-800 tracking-tight border-b pb-2 flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-[#E15B39]" />
                  <span>Interactive Operational Limits</span>
                </h3>

                <div className="space-y-4 text-xs font-medium text-gray-600">
                  <div className="space-y-1">
                    <label className="block text-gray-700 font-bold">Standard SLA Resolution Limit</label>
                    <select
                      value={slaLimit}
                      onChange={(e) => setSlaLimit(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded py-2 px-3 focus:outline-none"
                    >
                      <option value="24 Hours">24 Hours (Urgent)</option>
                      <option value="48 Hours">48 Hours (Standard)</option>
                      <option value="72 Hours">72 Hours (Deferred)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700 font-bold">Emergency Dispatch Phone Link</label>
                    <input
                      type="text"
                      value={alertPhone}
                      onChange={(e) => setAlertPhone(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded py-2 px-3 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700 font-bold">Technical Director Email Address</label>
                    <input
                      type="text"
                      value={techMail}
                      onChange={(e) => setTechMail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded py-1.5 px-3 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => alert("SLA support parameters have been persisted to system memory contexts.")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded transition text-center cursor-pointer"
                  >
                    Persist Settings
                  </button>
                </div>
              </div>

              {/* PHP STACK ALIGNMENT INFORMATION CARD (Incredibly helpful & solves user tech requirements) */}
              <div className="bg-[#212324] text-white rounded-lg border border-gray-800 shadow-md p-6 space-y-5">
                <h3 className="text-sm font-semibold tracking-tight text-white border-b border-gray-800 pb-2 flex items-center space-x-2 font-mono">
                  <Database className="w-4 h-4 text-[#E15B39]-500" />
                  <span className="text-slate-300">Legacy Architecture Info</span>
                </h3>

                <div className="space-y-3 text-xs text-gray-400 font-sans leading-relaxed">
                  <p>
                    This is an active React/TypeScript clone of the legacy <span className="text-white font-semibold flex-inline">SISSA Support Station MVC</span> framework. The original application stack was structured around:
                  </p>
                  <ul className="space-y-1 pl-4 list-disc font-mono text-[11px] text-[#E15B39]">
                    <li>Mustache.js for reactive view templates compile</li>
                    <li>template.html for raw element grids and maps</li>
                    <li>PDO & Idiorm ORM for PostgreSQL schemas operations</li>
                    <li>index.php & function.php routing engine</li>
                  </ul>
                  <p className="text-[11px]">
                    To review the mapping schema or examine standard SQL connections, toggle the interactive stack reference inspector below!
                  </p>
                </div>
              </div>
            </div>

            {/* HIGH-FIDELITY INTERACTIVE LEGACY PHP STACK CODE REFERENCE INSPECTOR (Mustache.js, template.html, pdo, idiorm, index.php, function.php) */}
            <div className="bg-[#18191B] border border-gray-800 rounded-lg shadow-xl overflow-hidden text-token">
              {/* Terminal header */}
              <div className="bg-gray-900 border-b border-gray-800 px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-emerald-500 animate-pulse font-mono" />
                  <span className="font-mono text-gray-300 font-semibold uppercase tracking-wider text-[11px]">Legacy Source Inspector</span>
                </div>

                {/* Tab selections */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono">
                  {(["index", "function", "mustache", "idiorm"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveCodeTab(tab)}
                      className={`px-3 py-1 text-[11px] rounded transition-all cursor-pointer ${
                        activeCodeTab === tab
                          ? "bg-[#2E3033] text-[#E15B39] font-bold border border-gray-700/80"
                          : "text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {tab === "index"
                        ? "index.php"
                        : tab === "function"
                        ? "function.php"
                        : tab === "mustache"
                        ? "template.html"
                        : "PDO / Idiorm schema"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Render block */}
              <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto max-h-96">
                {activeCodeTab === "index" && (
                  <pre className="text-[11px] text-green-400/95">
{`<?php
/**
 * SISSA Support Suite - MVC Core Router Gateway
 * @license Apache-2.0
 */

require_once 'function.php';

// Parse query segments
$action = isset($_GET['action']) ? trim($_GET['action']) : 'dashboard';

switch ($action) {
    case 'dashboard':
        $tickets = ORM::for_table('tickets')->order_by_desc('created_at')->find_many();
        $activities = ORM::for_table('activities')->order_by_desc('timestamp')->limit(10)->find_many();
        render_mustache_view('dashboard', [
            'tickets' => $tickets, 
            'activities' => $activities,
            'operator' => CURRENT_SUPPORT_AGENT
        ]);
        break;

    case 'add_ticket':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $ticket = ORM::for_table('tickets')->create();
            $ticket->title = $_POST['title'];
            $ticket->brand = $_POST['brand'];
            $ticket->requester = $_POST['requester'];
            $ticket->description = $_POST['description'];
            $ticket->status = 'Open';
            $ticket->save();
            header('Location: index.php?action=tickets_list');
            exit;
        }
        render_mustache_view('new_ticket');
        break;

    default:
        render_mustache_view('404');
        break;
}`}
                  </pre>
                )}

                {activeCodeTab === "function" && (
                  <pre className="text-[11px] text-blue-400">
{`<?php
/**
 * Helper methods, bootstrapping and db config context
 */

require_once 'vendor/autoload.php'; // load Idiorm micro-ORM & Mustache

define('CURRENT_SUPPORT_AGENT', 'Endless Waltz');

try {
    // 1. Raw PDO connection initiation
    $db_connection_string = "pgsql:host=sissa-postgres;port=5432;dbname=sissa_support_desk";
    $pdo = new PDO($db_connection_string, 'sissa_admin', 'SissaSecure@2026');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 2. Idiorm bootstrapping using standard PDO descriptor
    ORM::set_db($pdo);
    ORM::configure('logging', true);

} catch (PDOException $e) {
    error_log("Database Connection Failed: " . $e->getMessage());
    die("SISSA Operational Terminal Connection Error: Gateway Offline.");
}

/**
 * Render HTML via mustache.js templates
 */
function render_mustache_view($view_name, $parameters = []) {
    $template_content = file_get_contents('template.html');
    $mustache_engine = new Mustache_Engine([
        'entity_flags' => ENT_QUOTES,
        'escape' => function($value) {
            return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
        }
    ]);
    
    echo $mustache_engine->render($template_content, array_merge($parameters, [
        'active_view' => $view_name,
        'system_agent' => CURRENT_SUPPORT_AGENT
    ]));
}`}
                  </pre>
                )}

                {activeCodeTab === "mustache" && (
                  <pre className="text-[11px] text-yellow-400/90">
{`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SISSA Mustache Blueprint Grid</title>
</head>
<body>
    <!-- Mustache UI Component render bounds -->
    <div id="support-grid-app">
        {{#active_dashboard}}
            <h2>Ticket Overview</h2>
            <div className="status-grid">
                {{#tickets}}
                    <div class="card card-{{status}}">
                        <h3>{{title}}</h3>
                        <p>Brand: {{brand}} • Requester: {{requester}}</p>
                        <p>{{description}}</p>
                    </div>
                {{/tickets}}
            </div>
        {{/active_dashboard}}

        {{#active_new_ticket}}
            <h2>Create New Support Order</h2>
            <form action="index.php?action=add_ticket" method="POST">
                <input type="text" name="brand" placeholder="Device Brand" required />
                <input type="text" name="title" placeholder="Ticket Summary" required />
                <textarea name="description" placeholder="Issue Diagnostics" required></textarea>
                <button type="submit">Deploy Incident Log Page</button>
            </form>
        {{/active_new_ticket}}
    </div>
</body>
</html>`}
                  </pre>
                )}

                {activeCodeTab === "idiorm" && (
                  <pre className="text-[11px] text-[#E15B39]">
{`/**
 * Comparing raw SQL PDO queries with Idiorm Micro-ORM models:
 */

// A. Standard raw SQL PDO query
$sql = "SELECT * FROM tickets WHERE status = :status AND priority = :priority";
$stmt = $pdo->prepare($sql);
$stmt->execute(['status' => 'Open', 'priority' => 'High']);
$critical_raw_records = $stmt->fetchAll(PDO::FETCH_ASSOC);

// B. Same database execution mapped using Idiorm Object Relation model
$critical_orm_records = ORM::for_table('tickets')
    ->where('status', 'Open')
    ->where('priority', 'High')
    ->find_many();

// C. Adding active hardware warrant covers
$warranty = ORM::for_table('warranties')->create();
$warranty->tag       = 'SIS-LPT-8022';
$warranty->asset     = 'HP ProBook Laptop Pro';
$warranty->serial_no = 'HP-8891-AAX';
$warranty->purchase  = '2025-01-10';
$warranty->covered   = 'Full Covered (Parts+Labor)';
$warranty->expiration= '2027-01-10';
$warranty->save();`}
                  </pre>
                )}
              </div>
            </div>
          </div>
        );

      case "manage_users":
        return (
          <ManageUsersView
            users={manageUsers}
            companies={manageCompanies.map((c) => c.name)}
            departments={manageDepartments.map((d) => d.name)}
            onAddUser={handleAddManageUser}
            onDeleteUser={handleDeleteManageUser}
          />
        );

      case "manage_emails":
        return (
          <ManageEmailsView
            settings={emailSettings}
            onSaveSettings={handleSaveEmailSettings}
          />
        );

      case "manage_sms_templates":
        return (
          <ManageSmsTemplatesView
            templates={smsTemplates}
            onAddTemplate={handleAddSmsTemplate}
            onDeleteTemplate={handleDeleteSmsTemplate}
          />
        );

      case "manage_companies":
        return (
          <ManageCompaniesView
            companies={manageCompanies}
            onAddCompany={handleAddCompany}
            onDeleteCompany={handleDeleteCompany}
          />
        );

      case "manage_locations":
        return (
          <ManageLocationsView
            locations={manageLocations}
            companies={manageCompanies.map((c) => c.name)}
            onAddLocation={handleAddLocation}
            onDeleteLocation={handleDeleteLocation}
          />
        );

      case "manage_location_dispatch":
        return (
          <ManageLocationDispatchView
            rules={dispatchRules}
            companies={manageCompanies.map((c) => c.name)}
            locations={manageLocations.map((l) => l.name)}
            personnels={manageUsers
              .filter((u) => u.role === "Personnel" || u.role === "Administrator")
              .map((u) => (u.firstname ? `${u.firstname} ${u.lastname}` : u.username || "Operator"))}
            onAddRule={handleAddRule}
            onDeleteRule={handleDeleteRule}
          />
        );

      case "manage_departments":
        return (
          <ManageDepartmentsView
            departments={manageDepartments}
            onAddDepartment={handleAddDepartment}
            onDeleteDepartment={handleDeleteDepartment}
          />
        );

      case "manage_brands":
        return (
          <ManageBrandsView
            brands={manageBrands}
            departments={manageDepartments.map((d) => d.name)}
            onAddBrand={handleAddBrand}
            onDeleteBrand={handleDeleteBrand}
          />
        );

      case "manage_time_motion":
        return (
          <ManageTimeMotionRulesView
            rules={timeMotionRules}
            onAddRule={handleAddTimeMotionRule}
            onDeleteRule={handleDeleteTimeMotionRule}
          />
        );

      case "manage_ticket_services":
        return (
          <ManageTicketServiceTypesView
            types={ticketServiceTypes}
            onAddType={handleAddTicketServiceType}
            onDeleteType={handleDeleteTicketServiceType}
          />
        );

      default:
        return (
          <div className="p-8 text-center text-gray-400 text-xs">
            Section is under engineering. Redirecting to workspace...
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Brand Navigation Panel */}
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        searchTerm={globalSearchTerm}
        onSearchChange={setGlobalSearchTerm}
      />

      {/* Main Workspace Frame container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header toolbar */}
        <Header
          currentAgent={currentAgent}
          onAgentChange={setCurrentAgent}
          userEmail={userEmail}
        />

        {/* Viewport content */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {renderViewContent()}
        </div>
      </div>
    </div>
  );
}
