import './styles.scss';

import NewsApiService from './js/apiService';

import photoCardTpl from '../templates/photo-card.hbs';

import getRefs from './js/getRefs';

const refs = getRefs();
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', searchImages);

let flag = false;

function searchImages(e) {
  flag = false;
  e.preventDefault();
  newsApiService.query = e.currentTarget.elements.query.value;

  if (newsApiService.query === '') {
    return alert('Enter something');
  }

    newsApiService.resetPage();
     clearImagesContainer();
    newsApiService.fetchImages().then(images => {
    appendImagesMarkup(images);
     newsApiService.incrementPage();
  });
}

function appendImagesMarkup(images) {
  refs.gallery.insertAdjacentHTML('beforeend', photoCardTpl(images));
}

function clearImagesContainer() {
  refs.gallery.innerHTML = '';
}

const onEntry = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && newsApiService.query && flag) {
            newsApiService.fetchImages().then(images => {
                appendImagesMarkup(images);
                newsApiService.incrementPage();
            });
        }
    });
  flag = true;
};


const observer = new IntersectionObserver(onEntry, {
    rootMargin: '500px',
});
observer.observe(refs.sentinel);
