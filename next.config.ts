import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/download/windows',
        destination: 'https://github.com/thvgger/swiftlearn.exe/releases/latest/download/CBT-Setup.exe',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
