import Star from "./Star";
import ReviewText from "./ReviewText";
import { useSettings } from "../context/SettingsProvider";

export default function ProfileReview({ reviewData }) {

    const {title, img, review_text, rating, media_type, media_id} = reviewData || {
        title: "Superman",
        img: "https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg",
        review_text: "An awesome take on a classic superhero story!",
        rating: 5,
        media_type: "movie",
        media_id: 1061474
    };
    
    // const showReviewText = true;
    const { reviewText: showReviewText } = useSettings();

    return (
        <div className="flex flex-row rounded-[1px] max-w-full gap-4">
            <img
                src={img}
                title={title}
                className="min-w-27 min-h-37 max-w-27 min-h-37 rounded-sm hover:outline-1 hover:outline-black hover:outline-offset-3 hover:cursor-pointer"
                onClick={() => window.location.href = `/${media_type}/review/${media_id}`}
            />
            <div className="grid grid-rows-2 inline-block ">
                    <h1 className="text-2xl text-start inria-serif-regular mb-2">{title}</h1>
                    <div className="flex flex-row justify-start mb-3">
                    {[...Array(5)].map((_, i) => {
                        const value = i + 1;
                        return (
                            <Star
                                key={value}
                                className={`w-6 h-6 ${
                                value <= rating
                                    ? "fill-black stroke-neutral-950"
                                    : "fill-transparent stroke-neutral-950"
                                }`}
                                />
                                );
                                })}
                    </div>
                    {/* <p className="w-full text-sm">{review_text}</p> */}
                    {showReviewText == true ? 
                    <ReviewText className="w-full text-sm" content={review_text} /> 
                    : <div/> }
                    
            </div>    
            
        </div>
    );
}
