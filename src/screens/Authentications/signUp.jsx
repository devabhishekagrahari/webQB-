import SignUpForm from "../../components/Forms/signUpForm";
import LogoScreen from "../logoScreen";

export default function SignUp(){
  return (
    <div className="h-screen  flex flex-row items-center justify-between bg-white dark:bg-blue-900">
      <LogoScreen/>
      <SignUpForm />
    </div>
  );
}