import { isInStorage } from "./utils.js"
import state from "./state.js";

const searchResults = document.querySelector('.search-results')
const releaseContainer = document.querySelector('.release');
const bookmarksContainer = document.querySelector('.bookmarks')
const searchField = document.querySelector('.search')
const hideButton = document.createElement('button')
const bookmarksButton = document.querySelector('.nav__btn--bookmarks')

let { releaseInStorage } = state

export const closeSearch = () => {
		searchResults.innerHTML = ''	
		hideButton.remove()
}

export const closeBookmarks = state => {
	if(state) {
		bookmarksContainer.innerHTML = ''	
		bookmarksButton.remove()
	}
}

export const renderSearchResults = parsedList => {
		const markup = `
			<div class="search-block">
				<ul class="search-list">
				${parsedList.map(item => `<li class="search-item"><button class="release--btn" data-id="${item.id}">${item.title}</button></li>`).join('')}
				</ul>	
			</div>
		`
			
		hideButton.classList.add('hide-btn')
		hideButton.textContent = "✕"
		hideButton.addEventListener('click', closeSearch)
		searchField.append(hideButton)
		searchResults.innerHTML = ''
		searchResults.insertAdjacentHTML('afterbegin', markup)
}

export const renderRelease = release => {
	releaseInStorage = isInStorage(release.id)
	const markup = `
		<h1 class="release__title">
			<span>${release.artist} - ${release.title}</span>
		</h1> 
		<div class="release__details">
			<img src=${release?.image?.uri150} alt="${release.title}-cover" />
			<div class="release__info">
				<p class="release__info-data--price">${release.formats || 'Unknown'}: ${release.numForSale > 0 ? release.lowestPrice + '$ ' + `<span class="dim">${release.numForSale} offers</span>` : 'No one sells it right now :(' }</p>
				<p class="release__info-data--genre">Genre: ${release.genre}</p>
				<p class="release__info-data--format">Style: ${release.styles}</p>
			</div>
			<button class="release__save--btn" data-id="${release.id}">${releaseInStorage ? 'Remove' : 'Save'}</button>
		</div>
	`
	releaseContainer.innerHTML = ''
	releaseContainer.insertAdjacentHTML('afterbegin', markup)
}

export const renderBookmarks = (state) => {
	if(state) {
		let bookmakrsMarkup = '';
		bookmarksContainer.innerHTML = ''

		for (const [id, title] of Object.entries(localStorage)) {
			bookmakrsMarkup += `<li class="bookmark-item"><button class="bookmark--btn" data-id="${id}">${title}</button></li>`
		}

		const markup = `
			<div class="bookmarks-block">
				<ul class="bookmarks-list">
					${bookmakrsMarkup}
				</ul>	
			</div>
		`
		bookmarksContainer.innerHTML = ''
		bookmarksContainer.insertAdjacentHTML('afterbegin', markup)
	}

	if(!state) {
		bookmarksContainer.innerHTML = ''
	}
}

