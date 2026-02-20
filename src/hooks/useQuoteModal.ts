import { useState } from 'react'

export const useQuoteModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [serviceType, setServiceType] = useState<'web' | 'mobile' | 'automation'>('web')

  const openModal = (type: 'web' | 'mobile' | 'automation' = 'web') => {
    setServiceType(type)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    serviceType,
    openModal,
    closeModal
  }
}
