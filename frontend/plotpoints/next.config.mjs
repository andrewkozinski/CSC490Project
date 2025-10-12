/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["books.google.com", "placehold.co", "covers.openlibrary.org"],
        dangerouslyAllowSVG: true
    },
};

export default nextConfig;
