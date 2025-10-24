/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["books.google.com", "placehold.co", "covers.openlibrary.org", "image.tmdb.org", "idmldn7fblfn.objectstorage.us-ashburn-1.oraclecloud.com", "objectstorage.us-ashburn-1.oraclecloud.com"],
        dangerouslyAllowSVG: true
    },
};

export default nextConfig;
