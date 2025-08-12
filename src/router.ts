import { Router } from "express";
import { body } from "express-validator";
import { createAccount, getUser, getUserByHandle, updateProfile, uploadImage } from "./handlers/index";
import { login } from "./handlers/index";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

const router = Router()

router.get('/', (req, res) => {
    res.send("HOME")
})

//REGISTRO
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

    handleInputErrors, //middleware de errores de input
    createAccount)


//LOGIN
router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('Email no valido'),
    body('password')
        .notEmpty()
        .withMessage('El password debe ser obligatorio'),

    handleInputErrors,
    login)



router.get('/user', authenticate, getUser)


router.patch('/user',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    handleInputErrors,
    authenticate,
    updateProfile
)

router.post('/user/image', authenticate, uploadImage)

router.get('/:handle', getUserByHandle)


export default router