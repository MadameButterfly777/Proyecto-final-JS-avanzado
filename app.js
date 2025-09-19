const API_URL = "https://68b700a673b3ec66cec374d2.mockapi.io";

//la R del CRUD :P
const containerList = document.getElementById("list")
function getLibros () {
    fetch(`${API_URL}/list`)
    .then(Response => {
        if (!Response.ok) throw new Error (`Error HHTP: ${Response.status}`);
        return Response.json()
    })
    .then(libros => {
     showLibros(libros);
        
    })
    .catch(error => {
      console.error("No pude cargar libros:", err);
      containerList.innerHTML = `
        <div class="column is-12">
          <article class="message is-danger">
            <div class="message-header"><p>Error</p></div>
            <div class="message-body">⚠️ No pude cargar los libros: ${err.message}</div>
          </article>
        </div>`;   
    })
}

getLibros()


function showLibros (libros) {
 libros.forEach(book => {
    const {cover, title, author, genre, status, description} = book
    const column = document.createElement('div');
    column.className = "column is-one-quarter"
    column.innerHTML = `<div class="card">
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
          <div class="buttons">
            <button class="button is-small is-warning is-light" data-id="${book.id}" data-action="edit">✏️ Editar</button>
            <button class="button is-small is-danger" data-id="${book.id}" data-action="delete">🗑️ Eliminar</button>
          </div>
        </div>
      </div>
    `;
     containerList.appendChild(column);
 });
}
// la  U del CRUD
function editBook () {
    fetch(`${API_URL}/list/:id`)
}

//la C del CRUD
function newBook(update_book) {
    fetch(`${API_URL}/list/` , {
        method: "POST", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(update_book)
    })
    .then((resp) => resp.json())
    .then((datos) => console.log("datos:" , datos))
}

newBook(update_book)