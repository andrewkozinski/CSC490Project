import Header from "./components/Header";
import Test from "./components/Test";
import Icon from "./favicon.ico";

export default function Home() {
  return (
    <div>
      <Header/>
      <Test heading="The heading" subheading="this is a description"/>
    </div>
  );
}
