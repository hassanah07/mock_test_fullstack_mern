import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <div className="text-black dark:text-slate-100 font-semibold text-xl">
        404 | Page Not Found
      </div>
      <hr />
      <Link href="/" className="py-4">
        <button className="font-semibold text-xl bg-yellow-500 text-black px-6 py-2 hover:bg-pink-400">
          Go to Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
