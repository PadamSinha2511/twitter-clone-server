import  JWT  from "jsonwebtoken"
import {User} from "@prisma/client"

const JWT_SECRET = "lksndflkndfjpodsfpsdf"

class JWTSERVICE{
    public static async generateJwtToken(user:User){
        const payload={
            id:user?.id,
            email:user?.email
        }

        const token =JWT.sign(payload,JWT_SECRET);
        return token
    }
}

export default JWTSERVICE