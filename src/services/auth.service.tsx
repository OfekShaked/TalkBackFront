import axios from 'axios'
import config from '../configs/config';

export const login =async (userData:any,setCredentialError:any):Promise<Boolean> => {
    axios.post(`${config.apiUrl}/account/login`, userData)
    .then(response => {
        if(response.status===200){
            localStorage.setItem('token',response.data.token);
            localStorage.setItem('username',userData.username);
            return true;
        }else{
             setCredentialError(response.data.message);
             return false;
        }
    })
    .catch(error => {
         setCredentialError('There was an error! please try again!');
         return false;
    });
    return false;
}

export const register = async (userData:Object,setUsernameError:any)=>{
    axios.post(`${config.apiUrl}/account/register`, userData)
            .then(response => {
                if(response.status===200){
                    return true;
                }else{
                    setUsernameError(response.data);
                    return false;
                }
            })
            .catch(error => {
                setUsernameError('There was an error! please try again!');
                return false;
            });
};
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };
export const getCurrentUser = () =>{
    return localStorage.getItem('username');
};

export const isAuthorized = async():Promise<Boolean> =>{
    try{
        const dataToSend = {
            authorization:localStorage.getItem('token')
        }
    const response = await axios.post(`${config.apiUrl}/account/isconnected`, dataToSend)
        if(response.status===200){
            localStorage.setItem('token',response.data.token);
            localStorage.setItem('username',response.data.username);
            return true;
        }else{
             logout();
             return false;
        }
    }catch(error) {
         return false;
    };
}