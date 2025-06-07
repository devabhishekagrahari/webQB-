import PasswordForm from "../../components/Forms/fileform";
import LogoScreen from "../logoScreen";

export default function ForgetPassword(){
    return (
    <div className="h-screen w-screen flex items-center justify-between bg-white dark:bg-blue-900">
      <LogoScreen/>
      <PasswordForm />
    </div>
    )
}