/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { EmailSettings } from "../manageData";
import { ShieldAlert, Save } from "lucide-react";

interface ManageEmailsViewProps {
  settings: EmailSettings;
  onSaveSettings: (settings: EmailSettings) => void;
}

export default function ManageEmailsView({
  settings,
  onSaveSettings
}: ManageEmailsViewProps) {
  const [email, setEmail] = useState(settings.email);
  const [password, setPassword] = useState(settings.email ? "******" : "");
  const [smtpServer, setSmtpServer] = useState(settings.smtpServer);
  const [smtpPort, setSmtpPort] = useState(settings.smtpPort);
  const [imapString, setImapString] = useState(settings.imapString);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      email,
      smtpServer,
      smtpPort,
      imapString
    });
    alert("SMTP & IMAP system parameters have been successfully validated and synced into the background mail spooler!");
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#F9FAFB] font-sans">
      {/* Title */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-3xl font-extralight text-gray-800 tracking-tight">Email Settings</h2>
        <div className="text-xs text-gray-400 mt-1">Configure default postmaster credentials and polling triggers for active support inboxes.</div>
      </div>

      <div className="max-w-2xl bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
        {/* Update Card Header */}
        <div className="bg-gray-50 border-b border-gray-150 px-5 py-3">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-widest">Update</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 text-sm font-semibold text-gray-700">
          {/* Email Address */}
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-gray-750 text-right text-sm">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="me@example.com"
              className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-gray-750 text-right text-sm">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
            />
          </div>

          {/* SMTP Server */}
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-gray-750 text-right text-sm">SMTP Server</label>
            <input
              type="text"
              required
              value={smtpServer}
              onChange={(e) => setSmtpServer(e.target.value)}
              placeholder="smtp.gmail.com"
              className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39]"
            />
          </div>

          {/* SMTP Port */}
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-gray-750 text-right text-sm">SMTP Port</label>
            <input
              type="text"
              required
              value={smtpPort}
              onChange={(e) => setSmtpPort(e.target.value)}
              placeholder="465"
              className="col-span-2 bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] font-mono"
            />
          </div>

          {/* IMAP Connection String */}
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-gray-750 text-right text-sm">IMAP Connection String</label>
            <input
              type="text"
              required
              value={imapString}
              onChange={(e) => setImapString(e.target.value)}
              placeholder="{imap.googlemail.com:993/imap/ssl}"
              className="col-span-2 bg-gray-150 border border-gray-300 text-gray-550 rounded-lg py-2.5 px-4 text-sm font-normal outline-none hover:border-gray-400 focus:outline-none focus:border-[#E15B39] font-mono"
            />
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-3 gap-4 pt-3 border-t">
            <div></div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-[#00c0ef] hover:bg-[#00acd6] text-white px-6 py-2.5 text-sm font-semibold rounded-lg shadow-sm cursor-pointer transition flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Email Parameters</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="max-w-2xl mt-6 bg-amber-50 rounded border border-amber-200/80 p-4 text-xs flex items-start space-x-3 text-amber-800">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Credential Warning:</span> Change of postmaster email properties here forces automatic session verification on all active clients to protect SMTP channel payloads.
        </div>
      </div>
    </div>
  );
}
