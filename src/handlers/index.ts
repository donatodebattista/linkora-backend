import type { Request, Response } from 'express' //Para evitar type any en req y res
import User from '../models/User'
import { hashPassword } from '../utils/auth'

export const createAccount = async (req: Request, res: Response) => {
        
        //Control de correo duplicado
        const {email, password} = req.body
        const userExist = await User.findOne({email})

        if (userExist){
            const error = new Error('El Usuario ya esta registrado')
            res.status(409).json({error : error.message})
            return
        } 
            
        const user = new User(req.body)
        user.password = await hashPassword(password)
        await user.save()
        
        res.status(201).send('Usuario creado correctamente')

}
