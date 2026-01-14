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
      className="bg-white flex flex-col gap-7 px-8 py-6 border border-gray-200 rounded-2xl shadow-xs"
    >
      <div className="flex justify-between items-center gap-3">
        <h1 className="text-lg font-medium tracking-tight">{name}</h1>
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
