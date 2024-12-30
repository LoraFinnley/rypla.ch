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
                            description: 'Diese Cookies sammeln Informationen darüber, wie Sie die Seite verwenden. Diese Daten sind anonymisiert und können nicht verwendet werden, um Sie zu identifizieren. Gemäss DSG brauchen wir Ihre Zustimmung, um diese Cookies zu verwenden zu können.',
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