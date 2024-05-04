"use client";

import QuestionChart from "@/app/components/QuestionChart";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Countdown from "react-countdown";
import moment from "moment";

moment().format();

const Page = ({ params, searchParams }) => {
  const router = useRouter();
  const [pageNumbers, setPageNumbers] = useState([]);
  const [question, setQuestion] = useState([]);
  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);
  const [questionId, setQuestionId] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  const [refresh, setRefresh] = useState(Math.round(Math.random() * 99999901));
  // const [tempToken, settempToken] = useState(refresh)
  const toastOptions = {
    theme: "dark",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  };

  const dataLimit = 1;

  let currentPage = 1;

  if (Number(searchParams.page) >= 1) {
    currentPage = Number(searchParams.page);
    // setCurrentPage(searchParams.page)
  }

  const getItems = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/student/getmockquestion?currentpage=${currentPage}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          learnerToken: localStorage.getItem("learnerToken")
        },
        body: JSON.stringify({ setId: params.id })
      }
    );
    res = await res.json();
    setQuestionId(res.questionFinder[0]._id);
    setQuestion(res.questionFinder);
    const totalData = res.totalItems;
    const totalPages = Math.ceil(totalData / dataLimit);
    // let currentPage = 1;
    let pageNumbers = [];
    for (let i = currentPage - 25; i <= currentPage + 25; i++) {
      if (i < 1) continue;
      if (i > totalPages) break;
      pageNumbers.push(i);
    }
    setPageNumbers(pageNumbers);
    setRefresh(Math.round(Math.random() * 99999901));
  };

  const handleCheckedOne = (e) => {
    if (e.target.name == "one") {
      setOne(true);
      setTwo(false);
      setThree(false);
      setFour(false);
      document.getElementById("two").checked = false;
      document.getElementById("three").checked = false;
      document.getElementById("four").checked = false;
    } else if (e.target.name == "two") {
      setOne(false);
      setTwo(true);
      setThree(false);
      setFour(false);
      document.getElementById("one").checked = false;
      document.getElementById("three").checked = false;
      document.getElementById("four").checked = false;
    } else if (e.target.name == "three") {
      setOne(false);
      setTwo(false);
      setThree(true);
      setFour(false);
      document.getElementById("two").checked = false;
      document.getElementById("one").checked = false;
      document.getElementById("four").checked = false;
    } else if (e.target.name == "four") {
      setOne(false);
      setTwo(false);
      setThree(false);
      setFour(true);
      document.getElementById("one").checked = false;
      document.getElementById("two").checked = false;
      document.getElementById("three").checked = false;
    }
  };

  const submitQuestion = async () => {
    const data = {
      questionId,
      one,
      two,
      three,
      four
    };
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/student/startquestion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          learnerToken: localStorage.getItem("learnerToken")
        },
        body: JSON.stringify(data)
      }
    );
    res = await res.json();
    setOne(false);
    setTwo(false);
    setThree(false);
    setFour(false);
    document.getElementById("one").checked = false;
    document.getElementById("two").checked = false;
    document.getElementById("three").checked = false;
    document.getElementById("four").checked = false;
  };
  const showFinish = async () => {
    const data = {
      questionId,
      one,
      two,
      three,
      four
    };
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/student/startquestion`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          learnerToken: localStorage.getItem("learnerToken")
        },
        body: JSON.stringify(data)
      }
    );
    res = await res.json();
    if (res.status == true) {
      setIsFinished(true);
    }
    setOne(false);
    setTwo(false);
    setThree(false);
    setFour(false);
    document.getElementById("one").checked = false;
    document.getElementById("two").checked = false;
    document.getElementById("three").checked = false;
    document.getElementById("four").checked = false;
  };

  const submitExam = async () => {
    let res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/student/submitexam`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          learnerToken: localStorage.getItem("learnerToken")
        },
        body: JSON.stringify({ setId: params.id })
      }
    );
    res = await res.json();
    if (res.status === true) {
      router.push("/admin/testcompleted");
    }
  };

  const linkOne = "testall";
  const linkTwo = "attempt";

  useEffect(() => {
    if (!localStorage.getItem("learnerToken")) {
      router.back;
    }
    getItems();
  }, [searchParams.page]);
  return (
    <>
      <ToastContainer />

      {/* <div className="absolute right-0">
        <Countdown
          date={Date.parse(storedDate) + 900000}
          onComplete={submitExam}
        />
      </div> */}
      <div className="min-h-screen justify-center items-center flex">
        <div className="w-4/12 md:block hidden bg-slate-100 dark:bg-slate-800 shadow-2xl shadow-popover-foreground dark:shadow-yellow-300 px-4 py-32">
          {/* playground */}
          {/* playground */}
          <QuestionChart
            setId={params.id}
            pageNumbers={pageNumbers}
            pageParams={searchParams.page}
            linkOne={linkOne}
            linkTwo={linkTwo}
          />
        </div>
        <div className="md:w-8/12 w-full relative">
          {/* <div className="align-middle">
            <TfiArrowCircleRight className="align-middle"/>
          </div> */}
          {question.map((elem) => {
            return (
              <div className="w-full bg-slate-100 dark:bg-slate-800 shadow-2xl shadow-popover-foreground dark:shadow-yellow-300 p-4">
                <h2 className="text-xl text-center font-semibold">
                  {/* {elem.question} */}
                  <div dangerouslySetInnerHTML={{ __html: elem.question }} />
                </h2>
                <hr />
                <div className="list px-10 ">
                  <ul>
                    <li className="py-3 flex">
                      <input
                        type="checkbox"
                        name="one"
                        id="one"
                        className="w-5 mx-2"
                        onChange={handleCheckedOne}
                      />
                      {elem.selection.one.option}
                    </li>
                    <li className="py-3 flex">
                      <input
                        type="checkbox"
                        name="two"
                        id="two"
                        className="w-5 mx-2"
                        onChange={handleCheckedOne}
                      />
                      {elem.selection.two.option}
                    </li>
                    <li className="py-3 flex">
                      <input
                        type="checkbox"
                        name="three"
                        id="three"
                        className="w-5 mx-2"
                        onChange={handleCheckedOne}
                      />
                      {elem.selection.three.option}
                    </li>
                    <li className="py-3 flex">
                      <input
                        type="checkbox"
                        name="four"
                        id="four"
                        className="w-5 mx-2"
                        onClick={handleCheckedOne}
                      />
                      {elem.selection.four.option}
                    </li>
                  </ul>
                </div>
                <div className="buttons py-8 justify-between flex">
                  {searchParams.page > 1 && (
                    <Link
                      href={`/admin/testall/attempt/${params.id}?page=${
                        searchParams.page - 1
                      }`}
                    >
                      <button className="shadow-lg hover:bg-red-800 hover:dark:shadow-popover-foreground shadow-popover-foreground dark:shadow-purple-500 py-4 px-7">
                        Prev
                      </button>
                    </Link>
                  )}
                  {searchParams.page <= 1 && (
                    <button className="shadow-lg hover:bg-red-800 hover:dark:shadow-popover-foreground shadow-popover-foreground dark:shadow-purple-500 py-4 px-7">
                      N/A
                    </button>
                  )}
                  <div className="flex">
                    {searchParams.page < 25 && (
                      <Link
                        href={`/admin/testall/attempt/${params.id}?page=${
                          Number(searchParams.page) + 1
                        }`}
                      >
                        <button className="shadow-lg hover:bg-red-800 hover:dark:shadow-popover-foreground shadow-popover-foreground dark:shadow-purple-500 py-4 px-7">
                          Skip
                        </button>
                      </Link>
                    )}
                    {searchParams.page < 25 && (
                      <Link
                        href={`/admin/testall/attempt/${params.id}?page=${
                          Number(searchParams.page) + 1
                        }`}
                      >
                        <button
                          className="shadow-lg hover:bg-red-800 hover:dark:shadow-popover-foreground shadow-popover-foreground dark:shadow-purple-500 py-4 px-7 mx-3"
                          onClick={submitQuestion}
                        >
                          Next
                        </button>
                      </Link>
                    )}
                    {searchParams.page >= 25 && (
                      <button
                        className="shadow-lg hover:bg-red-800 hover:dark:shadow-popover-foreground shadow-popover-foreground dark:shadow-purple-500 py-4 px-7 mx-2"
                        onClick={showFinish}
                      >
                        next
                      </button>
                    )}
                    {isFinished == true && (
                      <button
                        className="shadow-lg hover:bg-red-800 hover:dark:shadow-popover-foreground shadow-popover-foreground dark:shadow-purple-500 py-4 px-7"
                        onClick={submitExam}
                      >
                        Finish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Page;
