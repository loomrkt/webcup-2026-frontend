import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*"],
  productionBrowserSourceMaps: false,
  output: "standalone",
  async redirects() {
    return [
      { source: "/services/status", destination: "/services?tab=status", permanent: true },
      { source: "/glossary", destination: "/services?tab=glossary", permanent: true },
      { source: "/ideas", destination: "/participation?tab=ideas", permanent: true },
      { source: "/projects", destination: "/participation?tab=projects", permanent: true },
      { source: "/consultations", destination: "/participation?tab=consultations", permanent: true },
      { source: "/support", destination: "/participation?tab=support", permanent: true },
      { source: "/profile", destination: "/account?tab=profile", permanent: true },
      { source: "/security", destination: "/account?tab=security", permanent: true },
      { source: "/settings/accessibility", destination: "/account?tab=accessibility", permanent: true },
      { source: "/data-concerns", destination: "/account?tab=data", permanent: true },
      { source: "/data-export", destination: "/account?tab=data", permanent: true },
      { source: "/places/emergency", destination: "/places?tab=emergency", permanent: true },
      { source: "/agent/dashboard", destination: "/agent?tab=dashboard", permanent: true },
      { source: "/agent/requests", destination: "/agent?tab=requests", permanent: true },
      { source: "/agent/communications", destination: "/agent?tab=communications", permanent: true },
      { source: "/agent/audit", destination: "/agent?tab=audit", permanent: true },
      { source: "/admin/users", destination: "/admin?tab=users", permanent: true },
      { source: "/admin/services", destination: "/admin?tab=services", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "5000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
