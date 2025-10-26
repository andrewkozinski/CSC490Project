import Star from "./Star";

export default function HomepageReview({reviewData}) {

    const {title, img, review_text, username, /*profilePicUrl,*/ rating, media_type, media_id} = reviewData || {
        title: "Superman",
        img: "https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg",
        review_text: "An awesome take on a classic superhero story!",
        username: "Username",
        //profilePicUrl: null,
        rating: 5,
        media_type: "movie",
        media_id: 1061474
    };

    return (
        <div className="grid grid-cols-2 rounded-[1px] w-max" onClick={() => window.location.href = `/${media_type}/review/${media_id}`}>
            <img
                src={img}
                title={title}
                className="min-w-25 min-h-37 max-w-25 min-h-37 rounded-sm hover:cursor-pointer"
                onClick={() => window.location.href = `/${media_type}/review/${media_id}`}
            />
            <div className="grid grid-rows-2 inline-block -ml-25">
                <h1 className="text-2xl text-start inria-serif-regular mb-2">{title}</h1>
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
                    <p className="-ml-1">{username}</p>
                    <div className="flex flex-row justify-start">
                    {[...Array(5)].map((_, i) => {
                        const value = i + 1;
                        return (
                            <Star
                                key={value}
                                className={`w-6 h-6 ${
                                value <= rating
                                    ? "fill-[#FFFC00] stroke-neutral-950"
                                    : "fill-transparent stroke-neutral-950"
                                }`}
                                />
                                );
                                })}
                    </div>
                </div>
                
                
                <p className="w-80 text-sm">{review_text}</p>
            </div>    
            
        </div>
    );
}