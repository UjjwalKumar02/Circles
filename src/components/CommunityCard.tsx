import { Link } from "react-router-dom";
import { ButtonV2 } from "../componentsV2/ButtonV2";

export function Community({
  name,
  role,
  desc,
  slug,
}: {
  name: string;
  role: string;
  desc: string;
  slug: string;
}) {
  return (
    <div className="w-full bg-white border border-gray-200 flex flex-col gap-5 px-9 py-8 md:px-7 md:py-6 rounded-2xl shadow-xs">
      <div className="flex md:flex-row flex-col justify-between md:items-center gap-3">
        <div className="flex md:justify-start justify-between items-center gap-3">
          <h1 className="text-xl font-medium tracking-tight">{name}</h1>

          <p className="text-xs rounded-lg bg-[#fde89e] text-gray-800 font-medium px-2 py-1">
            {role[0] + role.slice(1).toLowerCase()}
          </p>
        </div>

        <p className="md:hidden block text-gray-700 text-sm">{desc}</p>

        <Link to={`/community/${slug}`}>
          <ButtonV2 variant="primary" size="md" className="w-fit mt-1">
            Enter &gt;
          </ButtonV2>
        </Link>
      </div>

      <p className="md:block hidden text-gray-700 text-sm">{desc}</p>
    </div>
  );
}
