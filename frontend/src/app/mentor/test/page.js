"use client";
import React, { useState } from "react";

const Page = () => {
  const [check, setCheck] = useState(false);
  const handleClick = () => {
    console.log(check);
  };
  return (
    <div>
      <input
        type="checkbox"
        name="checkbox"
        id="checkbox"
        onChange={(e) => {
          if (e.target.checked) {
            setCheck(true);
          } else {
            setCheck(false);
          }
        }}
      />
      <button type="button" onClick={handleClick}>
        log
      </button>
    </div>
  );
};

export default Page;
