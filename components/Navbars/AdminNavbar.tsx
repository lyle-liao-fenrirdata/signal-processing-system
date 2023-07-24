import { useNavbarBreadcrumbStore } from "@/stores/navbarBreadcrumb";

export default function Navbar() {
  const breadcrumbs = useNavbarBreadcrumbStore((state) => state.breadcrumbs);

  return (
    <nav className="absolute left-0 top-0 z-10 flex w-full items-center bg-transparent py-4 md:flex-row md:flex-nowrap md:justify-start md:bg-slate-800">
      <div className="mx-autp flex w-full flex-wrap items-center justify-between px-4 md:flex-nowrap md:px-10">
        {/* Title */}
        {breadcrumbs.map((page, index) => (
          <span key={page.title} className="ml-4 inline first:ml-0">
            <a
              href={page.href}
              className="hidden text-lg font-semibold uppercase text-white lg:inline-block"
            >
              {page.title}
            </a>
            {index !== breadcrumbs.length - 1 && (
              <i className="fas fa-angle-right inline text-slate-500"></i>
            )}
          </span>
        ))}

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
