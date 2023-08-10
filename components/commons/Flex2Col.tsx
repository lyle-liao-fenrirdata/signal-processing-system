import { twMerge } from "tailwind-merge";

export type Flex2ColBasicProp = {
  left: JSX.Element;
  right: JSX.Element;
};

type Flex2ColProp = Flex2ColBasicProp & {
  leftClassName?: string;
  rightClassName?: string;
};

export const Flex2Col = ({
  left,
  right,
  leftClassName = "md:w-6/12 md:pr-6",
  rightClassName = "md:w-6/12",
}: Flex2ColProp) => (
  <div className="flex flex-wrap">
    <div className={twMerge("w-full", leftClassName)}>{left}</div>
    <div className={twMerge("w-full", rightClassName)}>{right}</div>
  </div>
);
