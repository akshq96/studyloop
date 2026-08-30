import { useEffect, useState } from "react";
import { animate } from "framer-motion";

export default function useCountUp(target, duration = 1.1) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target, duration]);

  return value;
}
