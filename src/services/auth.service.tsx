import axios from 'axios'

export const login =async (userData:Object,setCredentialError:any) => {
    axios.post('http://localhost:5000/account/login', userData)
    .then(response => {
        if(response.status===200){
            localStorage.setItem('token',response.data.token);
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
}

export const register = async (userData:Object,setUsernameError:any)=>{
    axios.post('http://localhost:5000/account/register', userData)
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
  };
export const getCurrentUser = () =>{
    return localStorage.getItem('token');
};