import Router from "next/router";

function statusCodeHandler(error){
    try{
        const statusCode = error.response.status;
       if(statusCode === 401){
            Router.push('/auth/login');
       }
        if(statusCode === 404){
            Router.push('/404');
        }
        if(statusCode === 500){
            Router.push('/shop/home');
        }

    }
    catch(error){
        console.log(error)
    }
}