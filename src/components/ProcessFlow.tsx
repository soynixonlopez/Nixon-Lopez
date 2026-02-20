'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Zap, Sparkles } from 'lucide-react'

interface ProcessStep {
  step: string
  title: string
  description: string
  icon?: React.ComponentType<any>
  color: string
}

interface ProcessFlowProps {
  steps: ProcessStep[]
  title: string
  subtitle: string
}

const ProcessFlow: React.FC<ProcessFlowProps> = ({ steps, title, subtitle }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="container-padding">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {title.includes('Desarrollo') ? (
              <>
                {title.split('Desarrollo')[0]}
                <span className="gradient-text">Desarrollo</span>
                {title.split('Desarrollo')[1]}
              </>
            ) : title.includes('Implementación') ? (
              <>
                {title.split('Implementación')[0]}
                <span className="gradient-text">Implementación</span>
                {title.split('Implementación')[1]}
              </>
            ) : (
              title
            )}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Modern Process Flow */}
        <div className="max-w-6xl mx-auto">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
          </div>

          {/* Steps Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                viewport={{ once: true }}
                onClick={() => setActiveStep(activeStep === index ? null : index)}
              >
                {/* Step Card */}
                <div className={`relative p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  activeStep === index 
                    ? 'bg-white dark:bg-slate-800 shadow-2xl border-2' 
                    : 'bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl'
                }`} style={{
                  borderColor: activeStep === index ? step.color : undefined
                }}>
                  {/* Step Number Badge */}
                  <div 
                    className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center font-black text-xl text-white shadow-lg"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.step}
                  </div>

                  {/* Step Icon */}
                  {step.icon && (
                    <div 
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: `${step.color}20` }}
                    >
                      <step.icon 
                        className="w-10 h-10" 
                        style={{ color: step.color }}
                      />
                    </div>
                  )}

                  {/* Step Title */}
                  <h3 className={`text-center font-bold text-xl mb-4 transition-all duration-300 ${
                    activeStep === index 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className={`text-center leading-relaxed transition-all duration-300 ${
                    activeStep === index 
                      ? 'text-gray-600 dark:text-gray-400' 
                      : 'text-gray-500 dark:text-gray-500'
                  }`}>
                    {step.description}
                  </p>

                  {/* Active Indicator */}
                  {activeStep === index && (
                    <motion.div
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  )}

                  {/* Hover Glow Effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: `${step.color}05` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Content Panel */}
          <motion.div
            className="relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: activeStep !== null ? "auto" : 0, 
              opacity: activeStep !== null ? 1 : 0 
            }}
            transition={{ 
              duration: 0.4, 
              ease: "easeInOut"
            }}
          >
            {activeStep !== null && (
              <motion.div
                className="p-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-start gap-6">
                  {/* Step Icon */}
                  <div className="flex-shrink-0">
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: steps[activeStep].color }}
                    >
                      {steps[activeStep].icon && (
                        React.createElement(steps[activeStep].icon, { className: "w-10 h-10 text-white" })
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: steps[activeStep].color }}
                      ></div>
                      <span 
                        className="text-sm font-medium uppercase tracking-wide"
                        style={{ color: steps[activeStep].color }}
                      >
                        Paso {steps[activeStep].step}
                      </span>
                      <button
                        onClick={() => setActiveStep(null)}
                        className="ml-auto w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
                      >
                        <span className="text-gray-600 dark:text-gray-400 text-sm">×</span>
                      </button>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {steps[activeStep].title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {steps[activeStep].description}
                    </p>

                    {/* Details */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: steps[activeStep].color }}
                        >
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Duración</p>
                          <p className="text-sm font-medium" style={{ color: steps[activeStep].color }}>1-2 días</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: steps[activeStep].color }}
                        >
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Complejidad</p>
                          <p className="text-sm font-medium" style={{ color: steps[activeStep].color }}>Media</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: steps[activeStep].color }}
                        >
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Progreso</p>
                          <p className="text-sm font-medium" style={{ color: steps[activeStep].color }}>{activeStep + 1}/{steps.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ProcessFlow