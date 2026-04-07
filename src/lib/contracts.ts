import { INVOICE_BRANDING } from '@/lib/invoice-branding'
import type { ServiceContractRecord } from '@/lib/types/contract'

export type ContractTemplate = {
  objectText: string
  includes: string[]
  excludes: string[]
  timeline: string
}

export function inferServiceType(serviceLabel: string) {
  const s = serviceLabel.toLowerCase()
  if (s.includes('app')) return 'app'
  if (s.includes('ia') || s.includes('automat')) return 'automation'
  if (s.includes('ads') || s.includes('publicidad')) return 'ads'
  return 'web'
}

export function getContractTemplate(serviceLabel: string): ContractTemplate {
  const type = inferServiceType(serviceLabel)
  if (type === 'app') {
    return {
      objectText:
        'EL PRESTADOR se compromete a desarrollar una aplicación móvil funcional para el negocio del CLIENTE, con arquitectura, interfaz y despliegue acordados.',
      includes: [
        'Diseño y desarrollo de interfaces principales',
        'Configuración de entorno y build de publicación',
        'Integraciones técnicas necesarias del proyecto',
        'Pruebas funcionales y entrega operativa',
      ],
      excludes: [
        'Campañas de publicidad',
        'Servicios de terceros no contratados',
        'Nuevas funcionalidades fuera del alcance inicial',
      ],
      timeline: '15 a 30 días hábiles',
    }
  }
  if (type === 'automation') {
    return {
      objectText:
        'EL PRESTADOR se compromete a implementar un sistema de automatización tecnológica y/o IA para optimizar procesos comerciales y de atención.',
      includes: [
        'Levantamiento del flujo actual y propuesta técnica',
        'Implementación de automatizaciones acordadas',
        'Pruebas de funcionamiento y ajustes iniciales',
        'Entrega de flujo operativo documentado',
      ],
      excludes: [
        'Soporte continuo fuera del periodo pactado',
        'Integraciones premium de terceros no contempladas',
        'Desarrollo de módulos completamente nuevos sin adenda',
      ],
      timeline: '7 a 15 días hábiles',
    }
  }
  if (type === 'ads') {
    return {
      objectText:
        'EL PRESTADOR se compromete a configurar y gestionar campañas publicitarias digitales orientadas a generación de prospectos y ventas.',
      includes: [
        'Configuración inicial de campañas y segmentación',
        'Implementación de eventos de seguimiento',
        'Optimización básica semanal durante el periodo contratado',
        'Reporte de resultados y recomendaciones',
      ],
      excludes: [
        'Presupuesto publicitario de plataformas',
        'Producción audiovisual de alta complejidad',
        'Gestión de comunidad o atención comercial',
      ],
      timeline: '3 a 5 días hábiles para implementación inicial',
    }
  }
  return {
    objectText:
      'EL PRESTADOR se compromete a desarrollar un sitio web profesional para presencia digital comercial del CLIENTE, con estructura clara y experiencia optimizada.',
    includes: [
      'Página principal y secciones de servicios',
      'Botón de contacto directo a WhatsApp',
      'Diseño adaptable a dispositivos móviles',
      'Pruebas técnicas y entrega funcional',
    ],
    excludes: [
      'Campañas publicitarias',
      'Diseño de logotipo',
      'Redacción de contenido no suministrado por el CLIENTE',
      'Dominio/correo/hosting privado salvo contratación adicional',
    ],
    timeline: '5 a 7 días hábiles',
  }
}

export type ContractIntroSegment =
  | { kind: 'text'; value: string }
  | { kind: 'key'; value: string }

const REP_LEGAL_NAME = 'NIXON JILL LOPEZ HERNANDEZ'

/** Fragmentos para negrita + subrayado en datos sensibles (HTML/PDF). */
export function buildContractIntroSegments(contract: ServiceContractRecord): ContractIntroSegment[] {
  const clientTax = contract.client_tax_id?.trim() || '____________________'
  const clientEmail = contract.client_email?.trim() || '____________________'
  const clientAddr = contract.client_address?.trim()

  const segs: ContractIntroSegment[] = [
    {
      kind: 'text',
      value:
        'NL Services, empresa dedicada al desarrollo de sistemas, sitios web y aplicaciones móviles para negocios y empresas en la República de Panamá, con RUC No. ',
    },
    { kind: 'key', value: INVOICE_BRANDING.ruc },
    { kind: 'text', value: ', correo electrónico: ' },
    { kind: 'key', value: INVOICE_BRANDING.email },
    {
      kind: 'text',
      value: ', debidamente representada por ',
    },
    { kind: 'key', value: REP_LEGAL_NAME },
    {
      kind: 'text',
      value:
        ', quien actúa en su calidad de representante legal, en adelante denominado “EL PRESTADOR”; y ',
    },
    { kind: 'key', value: contract.client_name },
    { kind: 'text', value: ', con cédula/RUC No. ' },
    { kind: 'key', value: clientTax },
    { kind: 'text', value: ', correo electrónico ' },
    { kind: 'key', value: clientEmail },
  ]

  if (clientAddr) {
    segs.push({ kind: 'text', value: ', con domicilio en ' })
    segs.push({ kind: 'key', value: clientAddr })
  }

  segs.push({
    kind: 'text',
    value:
      ', en adelante denominado “EL CLIENTE”; acuerdan celebrar el presente Contrato de Prestación de Servicios Tecnológicos.',
  })

  return segs
}

export function buildContractClauses(contract: ServiceContractRecord) {
  const template = getContractTemplate(contract.service_label)
  const amount = Number(contract.total_amount || 0).toFixed(2)
  const introSegments = buildContractIntroSegments(contract)
  const intro = introSegments.map((s) => s.value).join('')
  return {
    intro,
    introSegments,
    primera: template.objectText,
    segundaIncluye: template.includes,
    segundaNoIncluye: template.excludes,
    tercera: [
      `El valor total del proyecto será de USD $${amount}.`,
      'Forma de pago: 50% anticipo para iniciar el proyecto y 50% contra entrega y aprobación final.',
      'El proyecto no iniciará hasta recibir el pago inicial.',
      'Métodos de pago: Transferencia/ACH, Yappy u otro método previamente acordado.',
    ],
    cuarta: [
      'Si EL CLIENTE no posee dominio, hosting o correo corporativo, deberá asumir costos adicionales.',
      'Dominio anual: USD $15.',
      'Correo corporativo / email marketing: USD $10.',
      'Hosting privado: desde USD $25 mensuales cuando el tráfico supere aproximadamente 200 visitas mensuales.',
    ],
    quinta:
      `El tiempo estimado de desarrollo será de ${template.timeline}, contados a partir de recepción del pago inicial y entrega completa del contenido.`,
  }
}
