
// Global app controller

import {querySelectors,renderLoader,clearLoader} from './views/base.js';
import Search from './models/Search.js';
import Recipe from './models/Recipe.js';
import List from './models/List';
import Likes from './models/Likes.js';
import * as searchView from './views/searchView.js';
import * as recipeView from './views/recipeView.js';
import * as listView from './views/listView';
import * as likesView from './views/likesView';


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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        }
        catch(error){
            console.log(error);
        }
        finally{
            clearLoader();
        }
    }


}

////////////list controller///////////

const controlList = () =>{
    //create a list if ther is none yet
    if(!state.list){
        state.list = new List();
    }

    //add each ingredient to the list
    state.recipe.ingredients.forEach(ingredient=>{
        const item=state.list.addItem(ingredient.count,ingredient.unit,ingredient.ingredient);
        listView.renderItem(item);
    })

}

//testings

state.likes= new Likes();
/////////likes controller///////
const controlLike = () =>{

    if(!state.likes){
        state.likes = new Likes();
    }

    const currentId = state.recipe.id;
    //user isnt liked the current recipe
    if(!state.likes.isLiked(currentId)){
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.image_url
        );
        likesView.toggleLikeBtn(true);

        likesView.renderLikes(newLike);
    }
    //user liked the current recipe
    else{
        state.likes.deleteLike(currentId);


        likesView.toggleLikeBtn(false);

        
        likesView.deleteLike(currentId);
    }
    //changes the visibility of likes menu if needed
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}


//add events of loading new recipe to the page by clicking a recipe on search view or load an hash id of a specific recipe
['hashchange', 'load'].forEach(event=>window.addEventListener(event,controlRecipe));









///HANDLE DELETE AND UPDATE LIST ITEM EVENTS//
querySelectors.shopping.addEventListener('click' , event=>{
    const id = event.target.closest('.shopping__item').dataset.itemid;

    if(event.target.matches('.shopping__delete , .shopping__delete *')){
        state.list.deleteItem(id);

        listView.deleteItem(id);
    }
    else if (event.target.matches('.shopping__count-value')){
        const val =parseFloat(event.target.value) ;
        state.list.updateCount(id,val);
    }
})



//handling recipe button clicks

//increase or decrease button clicked on number of servings
querySelectors.recipe.addEventListener('click', event=>{
    //* means any child of btn-decrease -- if we click on the icon
    
    if(event.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.servings>1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(event.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(event.target.matches('.recipe__btn--add , .recipe__btn--add *')){
        controlList();
    }
    else if(event.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
});

