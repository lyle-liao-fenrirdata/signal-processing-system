import React from "react";

// components

import Navbar from "components/Navbars/AuthNavbar.js";
import FooterSmall from "components/Footers/FooterSmall.js";

export default function Auth({ children }) {
  return (
    <>
      <Navbar transparent />
      <main>
        <section className="relative h-full min-h-screen w-full py-24">
          <div className="absolute top-0 h-full w-full bg-slate-800 bg-full bg-no-repeat"></div>
          {children}
          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
}
