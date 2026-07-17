// ===============================
// CURSOR GLOW
// ===============================

const glow = document.getElementById("cursorGlow");

document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});

// ===============================
// PROGRESS BAR
// ===============================

window.addEventListener("scroll", () => {
    const maxHeight = document.body.scrollHeight - window.innerHeight;
    const percent = (window.scrollY / maxHeight) * 100;
    document.getElementById("progressBar").style.width = percent + "%";
});

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

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(element => revealObserver.observe(element));

// ===============================
// SMOOTH NAVIGATION
// ===============================

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const section = document.querySelector(link.getAttribute("href"));
        if (section) section.scrollIntoView({ behavior: "smooth" });
    });
});

// ===============================
// ACTIVE MENU
// ===============================

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) current = section.id;
    });
    navLinks.forEach(link => {
        link.style.color = link.getAttribute("href") === "#" + current ? "var(--accent)" : "";
    });
});

// ===============================
// MENU MOBILE
// ===============================

const menuToggle = document.getElementById("menuToggle");
const navLinksMenu = document.getElementById("navLinks");

if (menuToggle && navLinksMenu) {

    menuToggle.addEventListener("click", () => {
        const isOpen = navLinksMenu.classList.toggle("active");
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinksMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinksMenu.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    document.addEventListener("click", (event) => {
        const clickInsideMenu = navLinksMenu.contains(event.target) || menuToggle.contains(event.target);
        if (!clickInsideMenu && navLinksMenu.classList.contains("active")) {
            navLinksMenu.classList.remove("active");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        }
    });
}

// ===============================
// FORMULAIRE CONTACT (EmailJS)
// ===============================

// 1) Remplace ces 3 valeurs par les tiennes, visibles sur https://dashboard.emailjs.com
//    - PUBLIC_KEY   : Account > General > Public Key
//    - SERVICE_ID   : Email Services > (ton service Gmail) > Service ID
//    - TEMPLATE_ID  : Email Templates > "Contact Us" > Template ID (ex: rkxf6s7, visible dans l'URL)
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

        if (!nom || !email || !message) {
            alert("Veuillez remplir au minimum le nom, l'email et le message.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Veuillez entrer une adresse email valide.");
            return;
        }

        if (!window.emailjs) {
            alert("Le service d'envoi n'est pas disponible pour le moment.");
            return;
        }

        btnSend.textContent = "Envoi en cours...";
        btnSend.disabled = true;

        // Ces clés ({{nom}}, {{email}}, {{telephone}}, {{sujet}}, {{message}}) doivent
        // correspondre exactement aux variables utilisées dans le template EmailJS.
        const templateParams = {
            nom: nom,
            email: email,
            telephone: telephone || "Non renseigné",
            sujet: "Contact depuis le portfolio",
            message: message,
            site: "Portfolio"
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
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
                alert("Échec de l'envoi (" + detail + "). Vérifie la configuration EmailJS.");
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

const btnDownloadCV = document.querySelector('.btn-outline[download]');

if (btnDownloadCV) {
    btnDownloadCV.addEventListener("click", (e) => {
    e.preventDefault();

    const element = document.getElementById('cv-template');
    const originalText = btnDownloadCV.innerHTML;
    btnDownloadCV.innerHTML = "Génération...";

    // On mémorise la position actuelle, puis on remonte en haut
    const savedScrollX = window.scrollX;
    const savedScrollY = window.scrollY;
    window.scrollTo(0, 0);

    const realHeight = element.scrollHeight;

    const opt = {
        margin: 0,
        filename: 'CV_RAKOTONANDRASANA_Amede.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollX: 0,
            scrollY: 0,
            x: -9999,
            y: 0,
            width: 794,
            height: realHeight,
            windowWidth: 794,
            windowHeight: realHeight
        },
        jsPDF: { unit: 'px', format: [794, realHeight], orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        btnDownloadCV.innerHTML = originalText;
        window.scrollTo(savedScrollX, savedScrollY); // on remet l'utilisateur où il était
    }).catch((err) => {
        console.error("Erreur génération PDF :", err);
        btnDownloadCV.innerHTML = originalText;
        window.scrollTo(savedScrollX, savedScrollY);
    });
});
}
