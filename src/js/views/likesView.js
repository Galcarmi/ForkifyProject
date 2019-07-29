import {querySelectors} from './base';
import {limitRecipeTitle} from './searchView';

export const toggleLikeBtn = isLiked => {
    ///icons.svg#icon-heart-outlined
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`)
}

export const toggleLikeMenu = numLikes =>{
    querySelectors.likesMenu.style.visibility = numLikes>0 ? 'visible' : 'hidden';
}

export const renderLikes = like=>{
    const markup = `
         <li>
            <a class="likes__link" href="#${like.id}">
               <figure class="likes__fig">
                   <img src="${like.img}" alt="${like.title}">
               </figure>
               <div class="likes__data">
                   <h4 class="likes__name">${limitRecipeTitle(like.title)} ...</h4>
                   <p class="likes__author">${like.author}</p>
               </div>
            </a>
        </li>
    `;

    querySelectors.likesList.insertAdjacentHTML('beforeend',markup);
}

export const deleteLike = id =>{
    const element = document.querySelector(`.likes__link[href*="${id}"]`);
    if(element){
        element.parentElement.removeChild(element);
    }
}