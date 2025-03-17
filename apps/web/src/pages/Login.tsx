import { SignIn } from '@clerk/clerk-react';


export default function Login() {
  return (
    <div className="h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 animate-gradient">
      <SignIn />
    </div>
  );
}
