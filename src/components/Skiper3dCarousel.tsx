"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "../lib/utils"

export interface Skiper3dCarouselProps {
  items?: { title: string; description: string; color: string; src?: string }[]
  autoPlay?: boolean
  interval?: number
  className?: string
}

export default function Skiper3dCarousel({
  items = [],
  autoPlay = true,
  interval = 3000,
  className,
}: Skiper3dCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const count = items.length

  React.useEffect(() => {
    if (!autoPlay || count === 0) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count)
    }, interval)
    return () => clearInterval(timer)
  }, [autoPlay, interval, count])

  const getCardStyle = (index: number) => {
    const diff = ((index - activeIndex) % count + count) % count
    const normalized = diff > count / 2 ? diff - count : diff

    const rotateY = normalized * -45
    const translateZ = Math.abs(normalized) * -200
    const translateX = normalized * 240
    const opacity = Math.abs(normalized) > 2 ? 0 : 1 - Math.abs(normalized) * 0.4
    const scale = 1 - Math.abs(normalized) * 0.2
    const zIndex = count - Math.abs(normalized)

    return {
      rotateY,
      translateZ,
      translateX,
      opacity,
      scale,
      zIndex,
    }
  }

  return (
    <div className={cn('flex h-[500px] w-full flex-col items-center justify-center overflow-hidden [perspective:1000px]', className)}>
      <div className="relative h-[320px] w-full [transform-style:preserve-3d]">
        <AnimatePresence>
          {items.map((item, index) => {
            const style = getCardStyle(index)
            return (
              <motion.div
                key={index}
                className="absolute left-1/2 top-1/2 h-[300px] w-[240px] cursor-pointer rounded-3xl border border-white/10 p-6 shadow-2xl overflow-hidden bg-navy/80 backdrop-blur-sm"
                style={{
                  marginLeft: -120,
                  marginTop: -150,
                  zIndex: style.zIndex,
                  transformStyle: 'preserve-3d',
                }}
                animate={{
                  rotateY: style.rotateY,
                  z: style.translateZ,
                  x: style.translateX,
                  opacity: style.opacity,
                  scale: style.scale,
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                onClick={() => setActiveIndex(index)}
              >
                {item.src && (
                  <img src={item.src} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="" referrerPolicy="no-referrer" />
                )}
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                    style={{ backgroundColor: `${item.color}30`, color: item.color }}
                  >
                    &#9670;
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-white/50">{item.description}</p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="mt-6 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? 24 : 8,
              backgroundColor: i === activeIndex ? items[activeIndex].color : 'rgba(255,255,255,0.2)',
            }}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </div>
  )
}
