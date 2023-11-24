import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";
import {page} from "./scripts.js";

/**
 * An object literal containing query-selectors of the relevant HTML elements
 */
export const html = {
    
    search: {
        overlay: document.querySelector('[data-search-overlay]'),
        form: document.querySelector('[data-search-form]'),
        title: document.querySelector('[data-search-title]'),
        cancel: document.querySelector('[data-search-cancel]'),
        genres: document.querySelector('[data-search-genres'),
        authors: document.querySelector('[data-search-authors'),
    },
    settings: {
        overlay: document.querySelector('[data-settings-overlay]'),
        form: document.querySelector('[data-settings-form]'),
        theme: document.querySelector('[data-settings-theme]'),
        cancel: document.querySelector('[data-settings-cancel]'),
    },
    list: {
        button: document.querySelector('[data-list-button]'),
        message: document.querySelector('[data-list-message]'),
        active: document.querySelector('[data-list-active]'),
        blur: document.querySelector('[data-list-blur]'),
        image: document.querySelector('[data-list-image]'),
        title: document.querySelector('[data-list-title]'),
        subtitle: document.querySelector('[data-list-subtitle]'),
        description: document.querySelector('[data-list-description]'),
        close: document.querySelector('[data-list-close]'),

    },
    other: {
        search: document.querySelector('[data-header-search]'),
        settings: document.querySelector('[data-header-settings]'),
        list: document.querySelector('[data-list-items]')
    }
}
/**
 * An object literal containing css values for changing the theme colors.
 * @see handleSettingsSubmit in scripts.js for it's use.
 */
export const css = {
    day: {
        dark: '10, 10, 20',
        light: '255, 255, 255',
    },

    night: {
        dark: '255, 255, 255',
        light: '10, 10, 20',
    }
}

// PREVIEW
/**
 * Function that creates and returns HTML for book previews to be appended
 * to the list element. 
 * 
 * @param {Object} targetObject - Accepts any object literal that 
 * contains book information, in this case objects {@link book} from
 * data.js, or once a search form has been submitted, {@link searchResult} 
 * from scripts.js .
 * 
 * @param {Number} rangeStart - Defines where slicing of the targetObject
 * should occur, which is calculated by taking the current {@link page} value
 * and multiplying it by {@link BOOKS_PER_PAGE}
 * 
 * @param {Number} rangeEnd - Similar to rangeStart but defines where slicing
 * should end.
 * 
 * @returns {DocumentFragment} listFragment - Returns the newly created document
 * fragment which can then be appended to the list element.
 */
export const generatePreviewHtml = (targetObject, rangeStart, rangeEnd) => {
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

/**
 * Generates data for the preview overlay by creating an array from the event path,
 * with the event being a 'click' on any book preview in the list-items element, and
 * then inserts this data to the relevant element.
 * 
 * It does this by checking if any of the nodes in the array contains a dataset of "id",
 * and if so, sets {@link previewId} to the value of the "id" dataset. It then checks if
 * any of the {@link singleBook} in {@link books} contains an "id" key with a matching value and
 * sets {@link active} to equal that {@link singleBook}.
 */
export const generatePreviewOverlayData = (event) => {
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

/**
 * A function that creates and returns an object consisting of all the {@link singleBook} of {@link books}
 * which match the search parameters.
 * 
 * @param {Object} filters - This accepts an object containing data from the search form, 
 * defined as {@link filters} by {@link handleSearchSubmit} in scripts.js 
 * 
 * @returns {Object} result - This is used by {@link handleSearchSubmit} to define {@link searchResult} 
 * in scripts.js
 */
export const generateSearchResults = (filters) => {
    
    let result = []
    filters.title = filters.title.trim()
    for (const singleBook of books) {
        const titleMatch = filters.title === '' || singleBook.title.toLowerCase().includes(filters.title.toLowerCase())
        const authorMatch = filters.author === 'any' || singleBook.author === filters.author
        let genreMatch = filters.genre === 'any' 

        for (const singleGenre of singleBook.genres) {
             if (genres[singleGenre] === genres[filters.genre]) { 
                genreMatch = true 
            }
        } 
        if (titleMatch && authorMatch && genreMatch) {result.push(singleBook)}
    }
    
 return result
}

/**
 * A function that generates a list of genres from {@link genres} as <option> elements to be appended to the 
 * search form genre <input> dropdown menu. 
 * @returns {DocumentFragment} genreFragment - Returns the newly created document fragment to be appended.
 */
export const generateSearchGenres = () => {
    const genreFragment = document.createDocumentFragment()
    const element = document.createElement('option')
    element.value = 'any'
    element.innerText = 'All Genres'
    genreFragment.appendChild(element)

    for (let [id , name] of Object.entries(genres)) {
        const element = document.createElement('option')
        element.value = id
        element.innerText = name
        genreFragment.appendChild(element)
    }
    return genreFragment
}
html.search.genres.appendChild(generateSearchGenres())


/**
 * Similar to {@link generateSearchGenres} but uses {@link authors} to create the <option> elements.
 * @returns {DocumentFragment} genreFragment - Returns the newly created document fragment to be appended.
 */
export const generateSearchAuthors = () => {
    const authorsFragment = document.createDocumentFragment()
    const authorsElement = document.createElement('option')
    authorsElement.value = 'any'
    authorsElement.innerText = 'All Authors'
    authorsFragment.appendChild(authorsElement)

    for (let [id , name] of Object.entries(authors)) {
        const element = document.createElement('option')
        element.value = id
        element.innerText = name
        authorsFragment.appendChild(element)
    }
    return authorsFragment
}
html.search.authors.appendChild(generateSearchAuthors())