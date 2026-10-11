export const site = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || "UCR Filing Service",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "(800) 555-0100",
};

export const disclaimer = `${site.name} is a private, third-party filing service. We are not affiliated with, endorsed by, or acting on behalf of the Unified Carrier Registration (UCR) Plan, the FMCSA, or any government agency. You can register directly with the UCR Plan at ucr.gov. Our price includes the official UCR fee plus our service fee.`;
