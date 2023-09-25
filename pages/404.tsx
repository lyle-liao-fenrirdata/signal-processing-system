import IndexNavbar from "components/Navbars/IndexNavbar";
import Footer from "components/Footers/Footer";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <IndexNavbar />

      <section className="header relative flex h-screen max-h-860-px items-center pt-16">
        <div className="container mx-auto flex flex-wrap items-center">
          <div className="w-full px-4 md:w-8/12 lg:w-6/12 xl:w-6/12">
            <div className="pt-32 sm:pt-0">
              <h2 className="text-4xl font-semibold text-slate-600">
                404 找不到頁面!
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-500">
                請返回首頁，重新進入系統。
              </p>
              <div className="mt-12">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a
                  href="/"
                  className="mr-2 rounded bg-slate-700 px-6 py-4 text-sm font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-slate-500"
                >
                  回首頁
                </a>
                <button
                  className="rounded bg-white px-6 py-4 text-sm font-bold text-slate-700 shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-slate-500"
                  onClick={() => router.back()}
                >
                  回上一頁
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* eslint-disable @next/next/no-img-element */}
        <img
          className="b-auto absolute right-0 top-0 -mt-48 max-h-860-px w-10/12 pt-16 sm:mt-0 sm:w-6/12"
          src="/img/pattern_nextjs.png"
          alt="..."
        />
      </section>

      <Footer />
    </>
  );
}
