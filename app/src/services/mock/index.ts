import { clips, duels, groups, material, mockUser, topics } from '@/data/mock';
import type {
  CustomerInfo,
  JobStatus,
  Offering,
  Package,
  Services,
  UploadInput,
} from '@/services/types';
import { PRO_ENTITLEMENT } from '@/services/types';

// Mock-Umsetzung: läuft ohne Netz und simuliert kurze Wartezeiten.
const wait = (ms = 250) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const offeringPackages: readonly Package[] = [
  {
    identifier: 'pro_yearly',
    title: 'Jahres-Abo',
    priceString: '39,99 €',
    perMonthString: '3,33 €',
    period: '1 Jahr',
  },
  {
    identifier: 'pro_semester',
    title: 'Semester-Abo',
    priceString: '12,99 €',
    perMonthString: '2,17 €',
    period: '6 Monate',
  },
];

// Mock-Zustand, nur für Simulator-Durchläufe.
let proExpiry: string | null = null;
let jobs: Record<string, { startedAt: number; input: UploadInput }> = {};
let blocked = new Set<string>();

const customerInfo = (): CustomerInfo => ({
  entitlements: {
    active: proExpiry
      ? {
          [PRO_ENTITLEMENT]: {
            identifier: PRO_ENTITLEMENT,
            expirationDate: proExpiry,
            productIdentifier: 'pro_yearly',
          },
        }
      : {},
  },
});

const jobStatus = (id: string): JobStatus => {
  const job = jobs[id];
  if (!job) return { id, step: 'failed', progress: 0 };
  const elapsed = Date.now() - job.startedAt;
  if (elapsed < 2000) return { id, step: 'upload', progress: 0.2 };
  if (elapsed < 4500) return { id, step: 'extract', progress: 0.5 };
  if (elapsed < 7000) return { id, step: 'generate', progress: 0.85 };
  return { id, step: 'done', progress: 1, clipId: clips[0]?.id };
};

export const mockServices: Services = {
  auth: {
    async signIn() {
      await wait();
      return mockUser;
    },
    async signOut() {
      await wait(100);
      proExpiry = null;
    },
    async deleteAccount() {
      await wait();
      proExpiry = null;
      jobs = {};
      blocked = new Set();
    },
  },
  clips: {
    async feed() {
      await wait();
      return clips.filter((c) => c.visibility === 'public' && !blocked.has(c.authorId));
    },
    async clip(id) {
      await wait(100);
      return clips.find((c) => c.id === id);
    },
    async topics() {
      await wait();
      return topics;
    },
    async groups() {
      await wait();
      return groups;
    },
    async group(id) {
      await wait(100);
      return groups.find((g) => g.id === id);
    },
    async duels() {
      await wait();
      return duels;
    },
    async material() {
      await wait();
      return material;
    },
    async createJob(input) {
      await wait(150);
      const id = `job-${Date.now()}`;
      jobs[id] = { startedAt: Date.now(), input };
      return id;
    },
    async job(id) {
      await wait(100);
      return jobStatus(id);
    },
    async report() {
      await wait();
    },
    async blockUser(userId) {
      await wait(100);
      blocked.add(userId);
    },
  },
  purchases: {
    async offering(): Promise<Offering> {
      await wait();
      return { identifier: 'default', packages: offeringPackages };
    },
    async customerInfo() {
      await wait(100);
      return customerInfo();
    },
    async purchase(packageId) {
      await wait(800);
      const pkg = offeringPackages.find((p) => p.identifier === packageId);
      if (!pkg) throw new Error('Unbekanntes Paket');
      proExpiry = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString();
      return customerInfo();
    },
    async restore() {
      await wait();
      return customerInfo();
    },
  },
  video: {
    playbackUrl(assetId) {
      return `https://stream.mux.com/${assetId}.m3u8`;
    },
    async createUpload() {
      await wait(100);
      return { uploadUrl: 'https://mock.invalid/upload', assetId: `asset-${Date.now()}` };
    },
  },
};
