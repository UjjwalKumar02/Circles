interface TitleBarProps {
  title: string;
}

export default function Titlebar({ title }: TitleBarProps) {
  return (
    <div className="flex justify-center items-center p-3">
      {/* <p className="border border-gray-200 rounded-full px-2.5 py-1 font-bold text-white">
        &lt;
      </p> */}

      <h1 className="text-xl font-medium tracking-tighter">{title}</h1>

      {/* <p className="border border-gray-200 rounded-full px-2.5 py-1 font-bold text-white">
        +
      </p> */}
    </div>
  );
}
