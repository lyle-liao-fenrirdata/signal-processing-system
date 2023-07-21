import React from "react";

import Navbar from "components/Navbars/AuthNavbar";
import FooterSmall from "components/Footers/FooterSmall";

export default function Auth({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
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
