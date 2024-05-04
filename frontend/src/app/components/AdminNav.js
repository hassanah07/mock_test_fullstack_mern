"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { FaBars, FaWindowClose } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Image from "next/image";
import { AdminNav } from "../api/AdminNav";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navigation = () => {
  const router = useRouter();
  const [toggleNav, setToggleNav] = useState(true);
  let toggleNavbarClose, toggleNavbarOpen;
  const ref = useRef();
  const logout = () => {
    localStorage.removeItem("token");
    toast.success("Yup! Logged Out", {
      theme: "dark",
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
    router.push("/login");
  };

  return (
    <div className="flex dark:bg-black bg-slate-100 h-16">
      <ToastContainer />

      <nav className="py-4">
        <Link href="/admin/dashboard" className="flex" as={"/admin/dashboard"}>
          <span>
            <Image
              src="/images.PNG"
              alt="admin_logo"
              width={30}
              height={30}
              style={{ width: 30, height: 30 }}
            />
          </span>
          <span className="font-bold text-red-700 text-2xl mt-1">Dual</span>
          <span className="font-bold text-blue-600 text-2xl mt-1">Glass</span>
        </Link>
      </nav>

      <nav
        ref={ref}
        className={
          toggleNav === true
            ? "absolute top-0 right-0  z-40 md:bg-transparent md:block hidden"
            : "absolute top-0 right-0  z-40 md:bg-transparent md:block"
        }
      >
        <ul className="py-14 md:py-4 md:flex px-2 md:bg-transparent bg-pink-400 dark:bg-slate-800 md:w-auto w-48 md:rounded-none rounded-bl-lg">
          {AdminNav.map((currElen, index) => {
            return (
              <Link
                href={currElen.link}
                className="px-2"
                key={currElen.id}
                onClick={() => {
                  setToggleNav(true);
                }}
              >
                <li className="font-semibold mx-3 md:ml-auto capitalize text-slate-600 dark:text-white py-2 md:py-auto">
                  {currElen.name}
                </li>
                <hr className="md:hidden" />
              </Link>
            );
          })}
          <li className="font-semibold mx-3 md:ml-auto capitalize text-slate-600 dark:text-white py-2 md:py-auto text-2xl">
            <FiLogOut onClick={logout} />
          </li>
        </ul>
        <FaWindowClose
          className="absolute top-3 right-3 text-3xl text-white cursor-pointer md:hidden"
          onClick={() => {
            setToggleNav(true);
          }}
        />
      </nav>

      <div
        className="hamburgerManu absolute top-2 right-2 z-20 cursor-pointer md:hidden"
        onClick={() => {
          setToggleNav(false);
        }}
      >
        <div className="cursor-pointer" title="Log Out">
          <FaBars className="text-5xl text-pink-800" title="Log Out" />
        </div>
      </div>
    </div>
  );
};

export default Navigation;
