import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slug from 'slug'
import User from '../models/User'
import { hashPassword } from '../utils/auth'

export const createAccount = async (req: Request, res: Response) => {


        //Manejo de error validacion de datos
        let errors = validationResult(req)
        if(! errors.isEmpty()){
            res.status(400).json({errors: errors.array()})
            return
        }


        
        const {email, password} = req.body
        const userExist = await User.findOne({email})
        if (userExist){
            const error = new Error('El correo ingresado ya se encuentra registrado')
            res.status(409).json({error : error.message}) 
            return  
        } 
        
        const handle = slug(req.body.handle, '')

        const handleExist = await User.findOne({handle})
        if (handleExist){
            const error = new Error('El nombre de usuario no esta disponible')
            res.status(409).json({error : error.message})
            return
        } 
            
        const user = new User(req.body)
        user.password = await hashPassword(password)
        user.handle = handle
        
        await user.save()
        res.status(201).send('Usuario creado correctamente')

}
