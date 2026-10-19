/* UI glue: uses window.Extract (from lib/extract.js).
   Handles live extraction, file upload (.txt), CSV/JSON export, and copy buttons.
*/
(function () {
  const input = document.getElementById('inputText');
  const extractBtn = document.getElementById('extractBtn');
  const clearBtn = document.getElementById('clearBtn');
  const loadSampleBtn = document.getElementById('loadSampleBtn');
  const fileInput = document.getElementById('fileInput');
  const chooseFileBtn = document.getElementById('chooseFileBtn');

  const linksList = document.getElementById('linksList');
  const remainingText = document.getElementById('remainingText');
  const linkCount = document.getElementById('linkCount');

  const copyLinksBtn = document.getElementById('copyLinks');
  const copyTextBtn = document.getElementById('copyText');
  const exportCsvBtn = document.getElementById('exportCsv');
  const exportJsonBtn = document.getElementById('exportJson');

  const sampleText = `برای اطلاعات بیشتر به https://example.com مراجعه کنید.
همچنین می‌توانید [صفحه رسمی](https://example.org) یا <a href="https://docs.example.com">مستندات</a> را ببینید.
این متن برای تست است و لینک‌های تکراری مثل https://example.com هم در آن وجود دارد.`;

  function safeLinkHref(link) {
    if (/^https?:\/\//i.test(link)) return link;
    return 'https://' + link;
  }

  function renderResults({ links, remaining }) {
    linksList.innerHTML = '';
    if (!links || links.length === 0) {
      const li = document.createElement('li');
      li.className = 'empty-state';
      li.textContent = 'هیچ لینکی پیدا نشده است.';
      linksList.appendChild(li);
    } else {
      for (const l of links) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = safeLinkHref(l);
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = l;
        li.appendChild(a);
        linksList.appendChild(li);
      }
    }
    linkCount.textContent = String((links && links.length) || 0);
    remainingText.textContent = remaining || 'متن شما به‌صورت خودکار در اینجا نمایش داده می‌شود.';
  }

  function extractAndRender() {
    const res = Extract.extractLinksAndText(input.value || '');
    renderResults(res);
    return res;
  }

  extractBtn.addEventListener('click', extractAndRender);
  loadSampleBtn.addEventListener('click', () => {
    input.value = sampleText;
    extractAndRender();
  });
  input.addEventListener('input', () => {
    extractAndRender();
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    renderResults({ links: [], remaining: '' });
  });

  chooseFileBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.type && !file.type.startsWith('text')) {
      alert('لطفاً یک فایل متنی (.txt) انتخاب کنید.');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (ev) {
      input.value = String(ev.target.result || '');
      extractAndRender();
    };
    reader.readAsText(file, 'utf-8');
  });

  async function copyToClipboard(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      const prev = btn.textContent;
      btn.textContent = 'کپی شد ✓';
      setTimeout(() => (btn.textContent = prev), 1200);
    } catch (err) {
      alert('کپی ناموفق بود.');
    }
  }

  copyLinksBtn.addEventListener('click', () => {
    const links = Array.from(linksList.querySelectorAll('a')).map((a) => a.textContent.trim());
    if (!links.length) return alert('لینکی برای کپی وجود ندارد.');
    copyToClipboard(links.join('\n'), copyLinksBtn);
  });

  copyTextBtn.addEventListener('click', () => {
    const text = remainingText.textContent || '';
    if (!text) return alert('متنی برای کپی وجود ندارد.');
    copyToClipboard(text, copyTextBtn);
  });

  function downloadBlob(filename, content, mime) {
    const blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  exportCsvBtn.addEventListener('click', () => {
    const links = Array.from(linksList.querySelectorAll('a')).map((a) => a.textContent.trim());
    if (!links.length) return alert('لیستی برای صادرسازی وجود ندارد.');
    const rows = ['url', ...links.map((l) => `"${l.replace(/"/g, '""')}"`)];
    downloadBlob('links.csv', rows.join('\n'), 'text/csv;charset=utf-8');
  });

  exportJsonBtn.addEventListener('click', () => {
    const links = Array.from(linksList.querySelectorAll('a')).map((a) => a.textContent.trim());
    if (!links.length) return alert('لیستی برای صادرسازی وجود ندارد.');
    downloadBlob('links.json', JSON.stringify(links, null, 2), 'application/json;charset=utf-8');
  });

  renderResults({ links: [], remaining: '' });
})();
