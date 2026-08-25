const COMPANY_RULES = [
  { id: 'C1', label: 'Nombre legal y comercial', check: (c) => !!c.legalName && !!c.companyName },
  { id: 'C2', label: 'Cédula jurídica / identificación', check: (c) => !!c.taxId },
  { id: 'C3', label: 'Dirección, teléfono y correo', check: (c) => !!c.address && !!c.phone && !!c.email },
  { id: 'C4', label: 'Representante legal', check: (c) => !!c.representative },
  { id: 'C5', label: 'Página web verificable', check: (c) => !!c.website && c.website.startsWith('http') },
]

const VACANCY_RULES = [
  { id: 'V1', label: 'Nombre del puesto', check: (v) => !!v.positionName && v.positionName.length >= 3 },
  { id: 'V2', label: 'Descripción y funciones', check: (v) => !!v.description && v.description.length >= 20 },
  { id: 'V3', label: 'Requisitos claros', check: (v) => !!v.requirements && v.requirements.length >= 10 },
  { id: 'V4', label: 'Experiencia y formación', check: (v) => !!v.experience },
  { id: 'V5', label: 'Ubicación', check: (v) => !!v.location },
  { id: 'V6', label: 'Modalidad definida', check: (v) => ['presencial', 'remoto', 'híbrido'].includes(v.modality) },
  { id: 'V7', label: 'Tipo de contrato y jornada', check: (v) => !!v.contractType },
  { id: 'V8', label: 'Salario o rango', check: (v) => !!v.salaryRange },
  { id: 'V9', label: 'Fecha límite', check: (v) => !!v.deadline },
]

const SECURITY_RULES = [
  {
    id: 'S1',
    label: 'Solicita dinero para postularse',
    severity: 'critical',
    check: (v) => {
      const text = `${v.description} ${v.requirements}`.toLowerCase()
      return /paga?r?\s+(para|por)\s+(postular|inscribir|registr)/.test(text) ||
        /cuota|inscripci[oó]n|dep[oó]sito|transferencia\s+obligatoria/.test(text)
    },
  },
  {
    id: 'S2',
    label: 'Solicita información bancaria innecesaria',
    severity: 'critical',
    check: (v) => {
      const text = `${v.description} ${v.requirements}`.toLowerCase()
      return /n[uú]mero\s+de\s+cuenta|clabe|tarjeta\s+de\s+cr[eé]dito|cvv/.test(text)
    },
  },
  {
    id: 'S3',
    label: 'Ingresos poco realistas',
    severity: 'high',
    check: (v) => {
      const text = `${v.salaryRange} ${v.description}`.toLowerCase()
      return /\$\s*1[5-9],?000|\$\s*[2-9]\d,?000|\$\s*\d{3},?000/.test(v.salaryRange) &&
        /sin\s+experiencia|sin\s+estudios|f[aá]cil|desde\s+el\s+d[ií]a\s+uno/.test(text)
    },
  },
  {
    id: 'S4',
    label: 'No identifica claramente la empresa',
    severity: 'high',
    check: (v, company) => !company || !company.companyName,
  },
  {
    id: 'S5',
    label: 'Indicios de fraude o engaño',
    severity: 'critical',
    check: (v) => {
      const text = `${v.description} ${v.requirements}`.toLowerCase()
      return /ganancias?\s+garantizad|dinero\s+f[aá]cil|trabaja\s+desde\s+casa\s+y\s+gana|inversi[oó]n\s+m[ií]nima/.test(text)
    },
  },
]

export function classifyCompany(company) {
  const results = COMPANY_RULES.map((rule) => ({
    ...rule,
    passed: rule.check(company),
  }))

  const passed = results.filter((r) => r.passed).length
  const total = results.length
  const score = Math.round((passed / total) * 100)
  const approved = score >= 80

  return { results, score, approved, passed, total }
}

export function classifyVacancy(vacancy, company) {
  const ruleResults = VACANCY_RULES.map((rule) => ({
    ...rule,
    passed: rule.check(vacancy),
  }))

  const securityResults = SECURITY_RULES.map((rule) => ({
    ...rule,
    triggered: rule.check(vacancy, company),
  }))

  const rulePassed = ruleResults.filter((r) => r.passed).length
  const ruleTotal = ruleResults.length
  const ruleScore = Math.round((rulePassed / ruleTotal) * 100)

  const criticalFlags = securityResults.filter((r) => r.triggered && r.severity === 'critical')
  const highFlags = securityResults.filter((r) => r.triggered && r.severity === 'high')
  const allFlags = securityResults.filter((r) => r.triggered)

  let finalScore = ruleScore
  if (criticalFlags.length > 0) finalScore = Math.max(0, finalScore - 40)
  if (highFlags.length > 0) finalScore = Math.max(0, finalScore - 20)

  const hasCritical = criticalFlags.length > 0
  const autoReject = hasCritical
  const recommended = finalScore >= 70 && !hasCritical

  return {
    ruleResults,
    securityResults,
    ruleScore,
    finalScore,
    hasCritical,
    autoReject,
    recommended,
    flags: allFlags,
    criticalCount: criticalFlags.length,
    highCount: highFlags.length,
  }
}
