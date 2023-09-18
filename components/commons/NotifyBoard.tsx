"use client";

import React, { useEffect, useRef } from "react";
import useMqttStore from "@/stores/mqtt";
import Toast, { iconMap } from "@/components/commons/toast/Toast";
import { formatDateTime } from "@/utils/formats";

export default function NotifyBoard() {
  const messages = useMqttStore((state) => state.messages);
  const removeMessage = useMqttStore((state) => state.removeMessage);
  const clearAll = useMqttStore((state) => state.clearAll);
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
      <div className="flex">
        <button
          onClick={clearAll}
          className=" ml-auto p-1 opacity-75 transition-all hover:opacity-100"
        >
          清除全部
        </button>
      </div>

      {messages.map((message) => (
        <Toast
          key={message.id}
          message={message.message}
          type={message.type}
          onClose={() => removeMessage(message.id)}
        >
          <span className="absolute bottom-1 right-2 bg-transparent p-1 leading-none text-inherit opacity-75">
            通知時間: {formatDateTime.format(message.receivedAt)}
          </span>
        </Toast>
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
}
