import"./assets/modulepreload-polyfill-3cfb730f.js";import{S as E,i as d,a as b}from"./assets/vendor-b0d10f48.js";const v="45072891-a2b62f681812c134104bf6075",w="https://pixabay.com/api/",r=40;let s=1,u="",m=0,l=!1;function h(){const e=document.querySelector(".loading");e&&(e.style.display="flex")}function p(){const e=document.querySelector(".loading");e&&(e.style.display="none")}function f(){const e=document.querySelector(".load-more-button");e&&(e.style.display="block")}function i(){const e=document.querySelector(".load-more-button");e&&(e.style.display="none")}function g(){d.info({title:"End of Results",message:"We're sorry, but you've reached the end of search results.",position:"topRight"})}async function y(e,n=1){try{const t=await b.get(w,{params:{key:v,q:e,image_type:"photo",orientation:"horizontal",safesearch:"true",page:n,per_page:r}}),{hits:o,totalHits:a}=t.data;return m=a,o.length===0?(d.error({title:"No results",message:"Sorry, there are no images matching your search query. Please try again!",position:"topRight"}),[]):o}catch(t){return d.error({title:"Error",message:"An error occurred while downloading the images. Try again!",position:"topRight"}),console.error("Błąd pobierania danych:",t),[]}}function L(e){const n=document.getElementById("gallery");n&&(e.forEach(t=>{const o=document.createElement("a");o.href=t.largeImageURL,o.classList.add("gallery-item");const a=document.createElement("img");a.src=t.webformatURL,a.alt=t.tags,a.classList.add("gallery-image");const c=document.createElement("div");c.classList.add("image-info"),c.innerHTML=`
      <div>
        <span class="label">Likes:</span>
        <span>${t.likes}</span>
      </div>
      <div>
        <span class="label">Views:</span>
        <span>${t.views}</span>
      </div>
      <div>
        <span class="label">Comments:</span>
        <span>${t.comments}</span>
      </div>
      <div>
        <span class="label">Downloads:</span>
        <span>${t.downloads}</span>
      </div>
    `,o.appendChild(a),o.appendChild(c),n.appendChild(o)}),I.refresh(),console.log("shouldScrollOnLoadMore:",l),l&&setTimeout(S,100))}const I=new E(".gallery-item",{captionsData:"alt",captionDelay:250});function S(){const e=document.querySelectorAll(".gallery-item");if(e.length>0){const o=e[e.length-1].getBoundingClientRect().height;window.scrollBy({top:2*o,behavior:"smooth"})}}async function B(e){e.preventDefault();const n=document.getElementById("search-input").value.trim();if(!n)return;u=n,s=1,h(),i();const t=await y(u,s),o=document.getElementById("gallery");o.innerHTML="",L(t),p(),l=!1,t.length===r?f():(i(),g())}async function M(){s+=1,h();const e=await y(u,s);s*r>=m?(i(),g()):(l=!0,L(e),p(),(s-1)*r+e.length<m?f():(i(),g()))}document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("search-form");e?e.addEventListener("submit",B):console.error("Element #search-form not found");const n=document.querySelector(".load-more-button");n?n.addEventListener("click",M):console.error("Element .load-more-button not found")});
//# sourceMappingURL=commonHelpers2.js.map
