import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initDb } from "./src/db/init.ts";
import { db } from "./src/db/index.ts";
import * as schema from "./src/db/schema.ts";
import { eq, desc } from "drizzle-orm";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize the database and tables
  try {
    await initDb();
  } catch (err) {
    console.error("Critical database initialization failure:", err);
  }

  app.use(express.json());

  // ==================== TICKET ENDPOINTS ====================
  app.get("/api/tickets", async (req, res) => {
    try {
      const result = await db.select().from(schema.tickets);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      res.status(500).json({ error: "Failed to fetch tickets." });
    }
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const ticketVal = req.body;
      const inserted = await db.insert(schema.tickets).values({
        id: ticketVal.id,
        title: ticketVal.title || "",
        brand: ticketVal.brand || "",
        requester: ticketVal.requester || "",
        agent: ticketVal.agent || "Unclaimed",
        priority: ticketVal.priority || "Medium",
        status: ticketVal.status || "Open",
        createdAt: ticketVal.createdAt || new Date().toISOString(),
        createdDaysAgo: ticketVal.createdDaysAgo || 0,
        company: ticketVal.company || "",
        location: ticketVal.location || "",
        referenceNo: ticketVal.referenceNo || "",
        description: ticketVal.description || "",
        remarks: ticketVal.remarks || [],
        tags: ticketVal.tags || [],
        ticket_number: ticketVal.ticket_number || "",
        agent_uid: ticketVal.agent_uid || "",
        contact_uid: ticketVal.contact_uid || "",
        company_uid: ticketVal.company_uid || "",
        store_uid: ticketVal.store_uid || "",
        support_uid: ticketVal.support_uid || "",
        problem: ticketVal.problem || "",
        action: ticketVal.action || "",
        file_uid: ticketVal.file_uid || 0,
        date_created: ticketVal.date_created || new Date().toISOString(),
        date_modified: ticketVal.date_modified || new Date().toISOString(),
        date_resolved: ticketVal.date_resolved || null,
      }).returning();
      res.json(inserted[0] || ticketVal);
    } catch (error) {
      console.error("Failed to create ticket:", error);
      res.status(500).json({ error: "Failed to create ticket." });
    }
  });

  // ==================== TICKET FILES/ATTACHMENTS ENDPOINTS ====================
  app.get("/api/tickets/:id/files", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await db.select().from(schema.ticketFilesBlob).where(eq(schema.ticketFilesBlob.ticketUid, id));
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch ticket files:", error);
      res.status(500).json({ error: "Failed to fetch ticket files." });
    }
  });

  app.post("/api/tickets/:id/files", async (req, res) => {
    try {
      const { id } = req.params;
      const fileVal = req.body;
      const inserted = await db.insert(schema.ticketFilesBlob).values({
        uid: fileVal.uid || `file-${Date.now()}-${Math.random()}`,
        ticketUid: id,
        fileData: fileVal.fileData || "",
        fileSize: fileVal.fileSize || 0,
        fileType: fileVal.fileType || "",
      }).returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to insert ticket file:", error);
      res.status(500).json({ error: "Failed to upload file attachment." });
    }
  });

  app.put("/api/tickets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await db.update(schema.tickets)
        .set({
          title: updates.title,
          brand: updates.brand,
          requester: updates.requester,
          agent: updates.agent,
          priority: updates.priority,
          status: updates.status,
          company: updates.company,
          location: updates.location,
          referenceNo: updates.referenceNo,
          description: updates.description,
          remarks: updates.remarks,
          tags: updates.tags,
        })
        .where(eq(schema.tickets.id, id))
        .returning();
      res.json(updated[0] || { id, ...updates });
    } catch (error) {
      console.error("Failed to update ticket:", error);
      res.status(500).json({ error: "Failed to update ticket." });
    }
  });

  // ==================== ACTIVITY LOG ENDPOINTS ====================
  app.get("/api/activities", async (req, res) => {
    try {
      const result = await db.select().from(schema.activities);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      res.status(500).json({ error: "Failed to fetch activities." });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const act = req.body;
      const inserted = await db.insert(schema.activities)
        .values({
          id: act.id || `act-${Date.now()}`,
          timestamp: act.timestamp || "Just now",
          description: act.description || "",
          type: act.type || "system",
          user: act.user || "System",
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to save activity:", error);
      res.status(500).json({ error: "Failed to save activity." });
    }
  });

  // ==================== ALERT FEEDS ENDPOINTS ====================
  app.get("/api/feeds", async (req, res) => {
    try {
      const result = await db.select().from(schema.feeds);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch feeds:", error);
      res.status(500).json({ error: "Failed to fetch feeds." });
    }
  });

  // ==================== CALL LOG ENDPOINTS ====================
  app.get("/api/calls", async (req, res) => {
    try {
      const result = await db.select().from(schema.callLogs);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch call logs:", error);
      res.status(500).json({ error: "Failed to fetch call logs." });
    }
  });

  app.post("/api/calls", async (req, res) => {
    try {
      const call = req.body;
      const inserted = await db.insert(schema.callLogs)
        .values({
          id: call.id || `call-${Date.now()}`,
          callerName: call.callerName || "Unknown Caller",
          phoneNumber: call.phoneNumber || "",
          timestamp: call.timestamp || new Date().toISOString(),
          duration: call.duration || "00:00",
          status: call.status || "Answered",
          transcription: call.transcription || "",
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to add call log:", error);
      res.status(500).json({ error: "Failed to add call log." });
    }
  });

  // ==================== SMS MESSAGE ENDPOINTS ====================
  app.get("/api/sms", async (req, res) => {
    try {
      const result = await db.select().from(schema.smsMessages);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch SMS:", error);
      res.status(500).json({ error: "Failed to fetch SMS messages." });
    }
  });

  app.post("/api/sms", async (req, res) => {
    try {
      const sms = req.body;
      const inserted = await db.insert(schema.smsMessages)
        .values({
          id: sms.id || `sms-${Date.now()}`,
          senderName: sms.senderName || "",
          phoneNumber: sms.phoneNumber || "",
          timestamp: sms.timestamp || new Date().toISOString(),
          messageText: sms.messageText || "",
          replies: sms.replies || [],
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to save SMS:", error);
      res.status(500).json({ error: "Failed to save SMS." });
    }
  });

  app.put("/api/sms/:id/reply", async (req, res) => {
    try {
      const { id } = req.params;
      const replyObj = req.body; // { sender, text, timestamp }
      
      const current = await db.select().from(schema.smsMessages).where(eq(schema.smsMessages.id, id));
      if (!current || current.length === 0) {
        return res.status(404).json({ error: "SMS thread not found" });
      }
      
      const prevReplies = Array.isArray(current[0].replies) ? current[0].replies : [];
      const updatedReplies = [...prevReplies, replyObj];

      const updated = await db.update(schema.smsMessages)
        .set({ replies: updatedReplies })
        .where(eq(schema.smsMessages.id, id))
        .returning();
      res.json(updated[0]);
    } catch (error) {
      console.error("Failed to record SMS reply:", error);
      res.status(500).json({ error: "Failed to submit SMS reply." });
    }
  });

  // ==================== ASSETS ENDPOINTS ====================
  app.get("/api/assets", async (req, res) => {
    try {
      const result = await db.select().from(schema.assets);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
      res.status(500).json({ error: "Failed to fetch hardware assets." });
    }
  });

  app.post("/api/assets", async (req, res) => {
    try {
      const asset = req.body;
      const inserted = await db.insert(schema.assets)
        .values({
          id: asset.id || `ast-${Date.now()}`,
          tag: asset.tag || "",
          assetName: asset.assetName || "",
          brand: asset.brand || "",
          model: asset.model || "",
          serialNo: asset.serialNo || "",
          purchaseDate: asset.purchaseDate || "",
          location: asset.location || "",
          coveredAmount: asset.coveredAmount || "",
          expirationDate: asset.expirationDate || "",
          assignedUser: asset.assignedUser || "",
          status: asset.status || "Active",
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to save asset:", error);
      res.status(500).json({ error: "Failed to save hardware asset." });
    }
  });

  app.delete("/api/assets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.assets).where(eq(schema.assets.id, id));
      res.json({ success: true, message: `Asset ${id} deleted successfully.` });
    } catch (error) {
      console.error("Failed to delete asset:", error);
      res.status(500).json({ error: "Failed to delete hardware asset." });
    }
  });

  // ==================== WARRANTIES ENDPOINTS ====================
  app.get("/api/warranties", async (req, res) => {
    try {
      const result = await db.select().from(schema.warranties);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch warranties:", error);
      res.status(500).json({ error: "Failed to fetch warranties index." });
    }
  });

  app.post("/api/warranties", async (req, res) => {
    try {
      const w = req.body;
      const inserted = await db.insert(schema.warranties)
        .values({
          id: w.id || `w-${Date.now()}`,
          tag: w.tag || "",
          asset: w.asset || "",
          serialNo: w.serialNo || "",
          purchase: w.purchase || "",
          covered: w.covered || "",
          expiration: w.expiration || "",
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to register warranty:", error);
      res.status(500).json({ error: "Failed to register warranty record." });
    }
  });

  app.delete("/api/warranties/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.warranties).where(eq(schema.warranties.id, id));
      res.json({ success: true, message: `Warranty ${id} deleted.` });
    } catch (error) {
      console.error("Failed to delete warranty:", error);
      res.status(500).json({ error: "Failed to delete warranty." });
    }
  });

  // ==================== MANAGE: USERS ENDPOINTS ====================
  app.get("/api/manage/users", async (req, res) => {
    try {
      const result = await db.select().from(schema.manageUsers);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch managed users:", error);
      res.status(500).json({ error: "Failed to fetch registered users." });
    }
  });

  app.post("/api/manage/users", async (req, res) => {
    try {
      const u = req.body;
      const inserted = await db.insert(schema.manageUsers)
        .values({
          id: u.id || `u-${Date.now()}`,
          username: u.username || "",
          firstname: u.firstname || "",
          lastname: u.lastname || "",
          company: u.company || "",
          role: u.role || "Client",
          department: u.department || "",
          contactNo: u.contactNo || u.contact_no || "",
          email: u.email || "",
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to save managed user:", error);
      res.status(500).json({ error: "Failed to save user registry." });
    }
  });

  app.delete("/api/manage/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.manageUsers).where(eq(schema.manageUsers.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete user:", error);
      res.status(500).json({ error: "Failed to delete user from registry." });
    }
  });

  // ==================== MANAGE: EMAIL SETTINGS ====================
  app.get("/api/manage/email-settings", async (req, res) => {
    try {
      const result = await db.select().from(schema.emailSettings);
      res.json(result[0] || {});
    } catch (error) {
      console.error("Failed to fetch email settings:", error);
      res.status(500).json({ error: "Failed to retrieve email setup." });
    }
  });

  app.post("/api/manage/email-settings", async (req, res) => {
    try {
      const s = req.body;
      // Upsert globally to the same first row
      const inserted = await db.insert(schema.emailSettings)
        .values({
          id: "primary",
          email: s.email || "",
          smtpServer: s.smtpServer || s.smtp_server || "",
          smtpPort: s.smtpPort || s.smtp_port || "",
          imapString: s.imapString || s.imap_string || "",
        })
        .onConflictDoUpdate({
          target: schema.emailSettings.id,
          set: {
            email: s.email || "",
            smtpServer: s.smtpServer || s.smtp_server || "",
            smtpPort: s.smtpPort || s.smtp_port || "",
            imapString: s.imapString || s.imap_string || "",
          }
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to update email settings:", error);
      res.status(500).json({ error: "Failed to update email configurations." });
    }
  });

  // ==================== MANAGE: SMS TEMPLATES ====================
  app.get("/api/manage/sms-templates", async (req, res) => {
    try {
      const result = await db.select().from(schema.smsTemplates);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch SMS templates:", error);
      res.status(500).json({ error: "Failed to load SMS templates." });
    }
  });

  app.post("/api/manage/sms-templates", async (req, res) => {
    try {
      const t = req.body;
      const inserted = await db.insert(schema.smsTemplates)
        .values({
          id: t.id || `sms-${Date.now()}`,
          name: t.name || "",
          webhookUrl: t.webhookUrl || t.webhook_url || "",
          keyword: t.keyword || "",
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to save SMS template:", error);
      res.status(500).json({ error: "Failed to save SMS template." });
    }
  });

  app.delete("/api/manage/sms-templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.smsTemplates).where(eq(schema.smsTemplates.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  });

  // ==================== MANAGE: COMPANIES ====================
  app.get("/api/manage/companies", async (req, res) => {
    try {
      const result = await db.select().from(schema.companies);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      res.status(500).json({ error: "Failed to load companies list." });
    }
  });

  app.post("/api/manage/companies", async (req, res) => {
    try {
      const c = req.body;
      const inserted = await db.insert(schema.companies)
        .values({
          id: c.id || `comp-${Date.now()}`,
          name: c.name || "",
          type: c.type || "Client",
          address: c.address || "",
          contactPerson: c.contactPerson || c.contact_person || "",
          contactNo: c.contactNo || c.contact_no || "",
          email: c.email || "",
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to create company registry:", error);
      res.status(500).json({ error: "Failed to create company record." });
    }
  });

  app.delete("/api/manage/companies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.companies).where(eq(schema.companies.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  });

  // ==================== MANAGE: LOCATIONS ====================
  app.get("/api/manage/locations", async (req, res) => {
    try {
      const result = await db.select().from(schema.locations);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch locations:", error);
      res.status(500).json({ error: "Failed to load locations registry." });
    }
  });

  app.post("/api/manage/locations", async (req, res) => {
    try {
      const l = req.body;
      const inserted = await db.insert(schema.locations)
        .values({
          id: l.id || `loc-${Date.now()}`,
          name: l.name || "",
          company: l.company || "",
          type: l.type || "",
          address: l.address || "",
          contactPerson: l.contactPerson || l.contact_person || "",
          contactNo: l.contactNo || l.contact_no || "",
          email: l.email || "",
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to create location context:", error);
      res.status(500).json({ error: "Failed to save location data." });
    }
  });

  app.delete("/api/manage/locations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.locations).where(eq(schema.locations.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete location:", error);
    }
  });

  // ==================== MANAGE: DISPATCH RULES ====================
  app.get("/api/manage/rules", async (req, res) => {
    try {
      const result = await db.select().from(schema.dispatchRules);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch rules:", error);
      res.status(500).json({ error: "Failed to load location dispatch rules." });
    }
  });

  app.post("/api/manage/rules", async (req, res) => {
    try {
      const r = req.body;
      const inserted = await db.insert(schema.dispatchRules)
        .values({
          id: r.id || `rule-${Date.now()}`,
          name: r.name || "",
          description: r.description || "",
          company: r.company || "",
          location: r.location || "",
          user: r.user || "",
          locationsList: r.locationsList || r.locations_list || [],
          personnelsList: r.personnelsList || r.personnels_list || [],
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to save dispatch rule:", error);
      res.status(500).json({ error: "Failed to create location dispatch rule." });
    }
  });

  app.delete("/api/manage/rules/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.dispatchRules).where(eq(schema.dispatchRules.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete rules item:", error);
    }
  });

  // ==================== MANAGE: DEPARTMENTS ====================
  app.get("/api/manage/departments", async (req, res) => {
    try {
      const result = await db.select().from(schema.departments);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      res.status(500).json({ error: "Failed to load support departments." });
    }
  });

  app.post("/api/manage/departments", async (req, res) => {
    try {
      const d = req.body;
      const inserted = await db.insert(schema.departments)
        .values({
          id: d.id || `dept-${Date.now()}`,
          name: d.name || "",
          description: d.description || "",
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to add department:", error);
      res.status(500).json({ error: "Failed to add support department." });
    }
  });

  app.delete("/api/manage/departments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.departments).where(eq(schema.departments.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  });

  // ==================== MANAGE: BRANDS ====================
  app.get("/api/manage/brands", async (req, res) => {
    try {
      const result = await db.select().from(schema.brands);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      res.status(500).json({ error: "Failed to load hardware brands." });
    }
  });

  app.post("/api/manage/brands", async (req, res) => {
    try {
      const b = req.body;
      const inserted = await db.insert(schema.brands)
        .values({
          id: b.id || `brand-${Date.now()}`,
          department: b.department || "",
          name: b.name || "",
          description: b.description || "",
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to save brand:", error);
      res.status(500).json({ error: "Failed to index hardware brand." });
    }
  });

  app.delete("/api/manage/brands/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.brands).where(eq(schema.brands.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete brand:", error);
    }
  });

  // ==================== MANAGE: TIME AND MOTION ====================
  app.get("/api/manage/time-motion", async (req, res) => {
    try {
      const result = await db.select().from(schema.timeMotionRules);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch time motion rules:", error);
      res.status(500).json({ error: "Failed to load time and motion parameters." });
    }
  });

  app.post("/api/manage/time-motion", async (req, res) => {
    try {
      const r = req.body;
      const inserted = await db.insert(schema.timeMotionRules)
        .values({
          id: r.id || `tm-${Date.now()}`,
          variable: r.variable || "",
          taskIssue: r.taskIssue || r.task_issue || "",
          duration: r.duration || "",
          durationDays: r.durationDays !== undefined ? r.durationDays : (r.duration_days || 0),
          durationHours: r.durationHours !== undefined ? r.durationHours : (r.duration_hours || 0),
          durationMinutes: r.durationMinutes !== undefined ? r.durationMinutes : (r.duration_minutes || 0),
          durationSeconds: r.durationSeconds !== undefined ? r.durationSeconds : (r.duration_seconds || 0),
          level: r.level || "Medium",
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to add time and motion rule:", error);
      res.status(500).json({ error: "Failed to save time and motion configuration." });
    }
  });

  app.delete("/api/manage/time-motion/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.timeMotionRules).where(eq(schema.timeMotionRules.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete time motion param:", error);
    }
  });

  // ==================== MANAGE: SERVICE TYPES ====================
  app.get("/api/manage/ticket-services", async (req, res) => {
    try {
      const result = await db.select().from(schema.ticketServiceTypes);
      res.json(result);
    } catch (error) {
      console.error("Failed to fetch service types:", error);
      res.status(500).json({ error: "Failed to retrieve support classifications." });
    }
  });

  app.post("/api/manage/ticket-services", async (req, res) => {
    try {
      const t = req.body;
      const inserted = await db.insert(schema.ticketServiceTypes)
        .values({
          id: t.id || `tst-${Date.now()}`,
          name: t.name || "",
          description: t.description || "",
        })
        .returning();
      res.json(inserted[0]);
    } catch (error) {
      console.error("Failed to create ticket service type:", error);
      res.status(500).json({ error: "Failed to register support service type." });
    }
  });

  app.delete("/api/manage/ticket-services/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(schema.ticketServiceTypes).where(eq(schema.ticketServiceTypes.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete support service type:", error);
    }
  });

  // Vite middleware setup for Development/Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Full-stack server running on port ${PORT}`);
  });
}

startServer();
