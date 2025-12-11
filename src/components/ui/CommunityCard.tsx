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
    <div className="w-[22%] px-8 py-6 flex flex-col gap-8 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between">
        <p className="font-medium tracking-tighter text-lg">{name}</p>
        <p
          className={`border px-2 py-0.5 rounded-lg text-sm ${
            role === "ADMIN"
              ? "text-green-500 border-green-500"
              : "text-blue-500 border-blue-500"
          }`}
        >
          {role.charAt(0) + role.slice(1).toLowerCase()}
        </p>
      </div>

      <p className="text-gray-900">{description}</p>

      <Button
        variant="primary"
        size="md"
        text="Explore"
        onClick={() => console.log("first")}
        fullWidth={true}
      />
    </div>
  );
}
