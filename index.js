import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from 'path';
import nodemailer from "nodemailer";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Setze den View-Engine und das Views-Verzeichnis
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Verwende Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Statisches Verzeichnis korrekt setzen
app.use(express.static(path.join(__dirname, 'public')));

// Middleware zum Verarbeiten von JSON-Daten
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3000;
var siteTitle = "Template";

//Routen
app.get("/", (req, res) => {
    siteTitle = "Rypla GmbH";
    res.render(__dirname + "/views/index.ejs", {siteTitle: siteTitle});
  });


  
  app.get("/impressum", (req, res) => {
    siteTitle = "Rypla GmbH - Impressum";
    res.render(__dirname + "/views/impressum.ejs", {siteTitle: siteTitle});
});

//
//  Kontaktformular 
// 

const transporter = nodemailer.createTransport({
    host: "imap.mail.hostpoint.ch",
    port: 993,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "mailer@adept-it.ch",
      pass: "typnam-monho1-dacsYn",
    },
  });

  // Funktion zum Abfangen der Formulardaten aus dem HTML







app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
