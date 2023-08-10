import { Flex2Col, Flex2ColBasicProp } from "../commons/Flex2Col";

export const Flex2ColExt = ({ left, right }: Flex2ColBasicProp) => (
  <Flex2Col
    left={left}
    right={right}
    leftClassName="sm:w-6/12 sm:pr-6 md:w-7/12 lg:w-9/12"
    rightClassName="sm:w-6/12 md:w-5/12 lg:w-3/12"
  />
);
