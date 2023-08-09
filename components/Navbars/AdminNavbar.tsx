import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export type NavbarProps = {
  breadcrumbs: { title: string; href: string }[];
  username: string;
};

export default function Navbar({ breadcrumbs, username }: NavbarProps) {
  const router = useRouter();

  const { mutate: logout } = trpc.auth.logout.useMutation({
    retry: false,
    onSuccess: () => {
      router.replace("/auth/login");
    },
    onError: (error) => console.log(error),
  });

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
          <div className="flex flex-row flex-nowrap items-center gap-2">
            <span className="inline-flex h-12 min-w-fit items-center justify-center text-lg text-white">
              {username}
            </span>
            <button
              className="cursor-pointer bg-transparent px-3 py-1 text-xs leading-none text-white opacity-70 transition-all hover:opacity-100"
              type="button"
              onClick={() => logout()}
            >
              <i className="fas fa-right-from-bracket mr-2 text-xs text-white"></i>{" "}
              登出
            </button>
          </div>
        </ul>
      </div>
    </nav>
  );
}
