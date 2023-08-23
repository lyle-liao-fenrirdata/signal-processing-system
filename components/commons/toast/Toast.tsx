import React from "react";
import {
  CloseIcon,
  FailureIcon,
  QuestionIcon,
  SuccessIcon,
  WarningIcon,
} from "./Icon";
import { MqttQueue } from "@/stores/mqtt";

export const iconMap = {
  success: <SuccessIcon />,
  failure: <FailureIcon />,
  warning: <WarningIcon />,
};

type ToastProps = Omit<MqttQueue, "id"> & {
  onClose: () => void;
  children?: React.ReactNode;
};

const Toast = ({ message, type, onClose, children }: ToastProps) => {
  const toastIcon = iconMap[type];

  return (
    <div
      className="toast relative mt-2 rounded-lg bg-white p-6 text-slate-700 shadow-md transition-all duration-500 hover:shadow-xl"
      role="alert"
    >
      <div className="flex gap-4">
        {toastIcon ? (
          <div
            className={`h-6 w-6 shrink-0 ${
              type === "success"
                ? "text-emerald-500"
                : type === "failure"
                ? "text-red-500"
                : "text-sky-500"
            }`}
          >
            {toastIcon}
          </div>
        ) : (
          <div className="h-6 w-6 shrink-0 text-amber-500">
            <QuestionIcon />
          </div>
        )}
        <pre className="whitespace-normal break-all">{message}</pre>
      </div>
      {children}
      <button
        className="absolute right-2 top-2 h-6 w-6 cursor-pointer bg-transparent p-1 leading-none text-inherit opacity-75 hover:opacity-100"
        onClick={onClose}
      >
        <span className="icon">
          <CloseIcon />
        </span>
      </button>
    </div>
  );
};

export default Toast;
