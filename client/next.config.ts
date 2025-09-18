import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eimgjys.fxeyee.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.souhei.com.cn",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "resources1.interface003.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.zy223.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
