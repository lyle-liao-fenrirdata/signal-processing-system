export default function Footer() {
  return (
    <footer className="relative bg-slate-200 pb-6 pt-8">
      <div
        className="pointer-events-none absolute bottom-auto left-0 right-0 top-0 -mt-20 h-20 w-full overflow-hidden"
        style={{ transform: "translateZ(0)" }}
      >
        <svg
          className="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            className="fill-current text-slate-200"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
      <div className="container mx-auto px-4">
        <hr className="my-6 border-slate-300" />
        <div className="flex flex-wrap items-center justify-center md:justify-between">
          <div className="mx-auto w-full px-4 text-center md:w-4/12">
            <div className="py-1 text-sm font-semibold text-slate-500"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
