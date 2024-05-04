import Link from "next/link";
import React from "react";

const Ribbon = () => {
  return (
    <div className="bottom-0 fixed w-full">
      <div className="font-semibold text-xs md:text-sm text-center text-slate-600 bg-slate-300 dark:bg-slate-600 dark:text-slate-100 py-2 w-">
        <Link href="/">
          Trusted By Millions of Heart &copy; Guide Wale 2023
        </Link>
      </div>
    </div>
  );
};

export default Ribbon;
