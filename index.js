import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from 'path';
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

var siteTitle = "rypla";

const port = 3000;
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY;
const upload = multer();

// Setze den View-Engine und das Views-Verzeichnis
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statisches Verzeichnis korrekt setzen
app.use(express.static(path.join(__dirname, 'public')));

// Middleware zum Verarbeiten von JSON-Daten
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS‑Header **vor** den Routen setzen
const allowedOrigins = [
  "http://localhost:3000",
  "https://cdn.jsdelivr.net",
  "https://rypla.ch",       
  "https://www.rypla.ch",  
  "https://rypla.vercel.app"
];
app.use(
  cors({
    origin: (origin, cb) => {
      console.log("🔍 Antrag kommt von Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

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

app.post("/send-email", upload.none(), async (req, res) => {
  // Fehlerbehandlung global
  app.use((err, req, res, next) => {
    console.error("❗ Unerwarteter Fehler:", err);
    res.status(500).json({ success: false, message: "Interner Serverfehler." });
  });

  try {
    // reCAPTCHA Token prüfen
    const token = Array.isArray(req.body["g-recaptcha-response"])
      ? req.body["g-recaptcha-response"][0]
      : req.body["g-recaptcha-response"];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA‑Token fehlt – bitte das Formular erneut ausfüllen."
      });
    }

    console.log("🔐 Token:", token);
    console.log("📥 Formulardaten:", req.body);

    await verifyRecaptchaV2(token); // Verifikation

    // Formulardaten auslesen
    const formData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
    };

    // E-Mail konfigurieren
    const mailOptions = {
      from: `"Rypla Kontaktformular" <mailer@adept-it.ch>`,
      to: process.env.EMAIL_RECIPIENT,
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
        <p><strong>E‑Mail:</strong> ${formData.email}</p>
        <p><strong>Telefon:</strong> ${formData.phone}</p>
        <p><strong>Nachricht:</strong></p>
        <p>${formData.message.replace(/\n/g, "<br>")}</p>
      `
    };

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      connectionTimeout: 20000,
    });

    // E-Mail senden
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Fehler beim Senden der E‑Mail:", error);
        return res.json({
          success: false,
          message: "Die E‑Mail konnte nicht gesendet werden."
        });
      }

      console.log("📤 E‑Mail gesendet:", info.response);
      res.json({ success: true, message: "Die Nachricht wurde gesendet, vielen Dank!" });
    });

  } catch (err) {
    console.error("❗ Fehler bei reCAPTCHA:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


// Verifikation für reCAPTCHA v2
async function verifyRecaptchaV2(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const url = "https://www.google.com/recaptcha/api/siteverify";

  const params = new URLSearchParams({ secret, response: token });
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(`reCAPTCHA-Prüfung fehlgeschlagen: ${data["error-codes"]?.join(", ")}`);
  }

  return data;
}


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
