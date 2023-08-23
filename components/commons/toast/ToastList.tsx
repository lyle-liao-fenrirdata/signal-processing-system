import React, { useEffect, useRef } from "react";
import Toast from "./Toast";
import useMqttStore, { MqttQueue } from "@/stores/mqtt";

type ToastListProps = {
  data: MqttQueue[];
  x: "left" | "right";
  y: "top" | "bottom";
  removeToast: (id: string) => void;
};

export const ToastList = ({ data, x, y, removeToast }: ToastListProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const clearToast = useMqttStore((state) => state.clearToast);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      if (y === "top") {
        el.scrollTo({
          top: el.scrollHeight,
          left: 0,
          behavior: "smooth",
        });
      } else {
        el.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth",
        });
      }
    }
  }, [data, y]);

  const sortedData = y === "bottom" ? [...data].reverse() : [...data];

  return (
    sortedData.length > 0 && (
      <div
        className={`rounded toast-list--${y}-${x} fixed z-10 max-h-[60vh] w-full max-w-md overflow-y-auto overflow-x-hidden p-4 opacity-70 backdrop-blur-xl hover:opacity-100 ${
          y === "top" ? "top-0" : "bottom-0"
        } ${x === "left" ? "left-0" : "right-0"}`}
        aria-live="assertive"
        ref={listRef}
      >
        <div className="flex">
          <button
            onClick={() => clearToast()}
            className=" ml-auto p-1 opacity-75 transition-all hover:opacity-100"
          >
            清除全部
          </button>
        </div>
        {sortedData.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    )
  );
};

export default ToastList;
