export default function Landing() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="min-h-screen max-w-6xl mx-auto flex flex-col justify-between">
      {/* Navbar */}
      <div className="w-full flex justify-between items-center px-5 py-6">
        <h1 className="text-2xl font-medium tracking-tighter">Circles</h1>
        <a
          href="https://github.com/UjjwalKumar02/Circles"
          className="bg-black text-gray-100 px-4 py-1.5 rounded-xl text-sm font-medium"
          target="_blank"
        >
          GitHub
        </a>
      </div>

      {/* Hero section */}
      <div className="mb-16 px-8 flex flex-col gap-6 justify-center items-center">
        <h1 className="md:text-4xl text-3xl font-medium tracking-tight text-center">
          Connect, Share & Explore Communities
        </h1>

        <p className="text-gray-800 text-center">
          A Social platform to connect with people who share similar interests
        </p>
        <button
          className="bg-black text-gray-100 px-7 py-1.5 rounded-xl font-medium cursor-pointer"
          onClick={() =>
            (window.location.href = `${backendUrl}/api/user/auth/google`)
          }
        >
          Sign in with Google &gt;
        </button>
      </div>

      <div className="w-full flex justify-center items-center gap-1 p-4 text-sm">
        <p>Made by</p>
        <a
          href="https://ujjwalkumar02.github.io/pro/"
          className="hover:underline"
        >
          Ujjwal
        </a>
      </div>
    </div>
  );
}
