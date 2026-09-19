# Portfolio — RAKOTONANDRASANA Amedé

Portfolio personnel présentant mon parcours, mes compétences, mes expériences et mes projets académiques.

## Aperçu

Site vitrine responsive développé en HTML, CSS et JavaScript. Il comprend notamment :

- une présentation personnelle et un parcours professionnel ;
- une section compétences et formations ;
- des projets avec captures d’écran, démonstrations et liens GitHub ;
- un formulaire de contact avec EmailJS ;
- l’export du CV et un QR code vers le portfolio.

## Technologies utilisées

- HTML5
- CSS3
- JavaScript vanilla
- SVG pour les icônes
- EmailJS pour le formulaire de contact
- html2pdf.js et QRCode.js pour les fonctionnalités du CV

## Structure du projet

```text
portfolio/
├── index.html              # Page principale
├── css/
│   └── style.css           # Styles et responsive design
├── js/
│   ├── components-loader.js # Chargement des sections HTML
│   └── script.js            # Animations et interactions
├── assets/
│   ├── icons/              # Favicon et icônes
│   └── images/             # Photo et captures des projets
├── components/             # Sections HTML réutilisables
│   ├── navigation.html
│   ├── accueil.html
│   ├── competences.html
│   ├── projets.html
│   └── contact.html
├── data/                   # Données du portfolio
│   └── portfolio-data.js
├── .gitignore
└── README.md
```

## Utilisation

Ouvrir directement `index.html` dans un navigateur.

Pour lancer un serveur local, utiliser par exemple :

```bash
python3 -m http.server 8000
```

Puis ouvrir [http://localhost:8000](http://localhost:8000).

## Installation

Cloner le dépôt puis se placer dans le dossier du portfolio :

```bash
git clone https://github.com/amede-dev/portfolio.git
cd portfolio
```

Ce portfolio est un site statique : aucune commande `npm install` n'est nécessaire. Il peut être ouvert directement avec `index.html` ou lancé avec le serveur local indiqué ci-dessus.

## Configuration EmailJS

Le formulaire de contact utilise [EmailJS](https://www.emailjs.com/) pour envoyer les messages sans backend.

Pour utiliser vos propres identifiants, créez un compte EmailJS puis renseignez les valeurs suivantes dans `js/script.js` :

```javascript
const EMAILJS_PUBLIC_KEY = "votre_public_key";
const EMAILJS_SERVICE_ID = "votre_service_id";
const EMAILJS_TEMPLATE_ID = "votre_template_id";
```

Ces informations correspondent respectivement à la clé publique, au service d'envoi et au modèle d'e-mail configurés dans EmailJS. Pour un projet public, il est recommandé de vérifier les paramètres de sécurité et les restrictions de domaine dans votre compte EmailJS.

## Déploiement

Le projet peut être déployé directement sur GitHub Pages, Netlify ou Vercel comme site statique. Le fichier `index.html` doit rester à la racine du projet.

## Projets présentés

- [Site Vitrine Spray_Info](https://github.com/amede-dev/Site_vitrineSprayInfo)
- [Gestion d’École](https://github.com/amede-dev/Gestion_Ecole/tree/main/dist)

## Auteur

**RAKOTONANDRASANA Amedé** — [GitHub](https://github.com/amede-dev)
