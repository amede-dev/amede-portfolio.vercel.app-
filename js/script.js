// ===============================
// CURSOR GLOW
// ===============================

const glow = document.getElementById("cursorGlow");

// ===============================
// THÈME SOMBRE / CLAIR
// ===============================

const themeToggles = document.querySelectorAll(".theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {
    document.body.classList.add("light-theme");
}

function updateThemeButton() {
    const lightMode = document.body.classList.contains("light-theme");
    themeToggles.forEach(btn => {
        btn.setAttribute("aria-label", lightMode ? "Activer le mode sombre" : "Activer le mode clair");
        btn.title = lightMode ? "Activer le mode sombre" : "Activer le mode clair";
    });
}

themeToggles.forEach(btn => btn.addEventListener("click", () => {
    const lightMode = document.body.classList.toggle("light-theme");
    localStorage.setItem("portfolio-theme", lightMode ? "light" : "dark");
    updateThemeButton();
}));

updateThemeButton();

document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});

// ===============================
// PROGRESS BAR
// ===============================

const progressBar = document.getElementById("progressBar");

function updateProgress() {
    const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxHeight > 0 ? Math.min(100, (window.scrollY / maxHeight) * 100) : 0;
    progressBar.style.width = percent + "%";
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

// ===============================
// NETWORK CANVAS (fond réseau)
// ===============================

const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const DOTS = 80;
const dots = [];

for (let i = 0; i < DOTS; i++) {
    dots.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1
    });
}

function drawNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
    });

    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                const alpha = (1 - dist / 140) * 0.35;
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }

    dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59,130,246,0.55)";
        ctx.fill();
    });

    requestAnimationFrame(drawNetwork);
}

drawNetwork();

// ===============================
// FLOATING PARTICLES
// ===============================

const particleContainer = document.getElementById("particles");

for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    const size = Math.random() * 3 + 1.5;
    particle.style.width = size + "px";
    particle.style.height = size + "px";
    particle.style.background = Math.random() > 0.5 ? "#3b82f6" : "#60a5fa";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.bottom = Math.random() * 20 + "%";
    particle.style.animationDuration = Math.random() * 12 + 10 + "s";
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.opacity = Math.random() * 0.4 + 0.1;
    particleContainer.appendChild(particle);
}

// ===============================
// REVEAL ANIMATION
// ===============================

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.05 });

// Rejoue l'animation d'apparition à chaque affichage d'une vue.
function resetReveals(view) {
    view.querySelectorAll(".reveal").forEach(element => {
        element.classList.remove("visible");
        revealObserver.unobserve(element);
        revealObserver.observe(element);
    });
}

// ===============================
// NAVIGATION PAR VUES (une seule section affichée à la fois)
// Routes identiques à Portfolio-main : #/  #/a-propos  #/competences  #/projets  #/parcours  #/contact
// ===============================

const ROUTES = ["/", "/a-propos", "/competences", "/projets", "/parcours", "/contact"];

// Anciens liens à ancre (#competences, #formation…) redirigés vers la bonne vue.
const LEGACY_HASHES = {
    apropos: "/",
    accueil: "/",
    competences: "/competences",
    experiences: "/parcours",
    formation: "/parcours",
    projets: "/projets",
    langues: "/a-propos",
    interets: "/a-propos",
    contact: "/contact"
};

const views = [...document.querySelectorAll(".view")];
const navPills = document.getElementById("navPills");
const navIndicator = document.getElementById("navIndicator");
const mobilePanel = document.getElementById("mobilePanel");
const menuToggle = document.getElementById("menuToggle");
const menuToggleDesktop = document.getElementById("menuToggleDesktop");
const burgerExtras = document.getElementById("burgerExtras");
const backToTop = document.getElementById("backToTop");

// Numérotation automatique des expériences : 01, 02, 03…
function updateTimelineNumbers() {
    document.querySelectorAll("#experiences .timeline, #formation .formation-timeline").forEach(timeline => {
        timeline.querySelectorAll(":scope > .timeline-item").forEach((item, index) => {
            const card = item.querySelector(".timeline-card");
            if (!card) return;

            let number = card.querySelector(".timeline-number");
            if (!number) {
                number = document.createElement("span");
                number.className = "timeline-number";
                number.setAttribute("aria-hidden", "true");
                card.prepend(number);
            }

            number.textContent = String(index + 1).padStart(2, "0");
        });
    });
}

updateTimelineNumbers();

const timeline = document.querySelector("#experiences .timeline");
if (timeline) {
    new MutationObserver(updateTimelineNumbers).observe(timeline, { childList: true });
}
const formationTimeline = document.querySelector("#formation .formation-timeline");
if (formationTimeline) {
    new MutationObserver(updateTimelineNumbers).observe(formationTimeline, { childList: true });
}

// Numérotation automatique des catégories de compétences.
function updateSkillNumbers() {
    document.querySelectorAll("#competences .skill-category-card").forEach((card, index) => {
        let number = card.querySelector(".skill-number");
        if (!number) {
            number = document.createElement("span");
            number.className = "skill-number";
            number.setAttribute("aria-hidden", "true");
            card.prepend(number);
        }
        number.textContent = String(index + 1).padStart(2, "0");
    });
}

updateSkillNumbers();

// Bandeau défilant des outils : deux rangées qui avancent en sens opposés.
function setupToolsMarquee() {
    const list = document.querySelector(".tools-panel .tools-list");
    if (!list || list.dataset.marqueeReady === "true") return;

    const items = [...list.children];
    const preferredOrder = [
        "VirtualBox", "Git", "GitHub", "Docker", "Canva", "Gemini",
        "Jenkins / CI/CD", "Kubernetes", "SonarQube", "Render", "Vercel",
        "Nexus", "Streamlit", "Pipeline", "API Partner", "SMTP"
    ];
    const getName = item => item.textContent.trim();
    const orderedItems = preferredOrder
        .map(name => items.find(item => getName(item) === name))
        .filter(Boolean);

    list.dataset.marqueeReady = "true";
    list.classList.add("tools-marquee");
    list.replaceChildren();

    // Les deux lignes utilisent la même liste complète, comme dans Portfolio-main.
    const rows = [orderedItems, orderedItems];

    rows.forEach((rowItems, rowIndex) => {
        const row = document.createElement("div");
        row.className = "tools-marquee-row";
        const track = document.createElement("div");
        track.className = "tools-marquee-track" + (rowIndex === 1 ? " tools-marquee-track-reverse" : "");

        [rowItems, rowItems].forEach(copy => {
            copy.forEach(item => track.appendChild(item.cloneNode(true)));
        });

        row.appendChild(track);
        list.appendChild(row);
    });

}

setupToolsMarquee();

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

let currentRoute = null;

function resolveRoute() {
    const raw = location.hash.replace(/^#/, "");
    if (raw.startsWith("/")) {
        const clean = raw.length > 1 ? raw.replace(/\/+$/, "") : "/";
        return { route: ROUTES.includes(clean) ? clean : "/", anchor: null };
    }
    if (raw && LEGACY_HASHES[raw]) return { route: LEGACY_HASHES[raw], anchor: raw };
    return { route: "/", anchor: null };
}

function moveIndicator(animate = true) {
    if (!navIndicator || !navPills) return;
    const active = navPills.querySelector(".nav-pill.active");
    if (!active || !active.offsetWidth) {
        navIndicator.style.opacity = "0";
        return;
    }
    if (!animate) navIndicator.style.transition = "none";
    navIndicator.style.left = active.offsetLeft + "px";
    navIndicator.style.top = active.offsetTop + "px";
    navIndicator.style.width = active.offsetWidth + "px";
    navIndicator.style.height = active.offsetHeight + "px";
    navIndicator.style.opacity = "1";
    if (!animate) {
        navIndicator.offsetWidth; // force le recalcul avant de réactiver la transition
        navIndicator.style.transition = "";
    }
}

function showRoute(initial = false) {
    const { route, anchor } = resolveRoute();
    const changed = route !== currentRoute;

    // Normalise l'URL (ex. #contact -> #/contact) sans créer d'entrée d'historique.
    const wanted = "#" + route;
    if (location.hash !== wanted) {
        history.replaceState(null, "", wanted);
    }

    if (changed) {
        currentRoute = route;
        views.forEach(view => view.classList.toggle("active", view.dataset.route === route));

        document.querySelectorAll(".nav-pill, .mobile-link").forEach(link => {
            const isActive = link.dataset.route === route;
            link.classList.toggle("active", isActive);
            if (isActive) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });

        const activeView = views.find(view => view.dataset.route === route);
        if (activeView) resetReveals(activeView);

        moveIndicator(!initial);
        setMobileMenu(false);
        setDesktopExtras(false);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    if (anchor) {
        const target = document.getElementById(anchor);
        if (target) target.scrollIntoView({ behavior: initial ? "auto" : "smooth" });
    }

    updateProgress();
    updateBackToTop();
}

// Un clic sur le lien de la page courante remonte simplement en haut (comme le modèle).
document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-route]");
    if (link && link.dataset.route === currentRoute) {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

window.addEventListener("hashchange", () => showRoute(false));

// ===============================
// MENUS (burger mobile + burger desktop CV / thème)
// ===============================

function setMobileMenu(open) {
    if (!mobilePanel || !menuToggle) return;
    mobilePanel.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("menu-open", open);
}

function setDesktopExtras(open) {
    if (!burgerExtras || !menuToggleDesktop) return;
    burgerExtras.classList.toggle("open", open);
    burgerExtras.setAttribute("aria-hidden", open ? "false" : "true");
    menuToggleDesktop.setAttribute("aria-expanded", open ? "true" : "false");
    burgerExtras.querySelectorAll("a, button").forEach(el => { el.tabIndex = open ? 0 : -1; });
}

menuToggle?.addEventListener("click", () => {
    setMobileMenu(!mobilePanel.classList.contains("open"));
});

menuToggleDesktop?.addEventListener("click", () => {
    setDesktopExtras(!burgerExtras.classList.contains("open"));
});

mobilePanel?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setMobileMenu(false));
});

burgerExtras?.querySelector("[data-cv-download]")?.addEventListener("click", () => setDesktopExtras(false));

document.addEventListener("click", (event) => {
    if (burgerExtras?.classList.contains("open") &&
        !burgerExtras.contains(event.target) &&
        !menuToggleDesktop.contains(event.target)) {
        setDesktopExtras(false);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMobileMenu(false);
        setDesktopExtras(false);
    }
});

// Au passage en affichage desktop, on referme le panneau mobile (et on libère le scroll).
window.matchMedia("(min-width: 1280px)").addEventListener("change", (event) => {
    if (event.matches) setMobileMenu(false);
    moveIndicator(false);
});

window.addEventListener("resize", () => moveIndicator(false));
window.addEventListener("load", () => moveIndicator(false));

// ===============================
// RETOUR EN HAUT
// ===============================

function updateBackToTop() {
    backToTop?.classList.toggle("visible", window.scrollY > 600);
}

window.addEventListener("scroll", updateBackToTop, { passive: true });
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

showRoute(true);

// ===============================
// FORMULAIRE CONTACT (EmailJS)
// ===============================

const alertDialog = document.getElementById("alertDialog");
const alertDialogTitle = document.getElementById("alertDialogTitle");
const alertDialogMessage = document.getElementById("alertDialogMessage");
const alertDialogOk = document.getElementById("alertDialogOk");

function showAlertDialog(message, title = "Notification") {
    if (!alertDialog || !alertDialogMessage) return;
    alertDialogTitle.textContent = title;
    alertDialogMessage.textContent = message;
    alertDialog.hidden = false;
    alertDialogOk?.focus();
}

function closeAlertDialog() {
    if (alertDialog) alertDialog.hidden = true;
}

alertDialogOk?.addEventListener("click", closeAlertDialog);
alertDialog?.addEventListener("click", (event) => {
    if (event.target === alertDialog) closeAlertDialog();
});

const EMAILJS_PUBLIC_KEY  = "fZFTAZNpFk2pgS-2M";
const EMAILJS_SERVICE_ID  = "service_6kamede";
const EMAILJS_TEMPLATE_ID = "template_04n1u98";

if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
}

const btnSend = document.querySelector(".btn-send");

if (btnSend) {
    btnSend.addEventListener("click", () => {

        const nomInput = document.getElementById("formNom");
        const emailInput = document.getElementById("formEmail");
        const telInput = document.getElementById("formTelephone");
        const msgInput = document.getElementById("formMessage");

        const nom = nomInput ? nomInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const telephone = telInput ? telInput.value.trim() : "";
        const message = msgInput ? msgInput.value.trim() : "";

        if (!nom || !email || !telephone || !message) {
            showAlertDialog("Veuillez remplir tous les champs avant d'envoyer le message.", "Champs requis");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlertDialog("Veuillez entrer une adresse email valide.", "Email invalide");
            return;
        }

        if (telephone) {
            const telRegex = /^[0-9+\s-]{7,20}$/;
            if (!telRegex.test(telephone)) {
                showAlertDialog("Le numéro de téléphone ne doit contenir que des chiffres (espaces, + et - autorisés).", "Téléphone invalide");
                return;
            }
        }

        if (!window.emailjs) {
            showAlertDialog("Le service d'envoi n'est pas disponible pour le moment.", "Service indisponible");
            return;
        }

        btnSend.textContent = "Envoi en cours...";
        btnSend.disabled = true;

        // Ces clés ({{nom}}, {{email}}, {{telephone}}, {{sujet}}, {{message}}) doivent
        // correspondre exactement aux variables utilisées dans le template EmailJS.
        const templateParams = {
            nom: nom,
            email: email,
            telephone: telephone,
            sujet: "Contact depuis le portfolio",
            message: message,
            site: "Portfolio"
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                showAlertDialog("Votre message a été envoyé avec succès.", "Message envoyé");
                btnSend.textContent = "Message envoyé ✓";
                btnSend.style.background = "#22c55e";

                setTimeout(() => {
                    if (nomInput) nomInput.value = "";
                    if (emailInput) emailInput.value = "";
                    if (telInput) telInput.value = "";
                    if (msgInput) msgInput.value = "";
                    btnSend.textContent = "Envoyer";
                    btnSend.style.background = "";
                    btnSend.disabled = false;
                }, 3000);
            })
            .catch((err) => {
                console.error("Erreur EmailJS :", err);
                const detail = (err && (err.text || err.message)) ? (err.text || err.message) : "Erreur inconnue";
                showAlertDialog("Échec de l'envoi (" + detail + "). Vérifiez la configuration EmailJS.", "Échec de l'envoi");
                btnSend.textContent = "Envoyer";
                btnSend.disabled = false;
            });
    });
}

// ===============================
// CONSOLE MESSAGE
// ===============================

console.log("%cPortfolio EA2I - Amedé", "color:#3b82f6;font-size:18px;font-weight:bold;");
console.log("Java • IoT • ESP32 • JavaFX • RFID");

// ===============================
// TÉLÉCHARGEMENT CV EN PDF
// ===============================

const cvButtons = document.querySelectorAll("[data-cv-download]");

cvButtons.forEach(btnDownloadCV => {
    btnDownloadCV.addEventListener("click", (e) => {
        e.preventDefault();

        const cvTemplate = document.getElementById("cv-template");
        if (!cvTemplate) return;

        const printWindow = window.open("", "_blank", "width=900,height=1100");
        if (!printWindow) return;

        const cvClone = cvTemplate.cloneNode(true);
        const originalQr = document.querySelector("#cv-qr-code canvas");
        const clonedQr = cvClone.querySelector("#cv-qr-code");

        if (originalQr && clonedQr) {
            clonedQr.innerHTML = `<img src="${originalQr.toDataURL("image/png")}" alt="QR code" width="70" height="70">`;
        }

        const stylesheetUrl = new URL("css/style.css", document.baseURI).href;
        printWindow.document.write(`
            <!doctype html>
            <html lang="fr">
            <head>
                <meta charset="utf-8">
                <title>Portfolio | RAKOTONANDRASANA Amedé</title>
                <link rel="stylesheet" href="${stylesheetUrl}">
                <style>
                    @page { size: A4 portrait; margin: 0; }
                    html, body {
                        width: 210mm;
                        height: 297mm;
                        margin: 0;
                        padding: 0;
                        overflow: hidden;
                        break-after: avoid-page;
                        page-break-after: avoid;
                        background: #fff;
                    }
                    #cv-template {
                        position: relative !important;
                        left: auto !important;
                        top: auto !important;
                        width: 210mm !important;
                        height: 296mm !important;
                        min-height: 0 !important;
                        max-height: 296mm !important;
                        margin: 0 !important;
                        overflow: hidden !important;
                        zoom: 1 !important;
                        display: flex !important;
                        break-inside: avoid !important;
                        break-after: avoid-page !important;
                        page-break-inside: avoid !important;
                        page-break-after: avoid !important;
                    }
                    #cv-template .cv-sidebar,
                    #cv-template .cv-main {
                        height: 296mm !important;
                        min-height: 0 !important;
                    }
                    #cv-template .cv-body {
                        padding-right: 28px !important;
                    }
                    #cv-template .cv-qr-block {
                        right: 18px !important;
                    }
                </style>
            </head>
            <body>${cvClone.outerHTML}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.addEventListener("afterprint", () => printWindow.close(), { once: true });
        let hasPrinted = false;
        const printReadyWindow = () => {
            if (hasPrinted) return;
            hasPrinted = true;
            printWindow.focus();
            printWindow.print();
        };

        printWindow.addEventListener("load", () => setTimeout(printReadyWindow, 250), { once: true });
        setTimeout(printReadyWindow, 1200);
    });
});

// QR code du portfolio affiché dans le CV imprimable.
const qrContainer = document.getElementById("cv-qr-code");
if (qrContainer && window.QRCode) {
    new QRCode(qrContainer, {
        text: "https://amede-portfolio.vercel.app/",
        width: 70,
        height: 70,
        colorDark: "#1c2942",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}
