export const isInStorage = id => {
	 return (Object.keys(localStorage).includes(String(id)))
}
