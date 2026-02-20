'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Award } from 'lucide-react'
import TechLogo from './TechLogo'

const SkillsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })



  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" ref={ref}>
      <div className="container-padding">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4"
            animate={{ 
              boxShadow: [
                '0 0 0 0 rgba(168, 85, 247, 0.4)',
                '0 0 0 10px rgba(168, 85, 247, 0)',
                '0 0 0 0 rgba(168, 85, 247, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Award size={16} />
            Especialidades Técnicas
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Tecnologías que{' '}
            <span className="gradient-text">Domino</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Mi stack tecnológico abarca desde desarrollo frontend hasta inteligencia artificial, 
            siempre manteniéndome actualizado con las últimas tendencias.
          </p>
        </motion.div>

        {/* Tech Carousel - Main Content */}
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Infinite Carousel */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-infinite space-x-8">
              {/* First set of technologies */}
              {[
                { name: 'React' },
                { name: 'Next.js' },
                { name: 'TypeScript' },
                { name: 'Node.js' },
                { name: 'Python' },
                { name: 'OpenAI' },
                { name: 'PostgreSQL' },
                { name: 'MongoDB' },
                { name: 'Tailwind' },
                { name: 'Framer Motion' },
                { name: 'Docker' },
                { name: 'AWS' },
                { name: 'Git' },
                { name: 'Figma' },
                { name: 'Vercel' },
                { name: 'LangChain' },
                { name: 'Supabase' },
                { name: 'Prisma' },
                { name: 'GraphQL' },
                { name: 'Stripe' },
              ].map((tech, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 min-w-[140px] group hover:-translate-y-3 hover:border-blue-200 dark:hover:border-blue-700"
                >
                  <div className="text-5xl mb-3 group-hover:scale-125 group-hover:drop-shadow-lg transition-all duration-300 relative">
                    <TechLogo 
                      name={tech.name} 
                      size={48} 
                      className="text-black"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <span className="text-sm font-semibold text-black group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
                    {tech.name}
                  </span>
                </div>
              ))}
              
              {/* Duplicate set for infinite effect */}
              {[
                { name: 'React' },
                { name: 'Next.js' },
                { name: 'TypeScript' },
                { name: 'Node.js' },
                { name: 'Python' },
                { name: 'OpenAI' },
                { name: 'PostgreSQL' },
                { name: 'MongoDB' },
                { name: 'Tailwind' },
                { name: 'Framer Motion' },
                { name: 'Docker' },
                { name: 'AWS' },
                { name: 'Git' },
                { name: 'Figma' },
                { name: 'Vercel' },
                { name: 'LangChain' },
                { name: 'Supabase' },
                { name: 'Prisma' },
                { name: 'GraphQL' },
                { name: 'Stripe' },
              ].map((tech, index) => (
                <div
                  key={`duplicate-${index}`}
                  className="flex-shrink-0 flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 min-w-[140px] group hover:-translate-y-3 hover:border-blue-200 dark:hover:border-blue-700"
                >
                  <div className="text-5xl mb-3 group-hover:scale-125 group-hover:drop-shadow-lg transition-all duration-300 relative">
                    <TechLogo 
                      name={tech.name} 
                      size={48} 
                      className="text-black"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <span className="text-sm font-semibold text-black group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300">
                    {tech.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SkillsSection
