"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [mock, setmock] = useState([]);

  const profileerify = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/student/getmock`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          learnerToken: localStorage.getItem("learnerToken")
        },
        body: JSON.stringify()
      }
    );
    res = await res.json();
    if (res.status == false) {
      localStorage.removeItem("learnerToken");
      router.push("/login");
    }
  };

  const getMockSet = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/student/getmock`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          learnerToken: localStorage.getItem("learnerToken")
        },
        body: JSON.stringify()
      }
    );
    res = await res.json();
    const data = res.mock;
    if (res.status == true) {
      setmock(data);
    } else {
      localStorage.removeItem("learnerToken");
    }
  };
  useEffect(() => {
    profileerify();
    getMockSet();
  }, [router.query]);

  return (
    <>
      <div className="min-h-screen justify-center items-center flex">
        <div className="w-full md:w-[60%] bg-slate-100 dark:bg-slate-800 shadow-2xl shadow-popover-foreground p-4">
          {/* nav bar 2222222222222 */}
          <div className="Filter Subjects"></div>
          <hr />
          {mock.map((currElem) => {
            return (
              <Link
                href={`/admin/testall/view/${currElem._id}`}
                key={currElem._id}
              >
                <div className="py-4 my-3 w-full px-3 hover:bg-slate-300 dark:hover:bg-red-900 shadow-md shadow-purple-500 hover:shadow-red-500">
                  {currElem.heading}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Page;
