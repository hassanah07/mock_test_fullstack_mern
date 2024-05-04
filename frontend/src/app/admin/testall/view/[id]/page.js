"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = ({ params }) => {
  const router = useRouter();
  const [width, setWidth] = useState(false);
  const [height, setHeight] = useState(false);
  const [bigger, setBigger] = useState(false);

  const [currecntMock, setCurrecntMock] = useState([]);

  const handleReset = () => {
    setHeight(false), setWidth(false), setBigger(false);
  };
  const fullwidth = () => {
    setWidth(true);
  };
  const fullheight = () => {
    setHeight(true);
  };
  const moreBig = () => {
    setBigger(true);
  };
  const getItem = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/student/getmockset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          learnerToken: localStorage.getItem("learnerToken")
        },
        body: JSON.stringify({ id: params.id })
      }
    );
    res = await res.json();
    setCurrecntMock(res.currentset);
    if (res.status === false) {
      router.back;
    }
  };
  useEffect(() => {
    getItem();
  }, []);

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div
        className={`w-full shadow-2xl shadow-popover-foreground dark:shadow-purple-500 ${
          bigger == true ? "md:w-full" : "md:w-[50%]"
        }`}
      >
        <div className="shadow-xl shadow-yellow-500">
          <h1
            className={`text-2xl capitalize font-bold py-7 mx-5 ${
              bigger == true ? "hidden" : "block"
            }`}
          >
            {currecntMock.heading}
          </h1>
        </div>
        <small
          className={`font-semibold mx-10 ${
            bigger == true ? "hidden" : "block"
          }`}
        >
          Reference Video For this Mock Test of {currecntMock.mockId}
        </small>
        <div
          className={`items-center justify-center flex ${
            bigger == true ? "p-0" : "p-10"
          }`}
        >
          <iframe
            width="560"
            height={`${height == true ? "660" : "315"}`}
            src={
              currecntMock.embedLink != null
                ? `${currecntMock.embedLink}`
                : "https://www.youtube.com/embed/dfgefuy-TP2w?si=b4C6BPRGozfFKo5N"
            }
            // src={currecntMock.embedLink}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            className={`shadow-2xl shadow-popover-foreground dark:shadow-purple-500 ${
              width == true ? "w-full" : null
            }`}
          ></iframe>
        </div>
        <div className="hidden md:block">
          <div className="button flex flex-wrap justify-right p-10">
            {width === false && (
              <button
                className="shadow-lg shadow-popover-foreground dark:shadow-yellow-500 py-4 px-7"
                onClick={fullwidth}
              >
                Width Full
              </button>
            )}
            {height === false && (
              <button
                className="shadow-lg shadow-popover-foreground dark:shadow-yellow-500 py-4 px-7 mx-2"
                onClick={fullheight}
              >
                Height Full
              </button>
            )}
            {bigger === false && (
              <button
                className="shadow-lg shadow-popover-foreground dark:shadow-yellow-500 py-4 px-7 mx-2"
                onClick={moreBig}
              >
                Frame Hide
              </button>
            )}

            <button
              className="shadow-lg shadow-popover-foreground dark:shadow-yellow-500 py-4 px-7"
              onClick={handleReset}
            >
              Normal
            </button>
          </div>
        </div>

        <div className="button flex justify-between p-10">
          <button
            className="shadow-lg shadow-popover-foreground dark:shadow-yellow-500 py-4 px-7"
            onClick={router.back}
          >
            Back
          </button>
          <button className="shadow-lg shadow-popover-foreground dark:shadow-yellow-500 py-4 px-7">
            <Link href={`/admin/testall/preattempt/${params.id}`}>Next</Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
