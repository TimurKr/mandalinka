"use client";

import { useState } from "react";

export default function SubheadingText() {
  const subheadings = ["starostí", "stresu", "nákupov", "odpadu"];

  const [current, setCurrent] = useState(subheadings[0]);
  const [next, setNext] = useState(subheadings[1]);
  const [animationClass, setAnimationClass] = useState("transition-none");

  setTimeout(() => {
    setCurrent(next);
    setNext(subheadings[(subheadings.indexOf(next) + 1) % subheadings.length]);
    setAnimationClass("transition");
  }, 2500);

  return (
    <>
      <h4 className="relative mt-4 h-5 -translate-x-10 text-xl text-neutral-800">
        Varenie bez{" "}
        {subheadings.map((subheading) => (
          <span
            key={subheading}
            className={`absolute font-semibold italic ${animationClass} opacity-0 duration-1000 ease-in-out ${
              subheading === current
                ? "opacity-100"
                : subheading === next
                ? "-translate-y-full"
                : "translate-y-full"
            }`}
          >
            {subheading}
          </span>
        ))}
      </h4>
    </>
  );
}
