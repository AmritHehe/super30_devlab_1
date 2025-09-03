import express from 'express';
import nodemailer from 'nodemailer';
const app = express();
const users = [];
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
const resend = new Resend('re_9dz9Fsnr_6nKWMn9U4mX7khQ99bKdJ7t6');
const JWT_PASSWORD = "HELLO BHAIYA !";
import Cookies from 'js-cookie';
app.use(express.json());
const myHeaders = new Headers(); // Currently empty
app.post('/api/v1/signup', async (req, res) => {
    try {
        const email = req.body.email;
        users.push({
            email: email
        });
        const token = jwt.sign(email, JWT_PASSWORD);
        const transporter = nodemailer.createTransport({
            host: 'smtp.resend.com',
            secure: true,
            port: 465,
            auth: {
                user: 'resend',
                pass: 're_9dz9Fsnr_6nKWMn9U4mX7khQ99bKdJ7t6',
            },
        });
        const info = await transporter.sendMail({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Hello World',
            html: " here is you magic link " + "http://localhost:5173/" + token,
        });
        console.log("fuck it worked , info " + info);
        // resend.emails.send({ 
        //     from: 'onboarding@resend.dev',
        //     to: 'amritbarsiphone@gmail.com',
        //     subject: 'Hello World',
        //     html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
        // })
        myHeaders.set('authorisation', token);
        Cookies.set('token', token, { expires: 7, secure: true });
        res.status(200).json("please check ur email");
    }
    catch (err) {
        res.status(403).json("something went wrong" + err);
    }
    ;
});
app.post('/api/v1/signin', async (req, res) => {
    try {
        const email = req.body.email;
        //@ts-ignore
        const user = users.find(u => u.email === email);
        if (user) {
            const token = jwt.sign(email, JWT_PASSWORD);
            const transporter = nodemailer.createTransport({
                host: 'smtp.resend.com',
                secure: true,
                port: 465,
                auth: {
                    user: 'resend',
                    pass: 're_9dz9Fsnr_6nKWMn9U4mX7khQ99bKdJ7t6',
                },
            });
            const info = await transporter.sendMail({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Hello World',
                html: " here is you magic link " + "http://localhost:5173/" + token,
            });
            console.log("fuck it worked , info " + info);
            // resend.emails.send({ 
            //     from: 'onboarding@resend.dev',
            //     to: 'amritbarsiphone@gmail.com',
            //     subject: 'Hello World',
            //     html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
            // })
            res.status(200).json("please check ur email");
            res.status(200).json("please check ur email");
        }
        else {
            res.status(403).json("user not found");
        }
    }
    catch (err) {
        res.status(403).json("something went wrong" + err);
    }
    ;
});
app.listen(3000);
//# sourceMappingURL=email.js.map