import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";

export type NavbarProps = {
  breadcrumbs: { title: string; href: string }[];
};

export default function Navbar({ breadcrumbs }: NavbarProps) {
  const router = useRouter();
  const { data, error } = trpc.auth.verify.useQuery(undefined, {
    refetchOnMount: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    retryOnMount: false,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      router.replace("/auth/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  const { error: logoutError, refetch: logoutRefetch } =
    trpc.auth.logout.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      retryOnMount: false,
      retry: false,
      enabled: false,
    });

  function logout() {
    logoutRefetch();
    router.replace("/auth/login");
  }

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
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full text-lg text-white">
              {data?.user ? data.user.username : "anonymous"}
            </span>
            <button
              className="cursor-pointer rounded border border-solid border-white bg-transparent px-3 py-1 text-sm leading-none text-white opacity-70 transition-all hover:opacity-100"
              type="button"
              onClick={() => logout()}
            >
              <i className="fas fa-right-from-bracket mr-2 text-sm text-white"></i>{" "}
              登出
            </button>
          </div>
        </ul>
      </div>
    </nav>
  );
}
