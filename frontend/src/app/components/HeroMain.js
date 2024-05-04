import Link from "next/link";
import React from "react";

const HeroMain = () => {
  return (
    <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
      <h1 className="sm:text-4xl text-3xl title-font text-pink-900 capitalize font-extrabold dark:text-white">
        GuideWale
      </h1>
      <div className="lg:w-1/2 w-full leading-relaxed text-black text-justify capitalize dark:text-white text-lg pt-3 pb-4">
        GuideWale is not only a Income share Blog Writing Platform but It is
        also a Hive of Programmers. We are a Team of Programmers and We are
        always ready to work on your upcoming Web based Project
      </div>
      <div className="lg:w-1/2 w-full leading-relaxed text-black capitalize justify-between pb-3">
        <Link href="/talk">
          <button className="bg-yellow-500 hover:bg-red-500 px-6 py-2 font-bold text-black hover:text-slate-200 shadow-2xl shadow-popover-foreground">
            Lets Talk
          </button>
        </Link>
        <Link href="/pricing">
          <button className="bg-red-300 hover:bg-yellow-500 px-6 py-2 font-bold text-black hover:text-slate-200 shadow-2xl shadow-popover-foreground mx-4">
            Pricing
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HeroMain;
