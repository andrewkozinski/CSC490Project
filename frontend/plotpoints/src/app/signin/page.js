import Header from "../components/Header";
import TextField from "../components/TextField";

export default function SignIn() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 justify-center items-center">
        <div className="flex flex-col gap-4 w-1/4">
          <TextField label="Email" type="email" name="email" placeholder="Enter your email" />
          <TextField label="Password" type="password" name="password" placeholder="Enter your password" />
          <p className="mt-4 text-blue-500 cursor-pointer hover:underline">
            Submit
          </p>
        </div>
      </div>
    </div>
  );
}