export const siteConfig = {
  name: "HZ IT Company",
  legalName: "HZ IT Company",
  url: "https://hzitcompany.com",
  tagline: "IT services and software development for growing teams",
  defaultTitle: "HZ IT Company | IT Services & Software Development",
  defaultDescription:
    "HZ IT Company builds secure, high-performance web and mobile products. We provide custom software development, cloud, cybersecurity, UI/UX, and IT consulting.",
  locale: "en_US",
  themeColor: "#2563eb",
  contact: {
    email: "contact@hzit.com",
    phone: "+1 (555) 123-4567",
    whatsapp: "+15551234567",
  },
  address: {
    streetAddress: "123 Tech Street",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    postalCode: "94105",
    addressCountry: "US",
  },
  socials: {
    linkedin: "https://www.linkedin.com/company/hz-it-company",
    twitter: "https://twitter.com/hzitcompany",
    github: "https://github.com/hzitcompany",
  },
  // Put a real hosted image in /public for best SEO. This path assumes you add it later.
  defaultOgImage: "/og-image.png",
} as const;

export type SiteConfig = typeof siteConfig;
