"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import moment from "moment/moment";

const Page = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState("");
  const toastOption = {
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
    console.log(res);
    setProfileData(res.student);
    if (res.status == false) {
      localStorage.removeItem("learnerToken");
      router.push("/login");
    }
  };
  useEffect(() => {
    profileVerify();
  }, [router.query]);

  return (
    <>
      <section className="text-gray-600 body-font bg-green-100 dark:bg-slate-800 flex flex-row min-h-screen justify-center items-center pb-14">
        <div className="container px-5 py-24 mx-auto flex flex-col">
          <div className="lg:w-4/6 mx-auto">
            <div className="flex flex-col sm:flex-row mt-10">
              <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
                  <Image
                    src={profileData.image}
                    alt="profile_image"
                    width={100}
                    height={100}
                  />
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-gray-900 text-lg dark:text-slate-100">
                    {profileData.name}
                  </h2>
                  <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
                </div>
              </div>
              <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                <ul className="leading-relaxed text-sm mb-4 capitalize">
                  <li className="dark:text-slate-100">Name :</li>
                  <li className="dark:text-pink-500">{profileData.name}</li>
                  <li className="dark:text-slate-100">Email :</li>
                  <li className="dark:text-pink-500">{profileData.email}</li>
                  <li className="dark:text-slate-100">Mobile :</li>
                  <li className="dark:text-pink-500">{profileData.mobile}</li>
                  <li className="dark:text-slate-100">Last Access:</li>
                  <li className="dark:text-pink-500">
                    <p>{moment(profileData.updatedAt).fromNow()}</p>
                  </li>
                  <li className="dark:text-slate-100">
                    <Link href={`/admin/profile/${profileData._id}`}>
                      <button className="px-4 py-2 bg-red-500 hover:bg-yellow-500">
                        Change Password
                      </button>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
