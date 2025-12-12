import Button from "./Button";

interface CommunityCardProps {
  name: string;
  description: string;
  role: string;
}

export default function CommunityCard({
  name,
  description,
  role,
}: CommunityCardProps) {
  return (
    <div className="w-72 px-10 py-8 flex flex-col gap-10 border border-gray-300 rounded-md">
      <div className="flex items-center justify-between">
        <p className="font-medium tracking-tighter text-lg">{name}</p>
        <p
          className={`border px-2 py-0.5 rounded-lg text-sm font-medium ${
            role === "ADMIN"
              ? "text-purple-500 border-purple-500"
              : "text-blue-500 border-blue-500"
          }`}
        >
          {role.charAt(0) + role.slice(1).toLowerCase()}
        </p>
      </div>

      <p className="text-gray-900">{description}</p>

      {/* <Button
        variant="secondary"
        size="md"
        text="Explore"
        onClick={() => console.log("first")}
        fullWidth={true}
      /> */}
    </div>
  );
}
