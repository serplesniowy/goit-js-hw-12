import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '45072891-a2b62f681812c134104bf6075';
const API_URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;
let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
let shouldScrollOnLoadMore = false;

function showLoader() {
  const loader = document.querySelector('.loading');
  if (loader) {
    loader.style.display = 'flex';
  }
}

function hideLoader() {
  const loader = document.querySelector('.loading');
  if (loader) {
    loader.style.display = 'none';
  }
}

function showLoadMoreButton() {
  const loadMoreButton = document.querySelector('.load-more-button');
  if (loadMoreButton) {
    loadMoreButton.style.display = 'block';
  }
}

function hideLoadMoreButton() {
  const loadMoreButton = document.querySelector('.load-more-button');
  if (loadMoreButton) {
    loadMoreButton.style.display = 'none';
  }
}

function showEndOfResultsMessage() {
  iziToast.info({
    title: 'End of Results',
    message: "We're sorry, but you've reached the end of search results.",
    position: 'topRight',
  });
}

async function fetchImages(query, page = 1) {
  try {
    const response = await axios.get(API_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: page,
        per_page: PER_PAGE,
      },
    });

    const { hits, totalHits: total } = response.data;
    totalHits = total;

    if (hits.length === 0) {
      iziToast.error({
        title: 'No results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return [];
    }

    return hits;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'An error occurred while downloading the images. Try again!',
      position: 'topRight',
    });
    console.error('Błąd pobierania danych:', error);
    return [];
  }
}

function renderImages(images) {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  images.forEach(image => {
    const imgElement = document.createElement('a');
    imgElement.href = image.largeImageURL;
    imgElement.classList.add('gallery-item');

    const imageTag = document.createElement('img');
    imageTag.src = image.webformatURL;
    imageTag.alt = image.tags;
    imageTag.classList.add('gallery-image');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('image-info');
    infoDiv.innerHTML = `
      <div>
        <span class="label">Likes:</span>
        <span>${image.likes}</span>
      </div>
      <div>
        <span class="label">Views:</span>
        <span>${image.views}</span>
      </div>
      <div>
        <span class="label">Comments:</span>
        <span>${image.comments}</span>
      </div>
      <div>
        <span class="label">Downloads:</span>
        <span>${image.downloads}</span>
      </div>
    `;

    imgElement.appendChild(imageTag);
    imgElement.appendChild(infoDiv);
    gallery.appendChild(imgElement);
  });

  lightbox.refresh();
  console.log('shouldScrollOnLoadMore:', shouldScrollOnLoadMore); 
  if (shouldScrollOnLoadMore) {
    setTimeout(smoothScrollToNewImages, 100);
  }
}

const lightbox = new SimpleLightbox('.gallery-item', {
  captionsData: 'alt',
  captionDelay: 250,
});

function smoothScrollToNewImages() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
      const lastItem = galleryItems[galleryItems.length - 1];
      const rect = lastItem.getBoundingClientRect();
      const itemHeight = rect.height;
  
      window.scrollBy({
        top: 2 * itemHeight,
        behavior: 'smooth',
      });
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
  
    const query = document.getElementById('search-input').value.trim();
    if (!query) return;
  
    currentQuery = query;
    currentPage = 1;
  
    showLoader();
    hideLoadMoreButton();
    const images = await fetchImages(currentQuery, currentPage);
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    renderImages(images);
    hideLoader();
  
    shouldScrollOnLoadMore = false;
  
    if (images.length === PER_PAGE) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      showEndOfResultsMessage();
    }
  }

async function handleLoadMore() {
    currentPage += 1;
  
    showLoader();
    const images = await fetchImages(currentQuery, currentPage);
  
    if (currentPage * PER_PAGE >= totalHits) {
      hideLoadMoreButton();
      showEndOfResultsMessage();
    } else {
      
      shouldScrollOnLoadMore = true;
      
      renderImages(images);
      hideLoader();
  
      if ((currentPage - 1) * PER_PAGE + images.length < totalHits) {
        showLoadMoreButton();
      } else {
        hideLoadMoreButton();
        showEndOfResultsMessage();
      }
    }
  }

document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', handleSearch);
  } else {
    console.error('Element #search-form not found');
  }

  const loadMoreButton = document.querySelector('.load-more-button');
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', handleLoadMore);
  } else {
    console.error('Element .load-more-button not found');
  }
});
