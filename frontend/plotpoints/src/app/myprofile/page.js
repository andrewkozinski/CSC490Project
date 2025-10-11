import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

export default function ProfilePage(){
    return (
        <div>   
            <Header/>
            <div className="grid grid-cols-4 gap-5 justify-center">
                <div className="items-center justify-center m-10 border-2 w-70">
                    <img 
                    className="aspect-square rounded-full w-55 h-55 border-2 border-[#dfcdb5]" 
                    src="/images/cat.jpg">
                    </img>
                    {/* Get username */}
                    <h1 className="text-4xl text-center inria-serif-regular">tank</h1>
                    <p>User's bio here</p>
                </div>
                <div className="cols-span-3">
                    <div className="flex gap-5 overflow-y-auto px-10 py-5 h-70 items-center">

                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}