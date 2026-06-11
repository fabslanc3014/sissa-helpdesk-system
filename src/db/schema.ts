import { pgTable, text, integer, jsonb } from "drizzle-orm/pg-core";

// 1. Tickets Table
export const tickets = pgTable("tickets", {
  id: text("id").primaryKey(),
  title: text("title"),
  brand: text("brand"),
  requester: text("requester"),
  agent: text("agent"),
  priority: text("priority"),
  status: text("status"),
  createdAt: text("created_at"),
  createdDaysAgo: integer("created_days_ago"),
  company: text("company"),
  location: text("location"),
  referenceNo: text("reference_no"),
  description: text("description"),
  remarks: jsonb("remarks"), // string[]
  tags: jsonb("tags"), // string[]
  ticket_number: text("ticket_number"),
  agent_uid: text("agent_uid"),
  contact_uid: text("contact_uid"),
  company_uid: text("company_uid"),
  store_uid: text("store_uid"),
  support_uid: text("support_uid"),
  problem: text("problem"),
  action: text("action"),
  file_uid: integer("file_uid"),
  date_created: text("date_created"),
  date_modified: text("date_modified"),
  date_resolved: text("date_resolved"),
});

// 2. Recent Activities Table
export const activities = pgTable("activities", {
  id: text("id").primaryKey(),
  timestamp: text("timestamp"),
  description: text("description"),
  type: text("type"),
  user: text("user"),
});

// 3. Mayday Feeds Table
export const feeds = pgTable("feeds", {
  id: text("id").primaryKey(),
  timestamp: text("timestamp"),
  title: text("title"),
  message: text("message"),
  severity: text("severity"),
  source: text("source"),
});

// 4. Call Logs Table
export const callLogs = pgTable("call_logs", {
  id: text("id").primaryKey(),
  callerName: text("caller_name"),
  phoneNumber: text("phone_number"),
  timestamp: text("timestamp"),
  duration: text("duration"),
  status: text("status"),
  transcription: text("transcription"),
});

// 5. SMS Messages Table
export const smsMessages = pgTable("sms_messages", {
  id: text("id").primaryKey(),
  senderName: text("sender_name"),
  phoneNumber: text("phone_number"),
  timestamp: text("timestamp"),
  messageText: text("message_text"),
  replies: jsonb("replies"), // Array of { sender, text, timestamp }
});

// 6. Assets Table
export const assets = pgTable("assets", {
  id: text("id").primaryKey(),
  tag: text("tag").unique(),
  assetName: text("asset_name"),
  brand: text("brand"),
  model: text("model"),
  serialNo: text("serial_no"),
  purchaseDate: text("purchase_date"),
  location: text("location"),
  coveredAmount: text("covered_amount"),
  expirationDate: text("expiration_date"),
  assignedUser: text("assigned_user"),
  status: text("status"),
});

// 7. Warranties Table
export const warranties = pgTable("warranties", {
  id: text("id").primaryKey(),
  tag: text("tag"),
  asset: text("asset"),
  serialNo: text("serial_no"),
  purchase: text("purchase"),
  covered: text("covered"),
  expiration: text("expiration"),
});

// 8. Manage Users Table
export const manageUsers = pgTable("manage_users", {
  id: text("id").primaryKey(),
  username: text("username"),
  firstname: text("firstname"),
  lastname: text("lastname"),
  company: text("company"),
  role: text("role"),
  department: text("department"),
  contactNo: text("contact_no"),
  email: text("email"),
});

// 9. Email Settings Table (Single-row or persistent setup)
export const emailSettings = pgTable("email_settings", {
  id: text("id").primaryKey(),
  email: text("email"),
  smtpServer: text("smtp_server"),
  smtpPort: text("smtp_port"),
  imapString: text("imap_string"),
});

// 10. SMS Templates Table
export const smsTemplates = pgTable("sms_templates", {
  id: text("id").primaryKey(),
  name: text("name"),
  webhookUrl: text("webhook_url"),
  keyword: text("keyword"),
});

// 11. Companies Table
export const companies = pgTable("companies", {
  id: text("id").primaryKey(),
  name: text("name"),
  type: text("type"),
  address: text("address"),
  contactPerson: text("contact_person"),
  contactNo: text("contact_no"),
  email: text("email"),
});

// 12. Locations Table
export const locations = pgTable("locations", {
  id: text("id").primaryKey(),
  name: text("name"),
  company: text("company"),
  type: text("type"),
  address: text("address"),
  contactPerson: text("contact_person"),
  contactNo: text("contact_no"),
  email: text("email"),
});

// 13. Dispatch Rules Table
export const dispatchRules = pgTable("dispatch_rules", {
  id: text("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  company: text("company"),
  location: text("location"),
  user: text("user"),
  locationsList: jsonb("locations_list"), // string[]
  personnelsList: jsonb("personnels_list"), // string[]
});

// 14. Departments Table
export const departments = pgTable("departments", {
  id: text("id").primaryKey(),
  name: text("name"),
  description: text("description"),
});

// 15. Brands Table
export const brands = pgTable("brands", {
  id: text("id").primaryKey(),
  department: text("department"),
  name: text("name"),
  description: text("description"),
});

// 16. Time Motion Rules Table
export const timeMotionRules = pgTable("time_motion_rules", {
  id: text("id").primaryKey(),
  variable: text("variable"),
  taskIssue: text("task_issue"),
  duration: text("duration"),
  durationDays: integer("duration_days"),
  durationHours: integer("duration_hours"),
  durationMinutes: integer("duration_minutes"),
  durationSeconds: integer("duration_seconds"),
  level: text("level"),
});

// 17. Ticket Service Types Table
export const ticketServiceTypes = pgTable("ticket_service_types", {
  id: text("id").primaryKey(),
  name: text("name"),
  description: text("description"),
});

// 18. Ticket Files Table
export const ticketFilesBlob = pgTable("ticket_files_blob", {
  uid: text("uid").primaryKey(),
  ticketUid: text("ticket_uid"),
  fileData: text("file_data"),
  fileSize: integer("file_size"),
  fileType: text("file_type"),
});
