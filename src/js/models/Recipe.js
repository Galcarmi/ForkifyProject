import axios from 'axios';
import {config} from '../config.js';

export default class Recipe {
    constructor(id){
        this.id=id;
    }

    async getResults(){
        try{
            const results= await axios(`${config.proxy}https://www.food2fork.com/api/get?key=${config.key}&rId=${this.id}`);
            this.title=results.data.recipe.title;
            this.publisher=results.data.recipe.publisher;
            this.image_url=results.data.recipe.image_url;
            this.source_url=results.data.recipe.source_url;
            this.ingredients=results.data.recipe.ingredients;
        }
        catch(error){
            console.log(error);
        }
    }

    calcTime(){
        this.servings=2;
    }

    calcServings(){
        this.time=5;
    }
    parseIngredients(){
        const unitsLong=['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitsShort=['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitsShort,'kg','g'];
        const newIngredients=this.ingredients.map(element=>{
            //uniform units
            let ingredient=element.toLowerCase();
            unitsLong.forEach((unit,i)=>{
                ingredient=ingredient.replace(unit,unitsShort[i]);
            })
            //remove parentheses
            ingredient=ingredient.replace(/ *\([^)]*\) */g, ' ');
            //parse ingredients into count,unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(element2=>units.includes(element2));

            let objIngredient;
            if(unitIndex>-1){
                //there is a unit
                const arrCount=arrIng.slice(0,unitIndex); //example : 4 1/2 cups arrcount=[4,1/2]
                let count;
                if (arrCount.length === 1){
                    count=eval(arrIng[0].replace('-','+')).toFixed(2);// for cases like " 4-1/2 cups "
                }else{
                    count=eval(arrIng.slice(0,unitIndex).join('+')).toFixed(2); //calculates 4+1/2 and saves it to count variable
                }
                objIngredient = {
                    count,
                    unit:arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex+1).join(' ')
                }
            }else if (parseInt(arrIng[0],10)){
                //there is not unit but 1st element is number
                objIngredient = {
                    count: 1,
                    unit: parseInt(arrIng[0],10),
                    ingredient : arrIng.slice(1).join(' ') //full ingredient name without the quantity
                }
            }else if(unitIndex === -1){
                //there is no unit and no number in first position of the ingredient
                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredient //es6 new feature
                }
            }
            return objIngredient;
        })
        this.ingredients=newIngredients;
    }

    //updating servings and ingredients count according to the new servings
    updateServings(type){

        const newServings = type ==='dec'?this.servings-1:this.servings+1;

        this.ingredients.forEach(element=>{
            element.count *= (newServings/this.servings);
        })


        this.servings=newServings;
    }
}