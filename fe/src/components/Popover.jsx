/* eslint-disable react/prop-types */
import React, { useState, useRef, useId } from "react";
import {
  useFloating,
  FloatingPortal,
  arrow,
  shift,
  offset,
  flip,
  autoUpdate,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  safePolygon,
} from "@floating-ui/react";
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export default function Popover({
  children,
  className,
  renderPopover,
  as,
  initialOpen = false,
  placement = "bottom-end",
}) {
  const [open, setOpen] = useState(initialOpen);
  const arrowRef = useRef(null);
  const id = useId();

  const Element = as || Box;

  const {
    refs,
    floatingStyles,
    context,
    placement: finalPlacement,
    middlewareData,
  } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(8), flip(), shift(), arrow({ element: arrowRef })],
    whileElementsMounted: autoUpdate,
    transform: false,
  });

  const hover = useHover(context, { handleClose: safePolygon() });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <Element
        className={className}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        {children}
        <FloatingPortal id={id}>
          <AnimatePresence>
            {open && (
              <Box
                ref={refs.setFloating}
                component={motion.div}
                {...getFloatingProps()}
                style={floatingStyles}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                sx={{
                  bgcolor: "white",
                  borderRadius: 1,
                  boxShadow: 3,
                  p: 1,
                  position: "relative",
                  zIndex: 1300,
                }}
              >
                {/* Arrow */}
                <Box
                  ref={arrowRef}
                  sx={{
                    position: "absolute",
                    width: 0,
                    height: 0,
                    borderLeft: "8px solid transparent",
                    borderRight: "8px solid transparent",
                    ...(finalPlacement.startsWith("bottom") && {
                      borderBottom: "8px solid white",
                      top: "-8px",
                      left: middlewareData.arrow?.x,
                      transform: "translateX(-50%)",
                    }),
                    ...(finalPlacement.startsWith("top") && {
                      borderTop: "8px solid white",
                      bottom: "-8px",
                      left: middlewareData.arrow?.x,
                      transform: "translateX(-50%)",
                    }),
                    ...(finalPlacement.startsWith("left") && {
                      borderLeft: "8px solid white",
                      right: "-8px",
                      top: middlewareData.arrow?.y,
                      transform: "translateY(-50%)",
                    }),
                    ...(finalPlacement.startsWith("right") && {
                      borderRight: "8px solid white",
                      left: "-8px",
                      top: middlewareData.arrow?.y,
                      transform: "translateY(-50%)",
                    }),
                  }}
                />
                {renderPopover}
              </Box>
            )}
          </AnimatePresence>
        </FloatingPortal>
      </Element>
    </>
  );
}
