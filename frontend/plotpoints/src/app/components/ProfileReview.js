import Star from "./Star";
import "./ProfilePage.css";

export default function ProfileReview() {
    return (
        <div className="grid grid-cols-2 rounded-[1px] hover:outline-offset-5 hover:outline-1 w-max" onClick={() => window.location.href = `/movies/review/1061474`}>
            <img
                src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg"
                itle="Superman 2025"
                className="min-w-25 min-h-37 max-w-25 min-h-37 rounded-sm hover:cursor-pointer"
                onClick={() => window.location.href = `/movies/review/1061474`}
            />
            <div className="grid grid-rows-2 inline-block -ml-25">
                    <h1 className="text-2xl text-start inria-serif-regular mb-2">Superman</h1>
                    <div className="flex flex-row justify-start mb-3">
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
                    <p className="w-80">{"An awesome take on a classic superhero story!"}</p>
            </div>    
            
        </div>
    );
}
