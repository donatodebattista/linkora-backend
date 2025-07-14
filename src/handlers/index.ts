import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slugify from 'slugify'
import type { IUser } from '../models/User'

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }}}

import User from '../models/User'
import { hashPassword, checkpassword } from '../utils/auth'
import { generateJWT } from '../utils/jwt'


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

    //Generar JWT y enviarlo al cliente
    const token = generateJWT({id: user._id})
    res.send(token)
}


export const getUser = async (req: Request, res: Response) => {
    res.json(req.user)
    
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description } = req.body
        const handle = slugify(req.body.handle)
        const handleExist = await User.findOne({handle: handle})
        if (handleExist && handleExist.email !== req.user.email){
            const error = new Error('El nombre de usuario ya existe')
            res.status(409).json({ error: error.message })
            return
        } 

        //Actualizar el usuario
        req.user.handle = handle
        req.user.description = description
        await req.user.save()
        res.send('Perfil actualizado correctamente')

    } catch (e) {
        const error = new Error('Error al actualizar los datos del perfil')
        res.status(500).json({error: error.message})
    }
}