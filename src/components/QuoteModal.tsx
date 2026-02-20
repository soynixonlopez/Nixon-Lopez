'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calculator, Download, Send, CheckCircle, AlertCircle, Clock, DollarSign, Calendar, User, Mail, Phone, MessageSquare, Globe, Smartphone, Bot, Zap, Shield, Star } from 'lucide-react'

interface QuoteModalProps {
  isOpen: boolean
  onClose: () => void
  serviceType?: 'web' | 'mobile' | 'automation'
}

interface QuoteData {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  serviceSubtype: string
  features: string[]
  specifications: string[]
  timeline: string
  budget: string
  description: string
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, serviceType = 'web' }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [quoteData, setQuoteData] = useState<QuoteData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    serviceSubtype: '',
    features: [],
    specifications: [],
    timeline: '',
    budget: '',
    description: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [quoteResult, setQuoteResult] = useState<any>(null)

  const serviceConfig = {
    web: {
      title: 'Desarrollo Web',
      icon: Globe,
      color: '#3B82F6',
      subtypes: [
        { value: 'landing', label: 'Landing Page', description: 'Página de aterrizaje simple' },
        { value: 'corporate', label: 'Sitio Corporativo', description: 'Sitio web empresarial completo' },
        { value: 'ecommerce', label: 'E-commerce', description: 'Tienda online con carrito de compras' },
        { value: 'webapp', label: 'Aplicación Web', description: 'Aplicación web interactiva' },
        { value: 'custom', label: 'Desarrollo Personalizado', description: 'Solución a medida' }
      ],
      features: [
        { name: 'Diseño Responsivo', price: 500, description: 'Adaptable a todos los dispositivos' },
        { name: 'E-commerce Completo', price: 1200, description: 'Tienda online con carrito y pagos' },
        { name: 'CMS Personalizado', price: 800, description: 'Sistema de gestión de contenido' },
        { name: 'SEO Optimizado', price: 300, description: 'Optimización para motores de búsqueda' },
        { name: 'Integración de APIs', price: 400, description: 'Conexión con servicios externos' },
        { name: 'Panel de Administración', price: 600, description: 'Dashboard para gestión' },
        { name: 'Multiidioma', price: 350, description: 'Soporte para múltiples idiomas' },
        { name: 'Blog Integrado', price: 250, description: 'Sistema de blog incorporado' }
      ],
      specifications: [
        { name: 'Número de páginas', options: ['1-5 páginas', '6-15 páginas', '16-30 páginas', '30+ páginas'] },
        { name: 'Diseño', options: ['Plantilla personalizada', 'Diseño desde cero', 'Basado en referencia'] },
        { name: 'Integraciones', options: ['Google Analytics', 'Redes sociales', 'CRM', 'Sistema de pagos', 'Email marketing'] },
        { name: 'Hosting', options: ['Incluido (1 año)', 'Solo desarrollo', 'Migración existente'] }
      ]
    },
    mobile: {
      title: 'Desarrollo Móvil',
      icon: Smartphone,
      color: '#10B981',
      subtypes: [
        { value: 'ios', label: 'App iOS', description: 'Aplicación solo para iPhone/iPad' },
        { value: 'android', label: 'App Android', description: 'Aplicación solo para Android' },
        { value: 'cross', label: 'App Multiplataforma', description: 'Una app para iOS y Android' },
        { value: 'hybrid', label: 'App Híbrida', description: 'App web en contenedor nativo' },
        { value: 'custom', label: 'Desarrollo Personalizado', description: 'Solución específica' }
      ],
      features: [
        { name: 'App iOS Nativa', price: 2000, description: 'Aplicación para iPhone/iPad' },
        { name: 'App Android Nativa', price: 2000, description: 'Aplicación para Android' },
        { name: 'App Multiplataforma', price: 1500, description: 'Una app para iOS y Android' },
        { name: 'Integración de Notificaciones', price: 300, description: 'Push notifications' },
        { name: 'Integración de Pagos', price: 500, description: 'Sistema de pagos integrado' },
        { name: 'Modo Offline', price: 400, description: 'Funcionalidad sin conexión' },
        { name: 'Geolocalización', price: 350, description: 'Funciones basadas en ubicación' },
        { name: 'Cámara y Galería', price: 250, description: 'Acceso a cámara y fotos' }
      ],
      specifications: [
        { name: 'Plataforma', options: ['iOS', 'Android', 'Ambas'] },
        { name: 'Tipo de app', options: ['Nativa', 'Híbrida', 'Progressive Web App'] },
        { name: 'Funcionalidades', options: ['Cámara', 'GPS', 'Notificaciones', 'Pagos', 'Redes sociales'] },
        { name: 'Backend', options: ['API existente', 'Desarrollo de API', 'Sin backend'] }
      ]
    },
    automation: {
      title: 'Automatización',
      icon: Bot,
      color: '#8B5CF6',
      subtypes: [
        { value: 'chatbot', label: 'Chatbot', description: 'Bot conversacional inteligente' },
        { value: 'workflow', label: 'Automatización de Procesos', description: 'Workflows automatizados' },
        { value: 'integration', label: 'Integración de Sistemas', description: 'Conectar múltiples plataformas' },
        { value: 'analytics', label: 'Analytics y Reportes', description: 'Dashboard de métricas' },
        { value: 'custom', label: 'Solución Personalizada', description: 'Automatización específica' }
      ],
      features: [
        { name: 'Chatbot Inteligente', price: 800, description: 'Bot conversacional con IA' },
        { name: 'Automatización de Procesos', price: 1200, description: 'Workflows automatizados' },
        { name: 'Integración de Sistemas', price: 1000, description: 'Conectar múltiples plataformas' },
        { name: 'Dashboard de Analytics', price: 600, description: 'Panel de métricas y reportes' },
        { name: 'API Personalizada', price: 700, description: 'API para integraciones' },
        { name: 'Sistema de Alertas', price: 300, description: 'Notificaciones automáticas' },
        { name: 'Machine Learning', price: 1500, description: 'IA para análisis predictivo' },
        { name: 'Automatización de Email', price: 400, description: 'Campañas automáticas' }
      ],
      specifications: [
        { name: 'Tipo de automatización', options: ['Chatbot', 'Workflows', 'Integraciones', 'Analytics'] },
        { name: 'Plataformas a integrar', options: ['CRM', 'Email marketing', 'Redes sociales', 'E-commerce', 'ERP'] },
        { name: 'Nivel de IA', options: ['Básico', 'Intermedio', 'Avanzado con ML'] },
        { name: 'Volumen de datos', options: ['Bajo (<1K registros)', 'Medio (1K-10K)', 'Alto (10K+)'] }
      ]
    }
  }

  const config = serviceConfig[serviceType]

  const handleFeatureToggle = (featureName: string) => {
    setQuoteData(prev => ({
      ...prev,
      features: prev.features.includes(featureName)
        ? prev.features.filter(f => f !== featureName)
        : [...prev.features, featureName]
    }))
  }

  const handleSpecificationToggle = (specName: string, option: string) => {
    setQuoteData(prev => ({
      ...prev,
      specifications: prev.specifications.includes(`${specName}: ${option}`)
        ? prev.specifications.filter(s => s !== `${specName}: ${option}`)
        : [...prev.specifications.filter(s => !s.startsWith(`${specName}:`)), `${specName}: ${option}`]
    }))
  }

  const calculateQuote = () => {
    const selectedFeatures = config.features.filter(f => quoteData.features.includes(f.name))
    const basePrice = selectedFeatures.reduce((sum, feature) => sum + feature.price, 0)
    
    // Aplicar multiplicadores según timeline
    let timelineMultiplier = 1
    switch (quoteData.timeline) {
      case 'urgent': timelineMultiplier = 1.5; break
      case 'normal': timelineMultiplier = 1; break
      case 'flexible': timelineMultiplier = 0.9; break
    }

    // Aplicar multiplicadores según complejidad
    let complexityMultiplier = 1
    if (selectedFeatures.length > 4) complexityMultiplier = 1.2
    else if (selectedFeatures.length > 2) complexityMultiplier = 1.1

    const finalPrice = Math.round(basePrice * timelineMultiplier * complexityMultiplier)
    const developmentTime = Math.max(2, Math.ceil(selectedFeatures.length * 0.8))

    return {
      basePrice,
      finalPrice,
      developmentTime,
      selectedFeatures,
      timeline: quoteData.timeline,
      complexity: selectedFeatures.length > 4 ? 'Alta' : selectedFeatures.length > 2 ? 'Media' : 'Baja'
    }
  }

  const handleGenerateQuote = async () => {
    setIsGenerating(true)
    
    // Simular tiempo de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const result = calculateQuote()
    setQuoteResult(result)
    setIsGenerating(false)
    setCurrentStep(6)
  }

  const handlePrintQuote = () => {
    window.print()
  }

  const handleSendQuote = () => {
    // Aquí se implementaría el envío por email
    alert('Cotización enviada exitosamente. Te contactaremos pronto.')
    resetModal()
    onClose()
  }

  const resetModal = () => {
    setCurrentStep(1)
    setQuoteData({
      name: '',
      email: '',
      phone: '',
      company: '',
      projectType: '',
      serviceSubtype: '',
      features: [],
      specifications: [],
      timeline: '',
      budget: '',
      description: ''
    })
    setQuoteResult(null)
    setIsGenerating(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <config.icon className="w-6 h-6" style={{ color: config.color }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Cotización de {config.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Paso {currentStep} de 6
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: config.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / 6) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Información de Contacto
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={quoteData.name}
                        onChange={(e) => setQuoteData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={quoteData.email}
                        onChange={(e) => setQuoteData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="tu@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={quoteData.phone}
                        onChange={(e) => setQuoteData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Empresa
                      </label>
                      <input
                        type="text"
                        value={quoteData.company}
                        onChange={(e) => setQuoteData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="Nombre de tu empresa"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Tipo de {config.title}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {config.subtypes.map((subtype, index) => (
                      <motion.div
                        key={subtype.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          quoteData.serviceSubtype === subtype.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        onClick={() => setQuoteData(prev => ({ ...prev, serviceSubtype: subtype.value }))}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {subtype.label}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {subtype.description}
                            </p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            quoteData.serviceSubtype === subtype.value
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {quoteData.serviceSubtype === subtype.value && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Características del Proyecto
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {config.features.map((feature, index) => (
                      <motion.div
                        key={feature.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          quoteData.features.includes(feature.name)
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        onClick={() => handleFeatureToggle(feature.name)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {feature.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {feature.description}
                            </p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            quoteData.features.includes(feature.name)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {quoteData.features.includes(feature.name) && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Especificaciones Técnicas
                  </h3>
                  
                  <div className="space-y-6">
                    {config.specifications.map((spec, index) => (
                      <motion.div
                        key={spec.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-xl border border-gray-200 dark:border-gray-600"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                          {spec.name}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {spec.options.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleSpecificationToggle(spec.name, option)}
                              className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                                quoteData.specifications.includes(`${spec.name}: ${option}`)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Detalles del Proyecto
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timeline del Proyecto *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'urgent', label: 'Urgente', desc: '1-2 semanas', icon: Zap },
                          { value: 'normal', label: 'Normal', desc: '3-4 semanas', icon: Clock },
                          { value: 'flexible', label: 'Flexible', desc: '5+ semanas', icon: Calendar }
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                              quoteData.timeline === option.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                            onClick={() => setQuoteData(prev => ({ ...prev, timeline: option.value }))}
                          >
                            <option.icon className="w-6 h-6 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                            <h4 className="font-semibold text-center text-gray-900 dark:text-white mb-1">
                              {option.label}
                            </h4>
                            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                              {option.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Presupuesto Estimado
                      </label>
                      <select
                        value={quoteData.budget}
                        onChange={(e) => setQuoteData(prev => ({ ...prev, budget: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Selecciona un rango</option>
                        <option value="under-5k">Menos de $5,000</option>
                        <option value="5k-10k">$5,000 - $10,000</option>
                        <option value="10k-25k">$10,000 - $25,000</option>
                        <option value="25k-50k">$25,000 - $50,000</option>
                        <option value="over-50k">Más de $50,000</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Descripción del Proyecto
                      </label>
                      <textarea
                        value={quoteData.description}
                        onChange={(e) => setQuoteData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="Describe tu proyecto en detalle..."
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 6 && quoteResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      ¡Cotización Generada!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Aquí tienes tu cotización personalizada
                    </p>
                  </div>

                  {/* Quote Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Precio Total</h4>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          ${quoteResult.finalPrice.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Precio base: ${quoteResult.basePrice.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Tiempo de Desarrollo</h4>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {quoteResult.developmentTime} semanas
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Timeline: {quoteResult.timeline === 'urgent' ? 'Urgente' : quoteResult.timeline === 'normal' ? 'Normal' : 'Flexible'}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Complejidad</h4>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {quoteResult.complexity}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {quoteResult.selectedFeatures.length} características
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Desglose de Costos</h4>
                    <div className="space-y-3">
                      {quoteResult.selectedFeatures.map((feature: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-gray-900 dark:text-white">{feature.name}</span>
                          </div>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            ${feature.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-900 dark:text-white">Subtotal:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            ${quoteResult.basePrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Multiplicadores (timeline + complejidad):</span>
                          <span>
                            {quoteResult.timeline === 'urgent' ? '+50%' : quoteResult.timeline === 'flexible' ? '-10%' : '0%'}
                            {quoteResult.complexity === 'Alta' ? ' +20%' : quoteResult.complexity === 'Media' ? ' +10%' : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-lg font-bold text-blue-600 dark:text-blue-400 border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                          <span>Total:</span>
                          <span>${quoteResult.finalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Generando tu cotización...
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Analizando los requerimientos y calculando el precio
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 pb-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                {currentStep > 1 && currentStep < 6 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Anterior
                  </button>
                )}
                
                <div className="ml-auto flex gap-3">
                  {currentStep < 5 && (
                    <button
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      disabled={
                        (currentStep === 1 && (!quoteData.name || !quoteData.email)) ||
                        (currentStep === 2 && !quoteData.serviceSubtype) ||
                        (currentStep === 3 && quoteData.features.length === 0) ||
                        (currentStep === 4 && quoteData.specifications.length === 0)
                      }
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                    >
                      Siguiente
                    </button>
                  )}
                  
                  {currentStep === 5 && (
                    <button
                      onClick={handleGenerateQuote}
                      disabled={!quoteData.timeline}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center gap-2"
                    >
                      <Calculator className="w-4 h-4" />
                      Generar Cotización
                    </button>
                  )}
                  
                  {currentStep === 6 && quoteResult && (
                    <>
                      <button
                        onClick={handlePrintQuote}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Imprimir
                      </button>
                      <button
                        onClick={handleSendQuote}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Enviar Cotización
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default QuoteModal
