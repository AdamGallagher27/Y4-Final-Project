import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */

  // i have these temporaliy disabled for testing builds
  // will remove later
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

export default nextConfig
