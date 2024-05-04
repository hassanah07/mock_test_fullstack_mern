"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CompletedTest = () => {
  const [mock, setMock] = useState([]);
  const getItems = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/student/getcompletedmock`,
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
    console.log(res.dataFinder);
    setMock(res.dataFinder);
  };
  useEffect(() => {
    getItems();
  }, []);

  return (
    <>
      <div className="min-h-screen justify-center items-center flex">
        <div className="w-full md:w-[60%] bg-slate-100 dark:bg-slate-800 shadow-2xl shadow-popover-foreground p-4">
          <h2 className="text-2xl font-bold py-10 rounded-lg shadow-md shadow-yellow-300 px-3">
            Access your free Mock Test from here
          </h2>
          <hr />
          {mock.map((currElem) => {
            return (
              // <Link
              //   href={`/admin/testall/view/${currElem._id}`}
              //   key={currElem._id}
              // >
              <Link
                href={`/admin/testcompleted/view/${currElem._id}?page=1`}
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

export default CompletedTest;
