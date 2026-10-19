// ساده و بدون کتابخانه؛ کار با متن، استخراج لینک‌ها و نمایش
const input = document.getElementById('inputText');
const extractBtn = document.getElementById('extractBtn');
const clearBtn = document.getElementById('clearBtn');
const linksList = document.getElementById('linksList');
const remainingText = document.getElementById('remainingText');
const copyLinksBtn = document.getElementById('copyLinks');
const copyTextBtn = document.getElementById('copyText');

function extractLinksAndText(text) {
  if (!text) return { links: [], remaining: '' };

  const links = [];
  let working = text;

  const aRegex = /<a\b[^>]*href=(?:'|")([^'"]+)(?:'|")[^>]*>([\s\S]*?)<\/a>/gi;
  working = working.replace(aRegex, (m, href) => {
    links.push(href);
    return '';
  });

  const mdRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi;
  working = working.replace(mdRegex, (m, _t, href) => {
    links.push(href);
    return '';
  });

  const urlRegex = /((https?:\/\/|www\.)[^\s<>"'`]+)/gi;
  working = working.replace(urlRegex, (m) => {
    links.push(m);
    return '';
  });

  const remaining = working.replace(/\s{2,}/g, ' ').trim();

  const seen = new Set();
  const uniqueLinks = [];
  for (const l of links) {
    const normalized = l.trim();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      uniqueLinks.push(normalized);
    }
  }

  return { links: uniqueLinks, remaining };
}

function renderResults({ links, remaining }) {
  linksList.innerHTML = '';
  if (links.length === 0) {
    const li = document.createElement('li');
    li.textContent = '(هیچ لینکی پیدا نشد)';
    linksList.appendChild(li);
  } else {
    for (const l of links) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = l.startsWith('http') ? l : '//' + l;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = l;
      li.appendChild(a);
      linksList.appendChild(li);
    }
  }

  remainingText.textContent = remaining || '(متنی باقی نمانده)';
}

extractBtn.addEventListener('click', () => {
  const text = input.value;
  const res = extractLinksAndText(text);
  renderResults(res);
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  linksList.innerHTML = '';
  remainingText.textContent = '';
});

copyLinksBtn.addEventListener('click', async () => {
  const items = Array.from(linksList.querySelectorAll('a')).map(a => a.textContent);
  const text = items.join('\n');
  try {
    await navigator.clipboard.writeText(text);
    copyLinksBtn.textContent = 'کپی شد ✓';
    setTimeout(()=> copyLinksBtn.textContent = 'کپی لینک‌ها', 1200);
  } catch (e) {
    alert('کپی ناموفق: ' + e);
  }
});

copyTextBtn.addEventListener('click', async () => {
  const text = remainingText.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyTextBtn.textContent = 'کپی شد ✓';
    setTimeout(()=> copyTextBtn.textContent = 'کپی متن', 1200);
  } catch (e) {
    alert('کپی ناموفق: ' + e);
  }
});
