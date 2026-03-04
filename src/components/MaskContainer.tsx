"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "motion/react"
import { cn } from "../lib/utils"

export const MaskContainer = ({
  children, revealText, size = 10, revealSize = 600, className,
}: {
  children?: string | React.ReactNode; revealText?: string | React.ReactNode; size?: number; revealSize?: number; className?: string
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState<any>({ x: null, y: null })
  const containerRef = useRef<any>(null)

  const updateMousePosition = (e: any) => {
    const rect = containerRef.current.getBoundingClientRect()
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  useEffect(() => {
    // No-op, using onMouseMove on the div
  }, [])

  const maskSize = isHovered ? revealSize : size

  return (
    <motion.div 
      ref={containerRef} 
      className={cn("relative h-screen overflow-hidden bg-off-white", className)}
      onMouseMove={updateMousePosition}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-navy text-foam"
        style={{
          maskImage: `radial-gradient(circle ${maskSize / 2}px at ${mousePosition.x}px ${mousePosition.y}px, black 100%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${maskSize / 2}px at ${mousePosition.x}px ${mousePosition.y}px, black 100%, transparent 100%)`,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
        transition={{ maskSize: { duration: 0.3, ease: "easeInOut" } }}
      >
        <div className="absolute inset-0 z-0 h-full w-full bg-navy opacity-50" />
        <div 
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)} 
          className="relative z-20 mx-auto max-w-4xl text-center text-4xl font-bold"
        >
          {children}
        </div>
      </motion.div>
      <div className="flex h-full w-full items-center justify-center">{revealText}</div>
    </motion.div>
  )
}
