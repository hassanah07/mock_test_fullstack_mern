"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { headers } from "../../../../next.config";

const Page = () => {
  const router = useRouter();
  const [refresh, setRefresh] = useState(Math.round(Math.random() * 9999999));
  const [heading, setHeading] = useState();
  const [subject, setSubject] = useState();
  const [mentor, setMentor] = useState();
  const [mockSetId, setMockSetId] = useState();

  const toastOptions = {
    theme: "dark",
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  };
  const mentorProfile = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/mentor/profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mentorToken: localStorage.getItem("mentorToken")
        }
      }
    );
    res = await res.json();
    setMentor(res.profile.name);
    setSubject(res.profile.role);
    if (res.status === true) {
      toast.success(res.msg, toastOptions);
    } else if (res.status === false) {
      toast.error(res.msg, toastOptions);
      localStorage.removeItem("mentorToken");
      setRefresh(Math.round(Math.random() * 11111111111));
    }
  };
  useEffect(() => {
    const mentorToken = localStorage.getItem("mentorToken");
    if (!mentorToken) {
      router.push("/menlogin");
    }
  }, [refresh]);

  useEffect(() => {
    mentorProfile();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen justify-center items-center">
        <div className="w-full md:w-[50%] shadow-2xl shadow-popover-foreground">
          <div className="bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
            <h2 className="text-gray-900 text-2xl font-bold title-font mb-5">
              PENDING MOCK LIST
            </h2>
            <div className="relative mb-4">{/* PENDING MOCK LIST */}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
