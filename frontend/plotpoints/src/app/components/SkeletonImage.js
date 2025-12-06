import { randomTennaLoading } from "@/lib/random_tenna_loading";

export default function SkeletonImage() {
    return (
        <div
            style={{ width: '130px', height: '195px' }}
            className="rounded-md overflow-hidden bg-gray-200 animate-[pulse_3s_ease-in-out_infinite]"
        >
            <img
                src={randomTennaLoading()}
                alt="Loading..."
                className="w-full h-full object-cover"
            />
            <div className="w-full h-full bg-gray-500" />
        </div>
    );
}
