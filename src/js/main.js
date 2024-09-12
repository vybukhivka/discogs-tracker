import { fetchRelease } from "./controller.js"
import { renderRelease, renderBookmarks } from './render.js'
import { handleSearch } from "./search.js";
import { addToBookmark, deleteBookmark } from "./bookmarks.js";
import state from "./state.js";

const releaseContainer = document.querySelector('.release');
const bookmarksContainer = document.querySelector('.bookmarks')
const bookmarksButton = document.querySelector('.nav__btn--bookmarks')
const searchInput = document.querySelector('.search__field')
const searchResults = document.querySelector('.search-results')
const spinner = document.querySelector('.spinner')

let { bookmarksIsOpen } = state;

// Search 
searchInput.addEventListener('keydown', e => {
	// e.preventDefault()
	if(e.key !== 'Enter') return 
	handleSearch()
})

// Display selected release from search
searchResults.addEventListener('click', e => {
	if(e.target.className === "release--btn") {
		e.preventDefault()
		const releaseId = e.target.dataset.id

			fetchRelease(releaseId)
				.then(renderRelease)
				.then(() => spinner.style.display = 'none')
				.catch(e => console.error('Problem fetching release', e))
	} 
})

// Display selected release from bookmarks
bookmarksContainer.addEventListener('click', e => {
	if(e.target.className === 'bookmark--btn') {
		e.preventDefault()
		const releaseId = e.target.dataset.id

			fetchRelease(releaseId)
				.then(renderRelease)
				.then(() => spinner.style.display = 'none')
				.catch(e => console.error('Problem fetching release', e))
	} 
})

// Add or remove release from bookmarks
releaseContainer.addEventListener('click', e => {
	if(e.target.className === 'release__save--btn' && e.target.outerText === 'Save') {
		e.preventDefault()

		const releaseId = e.target.dataset.id

		fetchRelease(releaseId)
			.then(addToBookmark)
			.then(() => {
				document.querySelector('.release__save--btn').textContent = 'Remove'
			})
			.then(renderBookmarks(bookmarksIsOpen))
			.then(() => spinner.style.display = 'none')
	}
	
	if(e.target.className === 'release__save--btn' && e.target.outerText === 'Remove') {
		e.preventDefault()

		const releaseId = e.target.dataset.id

		fetchRelease(releaseId)
			.then(deleteBookmark(releaseId))
			.then(() => {
				document.querySelector('.release__save--btn').textContent = 'Save'
			})
			.then(renderBookmarks(bookmarksIsOpen))
			.then(() => spinner.style.display = 'none')
	}
})

// Open bookmarks
bookmarksButton.addEventListener('click', () => {
		bookmarksIsOpen = !bookmarksIsOpen
		renderBookmarks(bookmarksIsOpen)
})

