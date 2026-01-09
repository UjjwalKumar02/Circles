export function Community({
  name,
  role,
  desc,
  key,
}: {
  name: string;
  role: string;
  desc: string;
  key: string;
}) {
  return (
    <div
      key={key}
      className="bg-white flex flex-col gap-7 px-10 py-8 border border-gray-200 rounded-xl"
    >
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-medium tracking-tight">{name}</h1>
        {role === "ADMIN" ? (
          <p className="text-xs border rounded-xl border-red-500 text-red-500 font-medium px-2 py-1">
            {role}
          </p>
        ) : (
          <p className="text-xs border rounded-xl border-sky-500 text-sky-500 font-medium px-2 py-1">
            {role}
          </p>
        )}
      </div>

      <p className="text-gray-700">{desc}</p>
    </div>
  );
}
