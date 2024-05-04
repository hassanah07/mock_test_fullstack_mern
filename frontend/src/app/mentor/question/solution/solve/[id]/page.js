"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import dynamic from "next/dynamic";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import { AiFillBackward } from "react-icons/ai";

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
  const [questionSetId, setQuestionSetId] = useState([]);
  const [solved, setSolved] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState([]);
  const [solutionFind, setSolutionFind] = useState([]);

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
      setSolved(data.isSolved);
      setQuestionId(data.questionId);
      setQuestionSetId(data.questionSetId);
    } else if (res.status === false) {
      toast.error(res.msg, toastOptions);
    }
  };

  const solutionAdd = async () => {
    const data = {
      solution: content,
      questionSetId,
      questionId: params.id
    };
    console.log(data);
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/mentor/solutionadd`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mentorToken: localStorage.getItem("mentorToken")
        },
        body: JSON.stringify(data)
      }
    );
    res = await res.json();
    if (res.status == true) {
      toast.success(res.msg, toastOptions);
      setRefresh(Math.round(Math.random() * 99999999));
      location.reload();
    } else {
      toast.error(res.msg, toastOptions);
      // router.refresh;
    }
  };

  const findquestion = async () => {
    let solFind = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/mentor/solutionfind`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          mentorToken: localStorage.getItem("mentorToken")
        },
        body: JSON.stringify({ questionId: params.id })
      }
    );
    solFind = await solFind.json();
    setSolutionFind(solFind.solution);
  };

  useEffect(() => {
    mentorProfile();
    itemGet();
    findquestion();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen justify-center items-center">
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
                Question Viewer
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
          </div>
          <hr />
          {solved === true && (
            <div className="bg-transparent dark:text-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative">
              <h2 className="text-gray-900 dark:text-white text-2xl font-extrabold title-font mb-5">
                Solved Answar
              </h2>
              <hr />
              <div className="relative mb-4">
                {/* playgournd */}
                <div
                  dangerouslySetInnerHTML={{ __html: solutionFind.solution }}
                />
              </div>
              <div className="flex justify-between">
                {/* my button */}
                <Link
                  href={`/mentor/question/solution/edit/${solutionFind._id}`}
                >
                  <button className="py-2 my-5 px-5 dark:bg-slate-500 hover:dark:bg-green-300 hover:text-black">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          )}
          {solved === false && (
            <div className="bg-transparent dark:text-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative">
              <h2 className="text-gray-900 dark:text-white text-2xl font-extrabold title-font mb-5">
                Add Solution
              </h2>
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
                <div className="flex justify-between">
                  {/* my button */}
                  <button
                    className="py-2 my-5 px-5 dark:bg-slate-500 hover:dark:bg-green-300 hover:text-black"
                    onClick={solutionAdd}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
