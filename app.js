const API_URL = "https://68b700a673b3ec66cec374d2.mockapi.io";

// R del CRUD
const containerList = document.getElementById("list");

async function getLibros() {
  try {
    const res = await fetch(`${API_URL}/list`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const libros = await res.json();
    showLibros(libros);
  } catch (error) {
    console.error("No pude cargar libros:", error);
    containerList.innerHTML = `
      <div class="column is-12">
        <article class="message is-danger">
          <div class="message-header"><p>Error</p></div>
          <div class="message-body">⚠️ No pude cargar los libros: ${error.message}</div>
        </article>
      </div>`;
  }
}

function showLibros(libros = []) {
  containerList.innerHTML = "";
    if (!libros.length) {
    // Mensaje si no hay resultados
    containerList.innerHTML = '<div class="notification is-danger">No se encontraron libros.</div>';
    return;
  }
  libros.forEach((libro) => {
    const { cover, title, author, genre, status, description, id } = libro;

    const column = document.createElement("div");
    column.className = "column is-one-quarter";
    column.innerHTML = `
      <div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img class="is-rounded" src="${cover || 'https://picsum.photos/seed/fallback/100/100'}" alt="portada del libro">
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-5 mb-1">${title || 'Sin título'}</p>
              <p class="subtitle is-6">${author || ''}</p>
              <div class="tags">
                <span class="tag is-danger is-light">${genre || ''}</span>
                ${status ? `<span class="tag is-link is-light">${status}</span>` : ''}
              </div>
            </div>
          </div>
          <div class="content">${description || 'Sin descripción'}</div>
          <div class="buttons" class="notification">
            <button class="button is-small is-warning is-light" data-id="${id}" data-action="edit">✏️ Editar</button>
            <button class="button is-small is-danger" 
           class="delete" onclick="deleteBook('${id}')">🗑️ Eliminar</button>
          </div>
        </div>
      </div>`;
    containerList.appendChild(column);
  });
}

// D del CRUD

window.deleteBook = async function (id) {
  
  if (!confirm(`¿Estás segura/o de eliminar el libro con ID ${id}?`)) return;

  try {
    const res = await fetch(`${API_URL}/list/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    alert('Libro eliminado correctamente');
    await getLibros(); 
  } catch (err) {
    console.error('Error al borrar el libro:', err);
    alert(`⚠️ No pude borrar el libro: ${err.message}`);
  }
};


// === Modal  y C del CRUD

const modal      = document.getElementById('modal');
const btnAdd     = document.getElementById('btn-add');
const btnSave    = document.getElementById('modal-save');
const btnCancel  = document.getElementById('modal-cancel');
const btnClose   = document.getElementById('modal-close');


const openModal  = () => modal.classList.add('is-active');
const closeModal = () => modal.classList.remove('is-active');


btnAdd?.addEventListener('click', () => {

  modal.dataset.mode = 'create';
 
  clearForm();
  openModal();
});

//CON ESTE CERRAS EL PUTO MODAL (como me hizo doler la cabeza, lo admito en esto si le pedi ayuda a la IA :P)
btnCancel?.addEventListener('click', closeModal);
btnClose?.addEventListener('click', closeModal);


function clearForm() {
  document.getElementById('f-title').value = '';
  document.getElementById('f-author').value = '';
  document.getElementById('f-genre').value = 'gótico';
  document.getElementById('f-cover').value = '';
  document.getElementById('f-desc').value = '';
  document.getElementById('f-available').checked = false;
}


async function createBookFromModal() {
  
  const libro = {
    title: document.getElementById('f-title').value.trim(),
    author: document.getElementById('f-author').value.trim(),
    genre: document.getElementById('f-genre').value,
    cover: document.getElementById('f-cover').value.trim(),
    description: document.getElementById('f-desc').value.trim(),
    status: document.getElementById('f-available').checked ? 'leido' : 'pendiente'
  };

  if (!libro.title) {
    alert('Poné al menos el título 🙂');
    return;
  }


  const res = await fetch(`${API_URL}/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(libro)
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); 
}


btnSave?.addEventListener('click', async () => {
  try {
    btnSave.disabled = true; 
    await createBookFromModal();
    closeModal();        
    await getLibros();  
  } catch (e) {
    alert(`⚠️ No pude crear el libro: ${e.message}`);
  } finally {
    btnSave.disabled = false;
  }
});
 function editBook(id, data) {
  return fetch(`${API_URL}/list/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  }).then(r => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });
}


// === Filtros  ===
const $ = (id) => document.getElementById(id);

const bookList     = $("list");
const genreSelect  = $("genre");
const statusSelect = $("status");

const searchInput  = document.querySelector("#filters input");

let allBooks = []; 

async function cargarLibrosParaFiltrar() {
  const res = await fetch("https://68b700a673b3ec66cec374d2.mockapi.io/list");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  allBooks = await res.json();
  aplicarFiltros();
}

function aplicarFiltros() {
  const text   = (searchInput?.value || "").trim().toLowerCase();
  const genre  = (genreSelect?.value || "").toLowerCase();
  const status = (statusSelect?.value || "").toLowerCase();

  const filtrados = allBooks.filter(b => {
    const t = (b.title  || "").toLowerCase();
    const a = (b.author || "").toLowerCase();
    const g = (b.genre  || "").toLowerCase();
    const s = (b.status || "").toLowerCase();

    const okTexto  = !text   || t.includes(text) || a.includes(text);
    const okGenero = !genre  || g === genre;
    const okEstado = !status || s === status;

    return okTexto && okGenero && okEstado;
  });

  showLibros(filtrados);
}


searchInput?.addEventListener("input", aplicarFiltros);
genreSelect?.addEventListener("change", aplicarFiltros);
statusSelect?.addEventListener("change", aplicarFiltros);


cargarLibrosParaFiltrar();



getLibros();
