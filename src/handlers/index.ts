import type { Request, Response } from 'express' //Para evitar type any en req y res
import User from '../models/User'

export const createAccount = async (req: Request, res: Response) => {
        
        //Control de correo duplicado
        const {email} = req.body
        const userExist = await User.findOne({email})

        if (userExist){
            const error = new Error('El Usuario ya esta registrado')
            res.status(409).json({error : error.message})
            return
        } 
            
        const user = new User(req.body)
        await user.save()            
        res.status(201).send('Usuario creado correctamente')

}
