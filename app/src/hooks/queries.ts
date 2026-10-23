import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { PRO_ENTITLEMENT, services } from '@/services';
import type { UploadInput } from '@/services/types';
import { useSession } from '@/store/session';

export const keys = {
  feed: ['feed'] as const,
  clip: (id: string) => ['clip', id] as const,
  topics: ['topics'] as const,
  groups: ['groups'] as const,
  group: (id: string) => ['group', id] as const,
  duels: ['duels'] as const,
  material: ['material'] as const,
  job: (id: string) => ['job', id] as const,
  offering: ['offering'] as const,
  customerInfo: ['customerInfo'] as const,
};

export const useFeed = () => useQuery({ queryKey: keys.feed, queryFn: () => services.clips.feed() });
export const useClip = (id: string) =>
  useQuery({ queryKey: keys.clip(id), queryFn: () => services.clips.clip(id) });
export const useTopics = () => useQuery({ queryKey: keys.topics, queryFn: () => services.clips.topics() });
export const useGroups = () => useQuery({ queryKey: keys.groups, queryFn: () => services.clips.groups() });
export const useGroup = (id: string) =>
  useQuery({ queryKey: keys.group(id), queryFn: () => services.clips.group(id) });
export const useDuels = () => useQuery({ queryKey: keys.duels, queryFn: () => services.clips.duels() });
export const useMaterial = () => useQuery({ queryKey: keys.material, queryFn: () => services.clips.material() });

export const useJob = (id: string) =>
  useQuery({
    queryKey: keys.job(id),
    queryFn: () => services.clips.job(id),
    refetchInterval: (query) => (query.state.data?.step === 'done' || query.state.data?.step === 'failed' ? false : 1000),
  });

export const useOffering = () => useQuery({ queryKey: keys.offering, queryFn: () => services.purchases.offering() });

/** Pro-Status aus customerInfo. Der lokale Cache dient nur als Rückfall, solange die Abfrage lädt. */
export const useCustomerInfo = () =>
  useQuery({ queryKey: keys.customerInfo, queryFn: () => services.purchases.customerInfo() });

export function useIsPro(): boolean {
  const { data } = useCustomerInfo();
  const lastKnownPro = useSession((s) => s.lastKnownPro);
  const setLastKnownPro = useSession((s) => s.setLastKnownPro);
  const active = data ? Boolean(data.entitlements.active[PRO_ENTITLEMENT]) : null;

  useEffect(() => {
    if (active !== null && active !== lastKnownPro) setLastKnownPro(active);
  }, [active, lastKnownPro, setLastKnownPro]);

  return active ?? lastKnownPro;
}

export function usePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (packageId: Parameters<typeof services.purchases.purchase>[0]) =>
      services.purchases.purchase(packageId),
    onSuccess: (info) => {
      queryClient.setQueryData(keys.customerInfo, info);
    },
  });
}

export function useRestore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => services.purchases.restore(),
    onSuccess: (info) => queryClient.setQueryData(keys.customerInfo, info),
  });
}

export function useCreateJob() {
  return useMutation({
    mutationFn: (input: UploadInput) => services.clips.createJob(input),
  });
}

export function useReport() {
  return useMutation({
    mutationFn: ({ clipId, reason }: { clipId: string; reason: string }) =>
      services.clips.report(clipId, reason),
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => services.clips.blockUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.feed }),
  });
}
