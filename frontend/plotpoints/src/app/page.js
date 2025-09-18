import TextBox from "./components/TextBox";
import Test from "./components/Test";
import Button from "./components/Button";

export default function Home() {
  return (
    <div>
      <Test heading="WELCOME TO PLOT POINTS!" subheading="We are developing a movie, TV show, and book review site to help individuals share their thoughts and opinions on movies and shows they’ve seen or books they’ve read with their friends, family, and anyone else online, in order to have a better idea as to where they should choose to spend their time on certain media over another."/>
      <Button>Sign In</Button>
      </div>
  );
}
