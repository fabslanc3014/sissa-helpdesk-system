/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TicketRef,
  TicketStatus,
  TicketPriority,
  RecentActivity,
  MaydayFeed,
  CallLog,
  SMSMessage,
  HardwareAsset,
  WarrantyRecord
} from "./types";

export const COMPANIES = [
  "I686 Online Shop",
  "SISSA Corp Philippines",
  "Avasia Online Services",
  "HP Authorized Services",
  "Makati Logistics Hub"
];

export const LOCATIONS = [
  "Manila Head Office",
  "Quezon City Branch",
  "Makati Tech District",
  "Pasig Warehouse",
  "Ortigas Customer Center"
];

export const REQUESTERS = [
  "Lance Fabregas",
  "Isabella Torres",
  "Christian Santos",
  "Theresa Lim",
  "Ramon Valenzuela"
];

export const AGENTS = [
  "Endless Waltz",
  "System Autopilot",
  "Admin Support",
  "Support Desk 02"
];

export const initialTickets: TicketRef[] = [
  {
    id: "2605261",
    title: "#2605261 Repair",
    brand: "HP",
    requester: "Lance Fabregas",
    agent: "Unclaimed",
    priority: TicketPriority.Medium,
    status: TicketStatus.Open,
    createdAt: "2026-05-27T08:30:00Z",
    createdDaysAgo: 12,
    company: "I686 Online Shop",
    location: "Manila Head Office",
    referenceNo: "REF-2026-9938",
    description: "HP Pavilion Laptop screen flickering continuously after booting up. Issue started right after a system update. External display works fine, but the built-in monitor experiences display distortion.",
    remarks: [
      "Customer called to verify dispatch status. Out of stock on replacement screen assembly.",
      "Pending approval from technical lead."
    ],
    tags: ["No quick response", "Overdue by 9 days"]
  },
  {
    id: "2605262",
    title: "#2605262 Printer Network Config",
    brand: "Epson",
    requester: "Theresa Lim",
    agent: "Endless Waltz",
    priority: TicketPriority.Low,
    status: TicketStatus.Acknowledged,
    createdAt: "2026-06-05T10:15:00Z",
    createdDaysAgo: 3,
    company: "SISSA Corp Philippines",
    location: "Quezon City Branch",
    referenceNo: "EPS-99120",
    description: "Office model L3150 printer lost WiFi connectivity. Need static IP reassignment on the secondary router pool.",
    remarks: ["Assigned to desk - primary subnet ping successful."],
    tags: ["Network Sync"]
  },
  {
    id: "2605263",
    title: "#2605263 Server Cabinet Fault",
    brand: "APC",
    requester: "Christian Santos",
    agent: "Admin Support",
    priority: TicketPriority.High,
    status: TicketStatus.Updated,
    createdAt: "2026-06-07T14:20:00Z",
    createdDaysAgo: 1,
    company: "Pasig Warehouse",
    location: "Pasig Warehouse",
    referenceNo: "APC-00192",
    description: "Server cabinet UPS sounding a buzzer alarm. Battery replacement required due to voltage degradation alerts from telemetry module.",
    remarks: ["Informed building operations team for power shutoff notification."],
    tags: ["Critical Battery"]
  },
  {
    id: "2605264",
    title: "#2605264 POS Terminal Lockup",
    brand: "Toshiba",
    requester: "Ramon Valenzuela",
    agent: "Endless Waltz",
    priority: TicketPriority.High,
    status: TicketStatus.Suspended,
    createdAt: "2026-06-02T16:45:00Z",
    createdDaysAgo: 6,
    company: "I686 Online Shop",
    location: "Ortigas Customer Center",
    referenceNo: "TOS-POS-88",
    description: "Main Cash Register terminal freezes upon payment completion action. Transaction records not uploading to the central ERP backend database.",
    remarks: ["Suspended pending software patch deploy from developer team."],
    tags: ["ERP Delay", "POS Offline"]
  },
  {
    id: "2605265",
    title: "#2605265 Routine Router Reload",
    brand: "Cisco",
    requester: "Isabella Torres",
    agent: "Support Desk 02",
    priority: TicketPriority.Low,
    status: TicketStatus.Resolved,
    createdAt: "2026-06-01T09:00:00Z",
    createdDaysAgo: 7,
    company: "Makati Logistics Hub",
    location: "Makati Tech District",
    referenceNo: "CIS-8812",
    description: "Weekly clear down of DHCP logs and system memory dump flush requested for router cluster.",
    remarks: ["Logs packed and compressed. Successfully flushed router caches."],
    tags: ["Completed Cycle"]
  }
];

export const initialActivities: RecentActivity[] = [
  {
    id: "act-1",
    timestamp: "10 mins ago",
    description: "Ticket #2605261 was updated by Endless Waltz",
    type: "ticket",
    user: "Endless Waltz"
  },
  {
    id: "act-2",
    timestamp: "1 hour ago",
    description: "New call logged from +63 917 555 1204 - Ramon Valenzuela",
    type: "call",
    user: "System Autopilot"
  },
  {
    id: "act-3",
    timestamp: "3 hours ago",
    description: "Asset SIS-LPT-8022 (HP ProBook) warranty marked as active",
    type: "asset",
    user: "Admin Support"
  },
  {
    id: "act-4",
    timestamp: "1 day ago",
    description: "SMS alert: 'Emergency main database maintenance complete'",
    type: "sms",
    user: "System Autopilot"
  },
  {
    id: "act-5",
    timestamp: "2 days ago",
    description: "Ticket #2605264 status set to Suspended by Endless Waltz",
    type: "ticket",
    user: "Endless Waltz"
  },
  {
    id: "act-6",
    timestamp: "3 days ago",
    description: "New warranty added for Epson L3150 network printer",
    type: "asset",
    user: "Theresa Lim"
  }
];

export const initialFeeds: MaydayFeed[] = [
  {
    id: "feed-1",
    timestamp: "2026-06-08T03:00:00Z",
    title: "Primary ERP Node Latency Alert",
    message: "ERP database experiences elevated CPU throttling. API response latencies spiking at 2400ms across Quezon City warehouse.",
    severity: "warning",
    source: "APM Monitor"
  },
  {
    id: "feed-2",
    timestamp: "2026-06-07T21:44:00Z",
    title: "UPS Power Drop Pasig",
    message: "Critical UPS cabinet APC-UPS-12 in Pasig reports failure cell voltage. Automatic backup engaged safely.",
    severity: "danger",
    source: "Telemetry Module"
  },
  {
    id: "feed-3",
    timestamp: "2026-06-07T12:00:00Z",
    title: "Manila Gateway Sync Update",
    message: "Main office ISP changed backup line successfully without loss of IP routing tables.",
    severity: "info",
    source: "Cisco Firewall"
  },
  {
    id: "feed-4",
    timestamp: "2026-06-06T15:30:00Z",
    title: "Asset Ledger Backup Succeeded",
    message: "All warranty records, hardware tags, and customer reports serialized to backup node in deep cold cold storage.",
    severity: "info",
    source: "S3 Archivist"
  }
];

export const initialCalls: CallLog[] = [
  {
    id: "call-1",
    callerName: "Ramon Valenzuela",
    phoneNumber: "+63 917 555 1204",
    timestamp: "2026-06-08T02:10:00Z",
    duration: "03:14",
    status: "Answered",
    transcription: "Hello? Yes, the cash terminal registers are freezing again on card checkout. Please check the ERP API state immediately since shoppers are waiting."
  },
  {
    id: "call-2",
    callerName: "Lance Fabregas",
    phoneNumber: "+63 908 443 6612",
    timestamp: "2026-06-07T11:45:00Z",
    duration: "01:52",
    status: "Answered",
    transcription: "Calling regarding ticket #2605261. I want to check if the HP laptop visual screen replacement assembly is already available. Thanks."
  },
  {
    id: "call-3",
    callerName: "Unknown Caller",
    phoneNumber: "+63 922 108 0055",
    timestamp: "2026-06-06T18:12:00Z",
    duration: "00:00",
    status: "Missed"
  },
  {
    id: "call-4",
    callerName: "Theresa Lim",
    phoneNumber: "+63 915 222 8819",
    timestamp: "2026-06-05T09:30:00Z",
    duration: "05:40",
    status: "Answered",
    transcription: "The Epson printing node is completely refusing static assignment inside the secondary network router. We need a manual dispatch if possible."
  }
];

export const initialSMS: SMSMessage[] = [
  {
    id: "sms-1",
    senderName: "Lance Fabregas",
    phoneNumber: "+63 908 443 6612",
    timestamp: "2026-06-08T01:50:00Z",
    messageText: "Hi there, is there any update on my HP repair ticket 2605261? I need the device urgently for shop work this week.",
    replies: [
      { sender: "Endless Waltz", text: "Hi Lance, we are awaiting leader approval and procurement of the screen element. Will ping you soon.", timestamp: "2026-06-08T02:00:00Z" }
    ]
  },
  {
    id: "sms-2",
    senderName: "Christian Santos",
    phoneNumber: "+63 933 112 0048",
    timestamp: "2026-06-07T15:10:00Z",
    messageText: "Pasig Cabinet battery is still buzzing. Please expedite dispatch. Safety threshold triggers state warning.",
    replies: []
  },
  {
    id: "sms-3",
    senderName: "Isabella Torres",
    phoneNumber: "+63 945 889 0112",
    timestamp: "2026-06-01T08:45:00Z",
    messageText: "Logs backup requested for Cisco routers on Makati Node. Pls reply.",
    replies: [
      { sender: "Support Desk 02", text: "Copy that, setting up weekly backup pipeline now.", timestamp: "2026-06-01T09:10:00Z" }
    ]
  }
];

export const initialAssets: HardwareAsset[] = [
  {
    id: "ast-1",
    tag: "SIS-LPT-8022",
    assetName: "HP ProBook Laptop Pro",
    brand: "HP",
    model: "ProBook 440 G8",
    serialNo: "HP-8891-AAX",
    purchaseDate: "2025-01-10",
    location: "Manila Head Office",
    coveredAmount: "₱45,000",
    expirationDate: "2027-01-10",
    assignedUser: "Lance Fabregas",
    status: "Active"
  },
  {
    id: "ast-2",
    tag: "SIS-PRN-0209",
    assetName: "Epson Inkjet L3150",
    brand: "Epson",
    model: "L3150 L-Series",
    serialNo: "EPS-99120-ZZ",
    purchaseDate: "2024-06-15",
    location: "Quezon City Branch",
    coveredAmount: "₱12,500",
    expirationDate: "2026-06-15",
    assignedUser: "Theresa Lim",
    status: "Active"
  },
  {
    id: "ast-3",
    tag: "SIS-UPS-4491",
    assetName: "APC Smart-UPS SMT1500",
    brand: "APC",
    model: "SMT1500-Smart",
    serialNo: "APC-00192-V",
    purchaseDate: "2023-11-20",
    location: "Pasig Warehouse",
    coveredAmount: "₱58,000",
    expirationDate: "2025-11-20",
    assignedUser: "Christian Santos",
    status: "In Repair"
  },
  {
    id: "ast-4",
    tag: "SIS-POS-1029",
    assetName: "Toshiba SurePOS 500",
    brand: "Toshiba",
    model: "POS-500-Retail",
    serialNo: "TOS-POS-88-M",
    purchaseDate: "2024-03-01",
    location: "Ortigas Customer Center",
    coveredAmount: "₱38,000",
    expirationDate: "2026-03-01",
    assignedUser: "Ramon Valenzuela",
    status: "Active"
  },
  {
    id: "ast-5",
    tag: "SIS-RTR-0045",
    assetName: "Cisco ISR 4331 Router",
    brand: "Cisco",
    model: "ISR 4331-K9",
    serialNo: "CIS-8812-Y7",
    purchaseDate: "2023-01-15",
    location: "Makati Tech District",
    coveredAmount: "₱120,000",
    expirationDate: "2026-01-15",
    assignedUser: "Isabella Torres",
    status: "Active"
  }
];

export const initialWarranties: WarrantyRecord[] = [
  {
    id: "w-1",
    tag: "SIS-LPT-8022",
    asset: "HP ProBook Laptop Pro",
    serialNo: "HP-8891-AAX",
    purchase: "2025-01-10",
    covered: "Full Covered (Parts+Labor)",
    expiration: "2027-01-10"
  },
  {
    id: "w-2",
    tag: "SIS-PRN-0209",
    asset: "Epson Inkjet L3150",
    serialNo: "EPS-99120-ZZ",
    purchase: "2024-06-15",
    covered: "Standard (Parts only)",
    expiration: "2026-06-15"
  },
  {
    id: "w-3",
    tag: "SIS-UPS-4491",
    asset: "APC Smart-UPS SMT1500",
    serialNo: "APC-00192-V",
    purchase: "2023-11-20",
    covered: "Enterprise Bronze Care",
    expiration: "2025-11-20"
  },
  {
    id: "w-4",
    tag: "SIS-POS-1029",
    asset: "Toshiba SurePOS 500",
    serialNo: "TOS-POS-88-M",
    purchase: "2024-03-01",
    covered: "Active Warranty (Labor only)",
    expiration: "2026-03-01"
  },
  {
    id: "w-5",
    tag: "SIS-RTR-0045",
    asset: "Cisco ISR 4331 Router",
    serialNo: "CIS-8812-Y7",
    purchase: "2023-01-15",
    covered: "Cisco SmartNet 8x5xNBD",
    expiration: "2026-01-15"
  }
];
