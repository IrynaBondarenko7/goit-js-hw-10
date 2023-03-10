import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  text: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.text.addEventListener(
  'input',
  debounce(e => {
    const countryName = refs.text.value;
    console.log(countryName);
    const emptyInput = countryName.trim();
    clean();
    if (emptyInput !== '') {
      fetchCountries(countryName).then(data => {
        //робимо перевірку скільки країн повернув нам бекенд
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length >= 2 && data.length <= 10) {
          data.map(dataEl => renderShortPreView(dataEl));
          refs.list.classList.remove('is-hidden');
        } else if (data.length === 1) {
          data.map(dataEl => renderCountry(dataEl));
          refs.list.classList.add('is-hidden');
        } else if (data.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

//якщо співпадіння з 1 країною рендеремо дану розмітку
function renderCountry({ name, flags, capital, population, languages }) {
  const countries = `<div class="country-wrap">
          <image src="${flags.svg}" alt="${name.official}" width="40" height="30" />
        <p class="country-text">${name.official}</p>
      </div>
      <p class="country-description"><b>Capital:</b>${capital}</p>
      <p class="country-description"><b>Population:</b>${population}</p>
      <p class="country-description"><b>Languages:</b>${languages.sqi}</p>`;

  refs.info.insertAdjacentHTML('beforeend', countries);
}

//якщо співпадіння з багатьма країнами рендеремо дану розмітку
function renderShortPreView({ name, flags }) {
  const countries = `<li class="list-item">
          <image src="${flags.svg}"  alt="${name.official}" width="30" height="20" />
        <p class="preview-text">${name.official}</p>
      </li>`;

  refs.list.insertAdjacentHTML('beforeend', countries);
}

function clean() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}
