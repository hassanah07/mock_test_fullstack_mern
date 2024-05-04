import Link from "next/link";
import Hero from "./components/Hero";

export const metadata = {
  title: "GuideWale | Home",
  description:
    "Get latest Job Information, Health Tips, MedicaL Advices And many more at one Place"
};

const Page = async () => {
  return (
    <div className="overflow-hidden text-black body-font bg-white dark:bg-black dark:text-white min-h-screen">
      <Hero />
    </div>
  );
};

export default Page;
