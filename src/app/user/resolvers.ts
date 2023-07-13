 import axios from "axios";
import { prismaClient } from "../../client/db";
import JWTSERVICE from "../../services/jwt";
 
 interface oAuthToken{
    iss?:string,
    nbf?:string,
    sub?:string,
    email:string,
    email_verfified:string,
    azp?:string,
    name?:string,
    picture:string,
    given_name:string,
    family_name?:string,
    iat?:string,
    exp?:string
 }


 const queries ={
    verifyGoogleToken:async(parent:any,{token}:{token:string})=>{
        const googleToken=token;
        const googleUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleUrl.searchParams.set("id_token",googleToken);

        const {data} =await axios.get<oAuthToken>(googleUrl.toString(),{
            responseType:"json"
        })

        const user = await prismaClient.user.findUnique({where:{email:data.email}});
        if(!user)
        {
           await prismaClient.user.create({
            data:{
                email:data.email,
                firstName:data.given_name,
                lastName:data.family_name,
                profileImageUrl:data.picture
            }
           })
        }

        const userInDb  = await prismaClient.user.findUnique({where:{
            email:data.email
        }})

        if(!userInDb) throw new Error("User with this email not found");

        const userToken = JWTSERVICE.generateJwtToken(userInDb);

        return userToken
    }
}


export const resolvers = {queries};