# Components

Le portfolio utilise du HTML, du CSS et du JavaScript vanilla. Chaque grande section est maintenant un fragment HTML chargé par `js/components-loader.js`.

Les fragments sont appelés dans `index.html` avec l'attribut `data-component` :

| Section | Fragment HTML |
| --- | --- |
| Navigation | `navigation.html` |
| Accueil | directement dans `index.html` |
| Compétences | directement dans `index.html` |
| Expériences | `experiences.html` |
| Formation | `formation.html` |
| Projets | `projets.html` |
| Contact | `contact.html` |
| Pied de page | `footer.html` |

Les autres fragments contiennent la démonstration Android, les langues, les centres d'intérêt et le modèle CV. Le chargement par `fetch()` nécessite d'ouvrir le site avec un serveur local ou un hébergement web, et non directement avec `file://`.
