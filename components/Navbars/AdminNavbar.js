export default function Navbar() {
  return (
    <nav className="absolute left-0 top-0 z-10 flex w-full items-center bg-transparent p-4 md:flex-row md:flex-nowrap md:justify-start">
      <div className="mx-autp flex w-full flex-wrap items-center justify-between px-4 md:flex-nowrap md:px-10">
        {/* Title */}
        <a
          className="hidden text-lg font-semibold uppercase text-white lg:inline-block"
          href="#pablo"
          onClick={(e) => e.preventDefault()}
        >
          儀錶板
        </a>
        {/* User */}
        <ul className="hidden list-none flex-col items-center md:flex md:flex-row">
          <a className="block text-slate-500" href="#pablo">
            <div className="flex items-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full text-sm text-white">
                USERNAME
              </span>
            </div>
          </a>
        </ul>
      </div>
    </nav>
  );
}
