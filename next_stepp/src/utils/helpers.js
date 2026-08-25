import { STATUS_MAP, MODALITY_MAP, ICONS } from '../config/constants.js'

export function statusBadge(status) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending
  return `<span class="status-badge ${s.cls}">${s.label}</span>`
}

export function modalityLabel(modality) {
  return MODALITY_MAP[modality] || modality
}

export function renderStars(count) {
  let html = '<div class="rating-stars">'
  for (let i = 0; i < 5; i++) {
    html += `<span class="star ${i < count ? '' : 'empty'}">${i < count ? ICONS.star : ICONS.starEmpty}</span>`
  }
  html += '</div>'
  return html
}

export function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}
