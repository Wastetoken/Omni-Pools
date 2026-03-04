"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { cn } from "../lib/utils"

export interface PricingCardProps {
  planName?: string
  price?: string
  period?: string
  features?: { text: string }[]
  highlighted?: boolean
  ctaText?: string
  className?: string
}

export default function PricingCard({
  planName = "Pro",
  price = "$29",
  period = "/month",
  features = [],
  highlighted = false,
  ctaText = "Get Started",
  className,
}: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-full mx-auto",
        className
      )}
    >
      {/* Glow effect */}
      <motion.div
        className={cn(
          "absolute -inset-[2px] rounded-3xl opacity-0 blur-md transition-opacity duration-500",
          highlighted
            ? "bg-gradient-to-r from-aqua via-cyan-pool to-aqua"
            : "bg-gradient-to-r from-neutral-500 via-neutral-300 to-neutral-500"
        )}
        animate={{ opacity: isHovered ? 0.8 : highlighted ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Card body */}
      <div
        className={cn(
          "relative rounded-3xl border p-8 md:p-10 flex flex-col min-h-[600px] h-full transition-all duration-500",
          highlighted
            ? "bg-navy-dark border-aqua/50 shadow-[0_0_30px_rgba(0,255,255,0.1)]"
            : "bg-navy border-white/10"
        )}
      >
        {highlighted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
          >
            <span className="bg-aqua text-navy text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-xl whitespace-nowrap">
              Most Popular
            </span>
          </motion.div>
        )}

        <h3 className="text-lg font-semibold text-foam/80">{planName}</h3>

        <div className="mt-4 flex items-baseline gap-1">
          <motion.span
            className="text-5xl font-bold text-foam"
            key={price}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {price}
          </motion.span>
          <span className="text-foam/40 text-sm">{period}</span>
        </div>

        <div className="mt-8 space-y-3 flex-1">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.08, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <svg
                className={cn(
                  "w-4 h-4 shrink-0",
                  highlighted ? "text-aqua" : "text-foam/40"
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-foam/60">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "mt-8 w-full py-3 rounded-xl font-medium text-sm transition-colors",
            highlighted
              ? "bg-aqua text-navy hover:bg-cyan-pool"
              : "bg-white/10 text-foam hover:bg-white/20"
          )}
        >
          {ctaText}
        </motion.button>
      </div>
    </motion.div>
  )
}
