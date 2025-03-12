import { Router } from "express";
import { body } from "express-validator";
import { createAccount } from "./handlers/index";

const router = Router()


router.get('/', (req, res) => {
    res.send("HOME")
})

// AUTH y REGISTRO
router.post('/auth/register',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede ir vacio'),
    body('email')
        .isEmail()
        .withMessage('Email no valido'),
    body('password')
        .notEmpty()
        .withMessage('El password no puede ir vacio')
        .isLength({min: 8})
        .withMessage('El password debe contener 8 caracteres como minimo'),

    
    createAccount)


export default router