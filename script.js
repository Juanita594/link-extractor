const input = document.getElementById('inputText');
const extractBtn = document.getElementById('extractBtn');
const clearBtn = document.getElementById('clearBtn');
const loadSampleBtn = document.getElementById('loadSampleBtn');
const linksList = document.getElementById('linksList');
const remainingText = document.getElementById('remainingText');
const linkCount = document.getElementById('linkCount');
const copyLinksBtn = document.getElementById('copyLinks');
const copyTextBtn = document.getElementById('copyText');

const sampleText = `برای اطلاعات بیشتر به https://example.com مراجعه کنید.
همچنین می‌توانید [صفحه رسمی](https://example.org) یا <a href="https://docs.example.com">مستندات</a> را ببینید.
این متن برای تست است و لینک‌های تکراری مثل https://example.com هم در آن وجود دارد.`;

function normalizeUrl(raw) {
  return raw.trim().replace(/[.,;!?)]$/g, '');
}

function extractLinksAndText(text) {
  if (!text || !text.trim()) {
    return { links: [], remaining: '' };
  }

  const links = [];
  let working = text;

  const anchorRegex = /<a\b[^>]*href=(?:['"])([^'"]+)(?:['"])\s*[^>]*>(.*?)<\/a>/gi;
  working = working.replace(anchorRegex, (_, href) => {
    const normalized = normalizeUrl(href);
    if (!links.includes(normalized)) links.push(normalized);
    return '';
  });

  const markdownRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi;
  working = working.replace(markdownRegex, (_, __, href) => {
    const normalized = normalizeUrl(href);
    if (!links.includes(normalized)) links.push(normalized);
    return '';
  });

  const rawUrlRegex = /((https?:\/\/|www\.)[^\s<>'"`]+[\w/])/gi;
  working = working.replace(rawUrlRegex, (match) => {
    const normalized = normalizeUrl(match);
    if (!links.includes(normalized)) links.push(normalized);
    return '';
  });

  const remaining = working
    .replace(/\s{3,}/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { links, remaining };
}

function renderResults({ links, remaining }) {
  linksList.innerHTML = '';

  if (!links.length) {
    const li = document.createElement('li');
    li.className = 'empty-state';
    li.textContent = 'هیچ لینکی پیدا نشده است.';
    linksList.appendChild(li);
  } else {
    links.forEach((link) => {
      const item = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = link.startsWith('http') ? link : `https://${link}`;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = link;
      item.appendChild(anchor);
      linksList.appendChild(item);
    });
  }

  linkCount.textContent = String(links.length);
  remainingText.textContent = remaining || 'متن شما به‌صورت خودکار در اینجا نمایش داده می‌شود.';
}

function handleExtract() {
  const text = input.value;
  const result = extractLinksAndText(text);
  renderResults(result);
}

extractBtn.addEventListener('click', handleExtract);
loadSampleBtn.addEventListener('click', () => {
  input.value = sampleText;
  handleExtract();
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  renderResults({ links: [], remaining: '' });
});

copyLinksBtn.addEventListener('click', async () => {
  const links = Array.from(linksList.querySelectorAll('a')).map((item) => item.textContent.trim());
  if (!links.length) {
    return;
  }

  try {
    await navigator.clipboard.writeText(links.join('\n'));
    copyLinksBtn.textContent = 'کپی شد ✓';
    setTimeout(() => {
      copyLinksBtn.textContent = 'کپی';
    }, 1200);
  } catch (error) {
    alert('کپی لینک‌ها ناموفق بود.');
  }
});

copyTextBtn.addEventListener('click', async () => {
  if (!remainingText.textContent || remainingText.textContent.includes('به‌صورت خودکار')) {
    return;
  }

  try {
    await navigator.clipboard.writeText(remainingText.textContent);
    copyTextBtn.textContent = 'کپی شد ✓';
    setTimeout(() => {
      copyTextBtn.textContent = 'کپی';
    }, 1200);
  } catch (error) {
    alert('کپی متن ناموفق بود.');
  }
});

input.addEventListener('input', handleExtract);
renderResults({ links: [], remaining: '' });
