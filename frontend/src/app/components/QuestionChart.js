"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaRegEnvelope, FaRegEnvelopeOpen } from "react-icons/fa";

const QuestionChart = ({
  setId,
  pageNumbers,
  pageParams,
  linkOne,
  linkTwo
}) => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const getItems = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/student/getmockquestionchart`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          learnerToken: localStorage.getItem("learnerToken")
        },
        body: JSON.stringify({ setId: setId })
      }
    );
    res = await res.json();
    setData(res);
  };
  useEffect(() => {
    getItems();
  }, [pageParams]);

  return (
    <div>
      <div className="flex flex-wrap -m-4">
        {data.map((elem, index) => {
          return (
            <div className="w-1/4 py-3 px-2 cursor-pointer">
              <Link
                href={`/admin/${linkOne}/${linkTwo}/${setId}?page=${index + 1}`}
                key={index + 1}
              >
                <div
                  className={`border border-gray-300 shadow-lg shadow-slate-400 hover:shadow-2xl hover:shadow-yellow-400 hover:transition-all hover:bg-purple-100 hover:border-purple-300 dark:text-slate-100 dark:hover:bg-slate-900 ${
                    pageParams == index + 1 ? "bg-black dark:bg-blue-800" : null
                  }`}
                >
                  <div className="flex items-center justify-center bg-transparent-500 mb-4 cursor-pointer p-2">
                    {!data[index].studentData[0] && (
                      <FaRegEnvelope className="font-bold text-2xl text-indigo-700 dark:text-white" />
                    )}
                    {data[index].studentData[0] && (
                      <FaRegEnvelopeOpen className="font-bold text-2xl text-red-700 dark:text-red-700" />
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionChart;
