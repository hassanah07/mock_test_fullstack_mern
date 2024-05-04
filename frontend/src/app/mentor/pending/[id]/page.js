"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
import { GiHamburgerMenu } from "react-icons/gi";

const Page = ({ params }) => {
  const router = useRouter();
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const [refresh, setRefresh] = useState(Math.round(Math.random() * 9999999));
  const [oneCorrect, setOneCorrect] = useState(false);
  const [twoCorrect, setTwoCorrect] = useState(false);
  const [threeCorrect, setThreeCorrect] = useState(false);
  const [fourCorrect, setFourCorrect] = useState(false);

  const [optiona, setOptiona] = useState();
  const [optionb, setOptionb] = useState();
  const [optionc, setOptionc] = useState();
  const [optiond, setOptiond] = useState();

  const [questionId, setQuestionId] = useState(
    Math.floor(Math.random() * 10000001111)
  );

  const [mockRefresh, setmockRefresh] = useState(null);
  const [countRefresh, setCountRefresh] = useState([]);
  const [hidden, setHidden] = useState(false);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" }
      ],
      ["link", "image", "video"],
      ["clean"]
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false
    }
  };
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent"
  ];
  const config = {
    readonly: false,
    height: "300px",
    width: "100%",
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    toolbarAdaptive: true,
    toolbarSticky: true,
    imageDefaultWidth: 250,
    style: {
      background: "#27272E",
      color: "rgba(255,255,255,0.5)"
    }
  };
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

  const getMocks = async () => {
    let mockData = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/mentor/getsinglemock`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mentorToken: localStorage.getItem("mentorToken")
        },
        body: JSON.stringify({ mockSetId: params.id })
      }
    );
    mockData = await mockData.json();
    const singleMockData = mockData.data;
  };

  const handleChange = (e) => {
    if (e.target.name == "optiona") {
      setOptiona(e.target.value);
    } else if (e.target.name == "optionb") {
      setOptionb(e.target.value);
    } else if (e.target.name == "optionc") {
      setOptionc(e.target.value);
    } else if (e.target.name == "optiond") {
      setOptiond(e.target.value);
    }
  };

  const handleAddQuestion = async () => {
    const data = {
      question: content,
      optiona,
      optionb,
      optionc,
      optiond,
      one: oneCorrect,
      two: twoCorrect,
      three: threeCorrect,
      four: fourCorrect,
      questionSetId: params.id,
      questionId
    };
    let newQuestion = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/mentor/addquestion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mentorToken: localStorage.getItem("mentorToken")
        },
        body: JSON.stringify(data)
      }
    );
    newQuestion = await newQuestion.json();
    if (newQuestion.status === true) {
      setmockRefresh(Math.floor(Math.random() * 10000001111));
      toast.success(newQuestion.msg, toastOptions);
    } else {
      toast.error(newQuestion.msg, toastOptions);
    }
  };
  const newQuestion = () => {
    setQuestionId(Math.floor(Math.random() * 10000001111));
    toast.success("Add A new Question", toastOptions);
  };
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
    countRefresh = countRefresh.data;
    setCountRefresh(countRefresh.length);
  };

  const handleMax = () => {
    toast.error("Action Completed", toastOptions);
    setHidden(true);
  };

  useEffect(() => {
    questionCount();
  }, [mockRefresh]);

  useEffect(() => {
    mentorProfile();
    getMocks();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen justify-center items-center">
        <div className="w-full md:w-[65%] shadow-2xl shadow-popover-foreground">
          <div className="bg-transparent dark:text-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative">
            <Link href={`/mentor/question/multiple/${params.id}`}>
              <GiHamburgerMenu className="text-2xl" />
            </Link>
            <h2 className="text-gray-900 dark:text-white text-2xl font-extrabold title-font mb-5">
              Add Exact 25 Question
            </h2>
            <small className="absolute right-0 top-0 m-4">
              Added {countRefresh}
            </small>
            <hr />
            <div className="relative mb-4">
              <JoditEditor
                ref={editor}
                value={content}
                tabIndex={1}
                config={config}
                onBlur={(newContent) => setContent(newContent)}
                onChange={(newContent) => {}}
              />
              <div className="py-5">
                <div className="relative mb-4 w-12/12 flex">
                  <input
                    type="checkbox"
                    name="isCorrect"
                    id="isCorrect"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOneCorrect(true);
                      } else {
                        setOneCorrect(false);
                      }
                    }}
                  />

                  <input
                    type="text"
                    id="optiona"
                    name="optiona"
                    value={optiona}
                    onChange={handleChange}
                    className="bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out w-full"
                    placeholder="Option A"
                    autoComplete="off"
                  />
                </div>
                <div className="relative mb-4 w-12/12 flex">
                  <input
                    type="checkbox"
                    name="isCorrect"
                    id="isCorrect"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTwoCorrect(true);
                      } else {
                        setTwoCorrect(false);
                      }
                    }}
                  />
                  <input
                    type="text"
                    id="optionb"
                    name="optionb"
                    value={optionb}
                    onChange={handleChange}
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    placeholder="Option B"
                    autoComplete="off"
                  />
                </div>
                <div className="relative mb-4 w-12/12 flex">
                  <input
                    type="checkbox"
                    name="isCorrect"
                    id="isCorrect"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setThreeCorrect(true);
                      } else {
                        setThreeCorrect(false);
                      }
                    }}
                  />
                  <input
                    type="text"
                    id="optionc"
                    name="optionc"
                    value={optionc}
                    onChange={handleChange}
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    placeholder="Option C"
                    autoComplete="off"
                  />
                </div>
                <div className="relative mb-4 w-12/12 flex">
                  <input
                    type="checkbox"
                    name="isCorrect"
                    id="isCorrect"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFourCorrect(true);
                      } else {
                        setFourCorrect(false);
                      }
                    }}
                  />
                  <input
                    type="text"
                    id="optiond"
                    name="optiond"
                    value={optiond}
                    onChange={handleChange}
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    placeholder="Option D"
                    autoComplete="off"
                  />
                </div>
                <div className="flex justify-between">
                  {countRefresh < 25 && (
                    <button
                      className="btn button rounded-none bg-yellow-500 hover:bg-red-700 dark:bg-slate-700 dark:text-white py-2 w-1/3 mx-2"
                      onClick={newQuestion}
                    >
                      New
                    </button>
                  )}

                  {countRefresh >= 25 && null}
                  {countRefresh < 25 && (
                    <>
                      <button
                        className="btn button rounded-none bg-yellow-500 hover:bg-red-700 dark:bg-slate-700 dark:text-white py-2 w-1/3 mx-2"
                        onClick={handleAddQuestion}
                      >
                        Add
                      </button>
                    </>
                  )}
                  {countRefresh >= 25 && (
                    <button className="btn button rounded-none bg-yellow-500 hover:bg-red-700 dark:bg-slate-700 dark:text-white py-2 w-1/3 mx-2">
                      <Link href={`/mentor/question/solution/multiple/${params.id}`}>
                        Next
                      </Link>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
