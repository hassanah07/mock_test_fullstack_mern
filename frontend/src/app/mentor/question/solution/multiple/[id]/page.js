"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { AiFillBackward } from "react-icons/ai";

const Page = ({ params }) => {
  const router = useRouter();
  const editor = useRef(null);
  const [refresh, setRefresh] = useState(Math.round(Math.random() * 9999999));

  const [countRefresh, setCountRefresh] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [mockSetId, setMockSetId] = useState("");

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
      toast.success(res.msg, toastOptions);
      setRefresh(Math.round(Math.random() * 11111111110));
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

  const questionCount = async () => {
    const data = { questionSetId: params.id };
    let countRefresh = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/mentor/questioncount`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mentorToken: localStorage.getItem("mentorToken")
        },
        body: JSON.stringify(data)
      }
    );
    countRefresh = await countRefresh.json();
    const viewmocksetid = countRefresh.data[0].questionSetId;
    // console.log(countRefresh.data[0].questionSetId);
    countRefresh = countRefresh.data;
    setCountRefresh(countRefresh.length);
    setQuestions(countRefresh);
    setMockSetId(viewmocksetid);
  };

  const handleFinish = async () => {
    let finish = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/mentor/final`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mentorToken: localStorage.getItem("mentorToken")
        },
        body: JSON.stringify({ id: mockSetId })
      }
    );
    finish = await finish.json();
    if (finish.status === true) {
      router.push("/mentor/pending");
    }
  };

  useEffect(() => {
    questionCount();
    mentorProfile();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen justify-center items-center pb-16 pt-10">
        <div className="w-full md:w-[65%] shadow-2xl shadow-popover-foreground">
          <div className="bg-transparent dark:text-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative">
            <div className="flex">
              <button className="mx-4 cursor-pointer" onClick={router.back}>
                <AiFillBackward
                  className="text-4xl text-red-500"
                  title="Back"
                />
              </button>
              <h2 className="text-gray-900 dark:text-white text-2xl font-extrabold title-font">
                Select Question to solve
              </h2>
            </div>
            <small className="absolute right-0 top-0 m-4">
              Total {countRefresh} questions
            </small>
            <hr />
            <div className="relative mb-4">
              {/* playgorund */}
              {questions.map((currElem) => {
                return (
                  <Link
                    href={`/mentor/question/solution/solve/${currElem._id}`}
                    key={currElem._id}
                  >
                    <div
                      className={`py-2  text-inherit shadow-sm hover:shadow-2xl shadow-popover-foreground rounded-none my-3 px-5 ${
                        currElem.isSolved === true
                          ? "bg-purple-400"
                          : "bg-slate-600"
                      }`}
                    >
                      Question Number: {currElem.questionId}
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="justify-end">
              <button
                className="btn py-2 bg-slate-600 hover:bg-purple-300 px-4 hover:text-black"
                onClick={handleFinish}
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
