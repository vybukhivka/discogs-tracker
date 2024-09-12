const searchInput = document.querySelector('.search__field')

export const isInStorage = id => {
	 return (Object.keys(localStorage).includes(String(id)))
}

export const clearInput = () => {
	searchInput.value = ''
}
