
// Global app controller

import Search from './models/Search.js';
import {querySelectors,renderLoader,clearLoader} from './views/base.js';
import * as searchView from './views/searchView.js';

//global state of the app

const state={

}
const controlSearch = async ()=> {
    //get query from view
    const query=searchView.getInput();//todo

    if(query){
        //search for query and add to app state
        state.search=new Search(query);
        //prepare ui for results
        searchView.clearInput(); // clear search input
        searchView.clearResults();//clear previous results
        renderLoader(querySelectors.searchRes);

        //search for recipes
        await state.search.getResults();
        //render results to ui
        clearLoader();
        searchView.renderResults(state.search.result);
        

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