export default function Landing() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="w-5xl mx-auto flex justify-between items-center px-5 py-6">
        <h1 className="text-2xl font-medium tracking-tighter">Circles</h1>
        <a
          href="https://github.com/UjjwalKumar02/Circles"
          className="bg-black text-gray-100 px-4 py-1.5 rounded-xl text-sm font-medium"
        >
          GitHub
        </a>
      </div>

      <div className="mb-16 py-10 flex flex-col gap-6 justify-center items-center">
        <h1 className="text-3xl font-medium tracking-tight text-center">
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
