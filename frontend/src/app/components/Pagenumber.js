import Link from "next/link";
import React from "react";

const Pagenumber = ({ pageNumbers, myPage }) => {
  return (
    <>
      {pageNumbers.map((allpages) => {
        return (
          <Link
            key={allpages}
            href={`/${myPage}?page=${allpages}`}
            className="mx-2 px-3 text-black dark:text-white bg-transparent border-2 dark:border-white border-slate-700 hover:border-none font-semibold hover:animate-pulse hover:bg-pink-400 dark:hover:text-slate-900"
          >
            {allpages}
          </Link>
        );
      })}
    </>
  );
};

export default Pagenumber;
