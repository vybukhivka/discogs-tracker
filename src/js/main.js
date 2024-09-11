import { fetchRelease, fetchSearch } from "./controller"

const releaseContainer = document.querySelector('.release');
const searchButton = document.querySelector('.search__btn')
const searchInput = document.querySelector('.search__field')
const searchResults = document.querySelector('.search-results')
const releaseButton = document.querySelector('.release--btn')

const handleSearch = () => {
	const userSearchPrompt = searchInput.value;
	clearInput()

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
	releaseContainer.innerHTML = ''
	searchResults.insertAdjacentHTML('afterbegin', markup)
}

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
		</div>
	`
	releaseContainer.innerHTML = ''
	releaseContainer.insertAdjacentHTML('afterbegin', markup)
}

const clearInput = () => {
	searchInput.value = ''
}

searchButton.addEventListener('click', e => {
	e.preventDefault()
	handleSearch()
})

// TODO: Event delegation <<<
searchResults.addEventListener('click', e => {
	e.preventDefault()

	const releaseId = e.target.dataset.id

	fetchRelease(releaseId)
		.then(renderRelease)
		.catch(e => console.error('Problem fetching release', e))
})

