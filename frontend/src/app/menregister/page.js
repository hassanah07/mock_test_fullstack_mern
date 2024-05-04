"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [desc, setDesc] = useState("");

  const handleChange = (e) => {
    if (e.target.name == "name") {
      setName(e.target.value);
    } else if (e.target.name == "email") {
      setEmail(e.target.value);
    } else if (e.target.name == "mobile") {
      setMobile(e.target.value);
    } else if (e.target.name == "desc") {
      setDesc(e.target.value);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, email, mobile, desc };
    try {
      let resp = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }
      );
      const serverResponse = await resp.json();
      toast.success(serverResponse.msg, {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (error) {
      toast.error("Internal Sever Error-001", {
        theme: "dark",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  };
  return (
    <div className="text-black body-font bg-white dark:bg-black dark:text-white flex items-center justify-center min-h-screen">
      <ToastContainer />
      <section className="text-gray-600 body-font relative md:w-[70%] pb-14">
        <div className="container px-5 mx-auto md:w-[50%] shadow-2xl shadow-popover-foreground">
          <div className="flex flex-col text-center w-full py-2">
            <h2 className="sm:text-3xl text-2xl title-font my-4 text-yellow-500 font-semibold dark:text-slate-100">
              Register As a Author
            </h2>
          </div>
          <hr />
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="leading-7 text-sm text-gray-600 dark:text-slate-300"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full bg-transparent border border-gray-300 focus:border-transparent focus:bg-transparent focus:ring-2 focus:ring-pink-400 text-base outline-none text-yellow-500 font-semibold py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="leading-7 text-sm text-gray-600 dark:text-slate-300"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Email Id"
                    className="w-full bg-transparent border border-gray-300 focus:border-transparent focus:bg-transparent focus:ring-2 focus:ring-pink-400 text-base outline-none text-yellow-500 font-semibold py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative">
                  <label
                    htmlFor="Phone_number"
                    className="leading-7 text-sm text-gray-600 dark:text-slate-300"
                  >
                    Phone Number
                  </label>
                  <input
                    type="number"
                    id="mobile"
                    name="mobile"
                    value={mobile}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full bg-transparent border border-gray-300 focus:border-transparent focus:bg-transparent focus:ring-2 focus:ring-pink-400 text-base outline-none text-yellow-500 font-semibold py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>

              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="desc"
                    className="leading-7 text-sm text-gray-600 dark:text-slate-300"
                  >
                    Write About Yourself
                  </label>
                  <input
                    type="text"
                    id="desc"
                    name="desc"
                    value={desc}
                    onChange={handleChange}
                    placeholder="Start Typing"
                    className="w-full bg-transparent border border-gray-300 focus:border-transparent focus:bg-transparent focus:ring-2 focus:ring-pink-400 text-base outline-none text-yellow-500 font-semibold py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  className="text-slate-700 dark:text-white border-2 bg-white dark:bg-black py-2 px-8 focus:outline-none hover:bg-slate-300 hover:text-pink-900 dark:hover:bg-slate-700 text-lg font-semibold shadow-2xl shadow-popover-foreground dark:shadow-white w-full justify-center"
                  onClick={handleSubmit}
                >
                  Register Me!
                </button>
              </div>
              <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                <small className="text-red-700 font-semibold capitalize">
                  Never Share Your credentials with anyone
                </small>
                <p className="leading-normal my-5">
                  <b className="text-red-600 hover:animate-pulse">
                    <Link href="/login">Click to login</Link>
                  </b>
                  <br />
                  <b className="text-blue-600 hover:animate-pulse">
                    <Link href="/resetpassword">Click to Reset Password</Link>
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
