import { Router } from "express";
import { createAccount } from "./handlers/index";

const router = Router()


router.get('/', (req, res) => {
    res.send("HOME")
})

// AUTH y REGISTRO
router.post('/auth/register', createAccount)



export default router