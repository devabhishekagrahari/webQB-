import {useState} from "react";
import {Link} from "react-router-dom";
export default function PasswordForm(){
    const [email, setEmail]= useState(" a@gmail.com");
    const handlePassword=(e)=>{
        e.preventDefault();
        console.log("Check Your mail for the password reset link");
    }

    return (
    <form onSubmit={handlePassword} className="w-full  min-w-[600px] min-h-[400px] right-0 mr-8 max-w-md dark:bg-zinc-900 space-y-4 p-4">
        <h2 className="text-4xl text-center font-bold bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200 bg-clip-text text-transparent ">
        Create New Password 
        </h2>
       <div className="space-y-4">
       <label htmlFor="password" className="block text-2xl font-medium text-teal-500 dark:text-zinc-300">
         Email:
       </label>
       <input 
       id="email"
       type="email"
       required
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       className="mt-1 w-full px-4 py-2 border !border-teal-600 !bg-white dark:bg-zinc-800 text-teal-600 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-900"
       
       />
       </div> 

<div>
 <button
  type="submit"
  className="w-full text-3xl mt-5 py-2 border !border-teal-600  !bg-gradient-to-r from-teal-300 via-teal-400 to-teal-200 hover:bg-teal-200 text-white rounded-xl transition duration-200"
 >
    Send Password Reset Link
 </button>
</div>
<div className="flex flex-col justify-center ">
  {/* Register Link */}
  <p className="text-sm text-center mt-4 text-teal-600 dark:text-zinc-400">
    Don&apos;t have an account?{" "}
    <Link
      to="/signup"
      className="!text-teal-900 hover:underline dark:text-teal-400"
    >
      Sign Up
    </Link>
  </p>
    <p className="text-sm text-center mt-4 text-teal-600 dark:text-zinc-400">
    Log In Your Account?{" "}
    <Link
      to="/logIn"
      className="!text-teal-900 mt-2 hover:underline dark:text-teal-400"
    >
      Log In
    </Link>
  </p>
</div>
</form>
   )
}