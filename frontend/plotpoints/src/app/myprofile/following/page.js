import Footer from "@/app/components/Footer";
import Header from "../../components/Header";

export default function following() {
  return (
    <div>
      <Header></Header>
      <div className="flex items-center justify-center h-screen">
        <div className="w-3/4 h-full bottom-0 text-center shadow-lg mb-3 outline-transparent"></div>
      </div>
      <Footer></Footer>
    </div>
  );
}
