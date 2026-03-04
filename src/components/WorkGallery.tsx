"use client"

import * as React from "react"

import {
  HTMLMotionProps,
  motionValue,
  Variants,
  motion,
  useScroll,
  useTransform,
} from "motion/react"
import type { MotionValue } from "motion/react"

import { cn } from "../lib/utils"

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}

const SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
  duration: 0.3,
}
const blurVariants: Variants = {
  hidden: {
    filter: "blur(10px)",
    opacity: 0,
  },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
  },
}

const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined)

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) {
    return { scrollYProgress: motionValue(0) } as ContainerScrollContextValue
  }
  return context
}

export const ContainerScroll = ({
  children,
  className,
  style,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
  })
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-[120vh]", className)}
        style={{
          perspective: "1000px",
          perspectiveOrigin: "center top",
          transformStyle: "preserve-3d",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}
ContainerScroll.displayName = "ContainerScroll"

export const ContainerSticky = ({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "sticky left-0 top-0 min-h-[30rem] w-full overflow-hidden",
        className
      )}
      style={{
        perspective: "1000px",
        perspectiveOrigin: "center top",
        transformStyle: "preserve-3d",
        transformOrigin: "50% 50%",
        ...style,
      }}
      {...props}
    />
  )
}
ContainerSticky.displayName = "ContainerSticky"

export const GalleryContainer = ({
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div">) => {
  const { scrollYProgress } = useContainerScrollContext()
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [75, 0])
  const scale = useTransform(scrollYProgress, [0.5, 0.9], [1.2, 1])

  return (
    <motion.div
      className={cn(
        "relative grid size-full grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl",
        className
      )}
      style={{
        rotateX,
        scale,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
GalleryContainer.displayName = "GalleryContainer"

export const GalleryCol = ({
  className,
  style,
  yRange = ["0%", "-5%"],
  ...props
}: HTMLMotionProps<"div"> & { yRange?: string[] }) => {
  const { scrollYProgress } = useContainerScrollContext()
  const y = useTransform(scrollYProgress, [0, 1], yRange)

  return (
    <motion.div
      className={cn("relative flex w-full flex-col gap-4 ", className)}
      style={{
        y,
        ...style,
      }}
      {...props}
    />
  )
}
GalleryCol.displayName = "GalleryCol"

export const ContainerStagger = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ className, viewport, transition, ...props }, ref) => {
  return (
    <motion.div
      className={cn("relative", className)}
      ref={ref}
      initial="hidden"
      whileInView={"visible"}
      viewport={{ once: true || viewport?.once, ...viewport }}
      transition={{
        staggerChildren: transition?.staggerChildren || 0.2,
        ...transition,
      }}
      {...props}
    />
  )
})
ContainerStagger.displayName = "ContainerStagger"

export const ContainerAnimated = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ className, transition, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={blurVariants}
      transition={SPRING_CONFIG || transition}
      {...props}
    />
  )
})
ContainerAnimated.displayName = "ContainerAnimated"

const GALLERY_IMAGES = [
  "https://picsum.photos/seed/pool1/800/1200",
  "https://picsum.photos/seed/pool2/800/1000",
  "https://picsum.photos/seed/pool3/800/1100",
  "https://picsum.photos/seed/pool4/800/900",
  "https://picsum.photos/seed/pool5/800/1300",
  "https://picsum.photos/seed/pool6/800/1000",
  "https://picsum.photos/seed/pool7/800/1200",
  "https://picsum.photos/seed/pool8/800/1100",
  "https://picsum.photos/seed/pool9/800/1000",
]

export const WorkGallery = ({ images = [] }: { images?: string[] }) => {
  const displayImages = images.length > 0 ? images : GALLERY_IMAGES;
  
  return (
    <div className="bg-navy px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <ContainerScroll className="min-h-[180vh] md:min-h-[140vh]">
          <ContainerSticky className="min-h-[45rem] md:min-h-[35rem] flex items-center justify-center">
            <GalleryContainer className="max-w-6xl mx-auto px-4 md:px-0 will-change-transform">
              {/* Column 1 */}
              <GalleryCol yRange={["0%", "-25%"]} className="flex flex-col gap-4 will-change-transform">
                <ContainerStagger className="flex flex-col gap-4">
                  {displayImages.slice(0, 3).map((src, i) => (
                    <ContainerAnimated key={i} className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-2xl group will-change-transform">
                      <img
                        src={src}
                        alt={`Pool ${i}`}
                        loading="lazy"
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 will-change-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <p className="text-foam font-black uppercase tracking-widest text-xs">Project 0{i + 1}</p>
                      </div>
                    </ContainerAnimated>
                  ))}
                </ContainerStagger>
              </GalleryCol>

              {/* Column 2 */}
              <GalleryCol yRange={["0%", "15%"]} className="hidden md:flex flex-col gap-4 will-change-transform">
                <ContainerStagger className="flex flex-col gap-4">
                  {displayImages.slice(3, 6).map((src, i) => (
                    <ContainerAnimated key={i} className="relative aspect-[3/4] overflow-hidden rounded-2xl group will-change-transform">
                      <img
                        src={src}
                        alt={`Pool ${i + 3}`}
                        loading="lazy"
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 will-change-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <p className="text-foam font-black uppercase tracking-widest text-xs">Project 0{i + 4}</p>
                      </div>
                    </ContainerAnimated>
                  ))}
                </ContainerStagger>
              </GalleryCol>

              {/* Column 3 */}
              <GalleryCol yRange={["0%", "-20%"]} className="hidden md:flex flex-col gap-4 will-change-transform">
                <ContainerStagger className="flex flex-col gap-4">
                  {displayImages.slice(6, 9).map((src, i) => (
                    <ContainerAnimated key={i} className="relative aspect-[3/4] overflow-hidden rounded-2xl group will-change-transform">
                      <img
                        src={src}
                        alt={`Pool ${i + 6}`}
                        loading="lazy"
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 will-change-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <p className="text-foam font-black uppercase tracking-widest text-xs">Project 0{i + 7}</p>
                      </div>
                    </ContainerAnimated>
                  ))}
                </ContainerStagger>
              </GalleryCol>
            </GalleryContainer>
          </ContainerSticky>
        </ContainerScroll>
      </div>
    </div>
  )
}
