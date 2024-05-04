"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { AiFillBackward } from "react-icons/ai";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";

const Page = ({ params }) => {
  const router = useRouter();
  const [refresh, setRefresh] = useState(Math.round(Math.random() * 9999999));

  // data state
  const [currentQuestion, setCurrentQuestion] = useState([]);
  const [optiona, setOptiona] = useState([]);
  const [oneCorrect, setOneCorrect] = useState();
  const [optionb, setOptionb] = useState([]);
  const [twoCorrect, setTwoCorrect] = useState();
  const [optionc, setOptionc] = useState([]);
  const [threeCorrect, setThreeCorrect] = useState();
  const [optiond, setOptiond] = useState([]);
  const [fourCorrect, setFourCorrect] = useState();

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
    if (res.status === true) {
      // toast.success(res.msg, toastOptions);
      setRefresh(Math.round(Math.random() * 11111111110));
    } else if (res.status === false) {
      toast.error(res.msg, toastOptions);
      // localStorage.removeItem("mentorToken");
      setRefresh(Math.round(Math.random() * 11111111111));
    }
  };

  useEffect(() => {
    const mentorToken = localStorage.getItem("mentorToken");
    if (!mentorToken) {
      router.push("/menlogin");
    }
  }, [refresh]);

  const back = () => {
    router.back();
  };

  const itemGet = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/mentor/findquestion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mentorToken: localStorage.getItem("mentorToken")
        },
        body: JSON.stringify({ id: params.id })
      }
    );
    res = await res.json();
    const data = res.question;
    if (res.status === true) {
      setRefresh(Math.round(Math.random() * 11111111111));
      // state variable data
      setCurrentQuestion(data.question);

      setOptiona(data.selection.one.option);
      setOptionb(data.selection.two.option);
      setOptionc(data.selection.three.option);
      setOptiond(data.selection.four.option);

      setOneCorrect(data.selection.one.isCorrect);
      setTwoCorrect(data.selection.two.isCorrect);
      setThreeCorrect(data.selection.three.isCorrect);
      setFourCorrect(data.selection.four.isCorrect);
    } else if (res.status === false) {
      toast.error(res.msg, toastOptions);
    }
  };

  const deleteItem = async () => {
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/mentor/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mentorToken: localStorage.getItem("mentorToken")
      },
      body: JSON.stringify({ id: params.id })
    });
    res = await res.json();
    if (res.status === true) {
      setRefresh(Math.round(Math.random() * 11111111111));
      router.back();
    } else if (res.status === false) {
      toast.error(res.msg, toastOptions);
      setRefresh(Math.round(Math.random() * 11111111111));
    }
  };

  const editItem = async () => {
    console.log("object");
  };
  useEffect(() => {
    mentorProfile();
    itemGet();
  }, []);
  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen justify-center items-center py-16">
        <div className="w-full md:w-[65%] shadow-2xl shadow-popover-foreground">
          <div className="bg-transparent dark:text-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative">
            <div className="flex">
              <button className="mx-4 cursor-pointer" onClick={back}>
                <AiFillBackward
                  className="text-4xl text-red-500"
                  title="Back"
                />
              </button>
              <h2 className="text-gray-900 dark:text-white text-2xl font-extrabold title-font">
                View Question
              </h2>
            </div>
            <hr />
            <div className="relative mb-4">
              {/* playgorund */}
              <div className="question py-12">
                <div dangerouslySetInnerHTML={{ __html: currentQuestion }} />
              </div>
              <div className="options py-2">
                <div className="flex w-3/3 justify-between">
                  <div className="w-1/3">A. {optiona}</div>
                  <div className="w-1/3">
                    {oneCorrect === true && (
                      <ImCheckboxChecked
                        className="text-xl text-red-500"
                        title="Back"
                      />
                    )}
                    {oneCorrect === false && (
                      <ImCheckboxUnchecked className="text-xl" title="Back" />
                    )}
                  </div>
                </div>
              </div>
              <hr />
              <div className="options py-2">
                <div className="flex w-3/3 justify-between">
                  <div className="w-1/3">B. {optionb}</div>
                  <div className="w-1/3">
                    {twoCorrect === true && (
                      <ImCheckboxChecked
                        className="text-xl text-red-500"
                        title="Back"
                      />
                    )}
                    {twoCorrect === false && (
                      <ImCheckboxUnchecked className="text-xl" title="Back" />
                    )}
                  </div>
                </div>
              </div>
              <hr />
              <div className="options py-2">
                <div className="flex w-3/3 justify-between">
                  <div className="w-1/3">C. {optionc}</div>
                  <div className="w-1/3">
                    {threeCorrect === true && (
                      <ImCheckboxChecked
                        className="text-xl text-red-500"
                        title="Back"
                      />
                    )}
                    {threeCorrect === false && (
                      <ImCheckboxUnchecked className="text-xl" title="Back" />
                    )}
                  </div>
                </div>
              </div>
              <hr />
              <div className="options py-2">
                <div className="flex w-3/3 justify-between">
                  <div className="w-1/3">D. {optiond}</div>
                  <div className="w-1/3">
                    {fourCorrect === true && (
                      <ImCheckboxChecked
                        className="text-xl text-red-500"
                        title="Back"
                      />
                    )}
                    {fourCorrect === false && (
                      <ImCheckboxUnchecked className="text-xl" title="Back" />
                    )}
                  </div>
                </div>
              </div>
              <hr />
            </div>
            <div className="flex justify-between">
              <button className="py-2 px-5 dark:bg-slate-500 hover:dark:bg-green-300 hover:text-black">
                <Link href={`/mentor/question/edit/${params.id}`}>Edit</Link>
              </button>
              <button
                className="py-2 px-5 dark:bg-slate-500 hover:dark:bg-green-300 hover:text-black"
                onClick={deleteItem}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
