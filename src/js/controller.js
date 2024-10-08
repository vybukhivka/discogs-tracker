import keys from "./keys";

const spinner = document.querySelector('.spinner')

const {consumer, secret} = keys

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// loading spinner for fetch and render
export const fetchSearch = async function (query) {
	spinner.style.display = 'block'
  try {
    const res = await Promise.race([
		fetch(`https://api.discogs.com/database/search?artist=${encodeURIComponent(query)}&key=${consumer}&secret=${secret}`),
		timeout(10)
		])

    const data = await res.json();

    if (!res.ok)
      throw new Error(`Can't fetch release data :( ${res.status} `);

    const releaseList = data.results.slice(1)
			.filter(item => item.type = "release")

		return releaseList
  } catch (error) {
    if (error instanceof TypeError) {
      console.error(`Can't fetch release data :( ${error}`);
    } else {
      console.error(error.message);
    }
  }
};

export const fetchRelease = async function (releaseId) {
	// releaseContainer.innerHTML = 'Loading...'
	spinner.style.display = 'block'
  try {
    const res = await Promise.race([
			fetch(`https://api.discogs.com/releases/${releaseId}?key=${consumer}&secret=${secret}`),
			timeout(10)
		])

    const data = await res.json();

		console.log(data)
    if (!res.ok)
      throw new Error(`Can't fetch release data :( ${res.status} `);

   	let {release} = data 
    release = {
      id: data.id,
      artist: data.artists_sort,
      year: data.year,
      title: data.title,
      formats: data.formats[0]?.name,
      genre: data.genres[0],
      styles: data.styles.join(', '),
      label: data.labels[0]?.name,
      image: data.images[0],
      ratingCount: data.community?.rating?.count,
      ratingAvg: data.community?.rating?.average,
      lowestPrice: data?.lowest_price,
      numForSale: data?.num_for_sale,
    }

		return release
  } catch (error) {
    if (error instanceof TypeError) {
      console.error(`Can't fetch release data :( ${error}`);
    } else {
      console.error(error.message);
    }
  }
};
