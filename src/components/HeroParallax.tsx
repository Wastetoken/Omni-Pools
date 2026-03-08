"use client"

import React from "react"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react"

export const HeroParallax = ({
  products,
  title,
  subtitle,
}: {
  products: {
    title: string
    link: string
    thumbnail: string
  }[]
  title: string
  subtitle: string
}) => {
  const firstRow = products.slice(0, 5)
  const secondRow = products.slice(5, 10)
  const thirdRow = products.slice(10, 15)
  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const springConfig = { stiffness: 400, damping: 50, bounce: 0 }

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  )
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  )
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  )
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0, 1]),
    springConfig
  )
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  )
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  )
  return (
    <div
      ref={ref}
      className="h-[200vh] py-20 md:py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header title={title} subtitle={subtitle} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="will-change-transform"
      >
        <motion.div 
          style={{ x: translateX }}
          className="flex flex-row-reverse space-x-reverse space-x-20 mb-20 will-change-transform"
        >
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div 
          style={{ x: translateXReverse }}
          className="flex flex-row mb-20 space-x-20 will-change-transform"
        >
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div 
          style={{ x: translateX }}
          className="flex flex-row-reverse space-x-reverse space-x-20 will-change-transform"
        >
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export const Header = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div className="max-w-7xl relative mx-auto py-32 md:py-48 px-6 w-full left-0 top-0 z-10">
      <h1 className="text-7xl md:text-[12rem] font-black text-navy uppercase tracking-tighter leading-[0.8] mb-8">
        Omni <br /> <span className="serif-italic text-aqua lowercase ml-0 md:ml-24">Pools</span>
      </h1>
      <p className="max-w-xl text-lg md:text-xl text-navy/60 font-bold uppercase tracking-[0.2em] leading-relaxed">
        {subtitle}
      </p>
    </div>
  )
}

export const ProductCard = ({
  product,
}: {
  product: {
    title: string
    link: string
    thumbnail: string
  }
  key?: string
}) => {
  return (
    <div
      key={product.title}
      className="group/product h-96 w-[30rem] relative shrink-0 will-change-transform"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl transition-shadow duration-500"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          loading="lazy"
          className="object-cover object-left-top absolute h-full w-full inset-0 rounded-3xl will-change-transform"
          alt={product.title}
          referrerPolicy="no-referrer"
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-40 bg-navy pointer-events-none rounded-3xl transition-opacity duration-500"></div>
      <h2 className="absolute bottom-8 left-8 opacity-0 group-hover/product:opacity-100 text-foam font-black uppercase tracking-[0.2em] text-sm transition-all duration-500 transform translate-y-4 group-hover/product:translate-y-0">
        {product.title}
      </h2>
    </div>
  )
}
