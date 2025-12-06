import { randomTennaLoading } from "@/lib/random_tenna_loading";

export default function SkeletonImage({ useTennaImage = false }) {
    return (
        <div
            style={{ width: '130px', height: '195px' }}
            className="rounded-md overflow-hidden bg-gray-200 flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]"
        >
            {useTennaImage ? (
                <img
                    src={randomTennaLoading()}
                    alt="Loading..."
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
            )}
        </div>
    );
}