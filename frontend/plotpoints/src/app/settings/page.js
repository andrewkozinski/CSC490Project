import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Settings() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <div className="flex flex-1 justify-center items-center">
                <h1 className="text-2xl inline-block text-center">Settings</h1>
            </div>
            <Footer/>
        </div>
    );
}