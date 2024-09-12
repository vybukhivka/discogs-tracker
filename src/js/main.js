import { fetchRelease, fetchSearch } from "./controller"

const releaseContainer = document.querySelector('.release');
const bookmarksContainer = document.querySelector('.bookmarks')
const bookmarksButton = document.querySelector('.nav__btn--bookmarks')
const releaseSaveButton = document.querySelector('.release__save--btn')
const searchInput = document.querySelector('.search__field')
const searchResults = document.querySelector('.search-results')

let bookmarksIsOpen = false;
let releaseInStorage = false;

const handleSearch = () => {
	const userSearchPrompt = searchInput.value;
	clearInput()

	// TODO: user input validation
	// if(isNaN(+userSearchPrompt) || userSearchPrompt === '') 
	// 	return console.error('Input value is not a number')
	
	fetchSearch(userSearchPrompt)
		.then(data => {
			const parsedData = parseSearchResults(data)
			return parsedData
		})
		.then(renderSearchResults)
} 

const parseSearchResults = searchList => {
	const list = searchList.map(item => {
		const releaseData = {
			id: item.id,
			title: item.title,
			image: item.cover_image,
			label: item.label || ''
		}
		return releaseData
	})	
	return list
}

const renderSearchResults = parsedList => {
	const markup = `
		<div class="search-block">
			<ul class="search-list">
				${parsedList.map(item => `<li class="search-item"><button class="release--btn" data-id="${item.id}">${item.title}</button></li>`).join('')}
			</ul>	
		</div>
	`
	searchResults.insertAdjacentHTML('afterbegin', markup)
}

// TODO: add image from search
// fix bug: click on empty container
// triggers render
const renderRelease = release => {
	releaseInStorage = isInStorage(release.id)
	const markup = `
		<h1 class="release__title">
			<span>${release.artist} - ${release.title}</span>
		</h1> 

		<div class="release__details">
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

const addToBookmark = (release) => {
	const releaseData = { id: release.id, artist: release.artist, title: release.title }
	localStorage.setItem(release.id, `${release.artist} - ${release.title}`)		
	return Promise.resolve(releaseData) 
}

const getBookmark = (title) => {
	const storedRelease = localStorage.getItem(storedRelease)
	if(!storedRelease) throw new Error('No such release')
	return JSON.parse(storedRelease)
}

const renderBookmarks = () => {
	// if(bookmarksIsOpen) return  
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
	bookmarksContainer.insertAdjacentHTML('afterbegin', markup)
}

// TODO: complete this function
const deleteBookmark = id => {
	localStorage.removeItem(id)
}

const clearInput = () => {
	searchInput.value = ''
}

// NOTE: Listeners

// Search 
searchInput.addEventListener('keydown', e => {
	// e.preventDefault()
	if(e.key !== 'Enter') return 
	handleSearch()
})

// Display selected release
searchResults.addEventListener('click', e => {
	if(e.target.className === "release--btn") {
		e.preventDefault()
		const releaseId = e.target.dataset.id

			fetchRelease(releaseId)
				.then(renderRelease)
				.catch(e => console.error('Problem fetching release', e))
	} 
})

bookmarksContainer.addEventListener('click', e => {
	if(e.target.className === 'bookmark--btn') {
		e.preventDefault()
		const releaseId = e.target.dataset.id

			fetchRelease(releaseId)
				.then(renderRelease)
				.catch(e => console.error('Problem fetching release', e))
	} 
})

const isInStorage = id => {
	 return (Object.keys(localStorage).includes(String(id)))
}
// isInStorage(24772565)

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
			.then(renderBookmarks)
	}
	
	if(e.target.className === 'release__save--btn' && e.target.outerText === 'Remove') {
		e.preventDefault()

		const releaseId = e.target.dataset.id

		fetchRelease(releaseId)
			.then(deleteBookmark(releaseId))
			.then(() => {
				document.querySelector('.release__save--btn').textContent = 'Save'
			})
			.then(renderBookmarks)
	}
})

bookmarksButton.addEventListener('click', renderBookmarks)

// Get release from bookmarks

