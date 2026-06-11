import { pool } from "./index.ts";
import {
  initialTickets,
  initialActivities,
  initialFeeds,
  initialCalls,
  initialSMS,
  initialAssets,
  initialWarranties
} from "../data.ts";
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
} from "../manageData.ts";

export async function initDb() {
  console.log("Initializing database schema on Neon PostgreSQL...");
  const client = await pool.connect();
  try {
    // 1. Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        title TEXT,
        brand TEXT,
        requester TEXT,
        agent TEXT,
        priority TEXT,
        status TEXT,
        created_at TEXT,
        created_days_ago INTEGER,
        company TEXT,
        location TEXT,
        reference_no TEXT,
        description TEXT,
        remarks JSONB,
        tags JSONB,
        ticket_number TEXT,
        agent_uid TEXT,
        contact_uid TEXT,
        company_uid TEXT,
        store_uid TEXT,
        support_uid TEXT,
        problem TEXT,
        action TEXT,
        file_uid INTEGER,
        date_created TEXT,
        date_modified TEXT,
        date_resolved TEXT
      );

      -- Safe migrations for existing databases:
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS ticket_number TEXT;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS agent_uid TEXT;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS contact_uid TEXT;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS company_uid TEXT;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS store_uid TEXT;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS support_uid TEXT;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS problem TEXT;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS action TEXT;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS file_uid INTEGER;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS date_created TEXT;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS date_modified TEXT;
      ALTER TABLE tickets ADD COLUMN IF NOT EXISTS date_resolved TEXT;

      CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        description TEXT,
        type TEXT,
        "user" TEXT
      );

      CREATE TABLE IF NOT EXISTS feeds (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        title TEXT,
        message TEXT,
        severity TEXT,
        source TEXT
      );

      CREATE TABLE IF NOT EXISTS call_logs (
        id TEXT PRIMARY KEY,
        caller_name TEXT,
        phone_number TEXT,
        timestamp TEXT,
        duration TEXT,
        status TEXT,
        transcription TEXT
      );

      CREATE TABLE IF NOT EXISTS sms_messages (
        id TEXT PRIMARY KEY,
        sender_name TEXT,
        phone_number TEXT,
        timestamp TEXT,
        message_text TEXT,
        replies JSONB
      );

      CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        tag TEXT UNIQUE,
        asset_name TEXT,
        brand TEXT,
        model TEXT,
        serial_no TEXT,
        purchase_date TEXT,
        location TEXT,
        covered_amount TEXT,
        expiration_date TEXT,
        assigned_user TEXT,
        status TEXT
      );

      CREATE TABLE IF NOT EXISTS warranties (
        id TEXT PRIMARY KEY,
        tag TEXT,
        asset TEXT,
        serial_no TEXT,
        purchase TEXT,
        covered TEXT,
        expiration TEXT
      );

      CREATE TABLE IF NOT EXISTS manage_users (
        id TEXT PRIMARY KEY,
        username TEXT,
        firstname TEXT,
        lastname TEXT,
        company TEXT,
        role TEXT,
        department TEXT,
        contact_no TEXT,
        email TEXT
      );

      CREATE TABLE IF NOT EXISTS email_settings (
        id TEXT PRIMARY KEY,
        email TEXT,
        smtp_server TEXT,
        smtp_port TEXT,
        imap_string TEXT
      );

      CREATE TABLE IF NOT EXISTS sms_templates (
        id TEXT PRIMARY KEY,
        name TEXT,
        webhook_url TEXT,
        keyword TEXT
      );

      CREATE TABLE IF NOT EXISTS companies (
        id TEXT PRIMARY KEY,
        name TEXT,
        type TEXT,
        address TEXT,
        contact_person TEXT,
        contact_no TEXT,
        email TEXT
      );

      CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY,
        name TEXT,
        company TEXT,
        type TEXT,
        address TEXT,
        contact_person TEXT,
        contact_no TEXT,
        email TEXT
      );

      CREATE TABLE IF NOT EXISTS dispatch_rules (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT,
        company TEXT,
        location TEXT,
        "user" TEXT,
        locations_list JSONB,
        personnels_list JSONB
      );

      CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS brands (
        id TEXT PRIMARY KEY,
        department TEXT,
        name TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS time_motion_rules (
        id TEXT PRIMARY KEY,
        variable TEXT,
        task_issue TEXT,
        duration TEXT,
        duration_days INTEGER,
        duration_hours INTEGER,
        duration_minutes INTEGER,
        duration_seconds INTEGER,
        level TEXT
      );

      CREATE TABLE IF NOT EXISTS ticket_service_types (
        id TEXT PRIMARY KEY,
        name TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS ticket_files_blob (
        uid TEXT PRIMARY KEY,
        ticket_uid TEXT,
        file_data TEXT,
        file_size INTEGER,
        file_type TEXT
      );
    `);

    console.log("Database schema created or verified successfully.");

    // Helper: Seed table if empty
    const seedTable = async (tableName: string, initialData: any[], insertQueryFn: (item: any) => { query: string, values: any[] }) => {
      const res = await client.query(`SELECT COUNT(*) FROM "${tableName}"`);
      const count = parseInt(res.rows[0].count, 10);
      if (count === 0 && initialData.length > 0) {
        console.log(`Seeding initial data into ${tableName}...`);
        for (const item of initialData) {
          const { query, values } = insertQueryFn(item);
          await client.query(query, values);
        }
      }
    };

    // 2. Seed tables
    await seedTable("tickets", initialTickets, (t) => ({
      query: `INSERT INTO tickets (id, title, brand, requester, agent, priority, status, created_at, created_days_ago, company, location, reference_no, description, remarks, tags) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      values: [t.id, t.title, t.brand, t.requester, t.agent, t.priority, t.status, t.createdAt, t.createdDaysAgo, t.company, t.location, t.referenceNo, t.description, JSON.stringify(t.remarks), JSON.stringify(t.tags)]
    }));

    await seedTable("activities", initialActivities, (a) => ({
      query: `INSERT INTO activities (id, timestamp, description, type, "user") VALUES ($1, $2, $3, $4, $5)`,
      values: [a.id, a.timestamp, a.description, a.type, a.user]
    }));

    await seedTable("feeds", initialFeeds, (f) => ({
      query: `INSERT INTO feeds (id, timestamp, title, message, severity, source) VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [f.id, f.timestamp, f.title, f.message, f.severity, f.source]
    }));

    await seedTable("call_logs", initialCalls, (c) => ({
      query: `INSERT INTO call_logs (id, caller_name, phone_number, timestamp, duration, status, transcription) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      values: [c.id, c.callerName, c.phoneNumber, c.timestamp, c.duration, c.status, c.transcription || ""]
    }));

    await seedTable("sms_messages", initialSMS, (s) => ({
      query: `INSERT INTO sms_messages (id, sender_name, phone_number, timestamp, message_text, replies) VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [s.id, s.senderName, s.phoneNumber, s.timestamp, s.messageText, JSON.stringify(s.replies || [])]
    }));

    await seedTable("assets", initialAssets, (a) => ({
      query: `INSERT INTO assets (id, tag, asset_name, brand, model, serial_no, purchase_date, location, covered_amount, expiration_date, assigned_user, status) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      values: [a.id, a.tag, a.assetName, a.brand, a.model, a.serialNo, a.purchaseDate, a.location, a.coveredAmount, a.expirationDate, a.assignedUser, a.status]
    }));

    await seedTable("warranties", initialWarranties, (w) => ({
      query: `INSERT INTO warranties (id, tag, asset, serial_no, purchase, covered, expiration) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      values: [w.id, w.tag, w.asset, w.serialNo, w.purchase, w.covered, w.expiration]
    }));

    await seedTable("manage_users", initialManageUsers, (u) => ({
      query: `INSERT INTO manage_users (id, username, firstname, lastname, company, role, department, contact_no, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      values: [u.id, u.username, u.firstname, u.lastname, u.company, u.role, u.department, u.contactNo, u.email]
    }));

    await seedTable("email_settings", [initialEmailSettings], (e) => ({
      query: `INSERT INTO email_settings (id, email, smtp_server, smtp_port, imap_string) VALUES ($1, $2, $3, $4, $5)`,
      values: ["primary", e.email, e.smtpServer, e.smtpPort, e.imapString]
    }));

    await seedTable("sms_templates", initialSmsTemplates, (s) => ({
      query: `INSERT INTO sms_templates (id, name, webhook_url, keyword) VALUES ($1, $2, $3, $4)`,
      values: [s.id, s.name, s.webhookUrl, s.keyword]
    }));

    await seedTable("companies", initialCompanies, (c) => ({
      query: `INSERT INTO companies (id, name, type, address, contact_person, contact_no, email) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      values: [c.id, c.name, c.type, c.address, c.contactPerson, c.contactNo, c.email]
    }));

    await seedTable("locations", initialLocations, (l) => ({
      query: `INSERT INTO locations (id, name, company, type, address, contact_person, contact_no, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      values: [l.id, l.name, l.company, l.type, l.address, l.contactPerson, l.contactNo, l.email]
    }));

    await seedTable("dispatch_rules", initialDispatchRules, (r) => ({
      query: `INSERT INTO dispatch_rules (id, name, description, company, location, "user", locations_list, personnels_list) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      values: [r.id, r.name, r.description, r.company, r.location, r.user, JSON.stringify(r.locationsList), JSON.stringify(r.personnelsList)]
    }));

    await seedTable("departments", initialDepartments, (d) => ({
      query: `INSERT INTO departments (id, name, description) VALUES ($1, $2, $3)`,
      values: [d.id, d.name, d.description]
    }));

    await seedTable("brands", initialBrands, (b) => ({
      query: `INSERT INTO brands (id, department, name, description) VALUES ($1, $2, $3, $4)`,
      values: [b.id, b.department, b.name, b.description]
    }));

    await seedTable("time_motion_rules", initialTimeMotionRules, (r) => ({
      query: `INSERT INTO time_motion_rules (id, variable, task_issue, duration, duration_days, duration_hours, duration_minutes, duration_seconds, level) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      values: [r.id, r.variable, r.taskIssue, r.duration, r.durationDays, r.durationHours, r.durationMinutes, r.durationSeconds, r.level]
    }));

    await seedTable("ticket_service_types", initialTicketServiceTypes, (t) => ({
      query: `INSERT INTO ticket_service_types (id, name, description) VALUES ($1, $2, $3)`,
      values: [t.id, t.name, t.description]
    }));

    console.log("Database initialized and populated successfully.");
  } catch (error) {
    console.error("Database initialization error:", error);
  } finally {
    client.release();
  }
}
