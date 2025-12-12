export default function Navbar() {
  return (
    <div className="w-full bg-white fixed top-0 px-10 pt-6 pb-4 border-b border-gray-200 flex justify-between">
      <p className="text-2xl font-semibold tracking-tighter pl-11">Circles</p>
      <div className="flex items-center gap-4">
        {/* <input
          type="text"
          className="outline-none border border-gray-200 rounded-xl py-1 pl-2"
          placeholder="Search"
        /> */}
        <p className="border border-gray-200 rounded-full px-3 py-1 text-white">
          o
        </p>
      </div>
    </div>
  );
}
