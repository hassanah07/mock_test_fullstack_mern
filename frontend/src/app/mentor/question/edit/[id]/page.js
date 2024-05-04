"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";

import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

import { AiFillBackward } from "react-icons/ai";

const Page = ({ params }) => {
  const router = useRouter();
  const editor = useRef(null);
  const [content, setContent] = useState("");

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

      setContent(data.question);
    } else if (res.status === false) {
      //   console.log(res.error);
      toast.error(res.msg, toastOptions);
    }
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

  const handleUpdate = async () => {
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
      id: params.id
    };
    let res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/mentor/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mentorToken: localStorage.getItem("mentorToken")
      },
      body: JSON.stringify(data)
    });
    res = await res.json();
    if (res.status === true) {
      setRefresh(Math.round(Math.random() * 11111111111));
      toast.success(res.msg, toastOptions);
      //   router.back();
    } else if (res.status === false) {
      toast.error(res.msg, toastOptions);
      setRefresh(Math.round(Math.random() * 11111111111));
    }
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
                Edit Question
              </h2>
            </div>
            <hr />
            <div className="relative mb-4">
              {/* playgorund */}

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
                      value={oneCorrect}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setOneCorrect(true);
                        } else {
                          setOneCorrect(false);
                        }
                      }}
                      className="w-1/12 mr-1"
                    />

                    <input
                      type="text"
                      id="optiona"
                      name="optiona"
                      value={optiona}
                      onChange={handleChange}
                      className="bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out w-9/12"
                      placeholder="Option A"
                      autoComplete="off"
                    />
                    <div className="w-1/12 ml-1">
                      {oneCorrect === true && (
                        <ImCheckboxChecked
                          className="text-4xl text-red-500"
                          title="Back"
                        />
                      )}
                      {oneCorrect === false && (
                        <ImCheckboxUnchecked
                          className="text-4xl"
                          title="Back"
                        />
                      )}
                    </div>
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
                      className="w-1/12 mr-1"
                    />
                    <input
                      type="text"
                      id="optionb"
                      name="optionb"
                      value={optionb}
                      onChange={handleChange}
                      className="w-9/12 bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      placeholder="Option B"
                      autoComplete="off"
                    />
                    <div className="w-1/12 ml-1">
                      {twoCorrect === true && (
                        <ImCheckboxChecked
                          className="text-4xl text-red-500"
                          title="Back"
                        />
                      )}
                      {twoCorrect === false && (
                        <ImCheckboxUnchecked
                          className="text-4xl"
                          title="Back"
                        />
                      )}
                    </div>
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
                      className="w-1/12 mr-1"
                    />
                    <input
                      type="text"
                      id="optionc"
                      name="optionc"
                      value={optionc}
                      onChange={handleChange}
                      className="w-9/12 bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      placeholder="Option C"
                      autoComplete="off"
                    />
                    <div className="w-1/12 ml-1">
                      {threeCorrect === true && (
                        <ImCheckboxChecked
                          className="text-4xl text-red-500"
                          title="Back"
                        />
                      )}
                      {threeCorrect === false && (
                        <ImCheckboxUnchecked
                          className="text-4xl"
                          title="Back"
                        />
                      )}
                    </div>
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
                      className="w-1/12 mr-1"
                    />
                    <input
                      type="text"
                      id="optiond"
                      name="optiond"
                      value={optiond}
                      onChange={handleChange}
                      className="w-9/12 bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      placeholder="Option D"
                      autoComplete="off"
                    />
                    <div className="w-1/12 ml-1">
                      {fourCorrect === true && (
                        <ImCheckboxChecked
                          className="text-4xl text-red-500"
                          title="Back"
                        />
                      )}
                      {fourCorrect === false && (
                        <ImCheckboxUnchecked
                          className="text-4xl"
                          title="Back"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button
                      className="btn button rounded-none bg-yellow-500 hover:bg-red-700 dark:bg-slate-700 dark:text-white py-2 w-1/3 mx-2"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>

                    <button className="btn button rounded-none bg-yellow-500 hover:bg-red-700 dark:bg-slate-700 dark:text-white py-2 w-1/3 mx-2">
                      Next
                    </button>
                  </div>
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
