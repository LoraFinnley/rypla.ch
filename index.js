import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from 'path';
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY;

var siteTitle = "Template";

// Setze den View-Engine und das Views-Verzeichnis
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statisches Verzeichnis korrekt setzen
app.use(express.static(path.join(__dirname, 'public')));

// Middleware zum Verarbeiten von JSON-Daten
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routen
app.get("/", (req, res) => {
    siteTitle = "Rypla GmbH";
    res.render(__dirname + "/views/index.ejs", {
      siteTitle: siteTitle,
      recaptchaSiteKey: RECAPTCHA_SITE_KEY
    });
  });

  app.get("/impressum", (req, res) => {
    siteTitle = "Rypla GmbH - Impressum";
    res.render(__dirname + "/views/impressum.ejs", {
      siteTitle: siteTitle
    });
});

//
//  Kontaktformular 
// 

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 20000,
  });

  // Funktion zum Abfangen der Formulardaten aus dem HTML

  app.post("/send-email", (req, res) => {
    
    const formData = {
      name: req.body.name || req.query.name,
      email: req.body.email || req.query.email,
      phone: req.body.phone || req.query.phone,
      message: req.body.message || req.query.message,
    };
  
    console.log("Empfangene Daten:", formData);

    // formatting the email data

    const mailOptions = {
        from: `"Rypla Kontaktformular" <mailer@adept-it.ch>`,
        to: "linda.wyden@gmail.com",
        subject: `Neue rypla-Nachricht von ${formData.name}`,
        text: `
        Du hast eine neue Nachricht über www.rypla.ch erhalten:
        
        Name: ${formData.name}
        E-Mail: ${formData.email}
        Telefonnummer: ${formData.phone}
        Nachricht:
        ${formData.message}
        `,
        html: `
        <h3>Neue Nachricht vom Kontaktformular</h3>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>E-Mail:</strong> ${formData.email}</p>
        <p><strong>Telefonnummer:</strong> ${formData.phone}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${formData.message}</p>
        `,
    };

    // send the email

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Fehler beim Senden der E-Mail:", error);
      return res.json({ success: false, message: "Die E-Mail konnte nicht gesendet werden." });
      }

      console.log("E-Mail gesendet:", info.response);

      res.json({ success: true, message: "Die Nachricht wurde gesendet, vielen Dank!" });
  });
});

// fixes for popup cors error

const allowedOrigins = [
    "https://rypla-ch.vercel.app",
    "https://www.rypla.ch",
    "https://rypla.ch",
    "http://localhost:3000"
];

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
