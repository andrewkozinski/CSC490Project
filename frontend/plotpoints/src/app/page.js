import TextBox from "./components/TextBox";
import Test from "./components/Test";
import Button from "./components/Button";

export default function Home() {
  return (
    <div>
      <TextBox/>
      <Test heading="The heading" subheading="this is a description"/>
      <div className="absolute top-0 right-0 m-4">
      <Button>Sign In</Button>
      </div>
    </div>
  );
}
