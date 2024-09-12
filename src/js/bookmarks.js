export const addToBookmark = (release) => {
	const releaseData = { id: release.id, artist: release.artist, title: release.title }
	localStorage.setItem(release.id, `${release.artist} - ${release.title}`)		
	return Promise.resolve(releaseData) 
}

// TODO: complete this function
export const deleteBookmark = id => {
	localStorage.removeItem(id)
}

