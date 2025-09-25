import Footer from "../components/Footer";
import Header from "../components/Header";
import TextField from "../components/TextField";

export default function SignUp() {
  return (
    ////Flex box to make space for image on the right*/
    <div>
      <Header />
      <div className="flex min-h-screen mt-20 mx-20">
        <div className="flex flex-col gap-2">
          <TextField label="Username" type="text" name="username" placeholder="Enter your username" />
          <TextField label="Email" type="email" name="email" placeholder="Enter your email" />
          <TextField label="Password" type="password" name="password" placeholder="Enter your password" />
          <TextField label="Re-Enter Password" type="password" name="confirmPassword" placeholder="Re-enter your password" />
          <p className="text-blue-500 cursor-pointer hover:underline">
          Submit
          </p>
        </div>
      </div>
      <Footer/>
    </div>
    );
}