import type { Certificate } from "@/types";

export const certificates: Certificate[] = [
  {
    id: "google-chrome-devtools-user",
    title: "Chrome DevTools User",
    issuer: "Google Developers",
    type: "badge",
    skills: ["Chrome", "DevTools"],
    credentialUrl:
      "https://developers.google.com/profile/badges/activity/chrome-devtools/chrome-devtools-user",
    image: {
      url: "/badges/chrome-devtools-user.svg",
      publicId: "certificates/google-chrome-devtools-user",
      alt: "Google Developers Chrome DevTools User badge",
    },
  },
  {
    id: "google-sdk-platform-tools",
    title: "Android SDK Platform Tools",
    issuer: "Google Developers",
    type: "badge",
    skills: ["Android", "SDK Platform Tools"],
    credentialUrl:
      "https://developers.google.com/profile/badges/activity/android/sdk-platform-tools",
    image: {
      url: "/badges/sdk-platform-tools.svg",
      publicId: "certificates/google-sdk-platform-tools",
      alt: "Google Developers Android SDK Platform Tools badge",
    },
  },
  {
    id: "google-install-android-studio",
    title: "Android Studio User",
    issuer: "Google Developers",
    type: "badge",
    skills: ["Android Studio"],
    credentialUrl:
      "https://developers.google.com/profile/badges/activity/android/install-android-studio",
    image: {
      url: "/badges/install-android-studio.svg",
      publicId: "certificates/google-install-android-studio",
      alt: "Google Developers Android Studio User badge",
    },
  },
  {
    id: "google-install-android-studio-quail",
    title: "Android Studio - Quail releases",
    issuer: "Google Developers",
    type: "badge",
    skills: ["Android Studio"],
    credentialUrl:
      "https://developers.google.com/profile/badges/activity/android/install-android-studio-quail",
    image: {
      url: "/badges/install-android-studio-quail.png",
      publicId: "certificates/google-install-android-studio-quail",
      alt: "Google Developers Android Studio - Quail releases badge",
    },
  },
  {
    id: "google-learnings",
    title: "Learnings",
    issuer: "Google Developers",
    type: "badge",
    skills: ["Google Developer Program"],
    credentialUrl:
      "https://developers.google.com/profile/badges/recognitions/learnings",
    image: {
      url: "/badges/learnings.svg",
      publicId: "certificates/google-learnings",
      alt: "Google Developers Learnings badge",
    },
  },
];

export function getCertificates(): Certificate[] {
  return certificates;
}

export function getCertificateById(id: string): Certificate | undefined {
  return certificates.find((c) => c.id === id);
}
