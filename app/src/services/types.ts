// Verträge für alle Backend-Dienste. Screens sprechen nur mit diesen Interfaces;
// welche Umsetzung dahinter läuft (Mock oder echt), entscheidet src/services/index.ts.

export type Visibility = 'private' | 'group' | 'public';
export type ClipStyle = 'short' | 'detailed' | 'quiz';
export type AuthProvider = 'apple' | 'google';

export interface User {
  id: string;
  name: string;
  initials: string;
}

export interface Question {
  prompt: string;
  options: readonly [string, string, string];
  correctIndex: 0 | 1 | 2;
  explanation: string;
}

export interface Clip {
  id: string;
  topicId: string;
  title: string;
  /** Merksatz. Das Wort in `**…**` wird im Feed grün hervorgehoben. */
  merksatz: string;
  durationSec: number;
  likes: number;
  comments: number;
  author: string;
  authorId: string;
  visibility: Visibility;
  questions: readonly Question[];
}

export interface Topic {
  id: string;
  name: string;
  progress: number;
  clipCount: number;
}

export interface Group {
  id: string;
  name: string;
  subject: string;
  members: number;
  liveCount: number;
  joined: boolean;
}

export type DuelStatus = 'open' | 'running' | 'done';

export interface Duel {
  id: string;
  opponent: string;
  clipId: string;
  status: DuelStatus;
  myScore: number;
  opponentScore: number;
}

export interface MaterialItem {
  id: string;
  title: string;
  status: 'ready' | 'processing' | 'private';
  visibility: Visibility;
  clipId?: string;
}

export type UploadSource = { kind: 'pdf' | 'photo' | 'text'; value: string };

export interface UploadInput {
  source: UploadSource;
  style: ClipStyle;
  visibility: Visibility;
  rightsConfirmed: boolean;
}

export type JobStep = 'upload' | 'extract' | 'generate' | 'done' | 'failed';

export interface JobStatus {
  id: string;
  step: JobStep;
  progress: number;
  clipId?: string;
}

export interface AuthService {
  signIn(provider: AuthProvider): Promise<User>;
  signOut(): Promise<void>;
  /** Löscht Konto und alle Daten. Pflicht laut App Review (Konto muss löschbar sein). */
  deleteAccount(): Promise<void>;
}

export interface ClipService {
  feed(): Promise<Clip[]>;
  clip(id: string): Promise<Clip | undefined>;
  topics(): Promise<Topic[]>;
  groups(): Promise<Group[]>;
  group(id: string): Promise<Group | undefined>;
  duels(): Promise<Duel[]>;
  material(): Promise<MaterialItem[]>;
  createJob(input: UploadInput): Promise<string>;
  job(id: string): Promise<JobStatus>;
  report(clipId: string, reason: string): Promise<void>;
  blockUser(userId: string): Promise<void>;
}

export interface Package {
  identifier: 'pro_yearly' | 'pro_semester';
  title: string;
  priceString: string;
  perMonthString: string;
  period: string;
}

export interface Offering {
  identifier: 'default';
  packages: readonly Package[];
}

export interface CustomerInfo {
  entitlements: {
    active: Record<string, { identifier: string; expirationDate: string | null; productIdentifier: string }>;
  };
}

export interface PurchaseService {
  offering(): Promise<Offering>;
  customerInfo(): Promise<CustomerInfo>;
  purchase(packageId: Package['identifier']): Promise<CustomerInfo>;
  restore(): Promise<CustomerInfo>;
}

export interface VideoService {
  /** Mux-Playback-URL für einen Asset. */
  playbackUrl(assetId: string): string;
  createUpload(): Promise<{ uploadUrl: string; assetId: string }>;
}

export interface Services {
  auth: AuthService;
  clips: ClipService;
  purchases: PurchaseService;
  video: VideoService;
}

/** Entitlement-ID aus dem RevenueCat-Dashboard. */
export const PRO_ENTITLEMENT = 'pro';
