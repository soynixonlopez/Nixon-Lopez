/**
 * Ejecuta N auditorías Lighthouse (mobile) contra una URL y resume mediana + media.
 *
 * Uso:
 *   pnpm exec node scripts/lighthouse-mobile-batch.mjs
 *   BASE_URL=http://localhost:3030 RUNS=5 pnpm exec node scripts/lighthouse-mobile-batch.mjs
 *
 * Requisitos: Lighthouse CLI (pnpm dlx lighthouse), Chrome/Edge (CHROME_PATH).
 */

import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const reportsDir = path.join(root, 'reports')

const BASE_URL = process.env.BASE_URL || 'http://localhost:3030'
const RUNS = Math.max(3, Math.min(10, parseInt(process.env.RUNS || '5', 10) || 5))

const AUDIT_IDS = [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
  'interactive',
]

function median(arr) {
  if (!arr.length) return null
  const s = [...arr].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

function mean(arr) {
  if (!arr.length) return null
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function min(arr) {
  if (!arr.length) return null
  return Math.min(...arr)
}

function max(arr) {
  if (!arr.length) return null
  return Math.max(...arr)
}

function round2(n) {
  return n == null ? null : Math.round(n * 100) / 100
}

function runLighthouse(index) {
  const name = `lighthouse-mobile-run-${String(index + 1).padStart(2, '0')}.json`
  /** Ruta relativa al cwd (sin espacios) — evita fallos en Windows con `--output-path` */
  const outRel = path.join('reports', name).replace(/\\/g, '/')
  const outAbs = path.join(reportsDir, name)
  const chromePath =
    process.env.CHROME_PATH ||
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

  /** shell: true para que `npx` se resuelva en PATH (Windows/Git Bash) */
  const cmd = [
    'npx --yes lighthouse',
    JSON.stringify(BASE_URL),
    '--output=json',
    `--output-path=${outRel}`,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--chrome-flags=--headless',
    '--form-factor=mobile',
  ].join(' ')

  const r = spawnSync(cmd, {
    cwd: root,
    env: { ...process.env, CHROME_PATH: chromePath },
    shell: true,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  })

  let lhr
  try {
    if (fs.existsSync(outAbs)) {
      lhr = JSON.parse(fs.readFileSync(outAbs, 'utf8'))
    }
  } catch {
    lhr = null
  }

  if (!lhr || !lhr.categories) {
    const errDetail = r.error ? String(r.error) : ''
    throw new Error(
      `Lighthouse no produjo JSON válido (run ${index + 1}). status=${r.status} ${errDetail}\n${(r.stderr || '').slice(0, 1500)}`
    )
  }

  return lhr
}

function extractMetrics(lhr) {
  const cats = lhr.categories || {}
  const audits = lhr.audits || {}

  const scores = {
    performance: cats.performance?.score,
    accessibility: cats.accessibility?.score,
    bestPractices: cats['best-practices']?.score,
    seo: cats.seo?.score,
  }

  const metrics = {}
  for (const id of AUDIT_IDS) {
    const a = audits[id]
    metrics[id] = {
      numericValue: a?.numericValue ?? null,
      displayValue: a?.displayValue ?? null,
    }
  }

  return { scores, metrics, fetchTime: lhr.fetchTime }
}

function main() {
  fs.mkdirSync(reportsDir, { recursive: true })

  console.log(`URL: ${BASE_URL}`)
  console.log(`Corridas: ${RUNS}`)
  console.log(`Salida: ${reportsDir}\n`)

  const all = []
  for (let i = 0; i < RUNS; i++) {
    process.stdout.write(`Corriendo Lighthouse mobile ${i + 1}/${RUNS}... `)
    const lhr = runLighthouse(i)
    const extracted = extractMetrics(lhr)
    all.push({ run: i + 1, ...extracted })
    console.log('OK')
  }

  const perfScores = all.map((x) => x.scores.performance).filter((x) => x != null)
  const a11yScores = all.map((x) => x.scores.accessibility).filter((x) => x != null)
  const bpScores = all.map((x) => x.scores.bestPractices).filter((x) => x != null)
  const seoScores = all.map((x) => x.scores.seo).filter((x) => x != null)

  const aggregated = {
    performance: {
      median: round2(median(perfScores.map((s) => s * 100))),
      mean: round2(mean(perfScores.map((s) => s * 100))),
      min: round2(min(perfScores.map((s) => s * 100))),
      max: round2(max(perfScores.map((s) => s * 100))),
      unit: '0-100',
    },
    accessibility: {
      median: round2(median(a11yScores.map((s) => s * 100))),
      mean: round2(mean(a11yScores.map((s) => s * 100))),
      min: round2(min(a11yScores.map((s) => s * 100))),
      max: round2(max(a11yScores.map((s) => s * 100))),
      unit: '0-100',
    },
    bestPractices: {
      median: round2(median(bpScores.map((s) => s * 100))),
      mean: round2(mean(bpScores.map((s) => s * 100))),
      min: round2(min(bpScores.map((s) => s * 100))),
      max: round2(max(bpScores.map((s) => s * 100))),
      unit: '0-100',
    },
    seo: {
      median: round2(median(seoScores.map((s) => s * 100))),
      mean: round2(mean(seoScores.map((s) => s * 100))),
      min: round2(min(seoScores.map((s) => s * 100))),
      max: round2(max(seoScores.map((s) => s * 100))),
      unit: '0-100',
    },
  }

  const auditsAgg = {}
  for (const id of AUDIT_IDS) {
    const nums = all
      .map((x) => x.metrics[id]?.numericValue)
      .filter((v) => typeof v === 'number' && !Number.isNaN(v))
    if (id === 'cumulative-layout-shift') {
      auditsAgg[id] = {
        median: round2(median(nums)),
        mean: round2(mean(nums)),
        unit: 'CLS',
      }
    } else {
      auditsAgg[id] = {
        medianMs: round2(median(nums)),
        meanMs: round2(mean(nums)),
        minMs: round2(min(nums)),
        maxMs: round2(max(nums)),
        unit: 'ms',
      }
    }
  }

  const summary = {
    meta: {
      generatedAt: new Date().toISOString(),
      baseUrl: BASE_URL,
      runs: RUNS,
      formFactor: 'mobile',
      chromePath: process.env.CHROME_PATH || '(default)',
      methodology: [
        'Lighthouse CLI, modo mobile (viewport y throttling estándar de Lighthouse).',
        'Misma URL y mismas categorías en todas las corridas; navegador en headless.',
        'Se informan mediana y media: la mediana reduce el impacto de picos de CPU en el host.',
        'Los JSON por corrida se guardan en reports/ para auditoría y trazabilidad.',
      ],
      lighthouseNote:
        'La mediana es más representativa que una sola corrida ante variación de CPU/red simulada.',
    },
    categoryScores: aggregated,
    coreWebVitalsAndLab: auditsAgg,
    runs: all.map((r) => ({
      run: r.run,
      scores: {
        performance: r.scores.performance != null ? round2(r.scores.performance * 100) : null,
        accessibility: r.scores.accessibility != null ? round2(r.scores.accessibility * 100) : null,
        bestPractices: r.scores.bestPractices != null ? round2(r.scores.bestPractices * 100) : null,
        seo: r.scores.seo != null ? round2(r.scores.seo * 100) : null,
      },
      metricsMs: Object.fromEntries(
        AUDIT_IDS.map((id) => [
          id,
          r.metrics[id]?.numericValue != null ? round2(r.metrics[id].numericValue) : null,
        ])
      ),
    })),
  }

  const summaryPath = path.join(
    reportsDir,
    `lighthouse-mobile-summary-${new Date().toISOString().slice(0, 10)}.json`
  )
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8')

  console.log('\n--- Resumen (mediana / media) ---')
  console.log(
    JSON.stringify(
      {
        categoryScores: aggregated,
        coreWebVitalsAndLab: auditsAgg,
      },
      null,
      2
    )
  )
  console.log(`\nInforme guardado: ${summaryPath}`)
}

main()
