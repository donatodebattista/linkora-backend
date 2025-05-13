import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slugify from 'slugify'
import User from '../models/User'
import { hashPassword, checkpassword } from '../utils/auth'


export const createAccount = async (req: Request, res: Response) => {
        
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
        if (handleExist){
            const error = new Error('El nombre de usuario no esta disponible')
            res.status(409).json({error : error.message})
            return
        } 
        
        const user = new User(req.body)
        user.password = await hashPassword(password)
        user.handle = handleSlug
        
        await user.save()
        res.status(201).send('Usuario creado correctamente')

}


export const login = async (req: Request, res: Response) => {

    //Revisar si el usuario existe
    const {email, password} = req.body
    const user = await User.findOne({email})
    if (!user){
        const error = new Error('El correo ingresado no se encuentra registrado')
        res.status(404).json({error : error.message})
        return
    }

    //Revisar si la contraseña es correcta
    const match = await checkpassword(password, user.password)
    if(!match){
        const error = new Error('La contraseña es incorrecta')
        res.status(401).json({error : error.message})
        return
    }

    res.send('Autenticado...')
}
