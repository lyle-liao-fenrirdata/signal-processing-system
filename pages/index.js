/* eslint-disable react/jsx-no-target-blank */
import React from "react";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Footer from "components/Footers/Footer.js";

export default function Index() {
  return (
    <>
      <IndexNavbar fixed />
      <section className="header relative flex h-screen max-h-860-px items-center pt-16">
        <div className="container mx-auto flex flex-wrap items-center">
          <div className="w-full px-4 md:w-8/12 lg:w-6/12 xl:w-6/12">
            <div className="pt-32 sm:pt-0">
              <h2 className="text-4xl font-semibold text-slate-600">首頁</h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-500">
                It does not change any of the CSS from{" "}
                <a
                  href="https://tailwindcss.com/?ref=creativetim"
                  className="text-slate-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tailwind CSS
                </a>
                .
              </p>
              <div className="mt-12">
                <a
                  href="\admin\dashboard"
                  target="_blank"
                  className="get-started mb-1 mr-1 rounded bg-slate-400 px-6 py-4 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-slate-500"
                >
                  Get started
                </a>
              </div>
            </div>
          </div>
        </div>
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
