import React from "react";
import { BiSolidRightArrow } from "react-icons/bi";

const DashboardPage = () => {
  return (
    <>
      <div className={`flex justify-center items-center overflow-hidden`}>
        <div
          className={`w-full md:w-[50%] border-[3px] shadow-2xl shadow-popover-foreground relative overflow-hidden`}
        >
          <div className="mx-5">
            <p className="text-slate-400">Features Coming Soon</p>
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
