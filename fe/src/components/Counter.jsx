import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatNumber } from "../utils/utils";

// eslint-disable-next-line react/prop-types
export default function Counter({ targetNumber }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= targetNumber) {
          clearInterval(interval);
          return targetNumber;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [targetNumber]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {formatNumber(count)}
      {"+"}
    </motion.div>
  );
}
