import axios from "axios";
import { baseUrl } from "./Constants";

const axiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 20000,
    headers: {
        Authorization: localStorage.getItem("access_token") ?
        'JWT ' + localStorage.getItem("access_token")
        : null,
        "Content-Type": 'application/json',
        Accept: 'application/json'
    }
})


axiosInstance.interceptors.request.use(config => {

    let isAuthenticated = localStorage.getItem("access_token") ? true : false

        if (!config.headers['Authorization'] && isAuthenticated) {
            
            const token = localStorage.getItem("access_token");
            if (token) {
            config.headers.Authorization = "JWT " + token;
            }
            
        }
    return config;
},
(error) => {
    return Promise.reject(error);    
})

function NotifySessionExpired(){
    alert(
                    'A server/network error occurred. ' +
                        'Looks like CORS might be the problem. ' +
                        'Sorry about this - we will get it fixed shortly.'
                );
}

axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async function (error) {
            const originalRequest = error.config;
    
            if (typeof error.response === 'undefined') {
                alert(
                    'A server/network error occurred. ' +
                        'Looks like CORS might be the problem. ' +
                        'Sorry about this - we will get it fixed shortly.'
                );
                return Promise.reject(error);
            }
    
            if (
                error.response.status === 401 &&
                originalRequest.url === baseUrl + 'token/refresh/'
            ) {
                localStorage.clear()
                window.location.reload()
                NotifySessionExpired()
            }    
            if (
                error.response.data.code === 'token_not_valid' &&
                error.response.status === 401 &&
                error.response.data.messages[0].token_class === 'AccessToken'
            ) {
                const refreshToken = localStorage.getItem("refresh_token");
    
                if (refreshToken) {

                    return axiosInstance
                        .post('user/token/refresh/', { refresh: refreshToken })
                        .then((response) => {         
                            localStorage.setItem('access_token', response.data.access);
                            localStorage.setItem('refresh_token', response.data.refresh);

                            axiosInstance.defaults.headers['Authorization'] =
                                'JWT ' + response.data.access;
                            originalRequest.headers['Authorization'] =
                                'JWT ' + response.data.access;

                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => {  
                            console.log(err)
                            localStorage.clear()
                            window.location.reload()
                            NotifySessionExpired()
                        });

                       
                    
                } else {
                    localStorage.clear()
                    window.location.reload()
                    NotifySessionExpired()
                }
            }
    
            // specific error handling done elsewhere
            return Promise.reject(error);
        }
    );

export default axiosInstance