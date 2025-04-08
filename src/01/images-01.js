import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const API_KEY = '45072891-a2b62f681812c134104bf6075';
const API_URL = 'https://pixabay.com/api/';


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


async function fetchImages(query) {
    try {
        const response = await axios.get(API_URL, {
            params: {
                key: API_KEY,
                q: query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: 'true'
            }
        });

        const { hits } = response.data;

        if (hits.length === 0) {
            iziToast.error({
                title: 'No results',
                message: 'Sorry, there are no images matching your search query. Please try again!',
                position: 'topRight'
            });
            return [];
        }

        return hits;
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: 'An error occurred while downloading the images. Try again!',
            position: 'topRight'
        });
        console.error('Błąd pobierania danych:', error);
        return [];
    }
}


function renderImages(images) {
    const gallery = document.getElementById('gallery');
    if (!gallery) return; 

    gallery.innerHTML = ''; 

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
}


const lightbox = new SimpleLightbox('.gallery-item', {
    captionsData: 'alt',
    captionDelay: 250,
});


async function handleSearch(event) {
    event.preventDefault();

    const query = document.getElementById('search-input').value.trim();
    if (!query) return;

    showLoader();
    const images = await fetchImages(query);
    renderImages(images);
    hideLoader();
}


document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    } else {
        console.error('Element #search-form not found');
    }
});
