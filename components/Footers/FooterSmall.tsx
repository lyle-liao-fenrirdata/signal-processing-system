import React from "react";

export default function FooterSmall({ absolute }: { absolute: boolean }) {
  return (
    <footer
      className={
        (absolute ? "absolute bottom-0 w-full bg-slate-800" : "relative") +
        " pb-6"
      }
    >
      <div className="container mx-auto px-4">
        <hr className="border-b-1 mb-6 border-slate-600" />
      </div>
    </footer>
  );
}
