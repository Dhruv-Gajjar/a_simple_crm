export const enum CLIENT_STATUS {
  Active = "active",
  InActive = "in_active",
  Lead = "lead",
  Rejected = "rejected",
}

export const enum PROJECT_STATUS {
  Todo = "todo",
  Completed = "completed",
  OnHold = "on_hold",
  InProgress = "in_progress",
  Canceled = "canceled",
}

export const enum INVOICES_STATUS {
  Draf = "draft",
  Paid = "paid",
  Sent = "sent",
}

export interface Client {
  ID: string;
  name: string;
  email: string;
  source: string;
  status: CLIENT_STATUS;
  phoneNumber: string;
  remarks?: string;
  Projects: Project[];
}

export type NewClient = Omit<Client, "ID" | "Projects">;

export interface Project {
  ID: string;
  name: string;
  description: string;
  status: PROJECT_STATUS;
  clientId: string;
  startDate: Date;
  endDate: Date;
  total_cost: number;
  iterations: number;

  Transactions: Transactions[];
  Notes: Notes[];
  Invoices: Invoices[];
}

export interface Transactions {
  ID: string;
  projectId: string;
  amount_paid: number;
  paymentMethod: string;
  paymentDate: Date;
  CreatedAt: Date;
}

export interface Notes {
  ID: string;
  projectId: string;
  content: string;
  CreatedAt: Date;
}

export interface Invoices {
  ID: string;
  projectId: string;
  invoiceNumber: number;
  amount: number;
  status: INVOICES_STATUS;
  issueDate: Date;
  dueDate: Date;
  CreatedAt: Date;
}
