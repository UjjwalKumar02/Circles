interface CommunityProps {
  name: string
  description: string | null
  role: "ADMIN" | "MEMBER"
  explore: boolean
}


const Community = ({ name, description, role, explore }: CommunityProps) => {
  return (
    <div className="bg-white px-6 py-5 shadow border border-gray-400 my-5 rounded-xl space-y-6">
      <div className="flex justify-between items-center">
        <p className="font-medium text-gray-800">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </p>
        {role === "ADMIN" && (
          <p className="text-blue-500 font-medium">
            Admin
          </p>
        )}
        {explore && (
          <p className="text-blue-500 font-medium">
            Request to Join
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