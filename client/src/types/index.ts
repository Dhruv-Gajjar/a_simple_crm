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

export type ResponsePayload<T> = {
  message: string;
  data: T;
  error: boolean;
};

export type ProjectResponse = {
  projects: Project[];
  total_project: number;
  active_projects: number;
};

export interface Client {
  id: string;
  ID?: string;
  name: string;
  email: string;
  source: string;
  status: CLIENT_STATUS;
  phoneNumber?: string;
  phone_number?: string;
  remarks?: string;
  projects?: Project[];
  Projects?: Project[];

  createdAt?: Date;
  CreatedAt?: Date;
  updatedAt?: Date;
  UpdatedAt?: Date;
  deletedAt?: Date | null;
  DeletedAt?: Date | null;
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
  start_date?: Date;
  end_date?: Date;
  total_cost?: number;
  totalCost?: number;
  iterations: number;

  transactions: Transactions[];
  notes: Notes[];
  invoices: Invoices[];
}

export type NewProject = Omit<
  Project,
  "id" | "transactions" | "notes" | "invoices"
>;

export interface Transactions {
  iD: string;
  projectId: string;
  amount_paid: number;
  paymentMethod: string;
  paymentDate: Date;
  createdAt: Date;
}

export interface Notes {
  iD: string;
  projectId: string;
  content: string;
  createdAt: Date;
}

export interface Invoices {
  iD: string;
  projectId: string;
  invoiceNumber: number;
  amount: number;
  status: INVOICES_STATUS;
  issueDate: Date;
  dueDate: Date;
  createdAt: Date;
}
