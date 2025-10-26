'use client'

import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export const LoginButtons = () => {
  const api = process.env.NEXT_PUBLIC_BACK_API_URL

  return (
    <div className="flex flex-col gap-3 max-w-xs w-full">
      {/* Google */}
      <button
        onClick={() => (window.location.href = `${api}/auth/google`)}
        className="flex
        items-center
        justify-center
        gap-3
        rounded-xl
        bg-gradient-to-r
        from-red-500
        via-pink-500
        to-orange-500 
        text-white
        px-4
        py-3
        font-medium
        shadow-md
        hover:cursor-pointer
        hover:shadow-lg
        hover:scale-105
        active:scale-95
        transition"
      >
        <FcGoogle className="text-2xl bg-white rounded-full p-0.5" />
        Continue with Google
      </button>

      {/* GitHub */}
      <button
        onClick={() => (window.location.href = `${api}/auth/github`)}
        className="flex
        items-center
        justify-center
        gap-3
        rounded-xl
        bg-gradient-to-r
        from-green-500
        via-green-600
        to-green-700
        text-white
        px-4
        py-3
        font-medium
        shadow-md
        hover:cursor-pointer
        hover:shadow-lg
        hover:scale-105
        active:scale-95
        transition"
      >
        <FaGithub className="text-2xl" />
        Continue with GitHub
      </button>

      {/* LinkedIn */}
      <button
        onClick={() => (window.location.href = `${api}/auth/linkedin`)}
        className="flex
        items-center
        justify-center
        gap-3
        rounded-xl
        bg-gradient-to-r
        from-blue-500
        via-blue-600
        to-indigo-600
        text-white
        px-4
        py-3
        font-medium
        shadow-md
        hover:cursor-pointer
        hover:shadow-lg
        hover:scale-105
        active:scale-95
        transition"
      >
        <FaLinkedin className="text-2xl" />
        Continue with LinkedIn
      </button>
    </div>
  );
}
