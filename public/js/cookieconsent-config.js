console.log('1. cookieconsent-config.js has been loaded');

import 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.umd.js';


CookieConsent.run({

    revision: 3,

    guiOptions: {
        consentModal: {
            layout: 'box inline',
            position: 'bottom left',
            flipButtons: false
        },
        preferencesModal: {
            layout: 'box',
            position: 'left',
            flipButtons: false
        }
    },

    categories: {
        necessary: {
            readOnly: true,
            enabled: true
        },
        analytics: {
            enabled: true,
            autoClear: {
                cookies: [
                    {
                        name: /^(_ga|_gid)/
                    }
                ]
            }
        }
    },

    language: {
        default: 'de',
        translations: {
            de: {
                consentModal: {
                    title: 'Cookies',
                    description: 'Wir nutzen Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. Einige Cookies sind notwendig, um die Website ordnungsgemäss funktionieren zu lassen, während andere uns helfen, Ihr Nutzererlebnis zu verbessern und unsere Dienste zu optimieren. Sie können Ihre Einstellungen jederzeit anpassen oder Ihre Zustimmung widerrufen.',
                    acceptAllBtn: 'alle akzeptieren',
                    acceptNecessaryBtn: 'nur notwendige erlauben',
                    showPreferencesBtn: 'Einstellungen anzeigen'
                },
                preferencesModal: {
                    title: 'Cookie Einstellungen',
                    acceptAllBtn: 'alle akzeptieren',
                    acceptNecessaryBtn: 'nur notwendige erlauben',
                    savePreferencesBtn: 'aktuelle Auswahl erlauben',
                    closeIconLabel: 'Fenster schliessen',
                    sections: [
                        {
                            title: 'Was sind Cookies?',
                            description: 'Cookies sind kleine Textdateien, die von einer Website auf dem Gerät des Nutzers (z.B. Computer, Smartphone) gespeichert werden, während dieser die Website besucht. Sie dienen dazu, Informationen über den Nutzer oder sein Verhalten auf der Website zu speichern und später wieder abzurufen.'
                        },
                        {
                            title: 'technisch notwendige Cookies',
                            description: 'Das sind technisch notwendige Cookies, damit die Webseite richtig funktioniert. Diese können nicht deaktiviert werden.',

                            //this field will generate a toggle linked to the 'necessary' category
                            linkedCategory: 'necessary'
                        },
                        {
                            title: 'Google Analytics',
                            description: 'Analyse-Cookies werden verwendet um zu verstehen, wie Besucher mit der Website interagieren. Diese Cookies dienen zu Aussagen über die Anzahl der Besucher, Absprungrate, Herkunft der Besucher usw.',
                            linkedCategory: 'analytics'
                        }
                    ]
                }
            }
        }
    },

    onConsent: function(){
        if(CookieConsent.acceptedCategory('analytics')){
            console.log("2. Has been activated!");
            loadAnalyticsScript();
        }
    },

    onChange: function({changedCategories, changedServices}){
        console.log("onChange has been fired.");
        
        if(changedCategories.includes('analytics')){

            if(CookieConsent.acceptedCategory('analytics')){
                console.log("Change: Analytics has been activated!");
                loadAnalyticsScript();
            }else{
                console.log("Change: Analytics has been desabled!");
                disableAnalytics();
            }
        }
        else {
            console.log("nichts geändert");
        }
    }
});

// Load analytics script, if user consents
function loadAnalyticsScript() {
    console.log('3. Function loadAnalyticsScript has been fired.');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7RETH2601P';
    script.onload = () => {
        console.log("4. That's the analytics script.");
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-7RETH2601P');
    };
    document.head.appendChild(script);
}

function openCookieSettings() {
    if (typeof CookieConsent !== 'undefined') {
        CookieConsent.showPreferences();
        console.log('Cookie-Einstellungen geöffnet.');
    } else {
        console.error('CookieConsent ist nicht geladen.');
    }
}

window.openCookieSettings = openCookieSettings;

function disableAnalytics() {
    console.log('Deaktivieren von Google Analytics...');

    // 1. Lösche Google Analytics Cookies
    document.cookie = "_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "_gat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    console.log('Google Analytics Cookies wurden gelöscht.');

    // 2. Überschreibe die gtag-Funktion, um weitere Tracking-Aufrufe zu blockieren
    if (typeof window.gtag === "function") {
        window.gtag = function () {
            console.log('Google Analytics ist deaktiviert. Keine Daten werden gesendet.');
        };
    }

    // 3. Optionale Sicherheitsmaßnahme: Entferne das Analytics-Skript aus dem DOM
    const gaScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    if (gaScript) {
        gaScript.remove();
        console.log('Google Analytics-Skript wurde aus dem DOM entfernt.');
    }

    console.log('Google Analytics wurde erfolgreich deaktiviert.');
}