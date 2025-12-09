"use client";
import { randomTennaLoading } from "@/lib/random_tenna_loading";

export default function ProfileReviewSkeleton({ showReviewText = true, useTennaImage = false, randomLoadingTenna = true }) {

    const showTenna = useTennaImage || (randomLoadingTenna && Math.random() < 1 / 100);

    return (
        <div className="flex flex-row rounded-[1px] max-w-full gap-4 animate-[pulse_2s_ease-in-out_infinite]">
            {/* Poster placeholder */}
            <div
                className="max-w-27 max-h-37 min-w-27 max-w-37 rounded-sm bg-gray-200"
                style={{ width: "108px", height: "148px" }}
            >
                {showTenna ? (
                    <img
                        src={randomTennaLoading()}
                        alt="Loading..."
                        className="w-full h-full object-cover"
                    />
                ) : (
                    null
                )}
            </div>

            {/* Text + stars */}
            <div className="grid grid-rows-2 inline-block gap-2 w-full max-w-xl">
                {/* Title */}
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />

                {/* Review text */}
                {showReviewText && (
                    <div className="mt-1 space-y-2">
                        <div className="h-3 bg-gray-300 rounded w-2/3" />
                        <div className="h-3 bg-gray-300 rounded w-1/3" />
                    </div>
                )}
            </div>
        </div>
    );
}