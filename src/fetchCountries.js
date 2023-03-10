const URL = 'https://restcountries.com/v3.1/name/';

export const fetchCountries = name =>
  fetch(`${URL}${name}?fields=name,capital,population,flags,languages`)
    .then(res => {
      if (!res.ok) {
        if (res.status === 404) {
          return [];
        }
        throw new Error(res.status);
      }
      return res.json();
    })
    .catch(error => {
      console.error(error);
    });
