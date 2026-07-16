const OPERATOR_META = {
  "AlphaLink": { color: "#0b83a6", mttr: 184, monthly: 42 },
  "Nexa Fiber": { color: "#d67a00", mttr: 248, monthly: 35 },
  "Orbitel": { color: "#6d45c6", mttr: 132, monthly: 27 },
  "Vertex Telecom": { color: "#1b8b57", mttr: 96, monthly: 18 }
};

const INCIDENTS = [
  {
    id: "INC-2026-0713-001",
    unit: "Unidade Aurora Norte",
    city: "São Paulo",
    state: "SP",
    regional: "Regional Sudeste A",
    operator: "AlphaLink",
    circuit: "DEMO-SP-001",
    ip: "192.0.2.11",
    technology: "IP dedicado",
    speed: "200 Mbps",
    startedAt: "2026-07-13T13:18:00-03:00",
    durationMinutes: 78,
    priority: "critical",
    isolated: false,
    sla: "overdue",
    assignee: "Sem responsável",
    status: "Inicial",
    nextAction: "Atribuir responsável",
    event: "Health check sem resposta na interface WAN principal.",
    protocol: "",
    linksTotal: 2,
    linksDown: 1,
    history: [
      { time: "13/07, 13:18", author: "Monitoramento", status: "Detectado", text: "Evento de indisponibilidade recebido e classificado." }
    ]
  },
  {
    id: "INC-2026-0713-002",
    unit: "Centro Prisma Paulista",
    city: "Campinas",
    state: "SP",
    regional: "Regional Sudeste B",
    operator: "Nexa Fiber",
    circuit: "DEMO-SP-014",
    ip: "192.0.2.24",
    technology: "MPLS",
    speed: "100 Mbps",
    startedAt: "2026-07-13T12:42:00-03:00",
    durationMinutes: 114,
    priority: "critical",
    isolated: true,
    sla: "overdue",
    assignee: "Analista Demo",
    status: "Aguardando operadora",
    nextAction: "Cobrar previsão da operadora",
    event: "Todos os links cadastrados estão indisponíveis simultaneamente.",
    protocol: "NX-84721-DEMO",
    linksTotal: 2,
    linksDown: 2,
    history: [
      { time: "13/07, 12:42", author: "Monitoramento", status: "Detectado", text: "Isolamento confirmado por dois links indisponíveis." },
      { time: "13/07, 12:50", author: "Analista Demo", status: "Chamado aberto", text: "Operadora acionada. Aguardando previsão de normalização." }
    ]
  },
  {
    id: "INC-2026-0713-003",
    unit: "Laboratório Horizonte Sul",
    city: "Curitiba",
    state: "PR",
    regional: "Regional Sul",
    operator: "Orbitel",
    circuit: "DEMO-PR-008",
    ip: "198.51.100.18",
    technology: "SD-WAN",
    speed: "300 Mbps",
    startedAt: "2026-07-13T11:54:00-03:00",
    durationMinutes: 162,
    priority: "high",
    isolated: false,
    sla: "risk",
    assignee: "Marina Costa",
    status: "Em triagem",
    nextAction: "Validar energia com a unidade",
    event: "Link de contingência indisponível; link principal segue ativo.",
    protocol: "",
    linksTotal: 3,
    linksDown: 1,
    history: [
      { time: "13/07, 11:54", author: "Monitoramento", status: "Detectado", text: "Falha identificada no circuito de contingência." },
      { time: "13/07, 12:06", author: "Marina Costa", status: "Em triagem", text: "Validando energia e equipamento local." }
    ]
  },
  {
    id: "INC-2026-0713-004",
    unit: "Clínica Estação Central",
    city: "Belo Horizonte",
    state: "MG",
    regional: "Regional Sudeste C",
    operator: "Vertex Telecom",
    circuit: "DEMO-MG-003",
    ip: "198.51.100.33",
    technology: "IP dedicado",
    speed: "150 Mbps",
    startedAt: "2026-07-13T10:21:00-03:00",
    durationMinutes: 255,
    priority: "high",
    isolated: false,
    sla: "overdue",
    assignee: "Sem responsável",
    status: "Sem atualização",
    nextAction: "Registrar primeira tratativa",
    event: "Timeout ICMP persistente no equipamento de borda.",
    protocol: "",
    linksTotal: 2,
    linksDown: 1,
    history: [
      { time: "13/07, 10:21", author: "Monitoramento", status: "Detectado", text: "Evento validado após janela de confirmação." }
    ]
  },
  {
    id: "INC-2026-0713-005",
    unit: "Unidade Veredas",
    city: "Goiânia",
    state: "GO",
    regional: "Regional Centro-Oeste",
    operator: "AlphaLink",
    circuit: "DEMO-GO-012",
    ip: "203.0.113.42",
    technology: "MPLS",
    speed: "80 Mbps",
    startedAt: "2026-07-13T08:05:00-03:00",
    durationMinutes: 391,
    priority: "high",
    isolated: true,
    sla: "overdue",
    assignee: "Rafael Lima",
    status: "Técnico acionado",
    nextAction: "Confirmar horário de chegada",
    event: "Unidade sem resposta em todos os circuitos cadastrados.",
    protocol: "AL-99218-DEMO",
    linksTotal: 3,
    linksDown: 3,
    history: [
      { time: "13/07, 08:05", author: "Monitoramento", status: "Detectado", text: "Isolamento confirmado por três circuitos." },
      { time: "13/07, 08:22", author: "Rafael Lima", status: "Chamado aberto", text: "Operadora acionada e protocolo registrado." },
      { time: "13/07, 10:40", author: "Rafael Lima", status: "Técnico acionado", text: "Despacho técnico confirmado para a unidade." }
    ]
  },
  {
    id: "INC-2026-0712-006",
    unit: "Centro Atlântico",
    city: "Recife",
    state: "PE",
    regional: "Regional Nordeste",
    operator: "Nexa Fiber",
    circuit: "DEMO-PE-021",
    ip: "203.0.113.61",
    technology: "SD-WAN",
    speed: "200 Mbps",
    startedAt: "2026-07-12T15:30:00-03:00",
    durationMinutes: 1476,
    priority: "critical",
    isolated: false,
    sla: "overdue",
    assignee: "Joana Reis",
    status: "Escalado N2",
    nextAction: "Cobrar gestão da operadora",
    event: "Circuito principal indisponível; contingência com degradação.",
    protocol: "NX-84110-DEMO",
    linksTotal: 2,
    linksDown: 1,
    history: [
      { time: "12/07, 15:30", author: "Monitoramento", status: "Detectado", text: "Indisponibilidade confirmada no link principal." },
      { time: "12/07, 15:41", author: "Joana Reis", status: "Chamado aberto", text: "Protocolo aberto junto à operadora." },
      { time: "13/07, 09:15", author: "Joana Reis", status: "Escalado N2", text: "Caso escalado por ausência de previsão." }
    ]
  },
  {
    id: "INC-2026-0712-007",
    unit: "Unidade Vale Azul",
    city: "Rio de Janeiro",
    state: "RJ",
    regional: "Regional Sudeste D",
    operator: "Orbitel",
    circuit: "DEMO-RJ-017",
    ip: "198.51.100.71",
    technology: "IP dedicado",
    speed: "120 Mbps",
    startedAt: "2026-07-12T08:48:00-03:00",
    durationMinutes: 1878,
    priority: "critical",
    isolated: false,
    sla: "overdue",
    assignee: "Sem responsável",
    status: "Sem atualização",
    nextAction: "Assumir e cobrar operadora",
    event: "Sem resposta na interface WAN há mais de 24 horas.",
    protocol: "",
    linksTotal: 2,
    linksDown: 1,
    history: [
      { time: "12/07, 08:48", author: "Monitoramento", status: "Detectado", text: "Evento permanece ativo após revalidação." }
    ]
  },
  {
    id: "INC-2026-0711-008",
    unit: "Centro Diagnóstico Ipê",
    city: "Salvador",
    state: "BA",
    regional: "Regional Nordeste",
    operator: "Vertex Telecom",
    circuit: "DEMO-BA-006",
    ip: "203.0.113.86",
    technology: "MPLS",
    speed: "100 Mbps",
    startedAt: "2026-07-11T16:12:00-03:00",
    durationMinutes: 2874,
    priority: "critical",
    isolated: false,
    sla: "overdue",
    assignee: "Caio Mendes",
    status: "Aguardando operadora",
    nextAction: "Escalonar indisponibilidade prolongada",
    event: "Falha persistente no circuito primário.",
    protocol: "VT-31480-DEMO",
    linksTotal: 2,
    linksDown: 1,
    history: [
      { time: "11/07, 16:12", author: "Monitoramento", status: "Detectado", text: "Circuito primário indisponível." },
      { time: "11/07, 16:24", author: "Caio Mendes", status: "Chamado aberto", text: "Operadora acionada." }
    ]
  },
  {
    id: "INC-2026-0710-009",
    unit: "Unidade Serra Clara",
    city: "Florianópolis",
    state: "SC",
    regional: "Regional Sul",
    operator: "AlphaLink",
    circuit: "DEMO-SC-019",
    ip: "192.0.2.91",
    technology: "SD-WAN",
    speed: "250 Mbps",
    startedAt: "2026-07-10T09:36:00-03:00",
    durationMinutes: 4710,
    priority: "critical",
    isolated: true,
    sla: "overdue",
    assignee: "Marina Costa",
    status: "Aguardando técnico",
    nextAction: "Validar substituição do equipamento",
    event: "Unidade isolada após falha no equipamento de borda.",
    protocol: "AL-97802-DEMO",
    linksTotal: 2,
    linksDown: 2,
    history: [
      { time: "10/07, 09:36", author: "Monitoramento", status: "Detectado", text: "Isolamento confirmado." },
      { time: "10/07, 10:02", author: "Marina Costa", status: "Chamado aberto", text: "Acionamento registrado." },
      { time: "12/07, 14:20", author: "Marina Costa", status: "Aguardando técnico", text: "Equipamento de reposição em deslocamento." }
    ]
  }
];

const MONTHLY_DATA = [
  { month: "Fev", value: 92 },
  { month: "Mar", value: 108 },
  { month: "Abr", value: 97 },
  { month: "Mai", value: 121 },
  { month: "Jun", value: 104 },
  { month: "Jul", value: 68 }
];

const PIPELINE_DATA = window.COREOPS_DEMO_DATA;
if (PIPELINE_DATA?.incidents?.length) {
  Object.keys(OPERATOR_META).forEach((key) => delete OPERATOR_META[key]);
  Object.assign(OPERATOR_META, PIPELINE_DATA.operatorMeta || {});
  INCIDENTS.splice(0, INCIDENTS.length, ...PIPELINE_DATA.incidents);
  MONTHLY_DATA.splice(0, MONTHLY_DATA.length, ...(PIPELINE_DATA.monthlyData || []));
}

const memoryStorage = {};
const persisted = safeJsonParse(storageGet("noc-demo-state"), {});
const state = {
  incidents: INCIDENTS.map((incident) => ({
    ...incident,
    assignee: persisted.assignees?.[incident.id] || incident.assignee,
    protocol: persisted.protocols?.[incident.id] ?? incident.protocol,
    history: [...incident.history, ...(persisted.updates?.[incident.id] || [])]
  })),
  selectedId: INCIDENTS[0].id,
  detailTab: "summary",
  quickFilter: "all",
  search: "",
  regional: "all",
  theme: storageGet("noc-demo-theme") || "light"
};

const PRIORITY_META = {
  critical: { label: "Crítico", color: "#c62832", className: "badge-critical" },
  high: { label: "Alta prioridade", color: "#b56800", className: "badge-attention" },
  moderate: { label: "Atenção", color: "#1769d2", className: "badge-info" }
};

function safeJsonParse(value, fallback) {
  try { return JSON.parse(value) ?? fallback; } catch { return fallback; }
}

function storageGet(key) {
  try { return window.localStorage.getItem(key); } catch { return memoryStorage[key] ?? null; }
}

function storageSet(key, value) {
  try { window.localStorage.setItem(key, value); } catch { memoryStorage[key] = value; }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDuration(totalMinutes) {
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days) return `${days}d ${hours}h ${minutes}m`;
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatStart(value) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function icon(name) {
  return `<i data-lucide="${name}" aria-hidden="true"></i>`;
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.9 } });
}

function operatorColor(name) {
  return OPERATOR_META[name]?.color || "#60758c";
}

function durationColor(minutes) {
  if (minutes >= 1440) return "var(--red)";
  if (minutes >= 60) return "var(--amber)";
  return "var(--blue)";
}

function filteredIncidents() {
  const needle = state.search.trim().toLocaleLowerCase("pt-BR");
  return state.incidents.filter((incident) => {
    if (state.quickFilter === "isolated" && !incident.isolated) return false;
    if (state.quickFilter === "sla" && incident.sla !== "overdue") return false;
    if (state.quickFilter === "unassigned" && incident.assignee !== "Sem responsável") return false;
    if (state.regional !== "all" && incident.regional !== state.regional) return false;
    if (!needle) return true;
    const haystack = [incident.unit, incident.city, incident.state, incident.operator, incident.circuit, incident.ip, incident.event].join(" ").toLocaleLowerCase("pt-BR");
    return haystack.includes(needle);
  });
}

function getSelectedIncident() {
  return state.incidents.find((incident) => incident.id === state.selectedId);
}

function renderKpis() {
  const totalLinks = state.incidents.reduce((sum, item) => sum + item.linksDown, 0);
  const isolated = state.incidents.filter((item) => item.isolated).length;
  const operators = new Set(state.incidents.map((item) => item.operator)).size;
  const average = Math.round(state.incidents.reduce((sum, item) => sum + item.durationMinutes, 0) / state.incidents.length);
  const overdue = state.incidents.filter((item) => item.sla === "overdue").length;
  const action = state.incidents.filter((item) => item.assignee === "Sem responsável" || item.status === "Sem atualização").length;
  const items = [
    { label: "Links indisponíveis", value: totalLinks, meta: `${state.incidents.length} incidente(s) ativo(s)`, color: "var(--red)", icon: "unlink" },
    { label: "Unidades isoladas", value: isolated, meta: `${isolated} isolamento(s) confirmado(s)`, color: "var(--red)", icon: "circle-dot" },
    { label: "Operadoras afetadas", value: operators, meta: "Fornecedores com impacto", color: "var(--amber)", icon: "radio-tower" },
    { label: "Tempo médio aberto", value: formatDuration(average), meta: "Incidentes em andamento", color: "var(--blue)", icon: "clock-3" },
    { label: "SLA vencido", value: overdue, meta: `${state.incidents.filter((item) => item.durationMinutes >= 1440).length} acima de 24h`, color: "var(--amber)", icon: "triangle-alert" },
    { label: "Exigem ação", value: action, meta: "Sem dono ou sem atualização", color: "var(--purple)", icon: "clipboard-check" }
  ];
  document.querySelector("#kpiGrid").innerHTML = items.map((item) => `
    <article class="kpi-card" style="--kpi-color:${item.color}">
      <div class="kpi-card-header"><span>${escapeHtml(item.label)}</span><span class="kpi-icon">${icon(item.icon)}</span></div>
      <strong class="kpi-value">${escapeHtml(item.value)}</strong>
      <span class="kpi-meta">${escapeHtml(item.meta)}</span>
    </article>`).join("");
}

function renderFilterCounts() {
  document.querySelector("#filterAllCount").textContent = state.incidents.length;
  document.querySelector("#filterIsolatedCount").textContent = state.incidents.filter((item) => item.isolated).length;
  document.querySelector("#filterSlaCount").textContent = state.incidents.filter((item) => item.sla === "overdue").length;
  document.querySelector("#filterUnassignedCount").textContent = state.incidents.filter((item) => item.assignee === "Sem responsável").length;
}

function renderIncidentList() {
  const incidents = filteredIncidents();
  document.querySelector("#visibleCount").textContent = `${incidents.length} incidente${incidents.length === 1 ? "" : "s"}`;
  const root = document.querySelector("#incidentList");
  if (!incidents.length) {
    root.innerHTML = `<div class="empty-state">${icon("search-x")}<p>Nenhum incidente corresponde aos filtros selecionados.</p></div>`;
    refreshIcons();
    return;
  }
  root.innerHTML = incidents.map((incident) => {
    const priority = PRIORITY_META[incident.priority];
    const slaClass = incident.sla === "overdue" ? "badge-critical" : incident.sla === "risk" ? "badge-attention" : "badge-stable";
    const slaLabel = incident.sla === "overdue" ? "SLA vencido" : incident.sla === "risk" ? "SLA em risco" : "SLA em dia";
    return `
      <article class="incident-card ${incident.id === state.selectedId ? "is-selected" : ""}" data-incident-id="${incident.id}" tabindex="0" role="button" aria-label="Abrir detalhes de ${escapeHtml(incident.unit)}">
        <div class="incident-severity" style="--severity-color:${priority.color}"></div>
        <div class="incident-main">
          <div class="incident-topline"><span class="badge ${priority.className}">${priority.label}</span><span class="badge badge-info" style="color:${operatorColor(incident.operator)}">${escapeHtml(incident.operator)}</span></div>
          <h3>${escapeHtml(incident.unit)}</h3>
          <p class="incident-subtitle">${escapeHtml(incident.city)} / ${escapeHtml(incident.state)} · ${escapeHtml(incident.regional)} · ${incident.linksDown}/${incident.linksTotal} link(s) fora</p>
          <div class="incident-badges">
            ${incident.isolated ? '<span class="badge badge-critical">Unidade isolada</span>' : ""}
            <span class="badge ${incident.assignee === "Sem responsável" ? "badge-attention" : "badge-stable"}">${escapeHtml(incident.assignee)}</span>
            <span class="badge ${slaClass}">${slaLabel}</span>
          </div>
          <div class="next-action">${icon("arrow-right")}<span>Próxima ação: <strong>${escapeHtml(incident.nextAction)}</strong></span></div>
        </div>
        <div class="incident-metrics">
          <strong class="incident-duration" style="--duration-color:${durationColor(incident.durationMinutes)}">${formatDuration(incident.durationMinutes)}</strong>
          <span class="incident-start">Desde ${formatStart(incident.startedAt)}</span>
          <button class="button button-secondary open-detail" type="button" data-incident-id="${incident.id}">${icon("panel-right-open")}Detalhes</button>
        </div>
      </article>`;
  }).join("");
  root.querySelectorAll("[data-incident-id]").forEach((element) => {
    element.addEventListener("click", (event) => {
      event.stopPropagation();
      selectIncident(element.dataset.incidentId);
    });
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") selectIncident(element.dataset.incidentId);
    });
  });
  refreshIcons();
}

function selectIncident(id) {
  state.selectedId = id;
  renderIncidentList();
  renderDetail();
}

function renderDetail() {
  const incident = getSelectedIncident();
  const root = document.querySelector("#detailPanel");
  if (!incident) {
    root.innerHTML = `<div class="detail-empty">${icon("panel-right")}<strong>Selecione um incidente</strong><span>O contexto operacional será exibido aqui.</span></div>`;
    refreshIcons();
    return;
  }
  root.innerHTML = `
    <div class="detail-header">
      <div class="detail-header-top">
        <div><p class="section-kicker">DETALHES DO INCIDENTE</p><h2>${escapeHtml(incident.unit)}</h2><p class="incident-subtitle">${incident.linksDown} link(s) impactado(s) · ${formatDuration(incident.durationMinutes)}</p></div>
        <span class="badge ${incident.isolated ? "badge-critical" : "badge-info"}">${incident.isolated ? "Isolada" : escapeHtml(incident.status)}</span>
      </div>
      <p class="detail-event">${escapeHtml(incident.event)}</p>
      <div class="detail-actions">
        ${incident.assignee === "Sem responsável" ? `<button class="button button-warning" id="assumeIncident" type="button">${icon("user-check")}Assumir</button>` : ""}
        <button class="button" type="button" data-detail-tab="treatment">${icon("notebook-pen")}Registrar atualização</button>
        <button class="button button-secondary" type="button" data-detail-tab="evidence">${icon("radar")}Evidências</button>
      </div>
    </div>
    <div class="detail-tabs" role="tablist">
      ${[
        ["summary", "Resumo"], ["treatment", "Tratativa"], ["history", "Histórico"], ["evidence", "Evidências"]
      ].map(([value, label]) => `<button class="detail-tab ${state.detailTab === value ? "is-active" : ""}" type="button" data-detail-tab="${value}" role="tab">${label}</button>`).join("")}
    </div>
    <div class="detail-content">${renderDetailTab(incident)}</div>`;
  root.querySelectorAll("[data-detail-tab]").forEach((button) => button.addEventListener("click", () => {
    state.detailTab = button.dataset.detailTab;
    renderDetail();
  }));
  root.querySelector("#assumeIncident")?.addEventListener("click", () => assumeIncident(incident));
  root.querySelector("#treatmentForm")?.addEventListener("submit", (event) => saveTreatment(event, incident));
  refreshIcons();
}

function renderDetailTab(incident) {
  if (state.detailTab === "treatment") return renderTreatmentTab(incident);
  if (state.detailTab === "history") return renderHistoryTab(incident);
  if (state.detailTab === "evidence") return renderEvidenceTab(incident);
  return renderSummaryTab(incident);
}

function renderSummaryTab(incident) {
  const details = [
    ["Operadora", incident.operator], ["Circuito", incident.circuit], ["IP de monitoramento", incident.ip],
    ["Tecnologia", incident.technology], ["Velocidade", incident.speed], ["Início", formatStart(incident.startedAt)],
    ["Cidade / UF", `${incident.city} / ${incident.state}`], ["Regional", incident.regional],
    ["Responsável", incident.assignee], ["Status", incident.status], ["Protocolo", incident.protocol || "Não informado"],
    ["SLA", incident.sla === "overdue" ? "Vencido" : incident.sla === "risk" ? "Em risco" : "Em dia"]
  ];
  return `
    ${incident.isolated ? `<div class="detail-alert"><strong>Indisponibilidade total da unidade</strong><p>${incident.linksDown}/${incident.linksTotal} links cadastrados estão indisponíveis. Valide energia e conectividade local antes de abrir chamados duplicados.</p></div>` : ""}
    <div class="summary-grid">${details.map(([label, value]) => `<div class="summary-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}</div>
    <h3 class="detail-section-title">Links da unidade</h3>
    ${Array.from({ length: incident.linksTotal }, (_, index) => `<div class="link-row"><div><strong>${escapeHtml(incident.operator)} · LINK ${index + 1}</strong><p>${escapeHtml(incident.technology)} · ${escapeHtml(incident.speed)} · ${index < incident.linksDown ? "Indisponível" : "Operacional"}</p></div><span class="badge ${index < incident.linksDown ? "badge-critical" : "badge-stable"}">${index < incident.linksDown ? "Fora" : "Ativo"}</span></div>`).join("")}`;
}

function renderTreatmentTab(incident) {
  return `
    <div class="treatment-callout"><strong>Atualização objetiva:</strong> registre somente o que mudou, a próxima ação, o dono e o prazo. O protocolo informado permanece nas próximas atualizações.</div>
    <form class="treatment-form" id="treatmentForm">
      <div class="form-grid">
        <label class="form-field"><span>Status da tratativa</span><select name="status" required><option>Em triagem</option><option>Chamado aberto</option><option>Aguardando operadora</option><option>Aguardando técnico</option><option>Escalado N1</option><option>Escalado N2</option><option>Normalizado / monitorando</option></select></label>
        <label class="form-field"><span>Protocolo</span><input name="protocol" value="${escapeHtml(incident.protocol)}" placeholder="Ex.: OP-12345"></label>
      </div>
      <label class="form-field"><span>Próxima ação</span><input name="nextAction" value="${escapeHtml(incident.nextAction)}" required></label>
      <label class="form-field"><span>Comentário da atualização</span><textarea name="comment" placeholder="Descreva o que mudou e o retorno obtido." required></textarea></label>
      <button class="button" type="submit">${icon("save")}Registrar atualização</button>
    </form>`;
}

function renderHistoryTab(incident) {
  return `<div class="timeline">${[...incident.history].reverse().map((entry) => `
    <article class="timeline-entry"><div class="timeline-meta"><strong>${escapeHtml(entry.author)}</strong><span>${escapeHtml(entry.time)}</span></div><strong>${escapeHtml(entry.status)}</strong><p>${escapeHtml(entry.text)}</p></article>`).join("")}</div>`;
}

function renderEvidenceTab(incident) {
  return `
    <article class="evidence-card"><span class="badge badge-stable">Monitoramento vinculado</span><h3>Evento técnico</h3><p>${escapeHtml(incident.event)}</p><code>DEMO-EVENT-${escapeHtml(incident.id.slice(-3))} · HOST-${escapeHtml(incident.state)}-${escapeHtml(incident.id.slice(-3))}</code></article>
    <article class="evidence-card"><span class="badge badge-info">Base sintética</span><h3>Conciliação do circuito</h3><p>Correspondência demonstrativa por unidade, designação e IP reservado para documentação.</p><code>${escapeHtml(incident.circuit)} · ${escapeHtml(incident.ip)} · confiança 98%</code></article>
    <article class="evidence-card"><span class="badge badge-neutral">Privacidade</span><h3>Sem acesso externo</h3><p>Esta edição não consulta monitoramento, banco de dados ou sistemas corporativos.</p></article>`;
}

function assumeIncident(incident) {
  incident.assignee = "Analista Demo";
  incident.status = "Em triagem";
  incident.nextAction = "Validar evento e abrir acionamento";
  persistIncidentState(incident);
  renderAllOperational();
  showToast(`${incident.unit} atribuído ao Analista Demo.`);
}

function saveTreatment(event, incident) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const update = {
    time: new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date()),
    author: "Analista Demo",
    status: String(form.get("status")),
    text: String(form.get("comment"))
  };
  incident.protocol = String(form.get("protocol")).trim();
  incident.status = update.status;
  incident.nextAction = String(form.get("nextAction")).trim();
  incident.history.push(update);
  persistIncidentState(incident, update);
  state.detailTab = "history";
  renderAllOperational();
  showToast("Atualização registrada apenas neste navegador.");
}

function persistIncidentState(incident, newUpdate) {
  const current = safeJsonParse(storageGet("noc-demo-state"), { assignees: {}, protocols: {}, updates: {} });
  current.assignees ||= {};
  current.protocols ||= {};
  current.updates ||= {};
  current.assignees[incident.id] = incident.assignee;
  current.protocols[incident.id] = incident.protocol;
  if (newUpdate) {
    current.updates[incident.id] ||= [];
    current.updates[incident.id].push(newUpdate);
  }
  storageSet("noc-demo-state", JSON.stringify(current));
}

function renderIncidentTable(filter = "") {
  const needle = filter.trim().toLocaleLowerCase("pt-BR");
  const rows = state.incidents.filter((item) => [item.unit, item.event, item.operator, item.regional, item.assignee].join(" ").toLocaleLowerCase("pt-BR").includes(needle));
  document.querySelector("#incidentTableBody").innerHTML = rows.map((incident) => {
    const priority = PRIORITY_META[incident.priority];
    return `<tr data-table-incident="${incident.id}" tabindex="0"><td><span class="badge ${priority.className}">${priority.label}</span></td><td><strong>${escapeHtml(incident.unit)}</strong><small>${escapeHtml(incident.event)}</small></td><td><strong style="color:${operatorColor(incident.operator)}">${escapeHtml(incident.operator)}</strong><small>${escapeHtml(incident.circuit)}</small></td><td>${escapeHtml(incident.regional)}</td><td><strong>${formatDuration(incident.durationMinutes)}</strong><small>${formatStart(incident.startedAt)}</small></td><td>${escapeHtml(incident.assignee)}</td><td><span class="badge ${incident.sla === "overdue" ? "badge-critical" : "badge-attention"}">${incident.sla === "overdue" ? "Vencido" : "Em risco"}</span></td></tr>`;
  }).join("");
  document.querySelectorAll("[data-table-incident]").forEach((row) => row.addEventListener("click", () => {
    state.selectedId = row.dataset.tableIncident;
    switchView("overview");
    renderAllOperational();
  }));
  refreshIcons();
}

function buildUnitData() {
  return state.incidents.map((incident, index) => ({
    name: incident.unit,
    city: incident.city,
    state: incident.state,
    regional: incident.regional,
    operators: [incident.operator, ...(index % 3 === 0 ? ["Vertex Telecom"] : [])],
    links: incident.linksTotal,
    incidents30d: 2 + (index * 3) % 8,
    health: incident.isolated ? 42 : Math.max(58, 92 - Math.round(incident.durationMinutes / 90)),
    activeIncident: incident
  }));
}

function renderUnits(filter = "") {
  const needle = filter.trim().toLocaleLowerCase("pt-BR");
  const units = buildUnitData().filter((unit) => [unit.name, unit.city, unit.state, unit.regional].join(" ").toLocaleLowerCase("pt-BR").includes(needle));
  document.querySelector("#unitGrid").innerHTML = units.map((unit) => {
    const healthColor = unit.health < 50 ? "var(--red)" : unit.health < 75 ? "var(--amber)" : "var(--green)";
    return `<article class="unit-card"><div class="unit-card-top"><div><h3>${escapeHtml(unit.name)}</h3><p>${escapeHtml(unit.city)} / ${escapeHtml(unit.state)} · ${escapeHtml(unit.regional)}</p><div class="incident-badges">${unit.operators.map((name) => `<span class="badge badge-info" style="color:${operatorColor(name)}">${escapeHtml(name)}</span>`).join("")}</div></div><span class="health-score" style="--health-color:${healthColor}">${unit.health}</span></div><div class="unit-stats"><div class="unit-stat"><span>Links</span><strong>${unit.links}</strong></div><div class="unit-stat"><span>Incidentes 30d</span><strong>${unit.incidents30d}</strong></div><div class="unit-stat"><span>Situação</span><strong style="color:${unit.activeIncident.isolated ? "var(--red)" : "var(--amber)"}">${unit.activeIncident.isolated ? "Isolada" : "Degradada"}</strong></div></div></article>`;
  }).join("");
  refreshIcons();
}

function aggregateOperators() {
  return Object.keys(OPERATOR_META).map((name) => {
    const incidents = state.incidents.filter((item) => item.operator === name);
    return { name, count: incidents.reduce((sum, item) => sum + item.linksDown, 0), incidents: incidents.length, ...OPERATOR_META[name] };
  }).sort((a, b) => b.count - a.count);
}

function renderBars(rootId, data, valueFormatter = (value) => String(value), maxValue) {
  const max = maxValue || Math.max(...data.map((item) => item.value), 1);
  document.querySelector(rootId).innerHTML = data.map((item) => `<div class="bar-row"><span class="bar-label">${escapeHtml(item.label)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(2, item.value / max * 100)}%;--bar-color:${item.color || "var(--blue)"}"></div></div><span class="bar-value">${escapeHtml(valueFormatter(item.value))}</span></div>`).join("");
}

function renderOperators() {
  const operators = aggregateOperators();
  renderBars("#operatorBars", operators.map((item) => ({ label: item.name, value: item.count, color: item.color })), (value) => `${value} links`);
  document.querySelector("#operatorCards").innerHTML = operators.map((item) => `<article class="operator-card" style="--operator-color:${item.color}"><h3>${escapeHtml(item.name)}</h3><dl><dt>Incidentes ativos</dt><dd>${item.incidents}</dd><dt>MTTR 30d</dt><dd>${formatDuration(item.mttr)}</dd><dt>Chamados no mês</dt><dd>${item.monthly}</dd><dt>SLA cumprido</dt><dd>${88 + item.incidents}%</dd></dl></article>`).join("");
}

function renderReports() {
  const operators = aggregateOperators();
  const reportItems = [
    { label: "Chamados", value: 68, meta: "Julho parcial", color: "var(--blue)", icon: "ticket-check" },
    { label: "Eventos correlacionados", value: 66, meta: "97% com evidência", color: "var(--purple)", icon: "radar" },
    { label: "MTTR", value: "3h 42m", meta: "Meta de 5h", color: "var(--amber)", icon: "timer" },
    { label: "SLA cumprido", value: "91,2%", meta: "+2,4 p.p. no mês", color: "var(--green)", icon: "shield-check" },
    { label: "Unidades com ocorrência", value: 31, meta: "Base sintética", color: "var(--red)", icon: "building-2" }
  ];
  document.querySelector("#reportKpis").innerHTML = reportItems.map((item) => `<article class="kpi-card" style="--kpi-color:${item.color}"><div class="kpi-card-header"><span>${escapeHtml(item.label)}</span><span class="kpi-icon">${icon(item.icon)}</span></div><strong class="kpi-value">${escapeHtml(item.value)}</strong><span class="kpi-meta">${escapeHtml(item.meta)}</span></article>`).join("");
  renderBars("#reportOperatorBars", operators.map((item) => ({ label: item.name, value: item.monthly, color: item.color })), (value) => `${value}`);
  renderBars("#mttrBars", operators.map((item) => ({ label: item.name, value: item.mttr, color: item.color })), formatDuration, 300);
  const maxMonth = Math.max(...MONTHLY_DATA.map((item) => item.value));
  document.querySelector("#monthlyChart").innerHTML = MONTHLY_DATA.map((item) => `<div class="column-item"><strong class="column-value">${item.value}</strong><div class="column-bar" style="height:${item.value / maxMonth * 180}px"></div><span class="column-label">${item.month}</span></div>`).join("");
  refreshIcons();
}

function renderWall() {
  const incidentsByRecent = [...state.incidents].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  const isolated = incidentsByRecent.filter((item) => item.isolated);
  const totalLinks = state.incidents.reduce((sum, item) => sum + item.linksDown, 0);
  const over24h = state.incidents.filter((item) => item.durationMinutes >= 1440).length;
  const oldest = [...state.incidents].sort((a, b) => b.durationMinutes - a.durationMinutes)[0];
  const wallKpis = [
    { value: totalLinks, label: "Links fora", color: "var(--red)" },
    { value: isolated.length, label: "Unidades isoladas", color: "var(--red)" },
    { value: over24h, label: "Acima de 24h", color: "var(--amber)" },
    { value: formatDuration(oldest.durationMinutes), label: "Maior queda", color: "var(--purple)" }
  ];
  document.querySelector("#wallKpis").innerHTML = wallKpis.map((item) => `<article class="wall-kpi" style="--wall-color:${item.color}"><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></article>`).join("");
  document.querySelector("#wallIncidentList").innerHTML = incidentsByRecent.slice(0, 8).map((incident, index) => `<article class="wall-row" style="--wall-row-color:${durationColor(incident.durationMinutes)}"><span class="wall-row-rank">#${index + 1}</span><div><h4>${escapeHtml(incident.unit)}</h4><p>${escapeHtml(incident.regional)} · ${escapeHtml(incident.operator)} · ${incident.linksDown} link(s) fora</p></div><strong class="wall-row-time">${formatDuration(incident.durationMinutes)}</strong></article>`).join("");
  document.querySelector("#wallIsolatedList").innerHTML = isolated.length ? isolated.map((incident) => `<article class="isolated-wall-card"><h4>${escapeHtml(incident.unit)}</h4><p><strong>${formatDuration(incident.durationMinutes)}</strong> · ${incident.linksDown}/${incident.linksTotal} links fora</p><p>${escapeHtml(incident.regional)} · ${escapeHtml(incident.city)} / ${escapeHtml(incident.state)}</p><p>${escapeHtml(incident.operator)}</p></article>`).join("") : '<div class="empty-state">Nenhuma unidade isolada.</div>';
}

function renderAllOperational() {
  renderKpis();
  renderFilterCounts();
  renderIncidentList();
  renderDetail();
  renderIncidentTable(document.querySelector("#incidentTableSearch")?.value || "");
  renderUnits(document.querySelector("#unitSearch")?.value || "");
  renderOperators();
  renderReports();
  renderWall();
  refreshIcons();
}

function populateRegionals() {
  const select = document.querySelector("#regionalFilter");
  [...new Set(state.incidents.map((item) => item.regional))].sort().forEach((regional) => {
    const option = document.createElement("option");
    option.value = regional;
    option.textContent = regional;
    select.appendChild(option);
  });
}

function switchView(viewName) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("is-active", view.id === `view-${viewName}`));
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.view === viewName));
  const view = document.querySelector(`#view-${viewName}`);
  document.querySelector("#pageTitle").textContent = view.dataset.title;
  document.querySelector("#pageEyebrow").textContent = view.dataset.eyebrow;
  document.body.classList.remove("mobile-nav-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  refreshIcons();
}

function exportDemoCsv() {
  const header = ["incident", "unit", "operator", "regional", "duration_minutes", "status", "synthetic"];
  const rows = state.incidents.map((item) => [item.id, item.unit, item.operator, item.regional, item.durationMinutes, item.status, "true"]);
  const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "noc-demo-incidents.csv";
  link.click();
  URL.revokeObjectURL(url);
  showToast("CSV sintético exportado.");
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function updateClock() {
  const now = new Date();
  document.querySelector("#wallClock").textContent = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now);
  document.querySelector("#wallDate").textContent = new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" }).format(now);
  const generatedAt = PIPELINE_DATA?.metadata?.generatedAt ? new Date(PIPELINE_DATA.metadata.generatedAt) : now;
  document.querySelector("#lastUpdated").textContent = `Dataset de ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(generatedAt)}`;
}

function applyTheme() {
  document.body.dataset.theme = state.theme;
  document.querySelector("#themeToggle").innerHTML = icon(state.theme === "light" ? "moon" : "sun");
  refreshIcons();
}

function bindEvents() {
  document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
  document.querySelector("#sidebarToggle").addEventListener("click", () => document.body.classList.toggle("sidebar-collapsed"));
  document.querySelector("#mobileMenu").addEventListener("click", () => document.body.classList.toggle("mobile-nav-open"));
  document.querySelector("#themeToggle").addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    storageSet("noc-demo-theme", state.theme);
    applyTheme();
  });
  document.querySelector("#globalSearch").addEventListener("input", (event) => {
    state.search = event.target.value;
    renderIncidentList();
  });
  document.querySelectorAll(".filter-chip").forEach((button) => button.addEventListener("click", () => {
    state.quickFilter = button.dataset.filter;
    document.querySelectorAll(".filter-chip").forEach((item) => item.classList.toggle("is-active", item === button));
    renderIncidentList();
  }));
  document.querySelector("#regionalFilter").addEventListener("change", (event) => {
    state.regional = event.target.value;
    renderIncidentList();
  });
  document.querySelector("#incidentTableSearch").addEventListener("input", (event) => renderIncidentTable(event.target.value));
  document.querySelector("#unitSearch").addEventListener("input", (event) => renderUnits(event.target.value));
  document.querySelector("#exportDemo").addEventListener("click", exportDemoCsv);
}

function init() {
  populateRegionals();
  bindEvents();
  applyTheme();
  renderAllOperational();
  updateClock();
  setInterval(updateClock, 1000);
}

document.addEventListener("DOMContentLoaded", init);
