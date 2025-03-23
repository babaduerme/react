import axios from "axios";

export default axios.create({
    
    baseURL: "http://192.168.0.36/restGSB"
    //baseURL: "http://172.16.6.229/restGSB"
})
