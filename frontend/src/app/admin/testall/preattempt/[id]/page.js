"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEnvelope, FaRegEnvelopeOpen } from "react-icons/fa";

const Page = ({ params }) => {
  const router = useRouter();
  const toastOptions = {
    theme: "dark",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  };
  const startTest = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/student/startmock`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          learnerToken: localStorage.getItem("learnerToken")
        },
        body: JSON.stringify({ setId: params.id })
      }
    );
    res = await res.json();
    if ((res.status = true)) {
      toast.success(res.msg, toastOptions);
    } else {
      toast.error(res.msg, toastOptions);
    }
  };
  return (
    <>
      <ToastContainer />

      <div className="min-h-screen justify-center items-center flex">
        <div className="w-full md:w-[60%] bg-slate-100 dark:bg-slate-800 shadow-2xl shadow-popover-foreground dark:shadow-yellow-300 p-4">
          <h2 className="text-xl text-center font-semibold">
            Instruction for the Test
          </h2>
          <hr />
          <ol className="list-decimal px-10 py-12">
            <li className="py-2">Each Question Have Two Mark</li>
            <li className="py-2">No Negative Marking for Practice</li>
            <li className="py-2">No Time Limit for Practice</li>
            <li className="py-2">If you can's solve, click on Skip</li>
            <li className="py-2">
              if you click without marking any Option, The Question will be
              consider as False/Invalid for you
            </li>
            <li className="py-2">Total Number of Question is 25</li>
            <li className="py-2 flex">
              <FaRegEnvelope className="text-2xl" /> &nbsp;
              <p> Mean You have not answared</p>
            </li>
            <li className="py-2 flex">
              <FaRegEnvelopeOpen className="text-2xl" /> &nbsp;
              <p> Mean You have answared</p>
            </li>
          </ol>
          <div className="startBtn py-8 justify-between flex">
            <button
              className="shadow-lg shadow-popover-foreground dark:shadow-purple-500 py-4 px-7"
              onClick={router.back}
            >
              Back
            </button>
            <Link href={`/admin/testall/attempt/${params.id}?page=1`}>
              <button
                className="shadow-lg shadow-popover-foreground dark:shadow-purple-500 py-4 px-7"
                onClick={startTest}
              >
                Start Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
