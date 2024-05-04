"use client";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
  const router = useRouter();
  const [profileData, setProfileData] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [email, setEmail] = useState("");
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
  const profileVerify = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/student/profile`,
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
    // console.log(res);
    setProfileData(res.student);
    if (res.status == false) {
      localStorage.removeItem("learnerToken");
      router.push("/login");
    }
  };

  const handleChange = (e) => {
    if (e.target.name == "password") {
      setPassword(e.target.value);
    } else if (e.target.name == "confPassword") {
      setConfPassword(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password != confPassword) {
      toast.error("Confirm Password Should Be Same", toastOptions);
    } else {
      const data = { password };
      // console.log(data);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/student/changepassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            learnerToken: localStorage.getItem("learnerToken")
          },
          body: JSON.stringify(data)
        }
      );
      const resp = await res.json();
      if (resp.status == true) {
        toast.success(resp.msg, toastOptions);
        localStorage.removeItem("learnerToken");
        router.push("/login");
      } else {
        toast.error(resp.msg, toastOptions);
      }
    }
  };

  useEffect(() => {
    profileVerify();
  }, [router.query]);

  return (
    <>
      <ToastContainer />
      <section className="text-gray-600 dark:text-slate-100 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900 dark:text-slate-100">
              Change Login Password
            </h1>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="leading-7 text-sm text-gray-600 dark:text-slate-100"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Type Your New Password"
                    className="w-full bg-gray-100 bg-opacity-30 border border-gray-300 focus:border-none focus:bg-slate-500 focus:ring-2 focus:ring-transparent text-base outline-none text-gray-700 dark:text-yellow-400 font-semibold py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    htmlFor="confPassword"
                    className="leading-7 text-sm text-gray-600 dark:text-slate-100"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confPassword"
                    name="confPassword"
                    value={confPassword}
                    onChange={handleChange}
                    placeholder="Confirm Your Password"
                    className="w-full bg-gray-100 bg-opacity-30 border border-gray-300 focus:border-none focus:bg-slate-500 focus:ring-2 focus:ring-transparent text-base outline-none text-gray-700 dark:text-yellow-400 font-semibold py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Registered Email"
                    className="w-full bg-gray-100 bg-opacity-30 border border-gray-300 focus:border-none focus:bg-slate-500 focus:ring-2 focus:ring-transparent text-base outline-none text-gray-700 dark:text-yellow-400 font-semibold py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    hidden
                  />
                </div>
              </div>

              <div className="p-2 w-full">
                <button
                  className="flex ml-0 text-slate-100 bg-yellow-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 hover:text-slate-100 text-lg font-semibold"
                  onClick={handleSubmit}
                >
                  Change Password
                </button>
              </div>
              <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                <a className="text-red-500 font-semibold capitalize">
                  Never Share your Password with anyone
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
