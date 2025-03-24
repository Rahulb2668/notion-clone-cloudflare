import stringToHexColor from "@/lib/stringToColor";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MousePointer2 as MousePointer, TextCursor } from "lucide-react";

const FollowPointer = ({
  info,
  x,
  y,
}: {
  info: {
    name: string;
    email: string;
    avatar: string;
  };
  x: number;
  y: number;
}) => {
  const [animationKey, setAnimationKey] = useState(0);
  const [isMoving, setIsMoving] = useState(true);
  const [lastPosition, setLastPosition] = useState({ x, y });
  const color = stringToHexColor(info.email || "1");
  const displayName = info.name || info.email.split("@")[0];

  // Detect if cursor is moving
  useEffect(() => {
    const movementThreshold = 5; // pixels
    const isCurrentlyMoving =
      Math.abs(x - lastPosition.x) > movementThreshold ||
      Math.abs(y - lastPosition.y) > movementThreshold;

    if (isCurrentlyMoving) {
      setIsMoving(true);
      // Update last position after a small delay
      const timer = setTimeout(() => {
        setLastPosition({ x, y });
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Set to not moving after a delay
      const timer = setTimeout(() => {
        setIsMoving(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [x, y, lastPosition]);

  // Trigger pulse animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute z-50"
      style={{
        top: y,
        left: x,
        pointerEvents: "none",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Custom cursor with pulsing effect */}
      <motion.div
        key={animationKey}
        initial={{ scale: 1, opacity: 0.9 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.9, 0.7, 0.9],
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          times: [0, 0.6, 1],
        }}
        className="relative"
      >
        {/* Lucide Icon - switches between pointer and cursor */}
        <div className="absolute" style={{ top: -12, left: -12 }}>
          {isMoving ? (
            <MousePointer
              size={20}
              color={color}
              fill={`${color}22`}
              strokeWidth={2}
            />
          ) : (
            <TextCursor size={20} color={color} strokeWidth={2} />
          )}
        </div>

        {/* User info tooltip shown below the icon */}
        <motion.div
          className="absolute rounded-lg px-2 py-0.5 text-xs font-medium whitespace-nowrap shadow-md"
          style={{
            backgroundColor: `${color}22`,
            border: `1px solid ${color}`,
            color: color,
            top: 12,
            left: -12,
            transform: "translateX(-50%)",
            minWidth: "max-content",
          }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        >
          {displayName}
        </motion.div>
      </motion.div>

      {/* Ripple effect (appears periodically) */}
      <motion.div
        key={`ripple-${animationKey}`}
        className="absolute rounded-full"
        style={{
          border: `2px solid ${color}`,
          top: -8,
          left: -8,
        }}
        initial={{ width: 0, height: 0, opacity: 0.7 }}
        animate={{
          width: 40,
          height: 40,
          opacity: 0,
          top: -18,
          left: -18,
        }}
        transition={{ duration: 1 }}
      />
    </motion.div>
  );
};

export default FollowPointer;
