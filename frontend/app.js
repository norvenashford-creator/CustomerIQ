const API_BASE = 'http://127.0.0.1:8000';

function money(value) {
  if (value === null || value === undefined) return '—';
  return '$' + Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function percent(value) {
  if (value === null || value === undefined) return '—';
  return (Number(value) * 100).toFixed(2) + '%';
}

function fetchJson(path) {
  return fetch(API_BASE + path).then(r => {
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  });
}

function buildKpiCards(overview) {
  const kpiGrid = document.getElementById('kpi-grid');
  const kpis = [
    { label: 'Total Customers', value: overview.total_customers },
    { label: 'High Risk', value: overview.high_risk_customers, className: 'high' },
    { label: 'Medium Risk', value: overview.medium_risk_customers, className: 'medium' },
    { label: 'Low Risk', value: overview.low_risk_customers, className: 'low' },
    { label: 'Revenue Exposure', value: money(overview.total_revenue_exposure) },
    { label: 'Avg. Churn Probability', value: percent(overview.average_churn_probability) },
  ];
  kpiGrid.innerHTML = kpis.map(k => `
    <article class="kpi-card">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}</div>
    </article>
  `).join('');
}

function buildRiskDistribution(segments) {
  const max = Math.max(...segments.map(s => s.customer_count));
  const bars = document.getElementById('risk-bars');
  const meta = document.getElementById('risk-meta');
  const total = segments.reduce((acc, s) => acc + s.customer_count, 0);
  meta.textContent = `${total} customers`;

  bars.innerHTML = segments.map(s => {
    const width = Math.round((s.customer_count / max) * 100);
    const pct = Number(s.percentage || 0);
    return `<div class="risk-row">
      <span class="risk-label">${s.risk_segment}</span>
      <span class="risk-track">
        <span class="risk-fill ${s.risk_segment.toLowerCase()}" style="width:${width}%"></span>
      </span>
      <span class="risk-count">${s.customer_count} (${pct}%)</span>
    </div>`;
  }).join('');
}

function buildScatter(items) {
  const svg = document.getElementById('scatter-chart');
  const points = items.slice(0, 120);
  const maxValue = Math.max(...points.map(x => Number(x.monetary))); 
  const maxRisk = Math.max(...points.map(x => Number(x.churn_probability)));
  const width = 460;
  const height = 260;
  const pad = { left: 42, right: 22, top: 16, bottom: 36 };

  svg.innerHTML = '';

  // axes
  svg.innerHTML += `<line x1="${pad.left}" y1="${height-pad.bottom}" x2="${width-pad.right}" y2="${height-pad.bottom}" stroke="#90a4b8" />`;
  svg.innerHTML += `<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height-pad.bottom}" stroke="#90a4b8" />`;

  svg.innerHTML += `<text class="axis-label" x="${pad.left}" y="${height-8}" text-anchor="start">Spend</text>`;
  svg.innerHTML += `<text class="axis-label" x="${width-50}" y="${height-8}" text-anchor="end">Risk</text>`;

  points.forEach((item, i) => {
    const x = pad.left + (Number(item.monetary) / maxValue) * (width - pad.left - pad.right);
    const y = height - pad.bottom - (Number(item.churn_probability) / Math.max(maxRisk, 0.01)) * (height - pad.top - pad.bottom);
    svg.innerHTML += `<circle class="circle-point" cx="${x}" cy="${y}" r="3" data-id="${item.customer_id}" />`;
  });
}

function buildPriority(items) {
  const tbody = document.querySelector('#priority-table tbody');
  tbody.innerHTML = items.map(item => `
    <tr data-id="${item.customer_id}">
      <td>${item.customer_id}</td>
      <td><span class="risk-badge ${item.risk_segment.toLowerCase()}">${item.risk_segment}</span></td>
      <td>${percent(item.churn_probability)}</td>
      <td>${money(item.monetary)}</td>
      <td>${money(item.revenue_exposure)}</td>
      <td>${item.recency}</td>
    </tr>
  `).join('');

  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', () => fetchCustomer(parseInt(row.dataset.id)));
  });
}

function buildCustomerTable(items) {
  const tbody = document.querySelector('#customer-table tbody');
  tbody.innerHTML = items.map(item => `
    <tr data-id="${item.customer_id}">
      <td>${item.customer_id}</td>
      <td><span class="risk-badge ${item.risk_segment.toLowerCase()}">${item.risk_segment}</span></td>
      <td>${percent(item.churn_probability)}</td>
      <td>${money(item.monetary)}</td>
      <td>${item.recency}</td>
      <td>${item.frequency}</td>
      <td>${money(item.revenue_exposure)}</td>
    </tr>
  `).join('');

  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', () => fetchCustomer(parseInt(row.dataset.id)));
  });
}

function fetchCustomer(customer_id) {
  fetchJson(`/api/customers/${customer_id}`).then(row => {
    const detail = document.getElementById('customer-detail');
    detail.innerHTML = `<div class="detail-grid">
      <div class="detail-metric"><div class="label">Customer</div><div class="value">${row.customer_id}</div></div>
      <div class="detail-metric"><div class="label">Risk Segment</div><div class="value">${row.risk_segment}</div></div>
      <div class="detail-metric"><div class="label">Churn Probability</div><div class="value">${percent(row.churn_probability)}</div></div>
      <div class="detail-metric"><div class="label">Monetary Value</div><div class="value">${money(row.monetary)}</div></div>
      <div class="detail-metric"><div class="label">Recency</div><div class="value">${row.recency} days</div></div>
      <div class="detail-metric"><div class="label">Frequency</div><div class="value">${row.frequency}</div></div>
      <div class="detail-metric"><div class="label">Lifespan</div><div class="value">${row.customer_lifespan} days</div></div>
      <div class="detail-metric"><div class="label">AOV</div><div class="value">${money(row.average_order_value)}</div></div>
      <div class="detail-metric"><div class="label">Revenue Exposure</div><div class="value">${money(row.revenue_exposure)}</div></div>
    </div>
    <p>Customer ${row.customer_id} is classified as ${row.risk_segment} risk with an estimated churn probability of ${percent(row.churn_probability)}. Their historical monetary value is ${money(row.monetary)}, creating approximately ${money(row.revenue_exposure)} in revenue exposure.</p>`;
  }).catch(() => {
    const detail = document.getElementById('customer-detail');
    detail.innerHTML = '<div class="empty-detail">Customer detail is not available.</div>';
  });
}

function loadDashboard() {
  fetchJson('/api/overview').then(overview => {
    buildKpiCards(overview);
  });

  fetchJson('/api/analytics/risk-distribution').then(payload => {
    buildRiskDistribution(payload.segments);
  });

  fetchJson('/api/analytics/value-vs-risk?limit=120').then(payload => {
    buildScatter(payload.items);
  });

  fetchJson('/api/customers/priority?limit=5').then(payload => {
    buildPriority(payload.items);
  });

  refreshCustomerTable();
}

function refreshCustomerTable(page = 1) {
  const risk = document.getElementById('risk-filter').value || '';
  const sort = document.getElementById('sort-filter').value || 'customer_id';
  const min = document.getElementById('min-churn').value;
  const max = document.getElementById('max-churn').value;
  const offset = (page - 1) * 10;

  let path = `/api/customers?offset=${offset}&limit=10&sort=${encodeURIComponent(sort)}`;
  if (risk) path += `&risk_segment=${encodeURIComponent(risk)}`;
  if (min) path += `&min_churn=${encodeURIComponent(min)}`;
  if (max) path += `&max_churn=${encodeURIComponent(max)}`;

  fetchJson(path).then(payload => {
    buildCustomerTable(payload.items);
    document.getElementById('page-label').textContent = `Page ${page}`;
  });
}

function initEvents() {
  document.getElementById('apply-filter').addEventListener('click', () => refreshCustomerTable(1));
  document.getElementById('prev-page').addEventListener('click', () => {
    const label = document.getElementById('page-label').textContent.replace('Page ', '');
    const page = Math.max(1, Number(label) - 1);
    refreshCustomerTable(page);
  });
  document.getElementById('next-page').addEventListener('click', () => {
    const label = document.getElementById('page-label').textContent.replace('Page ', '');
    refreshCustomerTable(Number(label) + 1);
  });

  document.getElementById('refresh-btn').addEventListener('click', () => {
    loadDashboard();
  });
}

function init() {
  initEvents();
  loadDashboard();
}

init();
