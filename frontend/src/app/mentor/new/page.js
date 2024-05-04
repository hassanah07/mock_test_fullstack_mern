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

  const handleChange = (e) => {
    if (e.target.name == "heading") {
      setHeading(e.target.value);
      setMockSetId(Math.round(Math.random() * 123000000));
    }
    if (e.target.name == "subject") {
      setSubject(e.target.value);
    }
  };
  const handleSubmit = async () => {
    const data = {
      heading,
      subject,
      mockSetId,
      mentor,
      mockId: Math.round(Math.random() * 321000000),
      price: 0
    };
    let postData = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/mentor/craetemock`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mentorToken: localStorage.getItem("mentorToken")
        },
        body: JSON.stringify(data)
      }
    );
    postData = await postData.json();
    if (postData.status === true) {
      toast.success(postData.msg, toastOptions);
    } else {
      toast.error(postData.msg, toastOptions);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen justify-center items-center">
        <div className="w-full md:w-[50%] shadow-2xl shadow-popover-foreground">
          <div className="bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
            <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
              Add New Mock Set
            </h2>
            <div className="relative mb-4">
              <label
                htmlFor="heading"
                className="leading-7 text-sm text-gray-600"
              >
                Mock Heading
              </label>
              <input
                type="text"
                id="heading"
                name="heading"
                value={heading}
                onChange={handleChange}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="subject"
                className="leading-7 text-sm text-gray-600"
              >
                Subject
              </label>
              <select
                name="subject"
                id="subject"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out h-12 capitalize"
                onChange={handleChange}
              >
                <option value="" disabled selected>
                  Please Select Your Subject
                </option>
                <option value="english">english</option>
                <option value="mathamatics">mathamatics</option>
                <option value="reasoning">reasoning</option>
                <option value="biology">biology</option>
                <option value="physics">physics</option>
                <option value="chemistry">chemistry</option>
                <option value="General Knowledge">General Knowledge</option>
                <option value="Indian History">Indian History</option>
                <option value="geography">geography</option>
                <option value="Indian Polity">Indian Polity</option>
                <option value="foreign policy">foreign policy</option>
              </select>
            </div>
            <button
              className="text-white bg-yellow-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 text-lg"
              onClick={handleSubmit}
            >
              Add Mock Set
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
