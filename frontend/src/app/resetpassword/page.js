"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const profileId = Math.floor(Math.random() * 1233211020000);
  const handleChange = (e) => {
    if (e.target.name == "email") {
      setEmail(e.target.value);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, profileId };
    try {
      let res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/student/resetpassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );
      res = await res.json();
      toast.success(res, {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="text-black body-font bg-white dark:bg-black dark:text-white flex items-center justify-center min-h-screen">
      <ToastContainer />
      <section className="text-gray-600 body-font relative md:w-[70%]">
        <div className="container px-5 mx-auto md:w-[50%] shadow-2xl shadow-popover-foreground">
          <div className="flex flex-col text-center w-full py-2">
            <h1 className="sm:text-3xl text-2xl font-medium title-font my-4 text-gray-900 dark:text-slate-100">
              Forgotten Your Password
            </h1>
          </div>
          <hr />
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="leading-7 text-sm text-gray-600 dark:text-white"
                  >
                    Email Id
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="username"
                    className="w-full bg-transparent border border-gray-300 focus:border-transparent focus:bg-transparent focus:ring-2 focus:ring-pink-400 text-base outline-none text-yellow-500 font-semibold py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    autoComplete="off"
                  />
                  <input
                    type="number"
                    id="profileId"
                    name="profileId"
                    value={profileId}
                    onChange={handleChange}
                    placeholder="username"
                    className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-pink-500 focus:bg-white focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    autoComplete="off"
                    readOnly
                    hidden
                  />
                </div>
              </div>
              <div className="text-center text-red-800 font-semibold">
                <small>
                  (Auto Generated Password will be sent to your Email Id)
                </small>
              </div>
              <div className="p-2 w-full">
                <button
                  className="text-slate-700 dark:text-white border-2 bg-white dark:bg-black py-2 px-8 focus:outline-none hover:bg-slate-300 hover:text-pink-900 dark:hover:bg-slate-700 text-lg font-semibold shadow-2xl shadow-popover-foreground dark:shadow-white w-full justify-center"
                  onClick={handleSubmit}
                >
                  Reset Password
                </button>
              </div>
              <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                <small className="text-red-800 font-semibold">
                  Never Share Your Data with anyone
                </small>
                <p className="leading-normal my-5">
                  <b className="text-blue-600 hover:animate-pulse">
                    <Link href="/registration">Click Here for Sign Up</Link>
                  </b>
                  <br />
                  <b className="text-red-600 hover:animate-pulse">
                    <Link href="/login">Click to login</Link>
                  </b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
