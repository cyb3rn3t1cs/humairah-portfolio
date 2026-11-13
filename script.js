const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton?.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project-card');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  projects.forEach(card => card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter));
}));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// Count-up metrics: starts only when the cards enter the viewport.
const metricObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const node = entry.target;
    const target = Number(node.dataset.count || 0);
    const start = performance.now();
    const duration = 1350;
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      node.textContent = String(Math.round(target * eased)).padStart(2, '0');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    observer.unobserve(node);
  });
}, { threshold: 0.55 });
document.querySelectorAll('.metric-value').forEach(node => metricObserver.observe(node));

// Interactive, fictional incident-response exercise.
const labFeedback = document.getElementById('lab-feedback');
const labChoices = document.querySelectorAll('.lab-choice');
const labNotes = {
  identity: {
    title: 'GOOD START: ESTABLISH ACCOUNT CONTEXT',
    body: 'Confirm whether the sign-in passed MFA, whether the device is known, and whether the session matches the user’s normal pattern. Correlate identity-provider logs with VPN and endpoint telemetry. A suspicious location alone is not proof of compromise.'
  },
  activity: {
    title: 'FOLLOW THE DATA: MEASURE THE IMPACT',
    body: 'Review the audit events, exact records accessed, download volume, destination and whether the activity matches the user’s role. Preserve timestamps and relevant logs. This helps distinguish unusual-but-legitimate work from possible data exfiltration.'
  },
  contain: {
    title: 'CONTAINMENT: REDUCE RISK, PRESERVE EVIDENCE',
    body: 'Revoking sessions and temporarily restricting the account may be appropriate when the risk is credible. Coordinate with the incident lead, preserve logs first where possible, document actions and verify business impact. Containment should be proportionate and follow the response playbook.'
  }
};
labChoices.forEach(button => button.addEventListener('click', () => {
  const note = labNotes[button.dataset.choice];
  if (!note || !labFeedback) return;
  labChoices.forEach(item => item.classList.toggle('selected', item === button));
  labFeedback.innerHTML = `<span class="feedback-label">${note.title}</span><p>${note.body}</p>`;
}));
document.getElementById('lab-reset')?.addEventListener('click', () => {
  labChoices.forEach(item => item.classList.remove('selected'));
  if (labFeedback) labFeedback.innerHTML = '<span class="feedback-label">INVESTIGATION NOTE</span><p>Select an action to reveal the trade-offs and the next sensible step. There isn’t a substitute for context: preserve evidence and follow the incident response playbook.</p>';
});
