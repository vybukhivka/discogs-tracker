const releaseContainer = document.querySelector('.release');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

///////////////////////////////////////

const showRelease = async function (releaseId) {
  const searchLink = `https://api.discogs.com/releases/${releaseId}`
    try {
    // 1. Loading release
    const res = await fetch(searchLink);
    console.log(res);
    const data = await res.json();
    if (!res.ok)
      throw new Error(`Can't fetch release data :( \n ${res.status} `);

    console.log(data);
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
    console.log(release)

    // 2. Rendering release
    const markup = `
      <h1 class="release__title">
        <span>${release.artist} - ${release.title}</span>
      </h1> 

      <div class="release__details">
        <div class="release__info">
          <p class="release__info-data--price">${release.formats}: ${release.lowestPrice}$ (lowest) <span class="dim">${release.numForSale} offers</span></p>
          <p class="release__info-data--genre">${release.genre} (${release.styles})</p>
          <p class="release__info-data--format">(${release.styles})</p>
        </div>
      </div>
    `

    releaseContainer.insertAdjacentHTML('afterbegin', markup)
  } catch (error) {
    if (error instanceof TypeError) {
      console.error(`Can't fetch release data :( \n\n${error}`);
    } else {
      console.error(error.message);
    }
  }
};

showRelease(24772565);
