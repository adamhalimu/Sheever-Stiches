const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});


/* =========================================
   ANNOUNCEMENT BAR
========================================= */

const announcementText = document.getElementById("announcementText");

const announcements = [
    "New collection now available",
    "Complimentary delivery on orders over ₦150,000",
    "Made-to-order pieces available",
    "Discover the latest Sheever Stitches collection"
];

let currentAnnouncement = 0;

function showNextAnnouncement() {

    if (!announcementText || announcements.length === 0) {
        return;
    }

    announcementText.classList.add("is-changing");

    setTimeout(() => {

        currentAnnouncement =
            (currentAnnouncement + 1) % announcements.length;

        announcementText.textContent =
            announcements[currentAnnouncement];

        announcementText.classList.remove("is-changing");
        announcementText.classList.add("is-entering");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                announcementText.classList.remove("is-entering");
            });
        });

    }, 400);
}

if (announcementText && announcements.length > 1) {
    setInterval(showNextAnnouncement, 5000);
}
