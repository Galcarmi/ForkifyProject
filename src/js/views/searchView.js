import {querySelectors} from './base.js';
//get input from search block
export const getInput=()=> querySelectors.searchInput.value;
//clear current search input on page
export const clearInput = () => {
    querySelectors.searchInput.value='';
}
//clear current results and button on page
export const clearResults = () =>{
    querySelectors.searchResultList.innerHTML='';
    querySelectors.pagination.innerHTML='';
}

export const highlightSelected = id=>{

    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(element=>{
        element.classList.remove('results__link--active');
    })
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}

//limiting too long recipe titles
const limitRecipeTitle = (title,limit=17) => {
    const newTitle = [];
    if(title.length>limit){
        title.split(' ').reduce((acc,curr) =>{
            if(acc + curr.length <= limit ){
                newTitle.push(curr);
            }
            return acc + curr.length;
        } , 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

//creating html for the desirable recipe and inserting it to our web page
const renderRecipe = recipe=> {
    const markup = `
                <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
    `;
    querySelectors.searchResultList.insertAdjacentHTML('beforeend',markup);
}


//returns html code for the desirable button
const createButton = (page,type)=>`
    <button class="btn-inline results__btn--${type}" data-goto=${type==="prev"?page-1:page+1}>
    <svg class="search__icon">
        <use href="img/icons.svg#${type==="prev"?"icon-triangle-left":"icon-triangle-right"}"></use>
    </svg>
    <span>${type==="prev"?page-1:page+1}</span>
    </button>
    
`
//render previous/next buttons of the current page
const renderButtons=(page,numOfResults,resPerPage)=>{
    const pages=Math.ceil(numOfResults/resPerPage);
    let button;
    if(page===1 && pages>1){
        button=createButton(page,'next');
    }
    else if(page<pages){
        button=`
        ${createButton(page,'prev')}
        ${createButton(page,'next')}
        `;
    }
    else if(page===pages && pages>1){
        button=createButton(page,'prev');
    }

    querySelectors.pagination.insertAdjacentHTML('afterbegin',button);
}

export const renderResults=(recipes,page=1,resPerPage=10)=>{
    //render results of the current page
    const start=(page-1)*resPerPage;
    const end=page*resPerPage;
    recipes.slice(start,end).forEach(renderRecipe);
    //render pagination buttons
    renderButtons(page,recipes.length,resPerPage);
}

