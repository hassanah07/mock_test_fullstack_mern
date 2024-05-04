import Image from "next/image";
import Link from "next/link";
import React from "react";

import HeroTrusted from "./HeroTrusted";
import HeroMain from "./HeroMain";

const Hero = () => {
  return (
    <>
      <div className="items-center justify-center min-h-screen flex flex-col">
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <HeroMain />
            <HeroTrusted />
          </div>
        </section>
      </div>
    </>
  );
};

export default Hero;
