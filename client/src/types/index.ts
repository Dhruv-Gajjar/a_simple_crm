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

export const enum TRANSACTION_STATUS {
  Pending = "pending",
  Paid = "paid",
  Failed = "failed",
}

export const enum INVOICES_STATUS {
  Draft = "draft",
  Paid = "paid",
  Sent = "sent",
  Overdue = "overdue",
}

export const enum WORKSPACE_ROLE {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
}

export type ResponsePayload<T> = {
  message: string;
  result: T;
  error: boolean;
};

export interface Signup {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}

export interface Signin {
  username: string;
  passwordHash: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  memberships: WorkspaceMember[];
  accessToken: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  source: string;
  status: CLIENT_STATUS;
  phoneNumber?: string;
  remarks?: string;
  projects?: Project[];
  workspaceId: string;
  workspace?: Workspace;

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
  client?: Client;
  startDate: Date;
  endDate: Date;
  totalAmount?: number;
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
  project?: Project;
  amount?: number;
  amountPaid?: number;
  paymentMethod?: string;
  paymentDate?: Date;
  status: TRANSACTION_STATUS;
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

export interface DashboardAnalytics {
  totalActiveClients: number;
  totalActiveProjects: number;
  totalEarnings: number;
  activeProjects: Project[];
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  members?: WorkspaceMember[];
  clients?: Client[];
}

export type NewWorkspace = Omit<Workspace, "id" | "createdAt" | "isActive">;

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WORKSPACE_ROLE;
  workspace: Workspace;
  user: User;
}
