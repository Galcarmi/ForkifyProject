import axios from 'axios';
import {config} from '../config.js';

export default class Search{
    constructor(query){
        this.query=query;
    }
    //get data from food2fork api using proxy
    async getResults(){
        
        try{
            const res= await axios(`${config.proxy}https://www.food2fork.com/api/search?key=${config.key}&q=${this.query}`);
            this.result=res.data.recipes;
        }
        catch(error){
            console.log(error);
        }
    }

}