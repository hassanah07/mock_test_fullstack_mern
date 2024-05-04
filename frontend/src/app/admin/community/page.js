"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidRightArrow } from "react-icons/bi";
import styles from "./Community.module.css";

const DashboardPage = () => {
  const router = useRouter();
  const [mock, setmock] = useState([]);

  const profileerify = async () => {
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
    if (res.status == false) {
      localStorage.removeItem("learnerToken");
      router.push("/login");
    }
  };

  useEffect(() => {
    profileerify();
  }, [router.query]);
  return (
    <>
      <div className={`flex justify-center items-center overflow-hidden`}>
        <div
          className={`w-full md:w-[50%] border-[3px] shadow-2xl shadow-popover-foreground relative overflow-hidden`}
        >
          <div className={`${styles.msg} mx-5`}>
            <p className={`${styles.demo}`}>Features Coming Soon</p>
          </div>
          <div className="textarea fixed bottom-5 w-full flex mx-2">
            <textarea
              name="chat"
              id="chat"
              cols="30"
              rows="10"
              className="h-[45px] w-[95%]  md:w-[45%]"
            ></textarea>
            <BiSolidRightArrow className="text-5xl text-red-600 mx-2" />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
