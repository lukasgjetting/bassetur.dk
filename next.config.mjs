/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3e2ujpzrqrpi2.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  rewrites: async () => {
    return [
      {
        source: `/bryllup/${encodeURIComponent("ønskeliste")}`,
        destination: "/bryllup/oenskeliste",
      },
    ];
  },
  redirects: async () => {
    return [
      {
        source: `/${encodeURIComponent("ønskeliste")}`,
        destination: "/bryllup/ønskeliste",
        permanent: true,
      },
      {
        source: "/drikkevarer",
        destination: "/bryllup/drikkevarer",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
