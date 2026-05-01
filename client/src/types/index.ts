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
  id: string;
  name: string;
  email: string;
  soruce: string;
  status: CLIENT_STATUS;
  phoneNumber: string;
  remarks: string;
  projects: Project[];
}

export type NewClient = Omit<Client, "id" | "projects">;

export interface Project {
  id: string;
  name: string;
  description: string;
  status: PROJECT_STATUS;
  clientId: string;
  startDate: Date;
  endDate: Date;
  total_cost: number;
  iterations: number;

  transactions: Transactions[];
  notes: Notes[];
  invoices: Invoices[];
}

export interface Transactions {
  id: string;
  projectId: string;
  amount_paid: number;
  paymentMethod: string;
  paymentDate: Date;
  createdAt: Date;
}

export interface Notes {
  id: string;
  projectId: string;
  content: string;
  createdAt: Date;
}

export interface Invoices {
  id: string;
  projectId: string;
  invoiceNumber: number;
  amount: number;
  status: INVOICES_STATUS;
  issueDate: Date;
  dueDate: Date;
  createdAt: Date;
}
