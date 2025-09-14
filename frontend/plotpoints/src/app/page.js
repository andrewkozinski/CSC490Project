import TextBox from "./components/TextBox";
import Test from "./components/Test";

export default function Home() {
  return (
    <div>
      <TextBox/>
      <Test heading="The heading" subheading="this is a description"/>
    </div>
  );
}
