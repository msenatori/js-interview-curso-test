import express from 'express';
import rateLimit from 'express-rate-limit';
import { v4 } from 'uuid';

const app = express();

const rate_limit_setup = rateLimit({
    windowMs: 1000,
    max: 10,
    message: 'Too many requests',
    standardHeaders: true,
    statusCode: 429,
    legacyHeaders: false
});

app.use(express.json());
app.use(rate_limit_setup)


/**
 * POST /cursos/enroll
 * 
 * Permite inscribir un estudiante a un curso
 * Recibe un objeto con la siguiente estructura:
 * {
 *  "curso": "string",
 *  "email": "string",
 * }
 * 
 * Retorna un objeto con la siguiente estructura:
 * {
 * "message": "string",
 *  "data": {
 *  "id": "string",
 *  "curso": "string",
 *  "email": "string",
 * }
 */
app.post('/cursos/enroll', (req, res) => {
    console.log("dasdfsadf",req.body)

    const estudiante  = req.body

    if (!estudiante) {
        return res.status(400).json({
            error: 'Missing enroll'
        })
    }

    const enrolled =  {...estudiante, curso_enroll_id: v4()}

    res.status(200).json({
        message: 'Enrolled',
        data: enrolled
    })
});

app.post('/cursos/enroll/batch', (req, res) => {
    console.log("dasdfsadf",req.body)

    const estudiante  = req.body

    if (!estudiante) {
        return res.status(400).json({
            error: 'Missing enroll'
        })
    }

    const enrolled =  {...estudiante, curso_enroll_id: v4()}

    res.status(200).json({
        message: 'Enrolled',
        data: enrolled
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});