import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/download/windows',
        destination: 'https://github.com/thvgger/swiftlearn.exe/releases/download/latest/CBT-Setup-Offline.exe',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
