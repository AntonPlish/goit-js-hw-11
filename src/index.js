const axios = require('axios').default;
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import NewsApiService from './news-service'

const refs = {
    searchForm: document.querySelector('.search-form'),
    articlesContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};
const newsApiService = new NewsApiService();
refs.loadMoreBtn.style.visibility = 'hidden';
let lightbox = new SimpleLightbox('.gallery a', { /* options */ });

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
    e.preventDefault();
    clearArticlesContainer();
    refs.loadMoreBtn.style.visibility = 'hidden';
    newsApiService.query = e.currentTarget.elements.searchQuery.value;
    newsApiService.resetPage();
    newsApiService.fetchArticles().then(data => {
        if (data.total === 0) {
            Notiflix.Notify.failure(`<h2>Sorry, there are no images matching your search query. Please try again.</h2>`)
        } else {
            Notiflix.Notify.success(`<h2>Hooray! We found ${data.totalHits} images.</h2>`)
            buildCards(data.hits);
            refs.loadMoreBtn.style.visibility = 'visible';
        }
    });
};

function onLoadMore() {
    newsApiService.fetchArticles().then(data => {
        buildCards(data.hits);
        if (data.totalHits > 0 && data.hits.length === 0) {
            Notiflix.Notify.failure(`<h2>We're sorry, but you've reached the end of search results.</h2>`)
            refs.loadMoreBtn.style.visibility = 'hidden';
        };
    });
};

async function buildCards(hits) {
    const markup = await hits.map((element) => {
        return `
        <div class="photo-card">
        <a class="gallery__item" href="${element.largeImageURL}">
        <img class="gallery__image" width="300" height="200" src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
        </a>
        <div class="info">
        <p class="info-item">
        <b>Likes ${element.likes}</b>
        </p>
        <p class="info-item">
        <b>Views ${element.views}</b>
        </p>
        <p class="info-item">
        <b>Comments ${element.comments}</b>
        </p>
        <p class="info-item">
        <b>Downloads ${element.downloads}</b>
        </p>
        </div>
        </div>`})
        .join();
    refs.articlesContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();

    const cardHeight = await document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
        
    window.scrollBy({
        top: cardHeight.height * 2,
        behavior: "smooth",
    });

    const extraElement = await refs.articlesContainer.childNodes;
    for (let i = 0; i < extraElement.length; i += 1) {
        if (extraElement[i].nodeName === '#text') {
            extraElement[i].remove();
        };
    };
}

function clearArticlesContainer() {
    refs.articlesContainer.innerHTML = '';
};