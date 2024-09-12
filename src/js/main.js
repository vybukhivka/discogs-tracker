import { fetchRelease, fetchSearch } from "./controller"

const releaseContainer = document.querySelector('.release');
const searchButton = document.querySelector('.search__btn')
const searchInput = document.querySelector('.search__field')
const searchResults = document.querySelector('.search-results')
const bookmarksButton = document.querySelector('.nav__btn--bookmarks')

let bookmarksIsOpen = false;

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
const renderRelease = release => {
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
			<button class="release__save--btn" data-id="${release.id}">Save</button>
		</div>
	`
	releaseContainer.innerHTML = ''
	releaseContainer.insertAdjacentHTML('afterbegin', markup)
}

const addToBookmark = (release) => {
	const releaseData = { id: release.id, artist: release.artist, title: release.title }
	localStorage.setItem(`${release.artist} - ${release.title}`, release.id)		
}

const getBookmark = (title) => {
	const storedRelease = localStorage.getItem(storedRelease)
	if(!storedRelease) throw new Error('No such release')
	return JSON.parse(storedRelease)
}

const renderBookmarks = () => {
	// if(bookmarksIsOpen) return  
	let bookmakrsMarkup = '';

	for (const [title, id] of Object.entries(localStorage)) {
		bookmakrsMarkup += `<li class="bookmark-item"><button class="bookmark--btn" data-id="${id}">${title}</button></li>`
	}

	const markup = `
		<div class="bookmarks-block">
			<ul class="bookmarks-list">
				${bookmakrsMarkup}
			</ul>	
		</div>
	`
	searchResults.insertAdjacentHTML('afterbegin', markup)
}



// TODO: complete this function
const deleteBookmark = (title) => {}

const clearInput = () => {
	searchInput.value = ''
}

// NOTE: Listeners

// Search 
searchButton.addEventListener('click', e => {
	e.preventDefault()
	handleSearch()
})

// Display selected release
searchResults.addEventListener('click', e => {
	e.preventDefault()

	const releaseId = e.target.dataset.id

	fetchRelease(releaseId)
		.then(renderRelease)
		.catch(e => console.error('Problem fetching release', e))
})

// Save release to bookmarks
releaseContainer.addEventListener('click', e => {
	e.preventDefault()

	const releaseId = e.target.dataset.id
	console.log('button clicked', e.target.className === 'release__save--btn')

	if(e.target.className === 'release__save--btn') {
		console.log(releaseId)
		fetchRelease(releaseId)
			.then(addToBookmark)
	}
})

bookmarksButton.addEventListener('click', renderBookmarks)

// Get release from bookmarks

