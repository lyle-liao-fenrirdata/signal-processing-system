"use client";

import React, { useEffect, useRef } from "react";
import useMqttStore from "@/stores/mqtt";
import { iconMap } from "@/components/commons/toast/Toast";

export const SideList = () => {
  const messages = useMqttStore((state) => state.messages);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return messages.length > 0 ? (
    <div
      className="fixed right-2 top-20 z-10 max-h-[calc(100vh-80px)] w-full max-w-md overflow-y-auto overflow-x-hidden p-4"
      ref={listRef}
    >
      {messages.map((message) => (
        <div
          key={`${message.id}`}
          className="toast relative mb-2 rounded-lg bg-white p-6 text-slate-700 shadow-md transition-all duration-500 hover:shadow-xl"
          role="alert"
        >
          <div className="flex gap-4">
            <div
              className={`h-6 w-6 shrink-0 ${
                message.type === "success"
                  ? "text-emerald-500"
                  : message.type === "failure"
                  ? "text-red-500"
                  : "text-sky-500"
              }`}
            >
              {iconMap[message.type]}
            </div>
            <p>{message.message}</p>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="fixed right-2 top-20 z-10 max-h-[calc(100vh-80px)] w-full max-w-md overflow-y-auto overflow-x-hidden p-4">
      <div
        className="toast relative mb-2 rounded-lg bg-white p-6 text-slate-700 shadow-md transition-all duration-500 hover:shadow-xl"
        role="alert"
      >
        <div className="flex gap-4">
          <div className="h-6 w-6 shrink-0 text-sky-500">{iconMap.warning}</div>
          <p>沒有訊息</p>
        </div>
      </div>
    </div>
  );
};

export default SideList;
