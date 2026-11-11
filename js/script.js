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

// Animation individuelle des cartes d'expérience et de formation au défilement.
const timelineItems = document.querySelectorAll("#experiences .timeline-item, #formation .formation-timeline .timeline-item");
if (timelineItems.length) {
    timelineItems.forEach((item) => item.classList.add("scroll-reveal"));
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("in-view", entry.isIntersecting);
        });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

    timelineItems.forEach((item) => timelineObserver.observe(item));
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
                btnSend.style.background = "#2563eb";

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

// Navigation des projets : trois cartes visibles par page et par groupe.
document.querySelectorAll(".project-group").forEach((group) => {
    const cards = [...group.querySelectorAll(":scope > .project-card")];
    const pagination = group.querySelector(".project-pagination");
    if (!pagination || cards.length <= 3) return;

    const previousButton = pagination.querySelector(".project-page-prev");
    const nextButton = pagination.querySelector(".project-page-next");
    const status = pagination.querySelector(".project-page-status");
    const cardsPerPage = 3;
    const pageCount = Math.ceil(cards.length / cardsPerPage);
    let currentPage = 0;

    const renderPage = () => {
        const firstCard = currentPage * cardsPerPage;
        cards.forEach((card, index) => {
            card.hidden = index < firstCard || index >= firstCard + cardsPerPage;
        });
        previousButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === pageCount - 1;
        status.textContent = `${currentPage + 1} / ${pageCount}`;
    };

    previousButton.addEventListener("click", () => {
        if (currentPage > 0) {
            currentPage -= 1;
            renderPage();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < pageCount - 1) {
            currentPage += 1;
            renderPage();
        }
    });

    renderPage();
});

// Une seule catégorie principale par projet ; les technologies restent secondaires.
const primaryProjectCategories = [
    "Mobile", "IA", "Mobile", "Mobile", "Web", "Logiciels de bureau",
    "Web", "Web", "IoT", "Mobile", "IoT", "IoT"
];

document.querySelectorAll("#projets .project-card").forEach((card, index) => {
    const category = primaryProjectCategories[index];
    const icon = card.querySelector(".project-icon");
    if (category && icon) {
        card.dataset.category = category;
        icon.dataset.category = category;
        icon.setAttribute("title", category);
        icon.setAttribute("aria-label", `Catégorie : ${category}`);
    }
});

const projectCategoryButtons = document.querySelectorAll(".project-category-button");
const projectCards = [...document.querySelectorAll("#projets .project-card")];

const filterProjects = (selectedCategory) => {
    projectCards.forEach((card, index) => {
        const cardCategory = card.dataset.category || primaryProjectCategories[index];
        const shouldShow = selectedCategory === "all" || cardCategory === selectedCategory;
        card.hidden = !shouldShow;
        card.classList.toggle("project-filter-hidden", !shouldShow);
        if (shouldShow) {
            card.style.removeProperty("display");
        } else {
            card.style.setProperty("display", "none", "important");
        }
    });
};

projectCategoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedCategory = button.dataset.categoryFilter;
        projectCategoryButtons.forEach((item) => {
            const isActive = item === button;
            item.classList.toggle("active", isActive);
            item.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
        filterProjects(selectedCategory);
    });
});

filterProjects("all");

// Icônes réelles pour les catégories de la section Outils.
const categoryIcons = {
    "Outils": '<path d="m14.7 6.3 3-3 3 3-3 3M13 8l3 3-7.5 7.5a2.1 2.1 0 0 1-3-3zM4 20h5"/>',
    "Framework": '<path d="M4 6h16M4 12h16M4 18h16M8 4v4M16 10v4M10 16v4"/>',
    "Base de données": '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"/>',
    "Big Data": '<path d="M4 19V5M4 19h16M7 15l3-4 3 2 5-7"/>',
    "Cybersécurité": '<path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6zM9 12l2 2 4-5"/>',
    "Réseaux": '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M10.5 13.5 6.5 18M13.5 13.5l4 4.5"/>',
    "Microcontrôleur": '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M9 3v4M12 3v4M15 3v4M9 17v4M12 17v4M15 17v4M3 9h4M3 12h4M3 15h4M17 9h4M17 12h4M17 15h4"/>',
    "IA": '<path d="M9 9h6v6H9zM5 5h3v3H5zM16 5h3v3h-3zM5 16h3v3H5zM16 16h3v3h-3zM8 6.5h8M6.5 8v8M17.5 8v8M8 17.5h8"/>'
};

document.querySelectorAll(".tool-category-row h4").forEach((heading) => {
    const name = heading.textContent.trim();
    if (categoryIcons[name]) {
        heading.insertAdjacentHTML("afterbegin", `<svg class="category-icon" viewBox="0 0 24 24" aria-hidden="true">${categoryIcons[name]}</svg>`);
    }
});

const technologyIcons = {
    "VirtualBox": "devicon-virtualbox-plain", "Git": "devicon-git-plain", "GitHub": "devicon-github-original",
    "Docker": "devicon-docker-plain", "Canva": "devicon-canva-original", "Gemini": "devicon-google-plain",
    "Jenkins / CI/CD": "devicon-jenkins-line", "Kubernetes": "devicon-kubernetes-plain", "Pipeline": "devicon-gitlab-plain",
    "SonarQube": "devicon-sonarqube-plain", "Render": "devicon-grafana-plain", "Vercel": "devicon-vercel-original",
    "Nexus": "devicon-apache-plain", "Streamlit": "devicon-streamlit-plain", "API Partner": "devicon-fastapi-plain",
    "SMTP": "devicon-nginx-original", "React": "devicon-react-original", "Node.js": "devicon-nodejs-plain",
    "FastAPI": "devicon-fastapi-plain", "Spring Boot": "devicon-spring-original", "Android": "devicon-android-plain",
    "Flutter": "devicon-flutter-plain", "MySQL": "devicon-mysql-plain", "PostgreSQL": "devicon-postgresql-plain",
    "MongoDB": "devicon-mongodb-plain", "SQLite": "devicon-sqlite-plain", "Supabase": "devicon-supabase-plain",
    "Hadoop": "devicon-hadoop-plain", "Apache Spark": "devicon-apachespark-plain", "Kali Linux": "devicon-linux-plain", "OpenCV": "devicon-opencv-plain",
    "Arduino": "devicon-arduino-plain", "ESP32": "devicon-embeddedc-plain", "Raspberry Pi": "devicon-raspberrypi-plain", "Python": "devicon-python-plain",
    "TensorFlow": "devicon-tensorflow-original"
};

const technologySvgIcons = {
    "Machine Learning": '<path d="M8 4h8v5H8zM4 15h6v5H4zM14 15h6v5h-6zM12 9v3M7 12h10M7 12v3M17 12v3"/>',
    "Deep Learning": '<circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="m7 7 3 3M17 7l-3 3M7 17l3-3M17 17l-3-3"/>',
    "TCP/IP": '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M10.5 13.5 6.5 18M13.5 13.5l4 4.5"/>',
    "Wi-Fi": '<path d="M3 9a14 14 0 0 1 18 0M6 13a9 9 0 0 1 12 0M9 17a4 4 0 0 1 6 0"/><circle cx="12" cy="20" r="1"/>',
    "Bluetooth": '<path d="m12 3 5 5-5 4 5 4-5 5V3M4 8l8 8M4 16l8-8"/>',
    "LoRaWAN": '<path d="M5 18a10 10 0 0 1 14 0M8 14a6 6 0 0 1 8 0M11 10a2 2 0 0 1 2 0"/><circle cx="12" cy="20" r="1"/>',
    "Nmap": '<path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6zM9 12h6M12 9v6"/>',
    "Wireshark": '<path d="M4 18c2-5 4-8 8-8s6 3 8 8M7 7c1.5 1 2.5 2 3 4M17 7c-1.5 1-2.5 2-3 4"/>',
    "Metasploit": '<path d="M12 3a7 7 0 1 0 7 7M12 7v5l3 3M12 3v3M5 5l2 2"/>',
    "Social Engineering": '<circle cx="12" cy="8" r="3"/><path d="M5 20c.8-4 3-6 7-6s6.2 2 7 6M4 11h3M17 11h3"/>'
};

const aiCategory = [...document.querySelectorAll(".tool-category-row")].find((row) => row.querySelector("h4")?.textContent.trim() === "IA");
if (aiCategory) {
    aiCategory.querySelectorAll(".category-items > span").forEach((item) => {
        if (["Python", "Streamlit"].includes(item.textContent.trim())) item.remove();
    });
    aiCategory.querySelector(".category-items")?.insertAdjacentHTML("beforeend", "<span>OpenCV</span>");
}

const microcontrollerCategory = [...document.querySelectorAll(".tool-category-row")].find((row) => row.querySelector("h4")?.textContent.trim() === "Microcontrôleur");
if (microcontrollerCategory) {
    microcontrollerCategory.querySelectorAll(".category-items > span").forEach((item) => {
        if (["IR Remote", "LED Matrix"].includes(item.textContent.trim())) item.remove();
    });
    microcontrollerCategory.querySelector(".category-items")?.insertAdjacentHTML("beforeend", "<span>Raspberry Pi</span>");
}

document.querySelectorAll(".category-items > span").forEach((item) => {
    const name = item.textContent.trim();
    if (technologySvgIcons[name]) {
        item.insertAdjacentHTML("afterbegin", `<svg class="category-item-icon category-item-svg" viewBox="0 0 24 24" aria-hidden="true">${technologySvgIcons[name]}</svg>`);
        return;
    }
    const iconClass = technologyIcons[name] || "devicon-code-plain";
    item.insertAdjacentHTML("afterbegin", `<i class="${iconClass} colored category-item-icon" aria-hidden="true"></i>`);
});


