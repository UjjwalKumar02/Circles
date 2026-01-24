import { ButtonV2 } from "../componentsV2/ButtonV2";

export default function AuthPage() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffffc]">
      <div className="flex flex-col items-center gap-7 justify-center">
        <div className="flex gap-1 items-center">
          <div className="bg-[#fde89e] h-7 w-7 flex items-center justify-center rounded-lg font-medium text-xl border border-gray-100">
            @
          </div>
          <h1 className="text-2xl font-medium tracking-tighter">Circles</h1>
        </div>

        <ButtonV2
          variant="secondary"
          size="lg"
          onClick={() =>
            (window.location.href = `${backendUrl}/api/user/auth/google`)
          }
        >
          Sign In with Google
        </ButtonV2>
      </div>
    </div>
  );
}
