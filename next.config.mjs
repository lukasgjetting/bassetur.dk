const wishListUrl = "https://onskeskyen.dk/da/wishlists/g058o6e1yfIWuJYr";

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
  redirects: async () => {
    return [
      {
        source: `/${encodeURIComponent("ønskeliste")}`,
        destination: wishListUrl,
        permanent: true,
      },
      {
        source: `/bryllup/${encodeURIComponent("ønskeliste")}`,
        destination: wishListUrl,
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
