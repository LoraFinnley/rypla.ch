console.log('1. cookieconsent-config.js has been loaded');

import 'https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.0.1/dist/cookieconsent.umd.js';


CookieConsent.run({

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
            enabled: false,
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
                    title: 'Cookie Einstellungen vornehmen',
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
                            description: 'Diese Cookies sammeln Informationen darüber, wie Sie die Seite verwenden. Diese Daten sind anonymisiert und können nicht verwendet werden, um Sie zu identifizieren. Gemäss DSG brauchen wir Ihre Zustimmung, um diese Cookies zu verwenden zu können.',
                            linkedCategory: 'analytics'
                        },
                        {
                            title: 'Weitere Informationen',
                            description: 'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>'
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
    }
});


// Funktion zum Laden des Analytics-Skripts
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



/*
CookieConsent.run({

    cookie: {
        name: 'rypla-cookieconsent'
    },

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

    onFirstConsent: () => {
        console.log('onFirstAction fired');
        handleConsentChange();
    },

    onConsent: () => {
        console.log('onConsent fired ...');
        handleConsentChange();
    },

    onChange: () => {
        console.log('onChange fired ...');
        handleConsentChange();
    },

    categories: {
        necessary: {
            readOnly: true,
            enabled: true
        },
        analytics: {
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
                    acceptNecessaryBtn: 'nur technisch notwendige erlauben',
                    showPreferencesBtn: 'Einstellungen anzeigen'
                },
                preferencesModal: {
                    title: 'Cookie Einstellungen vornehmen',
                    acceptAllBtn: 'alle akzeptieren',
                    acceptNecessaryBtn: 'nur technisch notwendige erlauben',
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
                            description: 'Diese Cookies sammeln Informationen darüber, wie Sie die Seite verwenden. Diese Daten sind anonymisiert und können nicht verwendet werden, um Sie zu identifizieren. Gemäss DSG brauchen wir Ihre Zustimmung, um diese Cookies zu verwenden zu können.',
                            linkedCategory: 'analytics'
                        },
                        {
                            title: 'Weitere Informationen',
                            description: 'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>'
                        }
                    ]
                }
            }
        }
    }
});

// Funktion, um basierend auf der Zustimmung Analytics zu aktivieren
function handleConsentChange() {
    const consent = CookieConsent.hasConsented('analytics');
    if (consent) {
        console.log('Analytics wurde aktiviert.');
        loadAnalyticsScript();
    } else {
        console.log('Analytics wurde nicht aktiviert.');
    }
}

// Funktion zum Laden des Analytics-Skripts
function loadAnalyticsScript() {
    console.log('Lade Analytics-Skript...');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7RETH2601P';
    script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-7RETH2601P');
    };
    document.head.appendChild(script);
}

*/