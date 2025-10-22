'use client'

import { Paragraph } from '@/components/common/titles'
import { cn } from '@/lib/utils'
import { FEATURES_LEFT, FEATURES_RIGHT } from '@/utils/constant'
import { Feature } from '@/utils/types'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

interface FeatureCardTypes {
  children: React.ReactNode
  className?: string
  layoutId?: string
  onClick?: () => void
}

export const FeaturesGrid = () => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedFeature(null)
      }
    }

    if (selectedFeature) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [selectedFeature])

  return (
    <>
      <div className="md:grid grid-cols-5 gap-x-3 w-full h-full">
        {/* Left column */}
        <div className="col-span-3 flex flex-col justify-between h-full">
          <FeatureItem
            feature={FEATURES_LEFT[0]}
            onClick={() => setSelectedFeature(FEATURES_LEFT[0])}
            layoutId={`feature-${FEATURES_LEFT[0].title}`}
          />

          <div className="md:grid grid-cols-2 gap-x-3">
            {FEATURES_LEFT.slice(1).map((feature, i) => (
              <FeatureItem
                key={i}
                feature={feature}
                onClick={() => setSelectedFeature(feature)}
                layoutId={`feature-${feature.title}`}
              />
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-2 lg:grid grid-rows-2">
          {FEATURES_RIGHT.map((feature, i) => (
            <FeatureItem
              key={i}
              feature={feature}
              onClick={() => setSelectedFeature(feature)}
              layoutId={`feature-${feature.title}`}
            />
          ))}
        </div>
      </div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />

            {/* Expanded Card */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <FeatureCard
                ref={modalRef}
                className="max-w-3xl w-full h-fit overflow-y-hidden cursor-default"
                layoutId={`feature-${selectedFeature.title}`}
              >
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedFeature(null)}
                  className="absolute top-7 right-4 p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </motion.button>

                <Image
                  alt={selectedFeature.alt}
                  src={selectedFeature.image}
                  width={800}
                  height={800}
                  loading="lazy"
                  quality={100}
                  className="w-full object-cover rounded-lg mb-8"
                />
                <div>
                  <Paragraph className="mb-3">{selectedFeature.title}</Paragraph>
                  <p className="text-sm text-balance text-slate-300 font-medium">
                    {selectedFeature.description}
                  </p>
                </div>
              </FeatureCard>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export const FeatureItem = ({
  feature,
  onClick,
  layoutId,
}: {
  feature: Feature
  onClick?: () => void
  layoutId?: string
}) => (
  <FeatureCard className="cursor-pointer mt-5" layoutId={layoutId} onClick={onClick}>
    <Image
      alt={feature.alt}
      src={feature.image}
      width={500}
      height={500}
      loading="lazy"
      quality={100}
      className="w-full object-cover rounded-lg mb-8"
    />
    <div>
      <Paragraph className="mb-3">{feature.title}</Paragraph>
      <p className="text-sm text-balance text-slate-300 font-medium">{feature.description}</p>
    </div>
  </FeatureCard>
)

export const FeatureCard = ({
  children,
  className,
  layoutId,
  onClick,
}: FeatureCardTypes & { ref?: React.Ref<HTMLDivElement> }) => {
  const Component = layoutId ? motion.div : 'div'

  return (
    <Component
      layoutId={layoutId}
      onClick={onClick}
      className={cn(
        'rounded-lg border border-neutral-800 w-full relative overflow-hidden bg-neutral-900/30',
        className
      )}
    >
      <div className="absolute bottom-0 -left-10 -z-10 w-44 h-48 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#0072E5_70%)] blur-md rotate-45 animate-gradient-wave"></div>
      <div className="p-5 space-y-4">{children}</div>
    </Component>
  )
}
