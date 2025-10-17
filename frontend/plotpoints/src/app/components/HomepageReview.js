import Star from "./Star";

export default function HomepageReview({reviewData}) {
    return (
        <div className="grid grid-cols-2 rounded-[1px] w-max" onClick={() => window.location.href = `/movies/review/1061474`}>
            <img
                src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg"
                itle="Superman 2025"
                className="min-w-25 min-h-37 max-w-25 min-h-37 rounded-sm hover:cursor-pointer"
                onClick={() => window.location.href = `/movies/review/1061474`}
            />
            <div className="grid grid-rows-2 inline-block -ml-25">
                <h1 className="text-2xl text-start inria-serif-regular mb-2">Superman</h1>
                <div className="flex flex-row items-center gap-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent border-2 m-2 cursor-pointer shrink-0">
                    {/*profile pic*/}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-gray-700"
                    >         
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                    </svg>
                    </div>    
                    <p className="-ml-1">Username</p>
                    <div className="flex flex-row justify-start">
                    {[...Array(5)].map((_, i) => {
                        const value = i + 1;
                        return (
                            <Star
                                key={value}
                                className="fill-[#FFFC00] stroke-neutral-950 w-6 h-6"
                                />
                                );
                                })}
                    </div>
                </div>
                
                
                    
                <p className="w-80 text-sm">{"An awesome take on a classic superhero story!"}</p>
            </div>    
            
        </div>
    );
}