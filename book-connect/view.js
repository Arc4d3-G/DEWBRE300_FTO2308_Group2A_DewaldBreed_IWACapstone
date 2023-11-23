import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";
// import {matches, page} from "./scripts.js";
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



