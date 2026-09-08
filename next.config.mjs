/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  // Now that the site has real sub-routes (/roles, /dashboard/hr, ...), emit
  // each one as `<route>/index.html` instead of `<route>.html`. GitHub Pages
  // will happily serve either, but the directory form also makes `/roles/`
  // (with the trailing slash a user or a share link might add) resolve
  // instead of 404-ing.
  trailingSlash: true,
};

export default nextConfig;
