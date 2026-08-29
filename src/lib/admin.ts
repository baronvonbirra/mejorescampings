import localCampings from '../data/campings.json';

export const ADMIN_PASSKEY = 'C4mp1n64l1f3';

export interface AdminCampsiteStatus {
  slug: string;
  isPromoted: boolean;
  isDisabled: boolean;
  lastRescrapedAt?: string;
}

export function verifyAdminPassword(inputKey: string): boolean {
  return inputKey === ADMIN_PASSKEY;
}

export function auditCampsiteQuality(campings: any[]) {
  const brokenPhotos: any[] = [];
  const lowQuality: any[] = [];
  const missingAiDesc: any[] = [];

  for (const c of campings) {
    if (!c.image_url || c.image_url.includes('placeholder') || (c.image_urls && c.image_urls.length === 0)) {
      brokenPhotos.push(c);
    }
    if ((c.quality_score || 0) < 7.0 && (c.rating || 0) < 4.0) {
      lowQuality.push(c);
    }
    if (!c.ai_description) {
      missingAiDesc.push(c);
    }
  }

  return {
    brokenPhotos,
    lowQuality,
    missingAiDesc,
    totalCount: campings.length
  };
}
