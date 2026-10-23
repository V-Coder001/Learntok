import { mockServices } from '@/services/mock';
import { PRO_ENTITLEMENT } from '@/services/types';

describe('Mock-Services', () => {
  it('liefert Angebot mit Jahres- und Semester-Abo aus dem Offering', async () => {
    const offering = await mockServices.purchases.offering();
    expect(offering.identifier).toBe('default');
    expect(offering.packages.map((p) => p.identifier)).toEqual(['pro_yearly', 'pro_semester']);
  });

  it('setzt Pro erst nach einem Kauf im customerInfo', async () => {
    const before = await mockServices.purchases.customerInfo();
    expect(before.entitlements.active[PRO_ENTITLEMENT]).toBeUndefined();
    const after = await mockServices.purchases.purchase('pro_semester');
    expect(after.entitlements.active[PRO_ENTITLEMENT]).toBeDefined();
  });

  it('blendet blockierte Autoren im Feed aus', async () => {
    const before = await mockServices.clips.feed();
    expect(before.length).toBeGreaterThan(0);
    await mockServices.clips.blockUser(before[0]!.authorId);
    const after = await mockServices.clips.feed();
    expect(after.find((c) => c.authorId === before[0]!.authorId)).toBeUndefined();
  });

  it('meldet einen unbekannten Job als fehlgeschlagen', async () => {
    const status = await mockServices.clips.job('gibt-es-nicht');
    expect(status.step).toBe('failed');
  });
});
