"use client";
import useMeasure from "@/app/hooks/useMeasure";
import {
  motion,
  AnimatePresence,
  Variants,
  HTMLMotionProps,
} from "framer-motion";
import { PropsWithChildren, ReactElement, useEffect } from "react";
import React from "react";

const duration = 0.3;

type ResizableBoxProps = {
  /**
   * The id of the content that is being resized. By def
   */
  contentId?: string;
};

export function ContentSwitcher({
  children,
  contentId,
}: HTMLMotionProps<"div"> & PropsWithChildren & ResizableBoxProps) {
  let animations: { [key: string]: Variants } = {
    fade: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { duration: duration / 2, delay: duration / 2 },
      },
      exit: { opacity: 0, transition: { duration: duration / 2 } },
    },

    crossFade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },

    slide: {
      initial: { x: "100%", opacity: 0, scale: 0.75 },
      animate: { x: "0%", opacity: 1, scale: 1 },
      exit: { x: "-100%", opacity: 0, scale: 0.75 },
    },

    slideAndFade: {
      initial: { x: "100%", opacity: 0 },
      animate: { x: "0%", opacity: 1 },
      exit: { x: "-100%", opacity: 0 },
    },
  };

  return (
    <motion.div
      key={contentId || JSON.stringify(children, ignoreCircularReferences())}
      {...animations["slideAndFade"]}
      transition={{ duration }}
      // style={{ position: "absolute", width: "100%" }}
      // className={cn(height ? "absolute" : "relative", "w-full")}
    >
      {children}
    </motion.div>
  );
}

/*
  Replacer function to JSON.stringify that ignores
  circular references and internal React properties.

  https://github.com/facebook/react/issues/8669#issuecomment-531515508
*/
const ignoreCircularReferences = () => {
  const seen = new WeakSet();
  return (key: string, value: string) => {
    if (key.startsWith("_")) return; // Don't compare React's internal props.
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  };
};

type AnimationType = "fade" | "crossFade" | "slide" | "slideAndFade";

export default function ResizablePanel3({
  children,
  contentId,
  duration = 0.3,
  className,
  contentClassName,
  ...other
}: HTMLMotionProps<"div"> &
  PropsWithChildren & {
    /**
     * You can set this to identify the current content. If you do set it, then when the content changes, it will animate out the old content and animate in the new content.
     */
    contentId?: string;
    /**
     * The animation to use when the content changes. (conentId must be set for this to work)
     */
    animation?: AnimationType;

    /**
     * The duration of the resizing in seconds. Default is 0.3
     */
    duration?: number;

    contentClassName?: string;
  }) {
  let [ref, { height }] = useMeasure();

  let animations: { [key: string]: Variants } = {
    fade: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { duration: duration / 2, delay: duration / 2 },
      },
      exit: { opacity: 0, transition: { duration: duration / 2 } },
    },

    crossFade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },

    slide: {
      initial: { x: "100%", opacity: 0, scale: 0.75 },
      animate: { x: "0%", opacity: 1, scale: 1 },
      exit: { x: "-100%", opacity: 0, scale: 0.75 },
    },

    slideAndFade: {
      initial: { x: "100%", opacity: 0 },
      animate: { x: "0%", opacity: 1 },
      exit: { x: "-100%", opacity: 0 },
    },
  };

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: height || "auto" }}
      transition={{ duration }}
      className={className}
    >
      <AnimatePresence initial={false}>
        <motion.div
          {...other}
          key={contentId || undefined}
          {...animations["slideAndFade"]}
          transition={{ duration }}
          style={{
            position: height ? "absolute" : "relative",
            width: "100%",
            ...other.style,
          }}
          className={contentClassName}
          ref={ref}
        >
          {/* <div ref={ref} {...other}> */}
          {children}
          {/* </div> */}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export function ResizablePanelSimple({
  children,
  duration = 0.3,
  style,
  ...other
}: HTMLMotionProps<"div"> &
  PropsWithChildren & {
    /**
     * The animation to use when the content changes. (conentId must be set for this to work)
     */
    animation?: AnimationType;

    /**
     * The duration of the resizing in seconds. Default is 0.3
     */
    duration?: number;

    children: ReactElement;
  }) {
  let [ref, { height, width }] = useMeasure();

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden", ...style }}
      animate={{ height: height || "auto", width: width || "auto" }}
      transition={{ duration }}
      {...other}
    >
      {React.cloneElement(children, {
        ref,
        style: {
          ...(children.props.style || {}),
          position: height ? "absolute" : "relative",
        },
      })}
    </motion.div>
  );
}
