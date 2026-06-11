/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ManageUser {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  company: string;
  role: string;
  department: string;
  contactNo: string;
  email: string;
}

export interface EmailSettings {
  email: string;
  smtpServer: string;
  smtpPort: string;
  imapString: string;
}

export interface SmsTemplate {
  id: string;
  name: string;
  webhookUrl: string;
  keyword: string;
}

export interface Company {
  id: string;
  name: string;
  type: "Provider" | "Client" | string;
  address: string;
  contactPerson: string;
  contactNo: string;
  email: string;
}

export interface Location {
  id: string;
  name: string;
  company: string;
  type: string;
  address: string;
  contactPerson: string;
  contactNo: string;
  email: string;
}

export interface DispatchRule {
  id: string;
  name: string;
  description: string;
  company: string;
  location: string;
  user: string;
  locationsList: string[];
  personnelsList: string[];
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface Brand {
  id: string;
  department: string;
  name: string;
  description: string;
}

export interface TimeMotionRule {
  id: string;
  variable: string;
  taskIssue: string;
  duration: string; // e.g., "1 day, 2 hours"
  durationDays: number;
  durationHours: number;
  durationMinutes: number;
  durationSeconds: number;
  level: "Easy" | "Medium" | "Hard" | string;
}

export interface TicketServiceType {
  id: string;
  name: string;
  description: string;
}

// Initial values matching the user's screenshot layout exactly
export const initialManageUsers: ManageUser[] = [
  {
    id: "user-1",
    username: "endless.waltz",
    firstname: "Endless",
    lastname: "Waltz",
    company: "i686 Online Shop",
    role: "Administrator",
    department: "System Administration",
    contactNo: "+63 908 443 6612",
    email: "endless.waltz@avasiaonline.com"
  },
  {
    id: "user-2",
    username: "apasia",
    firstname: "Alex",
    lastname: "Pasia",
    company: "i686 Online Shop",
    role: "Administrator",
    department: "System Administration",
    contactNo: "+63 917 112 3456",
    email: "apasia@avasiaonline.com"
  },
  {
    id: "user-3",
    username: "",
    firstname: "",
    lastname: "",
    company: "i686 Online Shop",
    role: "Personnel",
    department: "Tech Support",
    contactNo: "+63 915 000 1111",
    email: "personnel@avasiaonline.com"
  },
  {
    id: "user-4",
    username: "lance",
    firstname: "Lance",
    lastname: "Fabregas",
    company: "i686 Online Shop",
    role: "Client",
    department: "Client Operations",
    contactNo: "+63 908 443 6612",
    email: "fabregaslance3144@gmail.com"
  },
  {
    id: "user-5",
    username: "client",
    firstname: "Ance",
    lastname: "Ance",
    company: "i686 Online Shop",
    role: "Client",
    department: "Client Operations",
    contactNo: "+63 918 222 3333",
    email: "ance.ance@avasiaonline.com"
  },
  {
    id: "user-6",
    username: "client123",
    firstname: "Client",
    lastname: "Client",
    company: "i686 Online Shop",
    role: "Client",
    department: "Client Operations",
    contactNo: "+63 919 444 5555",
    email: "client123@avasiaonline.com"
  }
];

export const initialEmailSettings: EmailSettings = {
  email: "me@example.com",
  smtpServer: "smtp.gmail.com",
  smtpPort: "465",
  imapString: "{imap.googlemail.com:993/imap/ssl}"
};

export const initialSmsTemplates: SmsTemplate[] = []; // Matches screenshot "No data found . . ."

export const initialCompanies: Company[] = [
  {
    id: "comp-1",
    name: "i686 Online Shop",
    type: "Provider",
    address: "Manila, Philippines",
    contactPerson: "Alex Pasia",
    contactNo: "+63 917 112 3456",
    email: "apasia@avasiaonline.com"
  }
];

export const initialLocations: Location[] = [
  {
    id: "loc-1",
    name: "Head Office",
    company: "i686 Online Shop",
    type: "Office",
    address: "Avasia Tower, Makati City",
    contactPerson: "Alex Pasia",
    contactNo: "+63 917 112 3456",
    email: "apasia@avasiaonline.com"
  }
];

export const initialDispatchRules: DispatchRule[] = [
  {
    id: "rule-1",
    name: "Lance",
    description: "Repair",
    company: "i686 Online Shop",
    location: "Head Office",
    user: "Alex Pasia",
    locationsList: ["Head Office"],
    personnelsList: ["Alex Pasia", "Endless Waltz"]
  },
  {
    id: "rule-2",
    name: "W",
    description: "Repair",
    company: "i686 Online Shop",
    location: "Head Office",
    user: "Endless Waltz",
    locationsList: ["Head Office"],
    personnelsList: ["Alex Pasia", "Endless Waltz"]
  },
  {
    id: "rule-3",
    name: "Nicole",
    description: "Problem",
    company: "i686 Online Shop",
    location: "Head Office",
    user: "Alex Pasia",
    locationsList: ["Head Office"],
    personnelsList: ["Alex Pasia", "Endless Waltz"]
  },
  {
    id: "rule-4",
    name: "Nice",
    description: "Problem",
    company: "i686 Online Shop",
    location: "Head Office",
    user: "Alex Pasia",
    locationsList: ["Head Office"],
    personnelsList: ["Alex Pasia", "Endless Waltz"]
  },
  {
    id: "rule-5",
    name: "L",
    description: "Problem",
    company: "i686 Online Shop",
    location: "Head Office",
    user: "Alex Pasia",
    locationsList: ["Head Office"],
    personnelsList: ["Alex Pasia", "Endless Waltz"]
  }
];

export const initialDepartments: Department[] = [
  {
    id: "dept-1",
    name: "System Administration",
    description: "System Administration"
  },
  {
    id: "dept-2",
    name: "Tech Support",
    description: "Tech Support"
  }
];

export const initialBrands: Brand[] = [
  {
    id: "brand-1",
    department: "System Administration",
    name: "HP",
    description: "Printer"
  }
];

export const initialTimeMotionRules: TimeMotionRule[] = []; // Matches screenshot "No data found . . ."

export const initialTicketServiceTypes: TicketServiceType[] = [
  {
    id: "tst-1",
    name: "Repair",
    description: "Repair"
  }
];
