/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import Link from "next/link";

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
              <h2 className="text-4xl font-semibold text-slate-600">
                Notus NextJS - A beautiful extension for Tailwind CSS.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-500">
                Notus NextJS is Free and Open Source. It does not change any of
                the CSS from{" "}
                <a
                  href="https://tailwindcss.com/?ref=creativetim"
                  className="text-slate-600"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tailwind CSS
                </a>
                . It features multiple HTML elements and it comes with dynamic
                components for ReactJS, Vue and Angular.
              </p>
              <div className="mt-12">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/nextjs/overview/notus?ref=nnjs-index"
                  target="_blank"
                  className="get-started mb-1 mr-1 rounded bg-slate-400 px-6 py-4 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-slate-500"
                >
                  Get started
                </a>
                <a
                  href="https://github.com/creativetimofficial/notus-nextjs?ref=nnjs-index"
                  className="github-star mb-1 ml-1 mr-1 rounded bg-slate-700 px-6 py-4 text-sm font-bold uppercase text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-slate-600"
                  target="_blank"
                >
                  Github Star
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

      <section className="relative mt-48 bg-slate-100 pb-40 md:mt-40">
        <div
          className="absolute bottom-auto left-0 right-0 top-0 -mt-20 h-20 w-full"
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
              className="fill-current text-slate-100"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="-mt-32 ml-auto mr-auto w-10/12 px-12 md:w-6/12 md:px-4 lg:w-4/12">
              <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-slate-700 bg-white shadow-lg">
                <img
                  alt="..."
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
                  className="w-full rounded-t-lg align-middle"
                />
                <blockquote className="relative mb-4 p-8">
                  <svg
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 583 95"
                    className="absolute -top-94-px left-0 block h-95-px w-full"
                  >
                    <polygon
                      points="-30,95 583,95 583,65"
                      className="fill-current text-slate-700"
                    ></polygon>
                  </svg>
                  <h4 className="text-xl font-bold text-white">
                    Great for your awesome project
                  </h4>
                  <p className="text-md mt-2 font-light text-white">
                    Putting together a page has never been easier than matching
                    together pre-made components. From landing pages
                    presentation to login areas, you can easily customise and
                    built your pages.
                  </p>
                </blockquote>
              </div>
            </div>

            <div className="w-full px-4 md:w-6/12">
              <div className="flex flex-wrap">
                <div className="w-full px-4 md:w-6/12">
                  <div className="relative mt-4 flex flex-col">
                    <div className="flex-auto px-4 py-5">
                      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 text-center text-slate-500 shadow-lg">
                        <i className="fas fa-sitemap"></i>
                      </div>
                      <h6 className="mb-1 text-xl font-semibold">
                        CSS Components
                      </h6>
                      <p className="mb-4 text-slate-500">
                        Notus NextJS comes with a huge number of Fully Coded CSS
                        components.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex min-w-0 flex-col">
                    <div className="flex-auto px-4 py-5">
                      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 text-center text-slate-500 shadow-lg">
                        <i className="fas fa-drafting-compass"></i>
                      </div>
                      <h6 className="mb-1 text-xl font-semibold">
                        JavaScript Components
                      </h6>
                      <p className="mb-4 text-slate-500">
                        We also feature many dynamic components for React,
                        NextJS, Vue and Angular.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full px-4 md:w-6/12">
                  <div className="relative mt-4 flex min-w-0 flex-col">
                    <div className="flex-auto px-4 py-5">
                      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 text-center text-slate-500 shadow-lg">
                        <i className="fas fa-newspaper"></i>
                      </div>
                      <h6 className="mb-1 text-xl font-semibold">Pages</h6>
                      <p className="mb-4 text-slate-500">
                        This extension also comes with 3 sample pages. They are
                        fully coded so you can start working instantly.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex min-w-0 flex-col">
                    <div className="flex-auto px-4 py-5">
                      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 text-center text-slate-500 shadow-lg">
                        <i className="fas fa-file-alt"></i>
                      </div>
                      <h6 className="mb-1 text-xl font-semibold">
                        Documentation
                      </h6>
                      <p className="mb-4 text-slate-500">
                        Built by developers for developers. You will love how
                        easy is to to work with Notus NextJS.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto overflow-hidden pb-20">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto mt-48 w-full px-12 md:w-4/12 md:px-4">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white p-3 text-center text-slate-500 shadow-lg">
                <i className="fas fa-sitemap text-xl"></i>
              </div>
              <h3 className="mb-2 text-3xl font-semibold leading-normal">
                CSS Components
              </h3>
              <p className="mb-4 mt-4 text-lg font-light leading-relaxed text-slate-600">
                Every element that you need in a product comes built in as a
                component. All components fit perfectly with each other and can
                have different colours.
              </p>
              <div className="block pb-6">
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Buttons
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Inputs
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Labels
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Menus
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Navbars
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Pagination
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Progressbars
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Typography
                </span>
              </div>
              <a
                href="https://www.creative-tim.com/learning-lab/tailwind/nextjs/alerts/notus?ref=nnjs-index"
                target="_blank"
                className="font-bold text-slate-700 transition-all duration-150 ease-linear hover:text-slate-500"
              >
                View All{" "}
                <i className="fa fa-angle-double-right ml-1 leading-relaxed"></i>
              </a>
            </div>

            <div className="ml-auto mr-auto mt-32 w-full px-4 md:w-5/12">
              <div className="relative mb-6 mt-48 flex w-full min-w-0 flex-col md:mt-0">
                <img
                  alt="..."
                  src="/img/component-btn.png"
                  className="absolute -top-29-px left-145-px z-3 w-full max-w-100-px rounded align-middle shadow-lg"
                />
                <img
                  alt="..."
                  src="/img/component-profile-card.png"
                  className="absolute -top-160-px left-260-px w-full max-w-210-px rounded-lg align-middle shadow-lg"
                />
                <img
                  alt="..."
                  src="/img/component-info-card.png"
                  className="absolute -top-225-px left-40-px z-2 w-full max-w-180-px rounded-lg align-middle shadow-lg"
                />
                <img
                  alt="..."
                  src="/img/component-info-2.png"
                  className="absolute -left-50-px top-25-px w-full max-w-200-px rounded-lg align-middle shadow-2xl"
                />
                <img
                  alt="..."
                  src="/img/component-menu.png"
                  className="absolute -left-20-px top-210-px w-full max-w-580-px rounded align-middle shadow-lg"
                />
                <img
                  alt="..."
                  src="/img/component-btn-pink.png"
                  className="absolute left-195-px top-95-px w-full max-w-120-px rounded align-middle shadow-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center pt-32">
            <div className="ml-auto mr-auto mt-32 w-full px-4 md:w-6/12">
              <div className="relative flex flex-wrap justify-center">
                <div className="my-4 w-full px-4 lg:w-6/12">
                  <a
                    href="https://www.creative-tim.com/learning-lab/tailwind/svelte/alerts/notus?ref=vtw-index"
                    target="_blank"
                  >
                    <div className="rounded-lg bg-red-600 p-8 text-center shadow-lg">
                      <img
                        alt="..."
                        className="mx-auto w-16 max-w-full rounded-full bg-white p-2 shadow-md"
                        src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/svelte.jpg"
                      />
                      <p className="mt-4 text-lg font-semibold text-white">
                        Svelte
                      </p>
                    </div>
                  </a>
                  <a
                    href="https://www.creative-tim.com/learning-lab/tailwind/react/alerts/notus?ref=vtw-index"
                    target="_blank"
                  >
                    <div className="mt-8 rounded-lg bg-sky-500 p-8 text-center shadow-lg">
                      <img
                        alt="..."
                        className="mx-auto w-16 max-w-full rounded-full bg-white p-2 shadow-md"
                        src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/react.jpg"
                      />
                      <p className="mt-4 text-lg font-semibold text-white">
                        ReactJS
                      </p>
                    </div>
                  </a>
                  <a
                    href="https://www.creative-tim.com/learning-lab/tailwind/nextjs/alerts/notus?ref=vtw-index"
                    target="_blank"
                  >
                    <div className="mt-8 rounded-lg bg-slate-700 p-8 text-center shadow-lg">
                      <img
                        alt="..."
                        className="mx-auto w-16 max-w-full rounded-full bg-white p-2 shadow-md"
                        src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/nextjs.jpg"
                      />
                      <p className="mt-4 text-lg font-semibold text-white">
                        NextJS
                      </p>
                    </div>
                  </a>
                </div>
                <div className="my-4 w-full px-4 lg:mt-16 lg:w-6/12">
                  <a
                    href="https://www.creative-tim.com/learning-lab/tailwind/js/alerts/notus?ref=vtw-index"
                    target="_blank"
                  >
                    <div className="rounded-lg bg-yellow-500 p-8 text-center shadow-lg">
                      <img
                        alt="..."
                        className="mx-auto w-16 max-w-full rounded-full bg-white p-2 shadow-md"
                        src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/js.png"
                      />
                      <p className="mt-4 text-lg font-semibold text-white">
                        JavaScript
                      </p>
                    </div>
                  </a>
                  <a
                    href="https://www.creative-tim.com/learning-lab/tailwind/angular/alerts/notus?ref=vtw-index"
                    target="_blank"
                  >
                    <div className="mt-8 rounded-lg bg-red-700 p-8 text-center shadow-lg">
                      <img
                        alt="..."
                        className="mx-auto w-16 max-w-full rounded-full bg-white p-2 shadow-md"
                        src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/angular.jpg"
                      />
                      <p className="mt-4 text-lg font-semibold text-white">
                        Angular
                      </p>
                    </div>
                  </a>
                  <a
                    href="https://www.creative-tim.com/learning-lab/tailwind/vue/alerts/notus?ref=vtw-index"
                    target="_blank"
                  >
                    <div className="mt-8 rounded-lg bg-emerald-500 p-8 text-center shadow-lg">
                      <img
                        alt="..."
                        className="mx-auto w-16 max-w-full rounded-full bg-white p-2 shadow-md"
                        src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/logos/vue.jpg"
                      />
                      <p className="mt-4 text-lg font-semibold text-white">
                        Vue.js
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="ml-auto mr-auto mt-48 w-full px-12 md:w-4/12 md:px-4">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white p-3 text-center text-slate-500 shadow-lg">
                <i className="fas fa-drafting-compass text-xl"></i>
              </div>
              <h3 className="mb-2 text-3xl font-semibold leading-normal">
                Javascript Components
              </h3>
              <p className="mb-4 mt-4 text-lg font-light leading-relaxed text-slate-600">
                In order to create a great User Experience some components
                require JavaScript. In this way you can manipulate the elements
                on the page and give more options to your users.
              </p>
              <p className="mb-4 mt-4 text-lg font-light leading-relaxed text-slate-600">
                We created a set of Components that are dynamic and come to help
                you.
              </p>
              <div className="block pb-6">
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Alerts
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Dropdowns
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Menus
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Modals
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Navbars
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Popovers
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Tabs
                </span>
                <span className="mr-2 mt-2 inline-block rounded-full bg-white px-2 py-1 text-xs font-semibold uppercase uppercase text-slate-500 last:mr-0">
                  Tooltips
                </span>
              </div>
              <a
                href="https://www.creative-tim.com/learning-lab/tailwind/nextjs/alerts/notus?ref=nnjs-index"
                target="_blank"
                className="font-bold text-slate-700 transition-all duration-150 ease-linear hover:text-slate-500"
              >
                View all{" "}
                <i className="fa fa-angle-double-right ml-1 leading-relaxed"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-32 pt-48">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto w-full px-12 md:w-5/12 md:px-4">
              <div className="md:pr-12">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white p-3 text-center text-slate-500 shadow-lg">
                  <i className="fas fa-file-alt text-xl"></i>
                </div>
                <h3 className="text-3xl font-semibold">
                  Complex Documentation
                </h3>
                <p className="mt-4 text-lg leading-relaxed text-slate-500">
                  This extension comes a lot of fully coded examples that help
                  you get started faster. You can adjust the colors and also the
                  programming language. You can change the text and images and
                  you&apos;re good to go.
                </p>
                <ul className="mt-6 list-none">
                  <li className="py-2">
                    <div className="flex items-center">
                      <div>
                        <span className="mr-3 inline-block rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold uppercase text-slate-500">
                          <i className="fas fa-fingerprint"></i>
                        </span>
                      </div>
                      <div>
                        <h4 className="text-slate-500">
                          Built by Developers for Developers
                        </h4>
                      </div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="flex items-center">
                      <div>
                        <span className="mr-3 inline-block rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold uppercase text-slate-500">
                          <i className="fab fa-html5"></i>
                        </span>
                      </div>
                      <div>
                        <h4 className="text-slate-500">
                          Carefully crafted code for Components
                        </h4>
                      </div>
                    </div>
                  </li>
                  <li className="py-2">
                    <div className="flex items-center">
                      <div>
                        <span className="mr-3 inline-block rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold uppercase text-slate-500">
                          <i className="far fa-paper-plane"></i>
                        </span>
                      </div>
                      <div>
                        <h4 className="text-slate-500">
                          Dynamic Javascript Components
                        </h4>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mr-auto w-full px-4 pt-24 md:w-6/12 md:pt-0">
              <img
                alt="..."
                className="max-w-full rounded-lg shadow-xl"
                style={{
                  transform:
                    "scale(1) perspective(1040px) rotateY(-11deg) rotateX(2deg) rotate(2deg)",
                }}
                src="/img/documentation.png"
              />
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-wrap justify-center text-center">
          <div className="w-full px-12 md:w-6/12 md:px-4">
            <h2 className="text-4xl font-semibold">Beautiful Example Pages</h2>
            <p className="mb-4 mt-4 text-lg leading-relaxed text-slate-500">
              Notus NextJS is a completly new product built using our past
              experience in web templates. Take the examples we made for you and
              start playing with them.
            </p>
          </div>
        </div>
      </section>

      <section className="z-1 relative block bg-slate-600">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center">
            <div className="lg:w-12/12 -mt-24 w-full  px-4">
              <div className="flex flex-wrap">
                <div className="w-full px-4 lg:w-4/12">
                  <h5 className="pb-4 text-center text-xl font-semibold">
                    Login Page
                  </h5>
                  <Link href="/auth/login">
                    <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-lg transition-all duration-150 ease-linear hover:-mt-4">
                      <img
                        alt="..."
                        className="h-auto max-w-full rounded-lg border-none align-middle"
                        src="/img/login.jpg"
                      />
                    </div>
                  </Link>
                </div>

                <div className="w-full px-4 lg:w-4/12">
                  <h5 className="pb-4 text-center text-xl font-semibold">
                    Profile Page
                  </h5>
                  <Link href="/profile">
                    <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-lg transition-all duration-150 ease-linear hover:-mt-4">
                      <img
                        alt="..."
                        className="h-auto max-w-full rounded-lg border-none align-middle"
                        src="/img/profile.jpg"
                      />
                    </div>
                  </Link>
                </div>

                <div className="w-full px-4 lg:w-4/12">
                  <h5 className="pb-4 text-center text-xl font-semibold">
                    Landing Page
                  </h5>
                  <Link href="/landing">
                    <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-lg transition-all duration-150 ease-linear hover:-mt-4">
                      <img
                        alt="..."
                        className="h-auto max-w-full rounded-lg border-none align-middle"
                        src="/img/landing.jpg"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-slate-600 py-20">
        <div className="container mx-auto pb-64">
          <div className="flex flex-wrap justify-center">
            <div className="ml-auto mr-auto w-full px-12 md:mt-64 md:w-5/12 md:px-4">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white p-3 text-center text-slate-500 shadow-lg">
                <i className="fas fa-code-branch text-xl"></i>
              </div>
              <h3 className="mb-2 text-3xl font-semibold leading-normal text-white">
                Open Source
              </h3>
              <p className="mb-4 mt-4 text-lg font-light leading-relaxed text-slate-400">
                Since{" "}
                <a
                  href="https://tailwindcss.com/?ref=creative"
                  className="text-slate-300"
                  target="_blank"
                >
                  Tailwind CSS
                </a>{" "}
                is an open source project we wanted to continue this movement
                too. You can give this version a try to feel the design and also
                test the quality of the code!
              </p>
              <p className="mb-4 mt-0 text-lg font-light leading-relaxed text-slate-400">
                Get it free on Github and please help us spread the news with a
                Star!
              </p>
              <a
                href="https://github.com/creativetimofficial/notus-nextjs?ref=nnjs-index"
                target="_blank"
                className="github-star mb-1 mr-1 mt-4 inline-block rounded bg-slate-700 px-6 py-4 text-sm font-bold uppercase text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-slate-600"
              >
                Github Star
              </a>
            </div>

            <div className="relative ml-auto mr-auto mt-32 w-full px-4 md:w-4/12">
              <i className="fab fa-github absolute -right-100 -top-150-px left-auto text-55 text-slate-700 opacity-80"></i>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-slate-200 pb-16 pt-32">
        <div
          className="absolute bottom-auto left-0 right-0 top-0 -mt-20 h-20 w-full"
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

        <div className="container mx-auto">
          <div className="relative z-10 -mt-64 flex flex-wrap justify-center rounded-lg bg-white px-12 py-16 shadow-xl">
            <div className="w-full text-center lg:w-8/12">
              <p className="text-center text-4xl">
                <span role="img" aria-label="love">
                  😍
                </span>
              </p>
              <h3 className="text-3xl font-semibold">
                Do you love this Starter Kit?
              </h3>
              <p className="mb-4 mt-4 text-lg leading-relaxed text-slate-500">
                Cause if you do, it can be yours now. Hit the buttons below to
                navigate to get the Free version for your next project. Build a
                new web app or give an old project a new look!
              </p>
              <div className="mt-10 flex flex-col sm:block">
                <a
                  href="https://www.creative-tim.com/learning-lab/tailwind/nextjs/overview/notus?ref=nnjs-index"
                  target="_blank"
                  className="get-started mb-2 mr-1 rounded bg-slate-400 px-6 py-4 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-slate-500"
                >
                  Get started
                </a>
                <a
                  href="https://github.com/creativetimofficial/notus-nextjs?ref=nnjs-index"
                  target="_blank"
                  className="github-star mb-1 mr-1 rounded bg-slate-700 px-6 py-4 text-sm font-bold uppercase text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-slate-600 sm:ml-1"
                >
                  <i className="fab fa-github mr-1 text-lg"></i>
                  <span>Help With a Star</span>
                </a>
              </div>
              <div className="mt-16 text-center"></div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
