export interface NavItem {
  name: string
  href: string
}

export interface TrustBadgeMessage {
  title: string
  subtitle: string
}

export interface ProblemItemMessage {
  problem: string
  solution: string
}

export interface BenefitItemMessage {
  title: string
  description: string
}

export interface ServiceItemMessage {
  id: 'web-negocio' | 'landing' | 'wordpress-tienda-20' | 'reservas'
  title: string
  description: string
  features: string[]
  priceLabel: string
  ctaLabel: string
}

export interface QuoteBannerOptionMessage {
  id: 'web-negocio' | 'landing' | 'wordpress-tienda-20' | 'sistema'
  title: string
  subtitle: string
}

export interface QuoteDetailOptionMessage {
  value: string
  label: string
}

export interface ProcessStepMessage {
  step: string
  title: string
  description: string
  highlight?: string
}

export interface TestimonialMessage {
  name: string
  company: string
  content: string
  highlights: string[]
}

export interface FaqItemMessage {
  question: string
  answer: string
}

export interface AiFeatureMessage {
  title: string
  description: string
}

export interface QuoteProjectTypeMessage {
  id: 'landing' | 'profesional' | 'tienda' | 'sistema'
  label: string
  description: string
  priceLabel: string
  delivery: string
  includes: string[]
}

export interface QuoteFeatureMessage {
  id: string
  label: string
  description: string
}

export interface QuoteBusinessMessage {
  id: string
  label: string
}

export interface QuoteTimelineMessage {
  id: string
  label: string
  description: string
}

export interface MoreProjectMessage {
  slug: string
  category: string
  summary: string
}

export interface Messages {
  common: {
    menu: string
    closeMenu: string
    openMenu: string
    close: string
    getQuote: string
    whatsapp: string
    whatsappLong: string
    home: string
    navigation: string
    services: string
    contact: string
    language: string
    theme: string
    darkMode: string
    lightMode: string
  }
  nav: NavItem[]
  footer: {
    tagline: string
    navTitle: string
    servicesTitle: string
    contactTitle: string
    rights: string
    privacy: string
    cookies: string
  }
  footerServices: NavItem[]
  whatsappMessages: {
    default: string
    hero: string
    problem: string
    benefits: string
    serviceWeb: string
    serviceLanding: string
    serviceStore: string
    customSoftware: string
    cases: string
    process: string
    faq: string
    about: string
    final: string
    caseAquarumbos: string
    caseAserta: string
    caseSara: string
    caseSpl: string
    caseNutrielys: string
  }
  hero: {
    eyebrow: string
    titleBefore: string
    titleAccent: string
    subtitleBeforeHighlight: string
    subtitleHighlightOpportunities: string
    subtitleMiddle: string
    subtitleHighlightWhatsapp: string
    ctaPrimary: string
    ctaSecondary: string
    floatCard: string
    techMobile: string
    techDesktop: string
    automations: string
    automationsShort: string
    imageAlt: string
    trustBadges: TrustBadgeMessage[]
  }
  problems: {
    sectionLabel: string
    titleBefore: string
    titleAccent: string
    subtitle: string
    chipTitles: string[]
    chipResults: string[]
    situationLabel: string
    problemLabel: string
    solutionLabel: string
    carouselLabel: string
    situationsTablist: string
    prevSituation: string
    nextSituation: string
    goToSituation: string
    ctaPrimary: string
    ctaSecondary: string
    trustNote: string
    items: ProblemItemMessage[]
  }
  benefits: {
    sectionLabel: string
    titleLine1: string
    titleAccent: string
    subtitle: string
    ctaPrimary: string
    trustNote: string
    items: BenefitItemMessage[]
  }
  services: {
    sectionLabel: string
    titleBefore: string
    titleAccent: string
    subtitle: string
    investmentLabel: string
    focusBold: string
    focusRest: string
    scheduleCall: string
    talkWhatsapp: string
    items: ServiceItemMessage[]
    trustPills: string[]
  }
  quoteBanner: {
    sectionLabel: string
    titleBefore: string
    titleAccent: string
    subtitle: string
    imageAlt: string
    formTitle: string
    formSubtitle: string
    step1Legend: string
    step2Legend: string
    detailPlaceholder: string
    submit: string
    footerNote: string
    formOptions: QuoteBannerOptionMessage[]
    detailOptions: QuoteDetailOptionMessage[]
    benefits: BenefitItemMessage[]
  }
  cases: {
    sectionLabel: string
    titleBefore: string
    titleAccent: string
    subtitle: string
    bannerTitle: string
    bannerSubtitle: string
    bannerCta: string
    viewPortfolio: string
    viewProject: string
    projectAlt: string
    prevProject: string
    nextProject: string
    carouselLabel: string
  }
  process: {
    sectionLabel: string
    titleBefore: string
    titleAccent: string
    subtitle: string
    steps: ProcessStepMessage[]
    ctaTitle: string
    ctaSubtitle: string
    ctaQuote: string
    ctaWhatsapp: string
  }
  testimonials: {
    sectionLabel: string
    titleBefore: string
    titleAccent: string
    subtitle: string
    starsAria: string
    bannerTitle: string
    bannerSubtitle: string
    bannerCta: string
    items: TestimonialMessage[]
  }
  ai: {
    sectionLabel: string
    titleBefore: string
    titleAccent: string
    subtitleBefore: string
    subtitleHighlight: string
    ctaPrimary: string
    ctaSecondary: string
    features: AiFeatureMessage[]
  }
  about: {
    sectionLabel: string
    titleBefore: string
    titleAccent: string
    paragraph1: string
    paragraph2: string
    stats: string[]
    checklist: string[]
    imageAlt: string
    name: string
    role: string
    followOn: string
    followHint: string
  }
  faq: {
    sectionLabel: string
    titleBefore: string
    titleAccent: string
    subtitle: string
    items: FaqItemMessage[]
  }
  finalCta: {
    sectionLabel: string
    titleBefore: string
    titleAccent: string
    subtitle: string
    ctaQuote: string
    ctaWhatsapp: string
    trustChips: string[]
    card1Title: string
    card1Body: string
    card2Title: string
    card2Body: string
  }
  trustStrip: {
    ariaLabel: string
    labels: string[]
  }
  quote: {
    pageImageAlt: string
    configuratorTitle: string
    configuratorSubtitle: string
    progressStep: string
    progressOf: string
    progressLabelSeparator: string
    changeProject: string
    projectSelected: string
    step1Question: string
    step2Question: string
    step2Hint: string
    step3Question: string
    step3Hint: string
    step4Title: string
    hasDomainQuestion: string
    hasHostingQuestion: string
    emailsQuestion: string
    emailsHint: string
    yes: string
    noDomainExtra: string
    noHostingExtra: string
    step5Question: string
    step5Hint: string
    step6Title: string
    labelName: string
    labelCompany: string
    labelWhatsapp: string
    labelEmail: string
    placeholderName: string
    placeholderCompany: string
    placeholderWhatsapp: string
    placeholderEmail: string
    back: string
    continue: string
    generating: string
    generateProposal: string
    footerNote: string
    errorGeneric: string
    doneSectionLabel: string
    doneTitleBefore: string
    doneTitleAccent: string
    doneThanks: string
    doneProjectLabel: string
    doneDeliveryLabel: string
    doneInvestmentLabel: string
    doneDisclaimer: string
    downloadPdf: string
    requestFormalProposal: string
    formalProposalSubject: string
    stepLabels: string[]
    benefits: string[]
    projectTypes: QuoteProjectTypeMessage[]
    businessTypes: QuoteBusinessMessage[]
    features: QuoteFeatureMessage[]
    timelines: QuoteTimelineMessage[]
    emailOptions: string[]
    lines: {
      domain: string
      hosting: string
      oneEmail: string
      manyEmails: string
      emailsSixPlus: string
    }
    deliveryFallback: string
    projectFallback: string
    summary: {
      estimatedInvestment: string
      yourProject: string
      chooseOptions: string
      selectForBreakdown: string
      deliveryPrefix: string
      deliveryOverlay: string
      usd: string
    }
    whatsappQuoteIntro: string
    whatsappQuoteProject: string
    whatsappQuoteBusiness: string
    whatsappQuoteTotal: string
    whatsappQuoteDelivery: string
    whatsappQuoteName: string
    whatsappQuoteCompany: string
    whatsappQuoteEmail: string
    whatsappQuoteWhatsapp: string
  }
  projectsPage: {
    metaTitle: string
    metaDescription: string
    backToCases: string
    eyebrow: string
    title: string
    subtitle: string
    projectAlt: string
    campaignFallback: string
    viewProject: string
    marketingOnly: string
    ctaTitle: string
    ctaSubtitle: string
    backHome: string
    moreProjects: MoreProjectMessage[]
  }
}
