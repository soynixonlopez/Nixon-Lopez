'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface Technology {
  name: string
  icon: string
  color: string
}

interface TechnologiesCarouselProps {
  technologies: Technology[]
  title: string
  subtitle: string
}

const TechnologiesCarousel: React.FC<TechnologiesCarouselProps> = ({ 
  technologies, 
  title, 
  subtitle 
}) => {
  // Duplicamos las tecnologías para crear el efecto infinito
  const duplicatedTechnologies = [...technologies, ...technologies]

  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-800 overflow-hidden">
      <div className="container-padding">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Carrusel de tecnologías */}
        <div className="relative">
          {/* Carrusel infinito */}
          <div className="flex gap-6 animate-scroll-infinite">
            {duplicatedTechnologies.map((tech, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 group cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -3 }}
              >
                <div className="bg-white dark:bg-slate-700 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-600 text-center min-w-[140px] group-hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      <tech.icon />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {tech.name}
                  </h3>
                  <div 
                    className="w-3 h-0.5 rounded-full mx-auto group-hover:w-6 transition-all duration-300"
                    style={{ backgroundColor: tech.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TechnologiesCarousel
