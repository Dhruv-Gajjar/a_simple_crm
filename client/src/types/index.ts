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
  Draft = "draft",
  Paid = "paid",
  Sent = "sent",
  Overdue = "overdue",
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
  updatedAt?: Date;
  deletedAt?: Date | null;
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
  id: string;
  projectId?: string;
  project_id?: string;
  amount_paid?: number;
  amountPaid?: number;
  paymentMethod?: string;
  payment_method?: string;
  paymentDate?: Date;
  payment_date?: Date;
  createdAt: Date;
}

export type NewTransaction = Omit<Transactions, "id" | "createdAt">;

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
