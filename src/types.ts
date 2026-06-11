/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TicketStatus {
  Open = "Open",
  Acknowledged = "Acknowledged",
  Updated = "Updated",
  Suspended = "Suspended",
  Resolved = "Resolved",
  Closed = "Closed"
}

export enum TicketPriority {
  Low = "Low",
  Medium = "Medium",
  High = "High"
}

export interface TicketRef {
  id: string;
  title: string;
  brand: string;
  requester: string;
  agent: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string; // ISO string or relative descriptions
  createdDaysAgo: number;
  company: string;
  location: string;
  referenceNo?: string;
  description: string;
  remarks: string[];
  tags: string[];
  ticket_number?: string;
  agent_uid?: string;
  contact_uid?: string;
  company_uid?: string;
  store_uid?: string;
  support_uid?: string;
  problem?: string;
  action?: string;
  file_uid?: number;
  date_created?: string;
  date_modified?: string;
  date_resolved?: string | null;
}

export interface RecentActivity {
  id: string;
  timestamp: string;
  description: string;
  type: "ticket" | "asset" | "system" | "sms" | "call";
  user: string;
}

export interface MaydayFeed {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "danger";
  source: string;
}

export interface CallLog {
  id: string;
  callerName: string;
  phoneNumber: string;
  timestamp: string;
  duration: string; // e.g. "02:45"
  recordingUrl?: string;
  transcription?: string;
  status: "Answered" | "Missed" | "In Progress";
}

export interface SMSMessage {
  id: string;
  senderName: string;
  phoneNumber: string;
  timestamp: string;
  messageText: string;
  replies: { sender: string; text: string; timestamp: string }[];
}

export interface HardwareAsset {
  id: string;
  tag: string;
  assetName: string;
  brand: string;
  model: string;
  serialNo: string;
  purchaseDate: string;
  location: string;
  coveredAmount: string;
  expirationDate: string;
  assignedUser: string;
  status: "Active" | "In Repair" | "Retired";
}

export interface WarrantyRecord {
  id: string;
  tag: string;
  asset: string;
  serialNo: string;
  purchase: string; // Purchase date
  covered: string; // Yes / No or coverage details
  expiration: string;
}
