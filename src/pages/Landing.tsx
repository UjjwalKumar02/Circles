export default function Landing() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <button
        className="bg-blue-500 text-white px-8 py-2 rounded-lg cursor-pointer"
        onClick={() =>
          (window.location.href = "http://localhost:3000/api/user/auth/google")
        }
      >
        Sign in with google
      </button>
    </div>
  );
}
