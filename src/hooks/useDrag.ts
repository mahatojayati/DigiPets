import React, { useState, useRef, useCallback, useEffect } from "react";
import { PetEngine } from "../engine/PetEngine";
import { PET_SIZE } from "../constants/physics";
import { EventBus } from "../ai/EventBus";

export function useDrag(petEngine: PetEngine | null) {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!petEngine) return;

      // Prevent default text selection highlights
      e.preventDefault();

      const state = petEngine.getState();
      dragOffset.current = {
        x: e.clientX - state.x,
        y: e.clientY - state.y,
      };

      setIsDragging(true);
      petEngine.setDragging(true);
      EventBus.dispatch("DRAG");
    },
    [petEngine]
  );

  useEffect(() => {
    if (!isDragging || !petEngine) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;

      // Bound clamp during drag
      const maxX = window.innerWidth - PET_SIZE.width;
      const maxY = window.innerHeight - PET_SIZE.height;

      const clampedX = Math.max(0, Math.min(newX, maxX));
      const clampedY = Math.max(0, Math.min(newY, maxY));

      petEngine.setPosition(clampedX, clampedY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      petEngine.setDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, petEngine]);

  return { isDragging, handleMouseDown };
}
