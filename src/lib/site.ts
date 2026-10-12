export const site = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || "GetUCRFiling",
  url: (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/+$/, ""),
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "(800) 555-0100",
  legal: {
    entityName: process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME || "[Legal entity name]",
    address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "[Business mailing address]",
    regNumber: process.env.NEXT_PUBLIC_LEGAL_REG_NUMBER || "",
    governingLaw: process.env.NEXT_PUBLIC_GOVERNING_LAW || "the Republic of Armenia",
    disputeVenue: process.env.NEXT_PUBLIC_DISPUTE_VENUE || "Yerevan, Republic of Armenia",
  },
};

export const disclaimer = `${site.name} is a private company that provides automated UCR filing software. We are not affiliated with, endorsed by, or acting on behalf of the Unified Carrier Registration (UCR) Plan, the FMCSA, or any government agency. You can register directly with the UCR Plan at ucr.gov. Our price includes the official UCR fee plus our software fee, shown separately at checkout.`;
