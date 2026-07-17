(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  root.dataset.theme = savedTheme || preferredTheme;
  toggle?.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  });

  document.querySelector('#current-year').textContent = new Date().getFullYear();

  const list = document.querySelector('#publication-list');
  const publications = Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS : [];

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const sortableDate = (publication) => {
    const raw = String(publication.date || publication.year || '0');
    if (/^\d{4}$/.test(raw)) return `${raw}-01-01`;
    if (/^\d{4}-\d{2}$/.test(raw)) return `${raw}-01`;
    return raw;
  };

  const publicationYear = (publication) => String(publication.date || publication.year || 'Undated').slice(0, 4);

  const renderAuthors = (authors) => authors.map((author) => {
    const safeAuthor = escapeHtml(author);
    return author === 'Jiaming Ye' ? `<span class="me">${safeAuthor}</span>` : safeAuthor;
  }).join(', ');

  const render = () => {
    const visible = publications
      .map((publication, originalIndex) => ({ ...publication, originalIndex }))
      .sort((a, b) => sortableDate(b).localeCompare(sortableDate(a)) || a.originalIndex - b.originalIndex);

    if (!visible.length) {
      list.innerHTML = '<p class="empty-state">No publications match this search. Try another keyword or topic.</p>';
      return;
    }

    const grouped = Object.groupBy
      ? Object.groupBy(visible, publicationYear)
      : visible.reduce((groups, publication) => {
          const year = publicationYear(publication);
          (groups[year] ||= []).push(publication);
          return groups;
        }, {});

    list.innerHTML = Object.entries(grouped)
      .sort(([yearA], [yearB]) => yearB.localeCompare(yearA))
      .map(([year, items]) => `
      <section class="year-group" aria-labelledby="year-${escapeHtml(year)}">
        <h3 class="year-label" id="year-${escapeHtml(year)}">${escapeHtml(year)}</h3>
        <div class="year-publications">
          ${items.map((publication) => `
            <article class="publication">
              <div class="publication-main">
                <h4 class="publication-title">${escapeHtml(publication.title)}</h4>
                <p class="publication-authors">${renderAuthors(publication.authors)}</p>
                <p class="publication-venue"><span class="venue-short">${escapeHtml(publication.venueShort)}</span> · ${escapeHtml(publication.venue)}${publication.note ? ` · ${escapeHtml(publication.note)}` : ''}</p>
              </div>
              <div class="publication-tags" aria-label="Publication type and topics">
                <span>${escapeHtml(publication.type)}</span>
                ${(publication.topics || []).slice(0, 1).map((topic) => `<span>${escapeHtml(topic.replace('-', ' '))}</span>`).join('')}
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    `).join('');
  };

  render();
})();
