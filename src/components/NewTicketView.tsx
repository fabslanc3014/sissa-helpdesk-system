/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { TicketRef, TicketStatus, TicketPriority } from "../types";
import { 
  ChevronRight, 
  AlertCircle, 
  Bold, 
  Italic, 
  Underline, 
  ListOrdered, 
  List, 
  Subscript, 
  Superscript, 
  Indent, 
  Outdent, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Strikethrough, 
  Link as LinkIcon, 
  Link2Off, 
  RemoveFormatting, 
  Minus, 
  Code as CodeIcon,
  Upload,
  FileCode,
  FileImage,
  X,
  Sparkles,
  Loader2
} from "lucide-react";

interface NewTicketViewProps {
  onAddTicket: (ticket: TicketRef) => void;
  onNavigate: (view: string) => void;
}

// Custom Select2 Lookalike Dropdown Component
interface Select2Props {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  required?: boolean;
  error?: boolean;
  focusedField: string | null;
  onFocus: () => void;
  onBlur: () => void;
}

const Select2 = ({
  id,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  options,
  placeholder,
  required,
  error,
  focusedField
}: Select2Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const isFocused = focusedField === id || isOpen;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center relative" ref={dropdownRef}>
      <label className={`sm:w-1/4 text-sm md:text-base font-semibold tracking-tight select-none transition-colors duration-150 ${
        isFocused ? "text-[#10b981]" : "text-gray-950"
      }`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="sm:w-3/4 relative mt-1 sm:mt-0">
        <div
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) {
              onFocus();
            } else {
              onBlur();
            }
          }}
          className={`w-full bg-white border rounded py-2.5 px-4 text-sm text-gray-850 outline-none transition cursor-pointer flex justify-between items-center ${
            error
              ? "border-red-400 focus:border-red-500 shadow-[0_0_0_2px_rgba(239,68,68,0.15)] bg-red-50/10"
              : isFocused
              ? "border-[#10b981] shadow-[0_0_0_2px_rgba(16,185,129,0.15)]"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <span className={selectedOption ? "text-gray-900 font-semibold" : "text-gray-400 font-normal"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="text-gray-400 text-xs">▼</span>
        </div>

        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            <div className="p-2.5 border-b border-gray-100 bg-gray-50 flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-white border border-gray-200 rounded py-2 px-3 text-sm text-gray-700 outline-none focus:border-[#10b981]"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-400 select-none">No matches found</div>
              ) : (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(opt.value);
                      setIsOpen(false);
                      onBlur();
                    }}
                    className={`p-3 text-sm transition cursor-pointer select-none ${
                      opt.value === value
                        ? "bg-[#10b981] text-white font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// Custom WYSIWYG Rich Text Component
interface WYSIWYGEditorProps {
  id: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  focusedField: string | null;
  onFocus: () => void;
  onBlur: () => void;
}

const WYSIWYGEditor = ({
  id,
  value,
  onChange,
  placeholder,
  focusedField,
  onFocus,
  onBlur
}: WYSIWYGEditorProps) => {
  const [htmlMode, setHtmlMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const executeCommand = (command: string, val: string = "") => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = window.prompt("Enter link URL:", "https://");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const formatBlock = (blockType: string) => {
    executeCommand("formatBlock", blockType);
  };

  const changeFontSize = (sizeValue: string) => {
    executeCommand("fontSize", sizeValue);
  };

  const changeFontColor = (colorValue: string) => {
    executeCommand("foreColor", colorValue);
  };

  const isFocused = focusedField === id;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* WYSIWYG Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1 items-center select-none">
        
        {/* Style selection */}
        <select
          onChange={(e) => formatBlock(e.target.value)}
          className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white text-gray-700 font-medium outline-none"
          title="Text Style"
        >
          <option value="p">Normal style</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="pre">Code Block</option>
        </select>

        {/* Font size selection */}
        <select
          onChange={(e) => changeFontSize(e.target.value)}
          className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white text-gray-700 font-medium outline-none"
          title="Font Size"
        >
          <option value="3">Size Regular</option>
          <option value="1">Size Small</option>
          <option value="2">Size Medium</option>
          <option value="4">Size Large</option>
          <option value="5">Size XL</option>
        </select>

        {/* Color picker */}
        <select
          onChange={(e) => changeFontColor(e.target.value)}
          className="text-xs border border-gray-200 rounded px-1.5 py-0.5 bg-white text-gray-700 font-medium outline-none"
          title="Font Color"
        >
          <option value="black">Default color</option>
          <option value="#dc2626">Red</option>
          <option value="#2563eb">Blue</option>
          <option value="#16a34a">Green</option>
          <option value="#ea580c">Orange</option>
          <option value="#7c3aed">Purple</option>
        </select>

        {/* Action icons separator */}
        <div className="h-4 w-[1px] bg-gray-300 mx-1" />

        {/* Button lists */}
        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Underline"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("strikeThrough")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => executeCommand("insertOrderedList")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Ordered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertUnorderedList")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Unordered List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("subscript")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Subscript"
        >
          <Subscript className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("superscript")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Superscript"
        >
          <Superscript className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => executeCommand("indent")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Indent"
        >
          <Indent className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("outdent")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Outdent"
        >
          <Outdent className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={() => executeCommand("justifyLeft")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyCenter")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyRight")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("justifyFull")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Justify Align"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={insertLink}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Insert Link"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("unlink")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Remove Link"
        >
          <Link2Off className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("removeFormat")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand("insertHorizontalRule")}
          className="p-1 hover:bg-gray-200 rounded text-gray-600 transition"
          title="Horizontal Rule"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-gray-300 ml-auto mr-1" />

        <button
          type="button"
          onClick={() => setHtmlMode(!htmlMode)}
          className={`p-1 rounded transition font-mono text-[10px] px-1.5 flex items-center space-x-1 ${
            htmlMode ? "bg-[#10b981] text-white" : "hover:bg-gray-200 text-gray-600"
          }`}
          title="HTML/Code View"
        >
          <CodeIcon className="w-3.5 h-3.5" />
          <span>HTML</span>
        </button>
      </div>

      {/* Editor Space */}
      <div className="relative">
        {htmlMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#1e293b] text-emerald-400 font-mono text-sm p-4 outline-none focus:ring-1 focus:ring-[#10b981]"
            rows={8}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onFocus={onFocus}
            onBlur={onBlur}
            className={`w-full min-h-[160px] p-4 text-sm text-gray-800 outline-none overflow-y-auto ${
              isFocused ? "ring-2 ring-[#10b981]/15 border-transparent" : ""
            }`}
            placeholder={placeholder}
          />
        )}
        {!value && !htmlMode && (
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none text-sm select-none font-normal">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};


export default function NewTicketView({ onAddTicket, onNavigate }: NewTicketViewProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Loaded database arrays states
  const [companies, setCompanies] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  // Step 1: Requester Info
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [requester, setRequester] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [referenceNo, setReferenceNo] = useState("");

  // Step 2: Ticket Details
  const [brand, setBrand] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [natureOfTicket, setNatureOfTicket] = useState("");
  const [extendAsService, setExtendAsService] = useState(false);

  // Step 3: Priority & Schedule
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.Low);
  const [incidentDate, setIncidentDate] = useState("");
  const [contactPerson, setContactPerson] = useState("");

  // Step 4: Agent Assignment
  const [agent, setAgent] = useState("");
  const [quickResponse, setQuickResponse] = useState("");

  // Step 5: Attachments
  const [files, setFiles] = useState<{ id: string; name: string; size: number; type: string; base64: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Run dynamic fetch to load standard tables on mount
  useEffect(() => {
    fetch("/api/manage/companies")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCompanies(data);
      })
      .catch((err) => console.error("Error fetching companies:", err));

    fetch("/api/manage/locations")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLocations(data);
      })
      .catch((err) => console.error("Error fetching locations:", err));

    fetch("/api/manage/users")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch((err) => console.error("Error fetching users:", err));

    fetch("/api/manage/brands")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch((err) => console.error("Error fetching brands:", err));
  }, []);

  // Soft cascade checks: reset Location and Requester if Company changes
  useEffect(() => {
    setLocation("");
    setRequester("");
    setRequesterEmail("");
  }, [company]);

  // Autofill email when Requester profile is selected
  useEffect(() => {
    if (requester) {
      const matchedUser = users.find((u) => u.id === requester);
      if (matchedUser) {
        setRequesterEmail(matchedUser.email || "");
      }
    } else {
      setRequesterEmail("");
    }
  }, [requester, users]);

  // Handle Cascades
  const selectedCompanyObj = companies.find((c) => c.id === company);

  // Filter stores/locations based on selected Company name or Company id matcher
  const filteredLocations = locations.filter((loc) => {
    if (!company) return false;
    return loc.company === company || loc.company === selectedCompanyObj?.name;
  });

  // Filter requester profiles users based on selected Company AND role MUST be Client
  const filteredRequesters = users.filter((u) => {
    if (!company) return false;
    const isClientCompany = u.company === company || u.company === selectedCompanyObj?.name;
    const isClientRole = u.role?.toLowerCase() === "client" || u.user_type?.toLowerCase() === "client";
    return isClientCompany && isClientRole;
  });

  // Support Technical Agents filtering: users whose role or user_type is 'Tech', 'Personnel', 'Tech Support', 'Administrator'
  const filteredTechAgents = users.filter((u) => {
    const roleLower = (u.role || u.user_type || "").toLowerCase();
    return (
      roleLower === "tech" ||
      roleLower === "personnel" ||
      roleLower === "tech support" ||
      roleLower === "administrator"
    );
  });

  // Validation function for current step
  const validateStep = (s: number) => {
    const nextErrors: { [key: string]: boolean } = {};
    let isValid = true;

    if (s === 1) {
      if (!company) {
        nextErrors.company = true;
        isValid = false;
      }
    } else if (s === 2) {
      if (!brand) {
        nextErrors.brand = true;
        isValid = false;
      }
      if (!subject.trim()) {
        nextErrors.subject = true;
        isValid = false;
      }
    } else if (s === 3) {
      if (!priority) {
        nextErrors.priority = true;
        isValid = false;
      }
    } else if (s === 4) {
      if (!agent) {
        nextErrors.agent = true;
        isValid = false;
      }
    }

    setErrors(nextErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setErrors({});
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  // Convert files loaded to base64 promises
  const processFile = (file: File) => {
    return new Promise<{ id: string; name: string; size: number; type: string; base64: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          base64: reader.result as string
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    await addUploadedFiles(Array.from(fileList));
  };

  const addUploadedFiles = async (fileList: File[]) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (files.length + fileList.length > 3) {
      alert("Attachment limits triggered: Maximum of 3 images can be registered per ticket.");
      return;
    }

    const processedList: typeof files = [];
    for (const file of fileList) {
      if (!validTypes.includes(file.type)) {
        alert(`Validation error inside file "${file.name}": Only PNG/JPG image assets are permitted.`);
        continue;
      }
      if (file.size > maxSize) {
        alert(`Validation error inside file "${file.name}": Individual image dimensions must stay below 5MB.`);
        continue;
      }
      try {
        const payload = await processFile(file);
        processedList.push(payload);
      } catch (err) {
        console.error("Failed to read file asset:", err);
      }
    }

    setFiles((prev) => [...prev, ...processedList]);
  };

  // Drag over dropzone highlights
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropFiles = e.dataTransfer.files;
    if (dropFiles && dropFiles.length > 0) {
      await addUploadedFiles(Array.from(dropFiles));
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Submit complete 5-step form payload to PostgreSQL
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);

    try {
      // 1. Compile state GUID and core values
      const ticketId = String(Math.floor(2600000 + Math.random() * 95200));
      
      const now = new Date();
      const ymd = now.getFullYear().toString() + 
                  String(now.getMonth() + 1).padStart(2, "0") + 
                  String(now.getDate()).padStart(2, "0");
      const ticketNumber = ymd + String(Math.floor(1000 + Math.random() * 9000));

      // Resolve selected Requester Name
      const matchedClient = users.find((u) => u.id === requester);
      const requesterLabel = matchedClient 
        ? `${matchedClient.firstname || ""} ${matchedClient.lastname || ""}`.trim() || matchedClient.username || matchedClient.email
        : "Guest Requester";

      // Resolve selected Support Agent Name
      const matchedAgent = users.find((u) => u.id === agent);
      const agentLabel = matchedAgent
        ? `${matchedAgent.firstname || ""} ${matchedAgent.lastname || ""}`.trim() || matchedAgent.username || matchedAgent.email
        : "Unclaimed";

      // Resolve brand name from its value (in case it is an ID)
      const matchedBrand = brands.find((b) => b.id === brand);
      const brandLabel = matchedBrand ? matchedBrand.name : brand;

      // Resolve location name 
      const matchedLoc = locations.find((l) => l.id === location);
      const locationLabel = matchedLoc ? matchedLoc.name : location;

      // Problem field compilation
      const compliedProblem = `${subject.trim()} - ${description.trim()}`;

      // Assemble final ticket block
      const ticketPayload: TicketRef = {
        id: ticketId,
        title: `#${ticketId} ${subject.trim()}`,
        brand: brandLabel,
        requester: requesterLabel,
        agent: agentLabel,
        priority: priority,
        status: TicketStatus.Open,
        createdAt: now.toISOString(),
        createdDaysAgo: 0,
        company: selectedCompanyObj?.name || company || "",
        location: locationLabel || "Head Office",
        referenceNo: referenceNo.trim() || undefined,
        description: description.trim(),
        remarks: [`[System]: Form wizard completed. Assigned automatically to agent ${agentLabel}.`],
        tags: ["Wizard Pipeline"],
        // Database requested schemas keys
        ticket_number: ticketNumber,
        agent_uid: "user-1", // Logged-in helpdesk administrator uid fallback
        contact_uid: requester,
        company_uid: company,
        store_uid: location,
        support_uid: agent,
        problem: compliedProblem,
        action: quickResponse.trim() || undefined,
        file_uid: files.length > 0 ? 1 : 0,
        date_created: now.toISOString(),
        date_modified: now.toISOString(),
      };

      // 2. Transmit Ticket payload to postgres
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketPayload),
      });

      if (!res.ok) {
        throw new Error("HTTP failure saving core ticket indices.");
      }

      // 3. Upload attachments sequentially into ticket_files_blob if we have files
      if (files.length > 0) {
        for (const f of files) {
          await fetch(`/api/tickets/${ticketId}/files`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: f.id,
              fileData: f.base64,
              fileSize: f.size,
              fileType: f.type
            })
          });
        }
      }

      // Trigger state updates in parent App framework 
      onAddTicket(ticketPayload);

      alert(`Support request #${ticketId} created successfully in SISSA databases! Redirecting to index...`);
      onNavigate("tickets_list");

    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission Error: Failed to write ticket metadata registers inside the Postgres cloud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#F9FAFB] font-sans">
      
      {/* Title */}
      <div className="border-b border-gray-200 pb-5 mb-6">
        <h2 className="text-4xl font-extralight text-gray-800 tracking-tight">New Ticket</h2>
        <p className="text-sm text-gray-450 mt-1.5">
          Initiating physical hardware diagnostic or system software support dispatches.
        </p>
      </div>

      {/* Main wizard wrapper layout */}
      <div className="max-w-4xl bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden">
        
        {/* Progress rail bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4.5 flex flex-col md:flex-row md:items-center justify-between text-xs md:text-sm font-semibold text-gray-400 select-none gap-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className={`pb-0.5 border-b-2 transition ${step === 1 ? "border-[#10b981] text-gray-800 font-bold text-sm" : step > 1 ? "border-transparent text-emerald-600 font-medium text-sm" : "border-transparent text-sm"}`}>
              1. Requester
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className={`pb-0.5 border-b-2 transition ${step === 2 ? "border-[#10b981] text-gray-800 font-bold text-sm" : step > 2 ? "border-transparent text-emerald-600 font-medium text-sm" : "border-transparent text-sm"}`}>
              2. Technical Details
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className={`pb-0.5 border-b-2 transition ${step === 3 ? "border-[#10b981] text-gray-800 font-bold text-sm" : step > 3 ? "border-transparent text-emerald-600 font-medium text-sm" : "border-transparent text-sm"}`}>
              3. Urgency
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className={`pb-0.5 border-b-2 transition ${step === 4 ? "border-[#10b981] text-gray-800 font-bold text-sm" : step > 4 ? "border-transparent text-emerald-600 font-medium text-sm" : "border-transparent text-sm"}`}>
              4. Assignment
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className={`pb-0.5 border-b-2 transition ${step === 5 ? "border-[#10b981] text-gray-800 font-bold text-sm" : "border-transparent text-sm"}`}>
              5. Files
            </span>
          </div>
          <span className="text-xs bg-emerald-100 text-[#10b981] rounded-full px-3 py-1 uppercase tracking-wide font-bold">
            Step {step} of 5
          </span>
        </div>

        {/* Wizard Panel Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <h3 className="text-base md:text-lg font-bold text-gray-900 tracking-tight border-b border-gray-100 pb-2.5">
            Create new ticket
          </h3>

          {/* STEP 1: Requester Info */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Company dropdown */}
              <Select2
                id="company"
                label="Company"
                value={company}
                onChange={setCompany}
                placeholder="Select Company"
                required
                error={errors.company}
                options={companies.map((c) => ({ value: c.id, label: c.name }))}
                focusedField={focusedField}
                onFocus={() => setFocusedField("company")}
                onBlur={() => setFocusedField(null)}
              />
              {errors.company && (
                <div className="flex sm:pl-[25%] text-xs text-red-500 font-medium select-none items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Please select a client company partner.</span>
                </div>
              )}

              {/* Location dropdown */}
              <Select2
                id="location"
                label="Location"
                value={location}
                onChange={setLocation}
                placeholder={company ? "Select Location" : "Select company first"}
                options={filteredLocations.map((l) => ({ value: l.id, label: l.name }))}
                focusedField={focusedField}
                onFocus={() => setFocusedField("location")}
                onBlur={() => setFocusedField(null)}
              />

              {/* Requester dropdown */}
              <Select2
                id="requester"
                label="Requester"
                value={requester}
                onChange={setRequester}
                placeholder={company ? "Select Requester" : "Select company first"}
                options={filteredRequesters.map((u) => ({
                  value: u.id,
                  label: `${u.firstname || ""} ${u.lastname || ""}`.trim() || u.username || u.email
                }))}
                focusedField={focusedField}
                onFocus={() => setFocusedField("requester")}
                onBlur={() => setFocusedField(null)}
              />

              {/* Auto-filled Requester Email Display */}
              {requesterEmail && (
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="sm:w-1/4 text-sm md:text-base font-semibold text-gray-500 select-none">
                    Contact Email
                  </span>
                  <div className="sm:w-3/4 bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-4 text-sm text-gray-700 font-medium">
                    {requesterEmail}
                  </div>
                </div>
              )}

              {/* Reference no field */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className={`sm:w-1/4 text-sm md:text-base font-semibold select-none transition-colors duration-150 ${
                  focusedField === "referenceNo" ? "text-[#10b981]" : "text-gray-900"
                }`}>
                  Reference no
                </label>
                <div className="sm:w-3/4">
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    onFocus={() => setFocusedField("referenceNo")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Reference number for the ticket (optional)"
                    className={`w-full bg-white border border-gray-205 rounded-lg py-2.5 px-4 text-sm text-gray-700 outline-none transition ${
                      focusedField === "referenceNo" ? "border-[#10b981] shadow-[0_0_0_2px_rgba(16,185,129,0.15)]" : "focus:border-gray-550 border-gray-300 hover:border-gray-400"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Ticket Details */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Brand dropdown */}
              <Select2
                id="brand"
                label="Brand"
                value={brand}
                onChange={setBrand}
                placeholder="Select Brand"
                required
                error={errors.brand}
                options={brands.map((b) => ({ value: b.id, label: b.name }))}
                focusedField={focusedField}
                onFocus={() => setFocusedField("brand")}
                onBlur={() => setFocusedField(null)}
              />
              {errors.brand && (
                <div className="flex sm:pl-[25%] text-xs text-red-500 font-medium select-none items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Please specify representing equipment brand.</span>
                </div>
              )}

              {/* Subject Text field */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className={`sm:w-1/4 text-sm md:text-base font-semibold select-none transition-colors duration-150 ${
                  focusedField === "subject" ? "text-[#10b981]" : "text-gray-900"
                }`}>
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="sm:w-3/4">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Subject for the ticket (ex. Asset Tag Stickers Attachment)"
                    className={`w-full bg-white border rounded-lg py-2.5 px-4 text-sm text-gray-700 outline-none transition ${
                      errors.subject
                        ? "border-red-400 shadow-[0_0_0_2px_rgba(239,68,68,0.15)]"
                        : focusedField === "subject"
                        ? "border-[#10b981] shadow-[0_0_0_2px_rgba(16,185,129,0.15)]"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {errors.subject && (
                    <div className="flex text-xs text-red-500 font-medium select-none items-center space-x-1.5 mt-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Support ticket subject index cannot be left empty.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description Rich Text Area */}
              <div className="flex flex-col sm:flex-row sm:items-start">
                <label className={`sm:w-1/4 text-sm md:text-base font-semibold pt-2 select-none transition-colors duration-150 ${
                  focusedField === "description" ? "text-[#10b981]" : "text-gray-900"
                }`}>
                  Description
                </label>
                <div className="sm:w-3/4">
                  <WYSIWYGEditor
                    id="description"
                    value={description}
                    onChange={setDescription}
                    placeholder="Diagnosed visual hardware failure symptoms (eg. printer led blink codes, network line offline states)..."
                    focusedField={focusedField}
                    onFocus={() => setFocusedField("description")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              {/* Nature of Ticket text Box */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className={`sm:w-1/4 text-sm md:text-base font-semibold select-none transition-colors duration-150 ${
                  focusedField === "natureOfTicket" ? "text-[#10b981]" : "text-gray-900"
                }`}>
                  Nature of Ticket
                </label>
                <div className="sm:w-3/4">
                  <input
                    type="text"
                    value={natureOfTicket}
                    onChange={(e) => setNatureOfTicket(e.target.value)}
                    onFocus={() => setFocusedField("natureOfTicket")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="(ex. Sales Warranty, Software Installation, Repair)"
                    className={`w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-700 outline-none transition ${
                      focusedField === "natureOfTicket" ? "border-[#10b981] shadow-[0_0_0_2px_rgba(16,185,129,0.15)]" : "focus:border-gray-550 border-gray-300 hover:border-gray-400"
                    }`}
                  />
                </div>
              </div>

              {/* Extend as service ticket checkbox */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="sm:w-1/4" />
                <div className="sm:w-3/4 flex items-center">
                  <label className="flex items-center space-x-3 cursor-pointer text-sm font-semibold text-gray-700 select-none">
                    <input
                      type="checkbox"
                      checked={extendAsService}
                      onChange={(e) => setExtendAsService(e.target.checked)}
                      className="rounded border-gray-300 text-[#10b981] focus:ring-[#10b981]/25 w-5 h-5 cursor-pointer"
                    />
                    <span>Extend as service ticket</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Priority & Schedule */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Urgency Priority Level radio toggles */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className={`sm:w-1/4 text-sm md:text-base font-semibold select-none transition-colors duration-150 ${
                  focusedField === "priority" ? "text-[#10b981]" : "text-gray-900"
                }`}>
                  Priority <span className="text-red-500">*</span>
                </label>
                <div className="sm:w-3/4 flex flex-wrap items-center gap-4">
                  {[TicketPriority.Low, TicketPriority.Medium, TicketPriority.High, "Urgent"].map((p) => (
                    <label
                      key={p}
                      onClick={() => setPriority(p as any)}
                      className={`flex items-center space-x-2.5 cursor-pointer text-sm font-semibold px-4 py-2.5 border rounded-lg transition ${
                        priority === p
                          ? "border-[#10b981] bg-[#10b981]/5 text-[#047857]"
                          : "border-gray-200 hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={priority === p}
                        onChange={() => {}} // handled by click container
                        className="text-[#10b981] focus:ring-[#10b981] w-4 h-4 cursor-pointer"
                      />
                      <span>{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Incident Date Input Field */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className={`sm:w-1/4 text-sm md:text-base font-semibold select-none transition-colors duration-150 ${
                  focusedField === "incidentDate" ? "text-[#10b981]" : "text-gray-900"
                }`}>
                  Incident date
                </label>
                <div className="sm:w-3/4">
                  <input
                    type="datetime-local"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    onFocus={() => setFocusedField("incidentDate")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-700 outline-none transition ${
                      focusedField === "incidentDate" ? "border-[#10b981] shadow-[0_0_0_2px_rgba(16,185,129,0.15)]" : "focus:border-gray-400 border-gray-3 w-full"
                    }`}
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Date and time when the incident occured</p>
                </div>
              </div>

              {/* Contact Person Name box */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className={`sm:w-1/4 text-sm md:text-base font-semibold select-none transition-colors duration-150 ${
                  focusedField === "contactPerson" ? "text-[#10b981]" : "text-gray-900"
                }`}>
                  Contact Person
                </label>
                <div className="sm:w-3/4">
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    onFocus={() => setFocusedField("contactPerson")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Person to coordinate with the ticket"
                    className={`w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-700 outline-none transition ${
                      focusedField === "contactPerson" ? "border-[#10b981] shadow-[0_0_0_2px_rgba(16,185,129,0.15)]" : "focus:border-gray-550 border-gray-300 hover:border-gray-400"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Agent Assignment */}
          {step === 4 && (
            <div className="space-y-6">
              {/* Assign Agent Select dropdown */}
              <Select2
                id="agent"
                label="Assign ticket to an Agent"
                value={agent}
                onChange={setAgent}
                placeholder="Select Agent"
                required
                error={errors.agent}
                options={filteredTechAgents.map((u) => ({
                  value: u.id,
                  label: `${u.firstname || ""} ${u.lastname || ""}`.trim() || u.username || u.email
                }))}
                focusedField={focusedField}
                onFocus={() => setFocusedField("agent")}
                onBlur={() => setFocusedField(null)}
              />
              {errors.agent && (
                <div className="flex sm:pl-[25%] text-xs text-red-500 font-medium select-none items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Please allocate a support field engineer.</span>
                </div>
              )}

              {/* Quick Response notes input */}
              <div className="flex flex-col sm:flex-row sm:items-start">
                <label className={`sm:w-1/4 text-sm md:text-base font-semibold pt-2 select-none transition-colors duration-150 ${
                  focusedField === "quickResponse" ? "text-[#10b981]" : "text-gray-900"
                }`}>
                  Quick Response
                </label>
                <div className="sm:w-3/4">
                  <WYSIWYGEditor
                    id="quickResponse"
                    value={quickResponse}
                    onChange={setQuickResponse}
                    placeholder="Deploy initial support notes or troubleshooting step logs (optional)..."
                    focusedField={focusedField}
                    onFocus={() => setFocusedField("quickResponse")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Attachments (Final) */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start">
                <label className="sm:w-1/4 text-sm md:text-base font-bold pt-2 text-gray-900 select-none">
                  Attachments
                </label>
                <div className="sm:w-3/4 space-y-4">
                  {/* File Upload zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
                      isDragging
                        ? "border-[#10b981] bg-[#10b981]/5 shadow-inner"
                        : "border-gray-300 bg-[#f9f9f9] hover:bg-gray-100/50 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelection}
                      multiple
                      accept="image/png, image/jpeg, image/jpg"
                      className="hidden"
                    />
                    <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3 animate-bounce" />
                    <p className="text-xl font-extrabold text-gray-700">➜ Drop files</p>
                    <p className="text-xl font-extrabold text-gray-700">to upload</p>
                    <p className="text-sm text-gray-400 font-medium mt-1.5">(or click)</p>
                    <p className="text-xs text-gray-400 font-normal mt-2.5">
                      Max 3 files, PNG/JPG assets only, maximum 5MB size limit.
                    </p>
                  </div>

                  {/* Uploaded File Assets list */}
                  {files.length > 0 && (
                    <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/50 space-y-2 select-none">
                      <p className="text-xs font-bold text-gray-700">Uploaded Assets ({files.length}/3)</p>
                      <div className="grid grid-cols-1 gap-2">
                        {files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between border border-gray-200 bg-white p-2.5 rounded-md shadow-sm"
                          >
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                              <FileImage className="w-4.5 h-4.5 text-[#10b981] shrink-0" />
                              <div className="text-xs overflow-hidden">
                                <p className="font-bold text-gray-800 truncate" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(file.id);
                              }}
                              className="text-gray-400 hover:text-red-500 transition p-1 cursor-pointer"
                              title="Delete attachment"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Persistent Form wizard bottom-left navigation bar */}
          <div className="flex justify-start space-x-4 border-t border-gray-100 pt-6 select-none">
            <button
              type="button"
              disabled={step === 1 || isSubmitting}
              onClick={handleBack}
              className={`border py-2.5 px-8 rounded-lg text-sm font-semibold transition cursor-pointer ${
                step === 1
                  ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                  : "bg-white hover:bg-gray-55 border-gray-300 text-gray-600"
              }`}
            >
              Back
            </button>

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#2A7DFB] hover:bg-[#1a6ce9] text-white text-sm font-semibold py-2.5 px-8 rounded-lg transition cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#2A7DFB] hover:bg-[#1a6ce9] text-white text-sm font-semibold py-2.5 px-8 rounded-lg transition cursor-pointer flex items-[#2A7DFB] space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Proactive guide sidebar notes */}
      <div className="mt-8 max-w-4xl bg-blue-50/50 border border-blue-100 p-5 rounded-xl flex items-start space-x-3.5 select-none animate-fade-in">
        <AlertCircle className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 space-y-1">
          <p className="font-semibold text-sm">Support Desk Dispatch Protocol</p>
          <p className="text-gray-650 leading-relaxed text-xs md:text-sm">
            Please check hardware service tags and asset registers before creating duplicate queries. If the asset does not exist in our library, you can create warranty registrations under the{" "}
            <span
              className="underline font-bold cursor-pointer hover:text-blue-900"
              onClick={() => onNavigate("assets_warranties")}
            >
              Assets &raquo; Warranties
            </span>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  );
}
