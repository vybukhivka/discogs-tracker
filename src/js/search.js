import { fetchSearch } from './controller';
import { renderSearchResults } from './render'
import { clearInput } from './utils';
import state from './state'

const searchInput = document.querySelector('.search__field')
const spinner = document.querySelector('.spinner')

let { searchIsOpen } = state

export const handleSearch = () => {
	const userSearchPrompt = searchInput.value;
	clearInput()

	fetchSearch(userSearchPrompt)
		.then(data => {
			const parsedData = parseSearchResults(data)
			return parsedData
		})
		.then(renderSearchResults)
		.then(() => spinner.style.display = 'none')
		.then(() => {
			searchIsOpen = true
		})
} 

export const parseSearchResults = searchList => {
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

