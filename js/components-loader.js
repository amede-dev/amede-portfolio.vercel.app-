const componentFiles = [
    "navigation.html",
    "footer.html"
];

const loaderUrl = document.currentScript.src;
const componentsUrl = new URL("../components/", loaderUrl);
const dataUrl = new URL("../data/portfolio-data.js", loaderUrl);
const appUrl = new URL("../js/script.js", loaderUrl);

async function loadComponents() {
    const slots = [...document.querySelectorAll("[data-component]")];
    await Promise.all(slots.map(async slot => {
        try {
            const componentUrl = new URL(slot.dataset.component, componentsUrl);
            componentUrl.searchParams.set("v", Date.now());
            const response = await fetch(componentUrl, { cache: "no-store" });
            if (!response.ok) throw new Error("HTTP " + response.status);
            const html = await response.text();
            const imagesUrl = new URL("../assets/images/", loaderUrl).href;
            const fragment = document.createRange().createContextualFragment(
                html.replaceAll("assets/images/", imagesUrl)
            );
            slot.replaceWith(fragment);
        } catch (error) {
            console.error("Impossible de charger " + slot.dataset.component, error);
            slot.outerHTML = "";
        }
    }));

    const dataScript = document.createElement("script");
    dataScript.src = dataUrl.href;
    document.body.appendChild(dataScript);

    const appScript = document.createElement("script");
    appScript.src = appUrl.href;
    document.body.appendChild(appScript);
}

loadComponents().catch(error => {
    console.error("Erreur de chargement des composants :", error);
    document.body.insertAdjacentHTML("beforeend", "<p style=\"padding:24px;color:#fca5a5;font-family:sans-serif\">Impossible de charger les composants. Lancez le site avec un serveur local.</p>");
});
