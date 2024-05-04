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

  const getItem = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/mentor/solutionfindwithid`,
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
    // console.log(res);
    setContent(res.solution.solution);
  };

  const handleUpdate = async () => {
    const data = {
      content: content,
      id: params.id
    };
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/mentor/solutionupdate`,
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
    if (res.status === true) {
      setRefresh(Math.round(Math.random() * 11111111111));
      toast.success(res.msg, toastOptions);
      router.back();
    } else if (res.status === false) {
      toast.error(res.msg, toastOptions);
      setRefresh(Math.round(Math.random() * 11111111111));
    }
  };

  useEffect(() => {
    mentorProfile();
    getItem();
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
                Edit Solution
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
                  <div className="flex justify-between">
                    <button
                      className="btn button rounded-none bg-yellow-500 hover:bg-red-700 dark:bg-slate-700 dark:text-white py-2 w-1/3 mx-2"
                      onClick={handleUpdate}
                    >
                      Update
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
