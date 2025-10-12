/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["books.google.com", "placehold.co", "covers.openlibrary.org", "image.tmdb.org"],
        dangerouslyAllowSVG: true
    },
};

export default nextConfig;
