(function () {
  const config = window.CATALOG_CONFIG || {};

  const catalogLogo = document.getElementById('catalogLogo');
  const catalogTitle = document.getElementById('catalogTitle');
  const catalogSubtitle = document.getElementById('catalogSubtitle');
  const catalogMeta = document.getElementById('catalogMeta');
  const modeTitle = document.getElementById('modeTitle');
  const catalogContent = document.getElementById('catalogContent');

  const ordModal = document.getElementById('ordModal');
  const ordX = document.getElementById('ordX');
  const ordLead = document.getElementById('ordLead');
  const ordPrize = document.getElementById('ordPrize');
  const ordSkill = document.getElementById('ordSkill');
  const ordName = document.getElementById('ordName');
  const ordSend = document.getElementById('ordSend');
  const ordDone = document.getElementById('ordDone');

  const QTY = {
    ind: { label: 'Individual', emo: '🧍', color: '#38B54F' },
    dupla: { label: 'Dupla', emo: '🧑‍🤝‍🧑', color: '#F68B21' },
    grupo: { label: 'Grupo', emo: '👨‍👩‍👧', color: '#484588' },
    sala: { label: 'Sala inteira', emo: '🏫', color: '#156052' }
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function qtyTag(item) {
    const qty = item.qty || 'ind';
    const itemQty = QTY[qty] || QTY.ind;
    return `<span class="qtag" style="background:${itemQty.color}">${itemQty.emo} ${itemQty.label}</span>`;
  }

  function itemThumb(item) {
    const imgHtml = item.img
      ? `<img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}">`
      : `<span class="emo">${escapeHtml(item.emo || '🎁')}</span>`;
    return `<div class="thumb">${imgHtml}</div>`;
  }

  function nameHtml(item, tag = 'h3') {
    const title = escapeHtml(item.name || 'Prêmio');
    if (item.link) {
      return `<${tag}><a href="${escapeHtml(item.link)}" target="_blank" rel="noopener" style="color:inherit;text-decoration:none;border-bottom:2px solid var(--green)">${title} 🔗</a></${tag}>`;
    }
    return `<${tag}>${title}</${tag}>`;
  }

  function fileLink(item) {
    if (!item.file || !item.file.data) return '';
    const fileName = escapeHtml(item.file.name || 'arquivo');
    return `<a class="dl" href="${escapeHtml(item.file.data)}" download="${fileName}">⬇️ Baixar arquivo</a>`;
  }

  function pointsMarkup(item) {
    if (!config.showPts) return '';
    return `<div class="pts">${escapeHtml(item.pts || 0)} <small>pts</small></div>`;
  }

  function catBody(cfg) {
    const items = Array.isArray(cfg.items) ? cfg.items : [];

    if (!items.length) {
      return '<div class="note">Nenhum prêmio foi selecionado para este catálogo.</div>';
    }

    if (cfg.mode === 'podio') {
      const top = items.slice(0, 3);
      const places = [
        { n: '1º', c: '#F6B21A', e: '🥇' },
        { n: '2º', c: '#B8BEC6', e: '🥈' },
        { n: '3º', c: '#CD8B4E', e: '🥉' }
      ];
      const cards = top.map((item, index) => `
        <div class="podium-card" style="--pc:${places[index].c}">
          <div class="place">${places[index].e} ${places[index].n} lugar</div>
          ${itemThumb(item)}
          ${qtyTag(item)}${nameHtml(item)}
          <p>${escapeHtml(item.desc || '')}</p>${pointsMarkup(item)}${fileLink(item)}
        </div>`).join('');
      const extra = items.length > 3 ? '<p class="note">Selecionados além dos 3 primeiros não entram no pódio.</p>' : '';
      return `<div class="podium">${cards}</div>${extra}`;
    }

    if (cfg.mode === 'trilha') {
      const last = items.length - 1;
      const steps = items.map((item, index) => {
        const skillName = (cfg.skills && cfg.skills[item.id] && String(cfg.skills[item.id]).trim()) || `Habilidade ${index + 1}`;
        const isFinal = index === last;
        return `
          <div class="step${isFinal ? ' final' : ''}">
            <div class="dot">${isFinal ? '🏆' : index + 1}</div>
            <div class="step-card">
              <div class="skill">${isFinal ? 'Prêmio final · ' : ''}${escapeHtml(skillName)}</div>
              ${itemThumb(item)}
              <div class="step-info">
                ${qtyTag(item)}${nameHtml(item)}
                <p>${escapeHtml(item.desc || '')}</p>
                ${cfg.showPts ? `<div class="pts">meta: ${escapeHtml(item.pts || 0)} pts</div>` : ''}
                ${fileLink(item)}
                <button class="redeem claim" data-prize="${escapeHtml(item.name || '')}" data-skill="${escapeHtml(skillName)}">Conquistei!</button>
              </div>
            </div>
          </div>`;
      }).join('');
      const objetivo = cfg.objetivo && cfg.objetivo.trim() ? `<div class="trilha-obj">🎯 ${escapeHtml(cfg.objetivo)}</div>` : '';
      return `${objetivo}<div class="trilha">${steps}</div>`;
    }

    const cards = items.map(item => `
      <div class="card">
        ${itemThumb(item)}
        <div class="cb">
          ${qtyTag(item)}${nameHtml(item)}
          <p>${escapeHtml(item.desc || '')}</p>
          ${pointsMarkup(item)}${fileLink(item)}
          <button class="redeem" data-prize="${escapeHtml(item.name || '')}">Escolher</button>
        </div>
      </div>`).join('');
    return `<div class="store">${cards}</div>`;
  }

  function renderCatalog() {
    const cfg = config || {};
    const title = cfg.title || 'Catálogo de Recompensas';
    const subtitle = {
      loja: 'Junte seus pontos e escolha o prêmio que mais combina com você!',
      podio: 'Parabéns aos destaques da turma! 🎉',
      trilha: 'Desenvolva cada habilidade e desbloqueie um prêmio.'
    }[cfg.mode] || 'Recompensas para a sua turma';
    const meta = [cfg.teacher, cfg.klass, cfg.school].filter(Boolean).join(' · ');

    if (catalogTitle) catalogTitle.textContent = title;
    if (catalogSubtitle) catalogSubtitle.textContent = subtitle;
    if (catalogMeta) catalogMeta.textContent = meta;
    if (modeTitle) {
      const modeText = {
        loja: 'Escolha seu prêmio',
        podio: 'Premiação da turma',
        trilha: 'Sua trilha de conquistas'
      }[cfg.mode] || 'Catálogo';
      modeTitle.textContent = modeText;
    }
    if (catalogLogo) {
      catalogLogo.alt = 'Br.ino';
      catalogLogo.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40" viewBox="0 0 120 40"><rect width="120" height="40" rx="8" fill="#38B54F"/><text x="60" y="24" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="white">Br.ino</text></svg>';
    }

    if (catalogContent) {
      catalogContent.innerHTML = catBody(cfg);
    }

    document.querySelectorAll('.redeem').forEach((button) => {
      button.addEventListener('click', () => {
        const prize = button.getAttribute('data-prize') || '';
        const skill = button.getAttribute('data-skill') || '';
        openOrderModal(prize, skill);
      });
    });
  }

  function openOrderModal(prize, skill) {
    if (!ordModal || !ordPrize || !ordLead || !ordSkill || !ordName || !ordSend || !ordDone) return;

    ordPrize.textContent = prize;
    ordLead.textContent = skill ? 'Você conquistou' : 'Você escolheu';
    if (skill) {
      ordSkill.textContent = `🧭 ${skill}`;
      ordSkill.style.display = 'block';
    } else {
      ordSkill.style.display = 'none';
    }
    ordName.value = '';
    ordDone.style.display = 'none';
    ordSend.style.display = '';
    ordModal.classList.add('show');
    setTimeout(() => ordName.focus(), 50);
  }

  function closeOrderModal() {
    if (ordModal) ordModal.classList.remove('show');
  }

  async function submitOrder() {
    if (!ordName || !ordPrize || !ordSend || !ordDone) return;

    const name = ordName.value.trim();
    if (!name) {
      ordName.focus();
      return;
    }

    const slug = (config.slug && String(config.slug)) || window.location.pathname.split('/').filter(Boolean).pop() || '';
    const prizeName = ordPrize.textContent || '';
    const skillName = ordSkill && ordSkill.style.display !== 'none' ? ordSkill.textContent.replace(/^🧭\s*/, '') : '';

    ordSend.style.display = 'none';
    ordDone.textContent = '✅ Enviado! Agora fale com seu professor(a).';
    ordDone.style.display = 'block';

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, studentName: name, prizeName, skillName })
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      ordDone.textContent = '⚠️ Não foi possível enviar a escolha agora. Tente novamente.';
      ordSend.style.display = '';
    }
  }

  if (ordX) ordX.addEventListener('click', closeOrderModal);
  if (ordModal) ordModal.addEventListener('click', (event) => {
    if (event.target === ordModal) closeOrderModal();
  });
  if (ordSend) ordSend.addEventListener('click', submitOrder);
  if (ordName) ordName.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') submitOrder();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCatalog);
  } else {
    renderCatalog();
  }
})();
