import { mockServices } from '@/services/mock';
import { realServices } from '@/services/real';
import type { Services } from '@/services/types';

export * from '@/services/types';

// EXPO_PUBLIC_USE_MOCKS=true|false (Standard: true).
export const useMocks = process.env.EXPO_PUBLIC_USE_MOCKS !== 'false';

export const services: Services = useMocks ? mockServices : realServices;
