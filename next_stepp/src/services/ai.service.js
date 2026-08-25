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

export function classifyCompany(company) {
  const checks = COMPANY_RULES.map((rule) => ({
    rule: rule.label,
    passed: rule.check(company),
    detail: rule.check(company) ? 'Cumple' : 'No cumple',
  }))
  const passed = checks.filter((r) => r.passed).length
  const score = Math.round((passed / checks.length) * 100)
  return {
    score,
    approved: score >= 80,
    checks,
    analysis: 'Clasificación local. Se recomienda revisión manual para mayor precisión.',
    recommendation: score >= 80 ? 'aprobar' : 'revisar manualmente',
    risks: score < 80 ? ['No cumple todos los requisitos'] : [],
  }
}

export function classifyVacancy(vacancy, _company) {
  const checks = VACANCY_RULES.map((rule) => ({
    rule: rule.label,
    passed: rule.check(vacancy),
    detail: rule.check(vacancy) ? 'Cumple' : 'No cumple',
  }))

  const text = `${vacancy.description} ${vacancy.requirements}`.toLowerCase()
  const flags = []
  if (/paga?r?\s+(para|por)\s+(postular|inscribir)/.test(text)) {
    flags.push({ rule: 'Solicita dinero', severity: 'critical', detail: 'Detectado pago para postular' })
  }
  if (/n[uú]mero\s+de\s+cuenta|clabe|tarjeta/.test(text)) {
    flags.push({ rule: 'Info bancaria', severity: 'critical', detail: 'Solicita datos bancarios' })
  }
  if (/ganancias?\s+garantizad|dinero\s+f[aá]cil/.test(text)) {
    flags.push({ rule: 'Ingresos poco realistas', severity: 'high', detail: 'Promesas poco realistas' })
  }

  const rulePassed = checks.filter((r) => r.passed).length
  let ruleScore = Math.round((rulePassed / checks.length) * 100)
  const hasCritical = flags.some((f) => f.severity === 'critical')
  if (hasCritical) ruleScore = Math.max(0, ruleScore - 40)

  return {
    finalScore: ruleScore,
    recommended: ruleScore >= 70 && !hasCritical,
    autoReject: hasCritical,
    checks,
    security: { safe: flags.length === 0, flags },
    analysis: 'Clasificación local.',
    recommendation: hasCritical ? 'rechazar' : ruleScore >= 70 ? 'aprobar' : 'revisar manualmente',
    risks: flags.map((f) => f.detail),
  }
}
