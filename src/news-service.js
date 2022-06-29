const axios = require('axios');

export default class NewsApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchArticles() {
        return await (`https://pixabay.com/api/?key=28319602-4eb5fc2c807c8422daa970660&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)
            .then(response => response.json)
            .then(data => {
                this.page += 1;
                return data;
            });
    }

    resetPage() {
        this.page = 1;
    };

get query() {
    return this.searchQuery;
    };

set query(newQuery) {
    this.searchQuery = newQuery;
    };

};