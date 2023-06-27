import React from "react";

// components

export default function CardProfile() {
  return (
    <>
      <div className="relative mb-6 mt-16 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-xl">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="flex w-full justify-center px-4">
              <div className="relative">
                <img
                  alt="..."
                  src="/img/team-2-800x800.jpg"
                  className="absolute -m-16 -ml-20 h-auto max-w-150-px rounded-full border-none align-middle shadow-xl lg:-ml-16"
                />
              </div>
            </div>
            <div className="mt-20 w-full px-4 text-center">
              <div className="flex justify-center py-4 pt-8 lg:pt-4">
                <div className="mr-4 p-3 text-center">
                  <span className="block text-xl font-bold uppercase tracking-wide text-slate-600">
                    22
                  </span>
                  <span className="text-sm text-slate-400">Friends</span>
                </div>
                <div className="mr-4 p-3 text-center">
                  <span className="block text-xl font-bold uppercase tracking-wide text-slate-600">
                    10
                  </span>
                  <span className="text-sm text-slate-400">Photos</span>
                </div>
                <div className="p-3 text-center lg:mr-4">
                  <span className="block text-xl font-bold uppercase tracking-wide text-slate-600">
                    89
                  </span>
                  <span className="text-sm text-slate-400">Comments</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <h3 className="mb-2 mb-2 text-xl font-semibold leading-normal text-slate-700">
              Jenna Stones
            </h3>
            <div className="mb-2 mt-0 text-sm font-bold uppercase leading-normal text-slate-400">
              <i className="fas fa-map-marker-alt mr-2 text-lg text-slate-400"></i>{" "}
              Los Angeles, California
            </div>
            <div className="mb-2 mt-10 text-slate-600">
              <i className="fas fa-briefcase mr-2 text-lg text-slate-400"></i>
              Solution Manager - Creative Tim Officer
            </div>
            <div className="mb-2 text-slate-600">
              <i className="fas fa-university mr-2 text-lg text-slate-400"></i>
              University of Computer Science
            </div>
          </div>
          <div className="mt-10 border-t border-slate-200 py-10 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4 lg:w-9/12">
                <p className="mb-4 text-lg leading-relaxed text-slate-700">
                  An artist of considerable range, Jenna the name taken by
                  Melbourne-raised, Brooklyn-based Nick Murphy writes, performs
                  and records all of his own music, giving it a warm, intimate
                  feel with a solid groove structure. An artist of considerable
                  range.
                </p>
                <a
                  href="#pablo"
                  className="font-normal text-sky-500"
                  onClick={(e) => e.preventDefault()}
                >
                  Show more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
