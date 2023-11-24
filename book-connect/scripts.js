import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";
import { html, generateSearchGenres, generateSearchAuthors, createPreviewHTML, generateSearchResults, updateRemaining, css} from "./view.js";

if (!books && !Array.isArray(books)) throw new Error('Source required') 

export let matches = books
export let page = 1;
const RANGE_START = ((page - 1) * BOOKS_PER_PAGE)
const RANGE_END = (page * BOOKS_PER_PAGE)

// INITIAL LIST GENERATION
html.other.list.appendChild(createPreviewHTML(books, RANGE_START, RANGE_END))
html.list.button.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
html.list.button.disabled = !(books.length - RANGE_END > 0)
// INITIAL THEME
html.settings.theme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
const v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches? 'night' : 'day'
document.documentElement.style.setProperty('--color-dark', css[v].dark);
document.documentElement.style.setProperty('--color-light', css[v].light);

//SETTINGS OVERLAY
const handleSettingsToggle = (event) => {
    if (html.settings.overlay.open) {
    html.settings.overlay.close()
    } else html.settings.overlay.showModal();
    html.settings.theme.focus(); 
}
const handleSettingsSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const result = Object.fromEntries(formData)
    document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
    document.documentElement.style.setProperty('--color-light', css[result.theme].light);
}

html.other.settings.addEventListener('click', handleSettingsToggle)
html.settings.cancel.addEventListener('click', handleSettingsToggle)
html.settings.form.addEventListener('submit', handleSettingsToggle)

// SEARCH OVERLAY
html.search.genres.appendChild(generateSearchGenres())
html.search.authors.appendChild(generateSearchAuthors())

const handleSearchToggle = (event) => {
    if (html.search.overlay.open) {
    html.search.overlay.close()
    } else html.search.overlay.showModal()
    html.search.title.focus();
}

html.other.search.addEventListener('click', handleSearchToggle)
html.search.cancel.addEventListener('click', handleSearchToggle)
html.search.form.addEventListener('submit', handleSearchToggle)


// SEARCH SUBMIT
const handleSearchSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const searchResult = generateSearchResults(filters)

    if (searchResult.length < 1 ) {
        html.list.message.classList.add('list__message_show')
    } else html.list.message.classList.remove('list__message_show')

    html.other.list.innerHTML = ''
    html.other.list.appendChild(createPreviewHTML(searchResult, RANGE_START, RANGE_END))
    matches = searchResult
    page = 1
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateRemaining()
}

html.search.form.addEventListener('submit', handleSearchSubmit)



// LIST BUTTON
const handleListButton = (event) => {
    page = page + 1
    html.other.list.appendChild(createPreviewHTML(matches, (page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE))
    updateRemaining()
}

html.list.button.addEventListener('click', handleListButton)
html.settings.form.addEventListener('submit', handleSettingsSubmit)

// PREVIEW OVERLAY
// look into using button instead of div
const generateItemOverlay = (event) => {
    const pathArray = event.composedPath()
    let active = undefined
    let previewId = ""
    for (let node of pathArray) {
        if (node.dataset.id !== undefined){
            previewId = node.dataset.id
            break
        } 
    }
    for (const singleBook of books) {
        if (previewId === singleBook.id){
            active = singleBook
        }
    }

  html.list.blur.src = active.image
  html.list.image.src = active.image
  html.list.title.innerText = active.title
  html.list.subtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
  html.list.description.innerText = active.description
}
html.other.list.addEventListener('click', generateItemOverlay)

const handleItemOverlay = (event) => {
    if (event.target.className === 'list__items') return
    if (html.list.active.open) {
        html.list.active.close()
    } else html.list.active.showModal();
}


html.other.list.addEventListener('click', handleItemOverlay)
html.list.close.addEventListener('click', handleItemOverlay)
