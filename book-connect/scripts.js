import { BOOKS_PER_PAGE, books } from "./data.js";
import { html, generatePreviewHtml, generateSearchResults, css, generatePreviewOverlayData} from "./generators.js";

/** Logs an error if {@link books} from data.js does not exist or isn't an array.*/
if (!books && !Array.isArray(books)) throw new Error('Source required') 

/**
 * Upon initialization {@link matches} should equal {@link books} for use with
 * {@link generatePreviewHtml}, however, once a search has been submitted, matches is redefined
 * as {@link searchResult} so that the "Show More" button will append using {@link searchResult} 
 * instead of {@link book}.
 */
export let matches = books

/**
 * Global variables used as shortcuts to calculate where {@link generatePreviewHtml} slices.
 * Note that {@link page}'s value is increased whenever the "Show More" button is clicked,
 * and is reset to 1 whenever a search is submitted.
 */
export let page = 1;
const RANGE_START = ((page - 1) * BOOKS_PER_PAGE)
const RANGE_END = (page * BOOKS_PER_PAGE)

/** 
 * Initial preview list is generated, as well as the "Show More" button's initial html.
 * @see generatePreviewHtml and @see generatePreviewOverlayData 
 */
html.other.list.appendChild(generatePreviewHtml(matches, RANGE_START, RANGE_END))
html.other.list.addEventListener('click', generatePreviewOverlayData)
html.list.button.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
html.list.button.disabled = !(books.length - RANGE_END > 0)


/** 
 * Settings form <option> value is set to either 'day' or 'night
 * according to the browser's preferred color scheme.
 * @see css
*/
html.settings.theme.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
const v = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches? 'night' : 'day'
document.documentElement.style.setProperty('--color-dark', css[v].dark);
document.documentElement.style.setProperty('--color-light', css[v].light);

/** Toggles the settings overlay either open or closed */
const handleSettingsToggle = (event) => {
    if (html.settings.overlay.open) {
    html.settings.overlay.close()
    } else html.settings.overlay.showModal();
    html.settings.theme.focus(); 
}

/**
 * Changes the theme according to the result of the settings form <option> submission
 */
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

/** Toggles the settings overlay either open or closed */
const handleSearchToggle = (event) => {
    if (html.search.overlay.open) {
    html.search.overlay.close()
    } else html.search.overlay.showModal()
    html.search.title.focus();
}

html.other.search.addEventListener('click', handleSearchToggle)
html.search.cancel.addEventListener('click', handleSearchToggle)
html.search.form.addEventListener('submit', handleSearchToggle)


/**
 * A function that creates an object from the search form submission results and assigns it to
 * {@link filters}. It then uses filters as a parameter for {@link generateSearchResults} and assigns
 * it's return value as {@link searchResult} which is then used in {@link generatePreviewHtml} to generate
 * preview html to be appended to the page. 
 */
const handleSearchSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const searchResult = generateSearchResults(filters)

    if (searchResult.length < 1 ) {
        html.list.message.classList.add('list__message_show')
    } else html.list.message.classList.remove('list__message_show')

    html.other.list.innerHTML = ''
    html.other.list.appendChild(generatePreviewHtml(searchResult, RANGE_START, RANGE_END))
    matches = searchResult
    page = 1
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateRemaining()
}

html.search.form.addEventListener('submit', handleSearchSubmit)


/**
 * When "Show More" button is clicked it will append the relevant book previews taken from whichever
 * object is assigned to {@link matches} (either {@link books} or {@link searchResult})
 * It also increases the value of {@link page} by 1 for use in slice calculations
 */
const handleListButton = (event) => {
    page = page + 1
    html.other.list.appendChild(generatePreviewHtml(matches, (page - 1) * BOOKS_PER_PAGE, page * BOOKS_PER_PAGE))
    updateRemaining()
}

html.list.button.addEventListener('click', handleListButton)
html.settings.form.addEventListener('submit', handleSettingsSubmit)

/**
 * A function that calculates the remaining books in either {@link books}, or if a search has
 * been submitted, {@link searchResult} and updates the "Show More" button's html to display the 
 * remaining books. 
 */
const updateRemaining = () => {
    const initial = matches.length - (page * BOOKS_PER_PAGE)
    const remaining = (initial > 0) ? initial : 0
    html.list.button.disabled = !(remaining > 0)
    
    html.list.button.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
    `
}

/** Toggles the book preview overlay either open or closed */
const handlePreviewOverlay = (event) => {
    if (event.target.className === 'list__items') return
    if (html.list.active.open) {
        html.list.active.close()
    } else html.list.active.showModal();
}

html.other.list.addEventListener('click', handlePreviewOverlay)
html.list.close.addEventListener('click', handlePreviewOverlay)