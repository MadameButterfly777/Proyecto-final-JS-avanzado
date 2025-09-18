const API_URL = "https://68b700a673b3ec66cec374d2.mockapi.io/list";

const $ = (e) => document.querySelector(e);
const bookList  = $('#list');
 const bookGenre = $('#genre'); 

const fetchBooks = async (params = {}) => {
  try {
    const url = new URL(API_URL);
    // si querés filtros, los agregás acá
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const data = await res.json();     
    if (Array.isArray(data)) {
    renderList(data);
    } else {
    renderList([]);
    }

  } catch (err) {
    console.error('fetchBooks error:', err);
    bookList.innerHTML = `
      <div class="column is-12">
        <article class="message is-danger">
          <div class="message-header"><p>Error</p></div>
          <div class="message-body">⚠️ No pude cargar los libros: ${err.message}</div>
        </article>
      </div>`;
  }
};

const renderList = (books = []) => {
  bookList.innerHTML = '';

  if (!books.length) {
    bookList.innerHTML = `
      <div class="column is-12 has-text-centered">
        <p class="title is-5">Sin resultados</p>
        <p class="subtitle is-6">Probá cargando datos o revisá filtros.</p>
      </div>`;
    return;
  }

  books.forEach((book) => {
    const column = document.createElement('div');
    column.className = 'column is-12-tablet is-6-desktop is-4-widescreen';
    column.innerHTML = `
      <div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img class="is-rounded" src="${book.cover || 'https://picsum.photos/seed/fallback/100/100'}" alt="portada del libro">
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-5 mb-1">${book.title || 'Sin título'}</p>
              <p class="subtitle is-6">${book.author || ''}</p>
              <div class="tags">
                <span class="tag is-danger is-light">${book.genre || ''}</span>
                ${book.status ? `<span class="tag is-link is-light">${book.status}</span>` : ''}
              </div>
            </div>
          </div>
          <div class="content">${book.description || 'Sin descripción'}</div>
          <div class="buttons">
            <button class="button is-small is-warning is-light" data-id="${book.id}" data-action="edit">✏️ Editar</button>
            <button class="button is-small is-danger" data-id="${book.id}" data-action="delete">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    `;
    bookList.appendChild(column);
  });
};
fetchAllFilters = async () => {
    const genreSet = new Set();
   
}

fetchAllFilters()
fetchBooks();
