/* ==========================================================================
   SuzzyPro Delivery — tracking.js
   Local shipment database + lookup/render logic
   ========================================================================== */

const SHIPMENT_DB = {
  SPD24589712: {
    status: 'In Transit',
    origin: 'Lagos',
    destination: 'Abuja',
    currentLocation: 'Ibadan',
    eta: 'Tomorrow, by 6:00 PM',
    driver: 'John Musa',
    vehicle: 'Mercedes Sprinter · KJA 445 XL',
    weight: '4.2 kg',
    service: 'Express Delivery',
    steps: ['Package Received', 'Sorting Facility', 'In Transit', 'Out for Delivery', 'Delivered'],
    activeStep: 2,
  },
  SPD56321478: {
    status: 'Out for Delivery',
    origin: 'Port Harcourt',
    destination: 'Enugu',
    currentLocation: 'Owerri',
    eta: 'Today, by 4:30 PM',
    driver: 'Amaka Obi',
    vehicle: 'Toyota Hiace · PHC 118 KJ',
    weight: '1.8 kg',
    service: 'Same-day Delivery',
    steps: ['Package Received', 'Sorting Facility', 'In Transit', 'Out for Delivery', 'Delivered'],
    activeStep: 3,
  },
  SPD98451237: {
    status: 'Delivered',
    origin: 'Kano',
    destination: 'Kaduna',
    currentLocation: 'Kaduna',
    eta: 'Delivered Jun 28, 2:14 PM',
    driver: 'Ibrahim Sule',
    vehicle: 'Honda CB · KN 902 RS',
    weight: '0.6 kg',
    service: 'Document Delivery',
    steps: ['Package Received', 'Sorting Facility', 'In Transit', 'Out for Delivery', 'Delivered'],
    activeStep: 4,
  },
  SPD77541265: {
    status: 'Sorting Facility',
    origin: 'Ibadan',
    destination: 'Lagos',
    currentLocation: 'Ibadan Hub',
    eta: 'In 2 days',
    driver: 'Unassigned',
    vehicle: 'Pending dispatch',
    weight: '12.5 kg',
    service: 'Business Logistics',
    steps: ['Package Received', 'Sorting Facility', 'In Transit', 'Out for Delivery', 'Delivered'],
    activeStep: 1,
  },
  SPD10983456: {
    status: 'International Transit',
    origin: 'Lagos, NG',
    destination: 'London, UK',
    currentLocation: 'Murtala Muhammed Cargo Terminal',
    eta: 'In 4–6 business days',
    driver: 'Freight partner carrier',
    vehicle: 'Air Freight · Flight VS412',
    weight: '3.1 kg',
    service: 'International Shipping',
    steps: ['Package Received', 'Sorting Facility', 'In Transit', 'Out for Delivery', 'Delivered'],
    activeStep: 2,
  },
};

document.addEventListener('DOMContentLoaded', () => {
  initTrackForms();
});

function initTrackForms() {
  document.querySelectorAll('.track-form, .track-form-lg').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[name="trackingNumber"]');
      const value = (input.value || '').trim().toUpperCase();
      if (!value) return;

      const resultsContainer = document.querySelector('#tracking-results');
      if (resultsContainer) {
        // On the tracking page itself: render inline
        renderTrackingResult(value, resultsContainer);
      } else {
        // On home page widget: redirect to tracking page with query param
        window.location.href = 'tracking.html?tn=' + encodeURIComponent(value);
      }
    });
  });

  // Auto-run lookup if arriving via ?tn=XXXX from the home widget
  const resultsContainer = document.querySelector('#tracking-results');
  if (resultsContainer) {
    const params = new URLSearchParams(window.location.search);
    const tn = params.get('tn');
    if (tn) {
      const input = document.querySelector('.track-form-lg input[name="trackingNumber"]');
      if (input) input.value = tn.toUpperCase();
      renderTrackingResult(tn.toUpperCase(), resultsContainer);
    }
  }
}

function renderTrackingResult(trackingNumber, container) {
  container.innerHTML = '<div class="track-loading"><span class="spinner"></span><p>Locating shipment...</p></div>';

  setTimeout(() => {
    const shipment = SHIPMENT_DB[trackingNumber];

    if (!shipment) {
      container.innerHTML = `
        <div class="track-empty animate-in">
          <div class="icon-tile" style="background:#FDEDEE;margin:0 auto 18px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#E5484D" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
          </div>
          <h3>No shipment found.</h3>
          <p>We couldn't find a shipment matching "${escapeHtml(trackingNumber)}". Double-check the tracking number and try again.</p>
        </div>`;
      return;
    }

    const stepPct = (shipment.activeStep / (shipment.steps.length - 1)) * 100;

    container.innerHTML = `
      <div class="track-result animate-in">
        <div class="track-result-head">
          <div>
            <span class="label">Tracking Number</span>
            <h3>${escapeHtml(trackingNumber)}</h3>
          </div>
          <span class="status-pill">${escapeHtml(shipment.status)}</span>
        </div>

        <div class="track-route">
          <div class="route-point">
            <span class="dot origin"></span>
            <div>
              <span class="label">Origin</span>
              <strong>${escapeHtml(shipment.origin)}</strong>
            </div>
          </div>
          <div class="route-line"><span class="route-line-fill" style="width:${stepPct}%"></span></div>
          <div class="route-point">
            <span class="dot dest"></span>
            <div>
              <span class="label">Destination</span>
              <strong>${escapeHtml(shipment.destination)}</strong>
            </div>
          </div>
        </div>

        <div class="track-meta-grid">
          <div class="meta-box"><span>Current Location</span><strong>${escapeHtml(shipment.currentLocation)}</strong></div>
          <div class="meta-box"><span>Estimated Delivery</span><strong>${escapeHtml(shipment.eta)}</strong></div>
          <div class="meta-box"><span>Driver</span><strong>${escapeHtml(shipment.driver)}</strong></div>
          <div class="meta-box"><span>Vehicle</span><strong>${escapeHtml(shipment.vehicle)}</strong></div>
          <div class="meta-box"><span>Package Weight</span><strong>${escapeHtml(shipment.weight)}</strong></div>
          <div class="meta-box"><span>Service Type</span><strong>${escapeHtml(shipment.service)}</strong></div>
        </div>

        <div class="track-timeline">
          ${shipment.steps.map((step, i) => `
            <div class="timeline-step ${i <= shipment.activeStep ? 'done' : ''} ${i === shipment.activeStep ? 'current' : ''}">
              <span class="timeline-icon pop-check" style="animation-delay:${i * 0.12}s">${i <= shipment.activeStep ? checkIcon() : ''}</span>
              <span class="timeline-label">${escapeHtml(step)}</span>
            </div>
          `).join('')}
          <div class="timeline-track"><span class="timeline-fill" style="width:${stepPct}%"></span></div>
        </div>
      </div>`;
  }, 900);
}

function checkIcon() {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
