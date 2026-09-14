/**
 * 🚀 Portfolio Data Loader Script
 * 
 * This script dynamically loads user profile data, social links, experience, projects
 * and education from JSON files located in the `assets/user_data/` directory. 📁
 * 
 * It uses async functions to fetch and parse JSON files, then populates corresponding sections
 * on the portfolio webpage by creating and appending HTML elements. 🖥️✨
 * 
 * Features:
 * - 👤 Loads user info (name, role, bio, skills grouped by category)
 * - 🔗 Loads social media and professional links with icons
 * - 💼 Renders experience entries with bullet highlights
 * - 📂 Displays project cards with highlights, tech stack, and links
 * - 🏫 Renders education history as cards
 * - ⚠️ Handles error cases by hiding sections gracefully if data is missing or fetch fails
 * 
 * Dependencies:
 * - 🦊 Font Awesome (for icons)
 * - 📐 HTML structure with specific element IDs expected for each section
 * 
 * Usage:
 * - 📜 Include this script on your portfolio page
 * - 📂 Ensure JSON data files are correctly placed in the specified folder
 * - ▶️ Call the load functions as needed to populate the page dynamically
 * 
 * Main Functions:
 * 
 * - async loadUserInfo() 👤
 *   Fetches and displays user personal details like name, role, and bio in the home section.
 * 
 * - async loadSocialLinks() 🔗
 *   Retrieves social media and professional profile links, rendering icons and clickable anchors.
 * 
 * - async loadExperience() 💼
 *   Renders roles with organisation, location, dates, and bullet highlights.
 * 
 * - async loadProjects() 📂
 *   Loads project data including titles, highlights, tech stack, and repository/demo links as cards.
 * 
 * - async loadEducation() 🏫
 *   Retrieves educational history and shows degrees, institutions, and duration in a card layout.
 * 
 * Author: Madhurima Rawat 👩‍💻
 * Date: 2025-06-03 📅
 */


// 🔗 Select all navigation links
document.querySelectorAll('nav a.nav-link').forEach(link => {
    // 🧏 Add click event listener to each nav link
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href'); // 🔍 Get the href attribute

        // 🚫 Skip external links or "Home" link (which has target="_blank" or full path)
        if (href.startsWith('http') || href === '{{ site.baseurl }}/' || this.hasAttribute('target')) return;

        e.preventDefault(); // ✋ Prevent default anchor behavior (jump)

        const targetId = href.substring(1); // 🔤 Remove '#' to get target ID
        const target = document.getElementById(targetId); // 🎯 Find the section with that ID
        const offset = 30; // 📏 Offset from the top in pixels

        if (target) {
            const elementPosition = target.getBoundingClientRect().top; // 📐 Element’s position relative to viewport
            const offsetPosition = elementPosition + window.pageYOffset - offset; // 🔢 Final scroll position

            // 🔽 Smoothly scroll to the calculated position
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth' // 🌊 Smooth scroll
            });
        }
    });
});


// Resolved against the page URL rather than the domain root, so the same
// build works at https://user.github.io/portfolio/ and at a bare domain.
const basePath = new URL("assets/user_data/", document.baseURI).href;

const iconMap = {
    "email-id": "fas fa-envelope",   // 📧 Email icon (Font Awesome Solid)
    "linkedin": "fab fa-linkedin",   // 🔗 LinkedIn icon (Font Awesome Brands)
    "github": "fab fa-github",       // 🐙 GitHub icon (Font Awesome Brands)
    "instagram": "fab fa-instagram", // 📸 Instagram icon (Font Awesome Brands)
    "twitter": "fab fa-twitter",     // 🐦 Twitter icon (Font Awesome Brands)
    "medium": "fab fa-medium",       // ✍️ Medium icon (Font Awesome Brands)
    "devto": "fab fa-dev"            // 💻 Dev.to icon (Font Awesome Brands)
};

async function fetchJSON(filename) {
    // 📂 Fetch a JSON file from the base path + filename
    const response = await fetch(basePath + filename);

    // ❌ Throw error if response is not OK (e.g., 404)
    if (!response.ok) throw new Error(`Failed to fetch ${filename}`);

    // ✅ Parse and return JSON data
    return await response.json();
}

// 🛠️ Helper function to hide a section by its HTML element ID 🆔
function hideSection(id) {
    // 🔍 Find the element with the given ID on the page
    const section = document.getElementById(id);

    // 🙈 If the element exists, hide it by setting CSS display to "none"
    // This removes it from view and layout flow
    if (section) section.style.display = "none";
}


function createSocialLink(name, url) {
    // 🔗 Create anchor element for social link
    const a = document.createElement("a");

    // ✉️ Use mailto: for email, else normal URL
    a.href = name === "email-id" ? `mailto:${url}` : url;

    // 🌐 Open in new tab safely
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    // 🎨 Add CSS class for styling social links
    a.className = "social-link";

    // 🖼️ Create <i> element for Font Awesome icon
    const icon = document.createElement("i");

    // 🎭 Set icon class based on mapping, fallback to envelope icon
    icon.className = iconMap[name] || "fas fa-envelope";

    // 🎯 Add margin to the right for spacing
    icon.style.marginRight = "8px";

    // ➕ Append icon to the anchor element
    a.appendChild(icon);

    // 📝 Append the uppercase, hyphen replaced text (e.g. "EMAIL ID")
    a.appendChild(document.createTextNode(name.replace("-", " ").toUpperCase()));

    // 🔙 Return the fully constructed social link element
    return a;
}


// 📆 Set current year and user name in footer
function setFooter(user) {
    const footerName = document.getElementById("footer-name");
    const footerYear = document.getElementById("footer-year");

    // 🧾 Set current year dynamically
    const year = new Date().getFullYear();
    if (footerYear) footerYear.textContent = year;

    // 👤 Replace '@name' with actual user name or fallback
    if (footerName) footerName.textContent = user.name || "Your Name";
}


// 🛠️ Build one row of skill pills, optionally labelled with its category
function createSkillGroup(label, skills) {
    const group = document.createElement("div");
    group.className = "skill-group";

    if (label) {
        const heading = document.createElement("h3");
        heading.className = "skill-group-label";
        heading.textContent = label;
        group.appendChild(heading);
    }

    const list = document.createElement("ul");
    list.className = "skills-list";

    skills.forEach(skill => {
        const li = document.createElement("li");
        li.textContent = skill;
        list.appendChild(li);
    });

    group.appendChild(list);
    return group;
}

// Skills accept either a flat array or an object of category → array
function renderSkills(skills) {
    const container = document.getElementById("skills-groups");
    if (!container || !skills) return false;

    container.innerHTML = "";

    if (Array.isArray(skills)) {
        if (skills.length === 0) return false;
        container.appendChild(createSkillGroup(null, skills));
        return true;
    }

    const categories = Object.keys(skills).filter(key => skills[key]?.length);
    if (categories.length === 0) return false;

    categories.forEach(category => {
        container.appendChild(createSkillGroup(category, skills[category]));
    });

    return true;
}

// 📌 Bullet list shared by experience entries and project cards
function createHighlightList(highlights) {
    const list = document.createElement("ul");
    list.className = "card-highlights";

    highlights.forEach(text => {
        const li = document.createElement("li");
        li.textContent = text;
        list.appendChild(li);
    });

    return list;
}

// 🔽 Click-to-expand block: the title stays visible, the bullets fold away.
//    <details> handles the toggling natively, so no click handler is needed.
function createCollapsibleSection(title, items, openByDefault = false) {
    const details = document.createElement("details");
    details.className = "card-details";
    if (openByDefault) details.open = true;

    const summary = document.createElement("summary");
    summary.className = "card-details-summary";
    summary.textContent = title;

    details.appendChild(summary);
    details.appendChild(createHighlightList(items));

    return details;
}

// 🧑‍💼 Load and display user info: name, role, bio, skills
async function loadUserInfo() {
    // Helper to hide a section by its ID
    function hideSection(id) {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = "none";
            section.classList.add("hidden"); // Optional: for CSS visibility fallback
        }
    }


    try {
        const user = await fetchJSON("user.json");

        // Check if user has any info to show
        if (user.name || user.role || user.bio || user.skills) {
            // 👤 Set user name, role, bio text content or empty string
            document.getElementById("name").textContent = user.name || "";
            document.getElementById("role").textContent = user.role || "";
            document.getElementById("bio").textContent = user.bio || "";

            if (!renderSkills(user.skills)) {
                hideSection("skills"); // ❌ Hide Skills if none
            }

            // ✅ Set footer with the user object
            setFooter(user);


        } else {
            // ❌ Hide home and skills section if no user info
            hideSection("home");
            hideSection("skills");
        }

    } catch (error) {
        // 🚫 On error, hide user related sections
        hideSection("home");
        hideSection("skills");
    }
}

// 🌐 Load and display social media/professional links
async function loadSocialLinks() {


    try {
        const social = await fetchJSON("social_links.json");

        const keys = Object.keys(social);
        if (keys.length === 0) throw new Error("Empty social_links.json");

        const socialContainer = document.getElementById("social-links");
        socialContainer.innerHTML = "";

        // 🔗 Create and append each social link element
        keys.forEach(key => {
            socialContainer.appendChild(createSocialLink(key, social[key]));
        });

    } catch (error) {
        // ❌ Hide social section on failure
        hideSection("social");
    }
}

// Buttons appear in this order; any extra key in `link` is appended after these
const PROJECT_LINK_LABELS = {
    live_demo: "Live Demo",
    website: "View Website",
    github: "GitHub",
    devpost: "Devpost",
    paper: "Paper"
};

function createProjectCard(project) {
    const card = document.createElement("div");
    card.className = "project-card section-card";

    // ✅ Add project image at the top
    if (project.image) {
        const img = document.createElement("img");
        img.src = project.image;
        img.alt = `${project.name} image`;
        img.className = "project-image section-image";
        card.appendChild(img);
    }

    const title = document.createElement("h3");
    title.className = "project-name section-subheading";
    title.textContent = project.name;

    const description = document.createElement("p");
    description.className = "project-description section-description";
    description.textContent = project.description;

    const tools = document.createElement("p");
    tools.className = "project-tools section-meta";
    const toolList = Array.isArray(project.tools) ? project.tools.join(" · ") : project.tools;
    tools.textContent = `Tools: ${toolList}`;

    card.appendChild(title);

    // Role and dates sit directly under the title as a single byline
    const byline = [project.role, project.period].filter(Boolean).join("  ·  ");
    if (byline) {
        const sub = document.createElement("p");
        sub.className = "project-byline card-byline";
        sub.textContent = byline;
        card.appendChild(sub);
    }

    if (project.award) {
        const award = document.createElement("p");
        award.className = "card-award";
        const icon = document.createElement("i");
        icon.className = "fas fa-award";
        award.appendChild(icon);
        award.appendChild(document.createTextNode(` ${project.award}`));
        card.appendChild(award);
    }

    const links = document.createElement("div");
    links.className = "project-links section-links";

    const linkOrder = Object.keys(PROJECT_LINK_LABELS);
    const linkRank = key => (linkOrder.indexOf(key) === -1 ? linkOrder.length : linkOrder.indexOf(key));
    const linkKeys = Object.keys(project.link || {}).sort((a, b) => linkRank(a) - linkRank(b));

    // Any key in `link` renders as a button; unknown keys get a spaced-out label
    linkKeys.forEach(key => {
        const url = project.link[key];
        if (!url) return;

        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.textContent = PROJECT_LINK_LABELS[key] || key.replace(/[_-]/g, " ");
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        links.appendChild(anchor);
    });

    if (project.description) card.appendChild(description);
    if (project.highlights?.length) card.appendChild(createHighlightList(project.highlights));

    // Optional collapsible blocks, e.g. "Extended Description" / "Process Description"
    project.sections?.forEach(section => {
        if (!section?.items?.length) return;
        card.appendChild(createCollapsibleSection(section.title, section.items, section.open));
    });
    card.appendChild(tools);
    if (links.childElementCount > 0) card.appendChild(links);

    return card;
}

// 💼 Load and display work / research experience
async function loadExperience() {
    const sectionId = "experience";

    try {
        const roles = await fetchJSON("experience.json");

        const list = document.getElementById("experience-list");
        if (!list) throw new Error("Experience container not found");

        list.innerHTML = "";

        if (!Array.isArray(roles) || roles.length === 0) {
            hideSection(sectionId);
            return;
        }

        roles.forEach(job => {
            const card = document.createElement("div");
            card.className = "experience-card section-card";

            const role = document.createElement("h3");
            role.className = "experience-role section-subheading";
            role.textContent = job.role;
            card.appendChild(role);

            const where = [job.organization, job.location].filter(Boolean).join(" — ");
            if (where) {
                const org = document.createElement("p");
                org.className = "experience-org section-description";
                org.textContent = where;
                card.appendChild(org);
            }

            if (job.period) {
                const period = document.createElement("p");
                period.className = "experience-period card-byline";
                period.textContent = job.period;
                card.appendChild(period);
            }

            if (job.highlights?.length) {
                card.appendChild(createHighlightList(job.highlights));
            }

            list.appendChild(card);
        });

    } catch (error) {
        hideSection(sectionId);
    }
}



// 📁 Load and display projects as cards
async function loadProjects() {

    try {
        // Await fetching and parsing JSON
        const response = await fetch(basePath + "projects.json");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const projects = await response.json();

        // Check if projects is an array and not empty
        if (!Array.isArray(projects) || projects.length === 0) {
            throw new Error("No projects found");
        }

        const projectsList = document.getElementById("projects-list");
        if (!projectsList) throw new Error("Projects list container not found");

        // Clear existing content
        projectsList.innerHTML = "";

        // Append project cards
        projects.forEach(project => {
            projectsList.appendChild(createProjectCard(project));
        });

        // Make sure section is visible
        const section = document.getElementById("projects");
        if (section) section.style.display = "block";

    } catch (error) {
        console.error("Error loading projects:", error);
        // Hide projects section on error or no projects
        hideSection("projects");
    }
}


// 🎓 Load and display education
async function loadEducation() {
    const sectionId = "education";

    try {
        const education = await fetchJSON("education.json");

        const educationTable = document.getElementById("education-table");
        educationTable.innerHTML = "";

        if (!Array.isArray(education) || education.length === 0) {
            hideSection(sectionId);
            return;
        }

        education.forEach(edu => {
            const eduItem = document.createElement("div");
            eduItem.className = "education-item section-card";

            const degree = document.createElement("h3");
            degree.className = "education-degree section-subheading";
            degree.textContent = edu.degree;

            const institution = document.createElement("p");
            institution.className = "education-institution section-description";
            institution.textContent = edu.institution;

            const year = document.createElement("p");
            year.className = "education-year section-meta";
            year.textContent = edu.year;

            const details = document.createElement("p");
            details.className = "education-details section-description";
            details.textContent = edu.details;

            eduItem.appendChild(degree);
            eduItem.appendChild(institution);
            eduItem.appendChild(year);
            eduItem.appendChild(details);

            educationTable.appendChild(eduItem);
        });

    } catch (error) {
        hideSection(sectionId);  // Hide entire section if JSON is missing or invalid
    }
}

// 🚀 Main function to load the entire portfolio by calling each loader
async function loadPortfolio() {
    await loadUserInfo();
    await loadSocialLinks();
    await loadExperience();
    await loadProjects();
    await loadEducation();
}

document.addEventListener("DOMContentLoaded", loadPortfolio);


// Toggle dark mode by adding/removing a class on the body
function toggleDarkMode() {
    const darkModeToggle = document.querySelector('a[href="#mode"]');
    const icon = darkModeToggle.querySelector("i");

    // Get the text node after the icon
    let textNode = darkModeToggle.childNodes[1];
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
        for (const node of darkModeToggle.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                textNode = node;
                break;
            }
        }
    }

    const isDark = document.body.classList.toggle("dark-mode");

    // Update icon and label
    if (isDark) {
        icon.classList.replace("fa-moon", "fa-sun");
        if (textNode) textNode.textContent = " Light Mode";
        localStorage.setItem("Portfolio-Templates-darkMode", "enabled");
    } else {
        icon.classList.replace("fa-sun", "fa-moon");
        if (textNode) textNode.textContent = " Dark Mode";
        localStorage.setItem("Portfolio-Templates-darkMode", "disabled");
    }
}

// Initialize dark mode based on localStorage or system preference
function initDarkMode() {
    const darkModeToggle = document.querySelector('a[href="#mode"]');
    const icon = darkModeToggle.querySelector("i");

    // Use localStorage if available, else use system preference
    const savedMode = localStorage.getItem("Portfolio-Templates-darkMode");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    let isDark = false;
    if (savedMode === "enabled") {
        isDark = true;
    } else if (savedMode === "disabled") {
        isDark = false;
    } else {
        isDark = prefersDark;
    }

    if (isDark) {
        document.body.classList.add("dark-mode");
        icon.classList.replace("fa-moon", "fa-sun");
        darkModeToggle.childNodes[1].textContent = " Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        icon.classList.replace("fa-sun", "fa-moon");
        darkModeToggle.childNodes[1].textContent = " Dark Mode";
    }
}


// Attach event listener on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    initDarkMode();

    const darkModeToggle = document.querySelector('a[href="#mode"]');
    darkModeToggle.addEventListener("click", e => {
        e.preventDefault();
        toggleDarkMode();
    });
});

