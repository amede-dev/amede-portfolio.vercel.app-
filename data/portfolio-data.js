/**
 * Données principales du portfolio.
 * Les sections restent rendues par index.html afin de conserver le fonctionnement
 * du site statique sans framework ni étape de compilation.
 */
const portfolioData = {
    projects: [
        {
            title: "Site Vitrine « Spray_Info »",
            description: "Conception et développement du site vitrine de l'entreprise avec React JS et EmailJS.",
            demo: "https://spray-info-chi.vercel.app/",
            source: "https://github.com/amede-dev/Site_vitrineSprayInfo"
        },
        {
            title: "Gestion d'École",
            description: "Système complet de gestion scolaire avec base de données, développé en langage Java et React.",
            demo: "https://gestion-ecole-five.vercel.app/",
            source: "https://github.com/amede-dev/Gestion_Ecole/tree/main/dist"
        }
    ]
};

if (typeof window !== "undefined") {
    window.portfolioData = portfolioData;
}
