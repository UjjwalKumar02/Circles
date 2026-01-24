import { useNavigate } from "react-router-dom";
import { EnterIcon } from "../iconsV2/EnterIcon";
import { ButtonV2 } from "./ButtonV2";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-[#fffffc]">
      {/* Nav */}
      <div className="border-b border-gray-100">
        <div className="max-w-300 mx-auto flex justify-between items-center py-4 lg:px-0 px-4">
          <div className="flex gap-1 items-center">
            <div className="bg-[#fde89e] h-7 w-7 flex items-center justify-center rounded-lg font-medium text-xl border border-gray-100">
              @
            </div>
            <h1 className="text-2xl font-medium tracking-tighter">Circles</h1>
          </div>

          <ButtonV2
            variant="secondary"
            size="md"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </ButtonV2>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center mt-32 md:mt-22 gap-2 lg:px-0 px-6">
        <h1 className="text-2xl md:text-5xl font-medium tracking-tighter text-center">
          Connect with people who
        </h1>
        <h1 className="text-2xl md:text-5xl font-medium tracking-tighter text-[#00143399] text-center">
          share similar interests
        </h1>

        <ButtonV2
          variant="primary"
          size="lg"
          onClick={() => navigate("/auth")}
          className="md:flex hidden items-center gap-1 mt-3"
        >
          Get Started
          <EnterIcon />
        </ButtonV2>
        {/* Mobile btn */}
        <ButtonV2
          variant="primary"
          size="md"
          onClick={() => navigate("/auth")}
          className="md:hidden flex items-center gap-1 mt-3"
        >
          Get Started
          <EnterIcon />
        </ButtonV2>
      </div>

      {/* Features */}
      <div className="flex justify-center">
        <div className="max-w-300 w-full mt-32 md:mt-22">
          <h1 className="text-xl lg:text-2xl font-medium tracking-tight text-center mb-5">
            Most loved features
          </h1>

          <div className="w-full flex lg:flex-row flex-col gap-8 justify-between items-center lg:px-0 px-6">
            {/* First card */}
            <div className="w-full bg-[#f7f7f1] p-8 lg:p-10 rounded-2xl flex flex-col gap-5 border-2 border-gray-100">
              <h2 className="text-xl md:text-2xl font-medium tracking-tighter">
                Admin controls
              </h2>
              <p className="text-[#00143399]">
                Manage posts and moderate members.
              </p>

              <button className="mt-1 bg-white font-medium px-4 py-2 md:px-7 md:py-3 rounded-xl text-sm w-fit border-2 border-gray-100">
                Manage dashboard
              </button>
            </div>

            {/* Second card */}
            <div className="w-full bg-[#f7f7f1] p-8 lg:p-10 rounded-2xl flex flex-col gap-5 border-2 border-gray-100">
              <h2 className="text-xl md:text-2xl font-medium tracking-tighter">
                Member perks
              </h2>
              <p className="text-[#00143399]">Connect with other members</p>

              <button className="mt-1 bg-white font-medium px-4 py-2 md:px-7 md:py-3 rounded-xl text-sm w-fit border-2 border-gray-100">
                View benefits
              </button>
            </div>

            {/* Third card */}
            <div className="w-full bg-[#f7f7f1] p-8 lg:p-10 rounded-2xl flex flex-col gap-5 border-2 border-gray-100">
              <h2 className="text-xl md:text-2xl font-medium tracking-tighter">
                Latest trends
              </h2>
              <p className="text-[#00143399]">
                Explore new and emerging trends.
              </p>

              <button className="mt-1 bg-white font-medium px-4 py-2 md:px-7 md:py-3 rounded-xl text-sm w-fit border-2 border-gray-100">
                Discover trends
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-[93%] lg:max-w-300 mx-auto w-full bg-[#fde89e] rounded-2xl flex flex-col items-center gap-2 py-24 mt-22 lg:px-0 px-4">
        <h1 className="text-2xl md:text-5xl font-medium tracking-tighter text-center">
          Connect with people who
        </h1>
        <h1 className="text-2xl md:text-5xl font-medium tracking-tighter text-[#00143399] text-center">
          share similar interests
        </h1>

        <ButtonV2
          variant="primary"
          size="lg"
          onClick={() => navigate("/auth")}
          className="md:flex hidden items-center gap-1 mt-3"
        >
          Get Started
          <EnterIcon />
        </ButtonV2>
        {/* Mobile btn */}
        <ButtonV2
          variant="primary"
          size="md"
          onClick={() => navigate("/auth")}
          className="md:hidden flex items-center gap-1 mt-3"
        >
          Get Started
          <EnterIcon />
        </ButtonV2>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-50">
        <div className="max-w-300 mx-auto w-full  rounded-2xl flex justify-between items-center gap-2.5 py-30 px-8 lg:px-14 ">
          <h1 className="text-xl lg:text-3xl font-medium tracking-tighter">
            Circles
          </h1>

          <div className="flex flex-col gap-2 items-center text-sm">
            <p className="font-medium">Connect</p>

            <a href="https://github.com/UjjwalKumar02/Circles" target="_blank">
              GitHub
            </a>
            <a href="https://ujjwalkumar02.github.io/pro/" target="_blank">
              Author
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
