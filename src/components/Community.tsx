interface CommunityProps {
  name: string
  description: string | null
  role: "ADMIN" | "MEMBER"
}


const Community = ({ name, description, role }: CommunityProps) => {
  return (
    <div className="w-full bg-  px-6 py-5 border-t-[1.5px] border-x-[1.5px] border-gray-300 space-y-7">
      <div className="flex gap-2.5 items-end">
        <p className="font-medium text-[#0969da]">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </p>
        {role === "ADMIN" && (
          <p className="text-[#59636e] font-medium border-[1.5px] border-gray-300 rounded-full text-xs px-1.5 py-0.5">
            Admin
          </p>
        )}
      </div>

      <p className="text-gray-800 text-sm">
        {description}
      </p>

    </div>
  )
}

export default Community