
// Global app controller

import Search from './models/Search.js';
import {querySelectors,renderLoader,clearLoader} from './views/base.js';
import Recipe from './models/Recipe.js';
import * as searchView from './views/searchView.js';
import * as recipeView from './views/recipeView.js';

//global state of the app

const state={

}

/////////////////////SEARCH CONTROLLER//////////////////////////
const controlSearch = async ()=> {
    //get query from view
    const query=searchView.getInput();

    if(query){
        //search for query and add to app state
        state.search=new Search(query);
        //prepare ui for results
        searchView.clearInput(); // clear search input
        searchView.clearResults();//clear previous results
        renderLoader(querySelectors.searchRes);
        try{
            //search for recipes
            await state.search.getResults();
            //render results to ui
            clearLoader();
            searchView.renderResults(state.search.result);
        }
        catch(error){
            console.log(error);
            clearLoader();
        }
    }
}

querySelectors.searchForm.addEventListener('submit',event=>{
    event.preventDefault();//eliminates auto realod of the page
    controlSearch();
})

querySelectors.pagination.addEventListener('click',event=>{
    const button=event.target.closest('.btn-inline');
    if (button){
        const goToPage=parseInt(button.dataset.goto,10);
        searchView.clearResults();//clear previous results
        searchView.renderResults(state.search.result,goToPage);//rendering results of the next/previous page
    }
})

/////////////////////RECIPE CONTROLLER//////////////////////////

const controlRecipe=async ()=>{

    //get recipe id from the url
    const id=window.location.hash.replace('#','');

    if(id){
        recipeView.clearRecipe();
        //prepare ui for changes
        renderLoader(querySelectors.recipe);
        //highlight selected recipe
        if(state.search){
            searchView.highlightSelected(id);
        }
        //create new recipe object
        state.recipe=new Recipe(id);
        try{
            //get recipe data and parse ingredients
            await state.recipe.getResults();
            state.recipe.parseIngredients();

            //calculate time and servings
            state.recipe.calcServings();
            state.recipe.calcTime();

            //render results
            recipeView.renderRecipe(state.recipe);
        }
        catch(error){
            console.log(error);
        }
        finally{
            clearLoader();
        }
    }


}

//choosing a recipt to render events
['hashchange', 'load'].forEach(event=>window.addEventListener(event,controlRecipe));

//handling recipe button clicks

//increase or decrease button clicked on number of servings
querySelectors.recipe.addEventListener('click', event=>{
    //* means any child of btn-decrease -- if we click on the icon
    
    if(event.target.matches('.btn-decrease, btn-decrease *')){
        if(state.recipe.servings>1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(event.target.matches('.btn-increase, btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
});

