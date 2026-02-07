import { useRouter } from "next/router";

function errorHandler(error){
    
    try{
        const statusCode = error.response.status;
      switch (statusCode) {
        case 401:
          window.location.href = "/auth/login";
          break;
        case 403:
            window.location.href = "/auth/login";
        default:
          console.log("Unhandled status code:", statusCode);
      }

    }
    catch(error){
        console.log(error)
    }
}

export  {errorHandler};