import jwt from 'jsonwebtoken'
import Company from '../models/Company.js'

export const protectCompany = async (req, res, next)=>{
    const token = req.headers.token;
    if(!token) return res.status(401).json({success: false, message: "Unauthorized!"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.company = await Company.findById(decoded.id).select('-password')

        next();

    } catch (error) {
        res.status(400).json({success: false, message: "Error in verifying company", error});
    }
}