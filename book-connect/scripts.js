import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";
import { html, generateSearchGenres, generateSearchAuthors} from "./view.js";

if (!books && !Array.isArray(books)) throw new Error('Source required') 
// if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')
let matches = books
let page = 1;


// PREVIEW

/**
 * Function that creates HTML for each book in data.js that will then
 * be appended to the list-items div in our page main body.
 * 
 * @returns {HTMLElement}
 */
const createPreviewHTML = (targetObject, rangeStart, rangeEnd) => {
    const listFragment = document.createDocumentFragment()
    const extractedBooks = targetObject.slice(rangeStart, rangeEnd)
    for (let { author, image, title, id } of extractedBooks) {
        author = authors[author] // to display the author as a name and not an id

        const preview = document.createElement('button')
        preview.className = 'preview'
        preview.dataset.id = id

        preview.innerHTML = /* html */ `
        <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${author}</div>
            </div>
        `
        listFragment.appendChild(preview)

    }
    return listFragment
}

html.other.list.appendChild(createPreviewHTML(books, ((page - 1) * [BOOKS_PER_PAGE]), (page * [BOOKS_PER_PAGE])))

html.search.genres.appendChild(generateSearchGenres())
html.search.authors.appendChild(generateSearchAuthors())

// LIST BUTTON
html.list.button.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
html.list.button.disabled = !(books.length - (page * BOOKS_PER_PAGE) > 0)



// THEME

// const css = {
//     day: {
//         dark: '10, 10, 20',
//         light: '255, 255, 255',
//     },

//     night: {
//         dark: '255, 255, 255',
//         light: '10, 10, 20',
//     }
// }

// data-settings-theme.value === window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
// v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches? 'night' | 'day'

// documentElement.style.setProperty('--color-dark', css[v].dark);
// documentElement.style.setProperty('--color-light', css[v].light);
// data-settings-form.submit() { actions.settings.submit }

//SETTINGS OVERLAY
const handleSettingsToggle = (event) => {
    if (html.settings.overlay.open) {
    html.settings.overlay.close()
    } else html.settings.overlay.showModal()
    html.settings.theme.focus();
}

html.other.settings.addEventListener('click', handleSettingsToggle)
html.settings.cancel.addEventListener('click', handleSettingsToggle)

// SEARCH OVERLAY
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
    let result = []

    for (const singleBook of books) {
        const titleMatch = filters.title.trim() === '' || singleBook.title.toLowerCase().includes(filters.title.toLowerCase())

        const authorMatch = filters.author === 'any' || singleBook.author === filters.author

        let genreMatch = filters.genre === 'any' 
        for (const singleGenre of singleBook.genres) {
            
             if (genres[singleGenre] === genres[filters.genre]) { 
                genreMatch = true 
            }
        } 
        if (titleMatch && authorMatch && genreMatch){ result.push(singleBook)}
    }

    if (result.length < 1 ) {
        html.list.message.classList.add('list__message_show')
    } else html.list.message.classList.remove('list__message_show')

    console.log(result)

    html.other.list.innerHTML = ''
    html.other.list.appendChild(createPreviewHTML(result, ((page - 1) * [BOOKS_PER_PAGE]), (page * [BOOKS_PER_PAGE])))
    matches = result
}

html.search.form.addEventListener('submit', handleSearchSubmit)


// LIST BUTTON HTML
const updateRemaining = () => {
    html.list.button.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (${matches.length - (page * BOOKS_PER_PAGE) > 0 ? matches.length - (page * BOOKS_PER_PAGE) : 0})</span>
        `
}

const handleListButton = (event) => {
    page = page + 1
    html.other.list.appendChild(createPreviewHTML(matches, ((page - 1) * [BOOKS_PER_PAGE]), (page * [BOOKS_PER_PAGE])))
    updateRemaining()
    console.log(matches)
}

html.list.button.addEventListener('click', handleListButton)


    // initial = matches.length - [page * BOOKS_PER_PAGE]
    // remaining = hasRemaining ? initial : 0
    // data-list-button.disabled = initial > 0

    // data-list-button.innerHTML = /* html */ `
    //     <span>Show more</span>
    //     <span class="list__remaining"> (${remaining})</span>
    // `
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     data-search-overlay.open = false
// }






// data-settings-overlay.submit; {
//     preventDefault()
//     const formData = new FormData(event.target)
//     const result = Object.fromEntries(formData)
//     document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
//     document.documentElement.style.setProperty('--color-light', css[result.theme].light);
//     data-settings-overlay).open === false
// }

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

const handleItemOverlay = (event) => {
    if (html.list.active.open) {
        html.list.active.close()
    } else html.list.active.showModal();
    
    
    
}
html.other.list.addEventListener('click', generateItemOverlay)
html.other.list.addEventListener('click', handleItemOverlay)
html.list.close.addEventListener('click', handleItemOverlay)
   

//     const fragment = document.createDocumentFragment()
//     const extracted = result.slice(((page - 1) * [BOOKS_PER_PAGE]), (page * [BOOKS_PER_PAGE]))
//     console.log(extracted)

//     for (let { author, image, title, id } of extracted) {
//         // const { author: authorId, id, image, title } = props
//         author = authors[author]

//         const preview = document.createElement('button')
//         preview.className = 'preview'
//         preview.dataset.id = id

//         preview.innerHTML = /* html */ `
//             <img
//                 class="preview__image"
//                 src="${image}"
//             />
            
//             <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${author}</div>
//             </div>
//         `

//         fragment.appendChild(preview)
//     }
    
// html.other.list.appendChild(fragment)