import Footer from "@/app/components/Footer";
import Header from "../../components/Header";
import FollowProfile from "@/app/components/FollowProfile";

export default function following() {
  return (
    <div>
      <Header></Header>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-3/4 h-full bottom-0 text-center shadow-lg mb-3 outline-transparent">
          <FollowProfile name="max" desc="yerrr"></FollowProfile>
          <FollowProfile></FollowProfile>
          <FollowProfile></FollowProfile>
          <FollowProfile></FollowProfile>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
