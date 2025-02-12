import { Router } from "express";

const router = Router()


router.get('/', (req, res) => {
    res.send("HOME")
})

// AUTH y REGISTRO
router.post('/auth/register', (req, res) => {
    console.log(req.body)
})

router.post('/auth/login', (req, res) =>{
    res.send('Seccion login')
})



export default router