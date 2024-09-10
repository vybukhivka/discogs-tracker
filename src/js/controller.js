const recipeContainer = document.querySelector('.release');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://api.discogs.com/releases/249504 --user-agent "FooBarApp/3.0"

///////////////////////////////////////

const showRelease = async function (releaseId) {
  try {
    const res = await fetch(`https://api.discogs.com/releases/${releaseId}`);
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
  } catch (error) {
    if (error instanceof TypeError) {
      console.error(`Can't fetch release data :( \n\n${error}`);
    } else {
      alert(error.message);
    }
  }
};

showRelease(24772565);