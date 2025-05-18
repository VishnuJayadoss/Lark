import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";

const STATUS_FLOW = ["pending", "confirmed", "picked_up", "delivered"];

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  picked_up: "Picked Up",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusIcons = {
  completed: <CheckCircle className="text-green-500 w-5 h-5" />,
  active: <CheckCircle className="text-yellow-500 w-5 h-5 animate-pulse" />,
  delivered: <CheckCircle className="text-green-600 w-5 h-5" />,
  cancelled: <XCircle className="text-red-500 w-5 h-5" />,
  upcoming: <div className="w-2.5 h-2.5 bg-gray-400 rounded-full" />,
};

const getStatusState = (
  currentStatus,
  step,
  index,
  isCancelled,
  cancelStepIndex
) => {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  if (isCancelled) {
    if (step === "cancelled") return "cancelled";
    if (index < cancelStepIndex) return "completed";
    if (index === cancelStepIndex) return "cancelled";
    return "upcoming";
  }

  if (step === "delivered" && currentStatus === "delivered") {
    return "delivered";
  }

  if (index < currentIndex) return "completed";
  if (index === currentIndex) return "active";
  return "upcoming";
};

const OrderTimeline = ({ currentStatus }) => {
  const isCancelled = currentStatus === "cancelled";
  let steps = [...STATUS_FLOW];
  let activeIndex = 0;

  if (isCancelled) {
    const cancelStepIndex = 1; // Adjust as needed
    steps = [...STATUS_FLOW.slice(0, cancelStepIndex + 1), "cancelled"];
    activeIndex = cancelStepIndex;
  } else {
    activeIndex = STATUS_FLOW.indexOf(currentStatus);
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center relative">
        {steps.map((step, index) => {
          const state = getStatusState(
            currentStatus,
            step,
            index,
            isCancelled,
            activeIndex
          );

          return (
            <div
              key={step}
              className="flex flex-col items-center w-full relative z-10"
            >
              <div
                className={clsx(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 bg-white shadow transition-all duration-300",
                  state === "completed" && "border-green-500",
                  state === "active" && "border-yellow-500",
                  state === "delivered" && "border-green-600",
                  state === "cancelled" && "border-red-500",
                  state === "upcoming" && "border-gray-300"
                )}
              >
                {statusIcons[state] || statusIcons.upcoming}
              </div>
              <span
                className={clsx(
                  "text-sm mt-2 text-center",
                  state === "completed" && "text-green-400",
                  state === "active" && "text-yellow-600 font-semibold",
                  state === "delivered" && "text-green-400 font-semibold",
                  state === "cancelled" && "text-red-400 font-semibold",
                  state === "upcoming" && "text-gray-500"
                )}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
          );
        })}

        {/* Animated Progress Line */}
        <motion.div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 z-0 rounded-full overflow-hidden">
          <motion.div
            className={clsx(
              "h-1 transition-all duration-500",
              isCancelled
                ? "bg-red-200"
                : "bg-gradient-to-r from-yellow-200 to-green-400"
            )}
            initial={{ width: 0 }}
            animate={{
              width: isCancelled
                ? "100%"
                : `${(activeIndex / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTimeline;
