"use client";
import Star from "./Star";
import { randomTennaLoading } from "@/lib/random_tenna_loading";

export default function HomepageReviewSkeleton({ useTennaImage = false, oneInAMillionTenna = true }) {
    
    const showTenna = useTennaImage || (oneInAMillionTenna && Math.random() < 1 / 1000000);

    return (
        <div className="flex flex-row rounded-[1px] w-max gap-4 animate-[pulse_2s_ease-in-out_infinite]">
            {/*Image Placeholder for the media image (movie poster, book cover, etc.)*/}
            <div
                className="max-w-27 max-h-42 rounded-sm bg-gray-200 flex items-center justify-center"
                style={{ width: '108px', height: '168px' }}
            >
                {showTenna ? (
                    <img
                        src={randomTennaLoading()}
                        alt="Loading..."
                        className="w-full h-full object-cover"
                    />
                ) : (
                    //<div className="w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin" /> //Loading spinner here
                    null
                )}
            </div>

            {/*Main Review Content Placeholders*/}
            <div className="grid grid-rows-2 inline-block gap-2 w-80">
                {/*Title*/}
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />

                {/*Username and the rating*/}
                <div className="flex flex-row items-center gap-2">
                    {/*Profile picture placeholder*/}
                    <div className="w-11 h-11 rounded-full bg-gray-300" />

                    {/*Username placeholder*/}
                    <div className="h-4 bg-gray-300 rounded w-1/3" />

                    {/*Rating placeholder 
                       Not sure how exactly to use the star stuff so im just kinda not doing it
                    */}
                    {/* <div className="flex flex-row justify-start gap-1">
                        {[...Array(5)].map((_, i) => (
                            
                        ))}
                    </div> */}
                </div>

                {/*Review text placeholder */}
                <div className="mt-2 space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-full" />
                    <div className="h-3 bg-gray-300 rounded w-5/6" />
                    <div className="h-3 bg-gray-300 rounded w-2/3" />
                </div>
            </div>
        </div>
    );
}
