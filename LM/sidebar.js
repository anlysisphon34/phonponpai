/**
 * sidebar.js — Single source of truth for admin sidebar
 * ใส่ <div id="sidebar"></div> ในทุกหน้า แล้ว load ไฟล์นี้
 * เรียก sidebarSetBadge(count) เพื่ออัปเดต followup badge หลัง API ตอบกลับ
 */
(function () {
  // ── CSS ──────────────────────────────────────────────────────────────────────
  const CSS = `
.sidebar{width:220px;flex-shrink:0;background:var(--sidebar);display:flex;flex-direction:column;overflow-y:auto}
.sidebar::-webkit-scrollbar{display:none}
.sb-brand{padding:28px 20px 24px;border-bottom:1px solid rgba(255,255,255,.08)}
.sb-brand-mark{width:40px;height:40px;background:var(--terra);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:12px}
.sb-brand-mark svg{width:22px;height:22px}
.sb-name{font-size:15px;font-weight:700;color:#fff;line-height:1.2}
.sb-sub{font-size:11px;color:rgba(255,255,255,.4);margin-top:4px}
.sb-section{padding:20px 12px 8px;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3)}
.sb-item{display:flex;align-items:center;gap:10px;padding:11px 20px;border-radius:10px;margin:2px 8px;cursor:pointer;transition:background .15s;text-decoration:none}
.sb-item:hover{background:rgba(255,255,255,.06)}
.sb-item.active{background:rgba(232,168,48,.15);border:1px solid rgba(232,168,48,.2)}
.sb-item .ico{width:18px;height:18px;opacity:.5;flex-shrink:0}
.sb-item.active .ico{opacity:1}
.sb-item span{font-size:14px;color:rgba(255,255,255,.6);font-weight:500}
.sb-item.active span{color:#fff;font-weight:600}
.sb-badge{margin-left:auto;background:var(--terra);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:100px}
.sb-week{margin:auto 0 0;padding:20px;border-top:1px solid rgba(255,255,255,.08)}
.sb-week-label{font-size:11px;color:rgba(255,255,255,.4);margin-bottom:6px}
.sb-week-bar{height:4px;background:rgba(255,255,255,.1);border-radius:4px;overflow:hidden}
.sb-week-fill{height:100%;background:#E8A830;border-radius:4px;width:0%;transition:width .5s ease}
.sb-week-num{font-size:14px;font-weight:700;color:#fff;margin-top:6px}
`;

  // ── Detect current page ───────────────────────────────────────────────────────
  const page = window.location.pathname.split('/').pop() || 'dashboard.html';

  // ── Week progress ─────────────────────────────────────────────────────────────
  const start   = new Date('2026-06-08T00:00:00+07:00');
  const diff    = Math.floor((Date.now() - start.getTime()) / 86400000);
  const curWeek = Math.min(Math.max(Math.floor(diff / 7) + 1, 1), 12);
  const pct     = Math.round(curWeek / 12 * 100);

  // ── Followup badge ────────────────────────────────────────────────────────────
  const cnt = sessionStorage.getItem('followupCount') || '';

  // ── Helper: build nav item ────────────────────────────────────────────────────
  function item(href, svgBody, label, hasBadge) {
    const active    = href === page ? ' active' : '';
    const badgeHTML = hasBadge
      ? `<span class="sb-badge" id="sb-followup-badge"${cnt ? '' : ' style="display:none"'}>${cnt || ''}</span>`
      : '';
    return `
    <a class="sb-item${active}" href="${href}">
      <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">${svgBody}</svg>
      <span>${label}</span>${badgeHTML}
    </a>`;
  }

  // ── Build HTML ────────────────────────────────────────────────────────────────
  const html = `<div class="sidebar">
  <div class="sb-brand">
    <div class="sb-brand-mark"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white" opacity=".9"/><circle cx="12" cy="9" r="2.5" fill="white"/></svg></div>
    <div class="sb-name">โครงการ 90 วัน</div>
    <div class="sb-sub">ระบบเจ้าหน้าที่</div>
  </div>
  <div class="sb-section">หลัก</div>
  ${item('dashboard.html',    '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',                                                             'ภาพรวม')}
  ${item('participants.html', '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',                                                                                           'ผู้เข้าร่วม')}
  ${item('screening.html',    '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>',                                                                                                                                                             'คัดกรอง')}
  ${item('followup.html',     '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>',                                                                                                                                                                             'ติดตาม', true)}
  ${item('leaderboard.html',  '<path d="M8 6v12M12 3v15M16 9v9"/><path d="M3 20h18"/>',                                                                                                                                                                                                   'ผู้ชนะ')}
  <div class="sb-section">รายงาน</div>
  ${item('#',                 '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="11" x2="15" y2="11"/>',                                                                                                                             'Export รายงาน')}
  <div class="sb-week">
    <div class="sb-week-label">ความคืบหน้าโครงการ</div>
    <div class="sb-week-bar"><div class="sb-week-fill" style="width:${pct}%"></div></div>
    <div class="sb-week-num">สัปดาห์ที่ ${curWeek} / 12</div>
  </div>
</div>`;

  // ── Inject CSS ────────────────────────────────────────────────────────────────
  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  // ── Inject HTML ───────────────────────────────────────────────────────────────
  const el = document.getElementById('sidebar');
  if (el) el.outerHTML = html;
})();

/**
 * อัปเดต followup badge หลัง API ตอบกลับ
 * เรียกจากหน้าที่ fetch getFollowups หรือ getDashboard
 */
function sidebarSetBadge(count) {
  const badge = document.getElementById('sb-followup-badge');
  if (!badge) return;
  if (count) {
    badge.textContent  = count;
    badge.style.display = '';
  } else {
    badge.style.display = 'none';
  }
  sessionStorage.setItem('followupCount', count || '');
}
