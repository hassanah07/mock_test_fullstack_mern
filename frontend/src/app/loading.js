"use client";
import Image from "next/image";
import React from "react";

const loading = () => {
  return (
    <>
      <div className="flex flex-row min-h-screen justify-center items-center">
        <div className="lds-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default loading;
