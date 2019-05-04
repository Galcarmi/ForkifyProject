import axios from 'axios';

export default class Search{
    constructor(query){
        this.query=query;
    }
    //get data from food2fork api using proxy
    async getResults(){
        const proxy='https://cors-anywhere.herokuapp.com/';
        const key='PROCESS.ENV.APIKEY';
        try{
            const res= await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result=res.data.recipes;
        }
        catch(error){
            console.log(error);
        }
    }

}