import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slugify from 'slugify'
import User from '../models/User'
import { hashPassword } from '../utils/auth'

export const createAccount = async (req: Request, res: Response) => {
        //Manejo de error validacion de datos
        let errors = validationResult(req)
        if(! errors.isEmpty()){
            res.status(400).json({errors: errors.array()})
            return
        }
        
        //Manejo de error si el usuario ya existe
        const {email, password, handle} = req.body
        const userExist = await User.findOne({email})
        if (userExist){
            const error = new Error('El correo ingresado ya se encuentra registrado')
            res.status(409).json({error : error.message}) 
            return  
        } 
        
        //Manejo de error si el nombre de usuario ya existe
        const handleSlug = slugify(handle)
        const handleExist = await User.findOne({handle: handleSlug})
        console.log(handleExist)
        if (handleExist){
            const error = new Error('El nombre de usuario no esta disponible')
            res.status(409).json({error : error.message})
            return
        } 
        
        console.log('Sigue la ejecucion 1')

        const user = new User(req.body)
        user.password = await hashPassword(password)
        user.handle = handleSlug
        
        console.log('Sigue la ejecucion 2')

        await user.save()
        res.status(201).send('Usuario creado correctamente')

}
