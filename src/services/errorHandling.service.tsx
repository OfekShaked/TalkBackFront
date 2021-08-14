import axios from 'axios'
import config from '../configs/config';

export const handleError = async(error:any) =>{
    try{
        await axios.post(`${config.apiUrl}/errors/add`, {error:error.stack})
    }catch(err){
        console.log(error.stack);
        console.log(err);
    }
}