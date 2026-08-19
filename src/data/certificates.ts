import type { Certificate } from "@/types";

export const certificates: Certificate[] = [];

export function getCertificates(): Certificate[] {
  return certificates;
}

export function getCertificateById(id: string): Certificate | undefined {
  return certificates.find((c) => c.id === id);
}
