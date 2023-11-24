import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";
import {matches, page} from "./scripts.js";
/**
 * An object literal containing references to the relevant HTML elements
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
 * Function that creates HTML for each book in data.js that will then
 * be appended to the list-items div in our page main body.
 * 
 * @returns {HTMLElement}
 */
export const createPreviewHTML = (targetObject, rangeStart, rangeEnd) => {
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

export const updateRemaining = () => {
    const initial = matches.length - (page * BOOKS_PER_PAGE)
    const remaining = (initial > 0) ? initial : 0
    html.list.button.disabled = !(remaining > 0)
    
    html.list.button.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
    `
}

// GENRE FILTER OPTIONS

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

// AUTHOR FILTER OPTIONS
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



