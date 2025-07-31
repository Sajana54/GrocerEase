
import jwt from 'jsonwebtoken';

const authUser = async(req, res, next) => { 
    const {token} = req.cookies;
    if (!token) {
        return res.json({success: false, message: 'Unauthorized'});
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecode.id){
            // Set userId on req object, not req.body
            req.userId = tokenDecode.id;
        }
        else {
            return res.json({ success: false, message: 'not authorized'});
        }
        next();
    } catch (error) {
        res.json({success: false, message: error.message });
    }
}

export default authUser;


