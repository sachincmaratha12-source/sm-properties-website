document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       FEATURED PROJECT SLIDER
    ====================================================== */

    const projectSlider =
        document.querySelector(".projects-slider");

    const projectNext =
        document.querySelector(".projects-next");

    const projectPrev =
        document.querySelector(".projects-prev");

    let projectAutoSlide;


    function moveProjectsForward() {

        if (!projectSlider) {
            return;
        }

        const card =
            projectSlider.querySelector(".project-card");

        if (!card) {
            return;
        }

        const cardWidth =
            card.offsetWidth + 26;

        const maxScroll =
            projectSlider.scrollWidth -
            projectSlider.clientWidth;


        if (projectSlider.scrollLeft >= maxScroll - 5) {

            projectSlider.scrollTo({
                left: 0,
                behavior: "smooth"
            });

        } else {

            projectSlider.scrollBy({
                left: cardWidth,
                behavior: "smooth"
            });

        }

    }


    function moveProjectsBackward() {

        if (!projectSlider) {
            return;
        }

        const card =
            projectSlider.querySelector(".project-card");

        if (!card) {
            return;
        }

        const cardWidth =
            card.offsetWidth + 26;


        if (projectSlider.scrollLeft <= 5) {

            projectSlider.scrollTo({
                left:
                    projectSlider.scrollWidth,
                behavior: "smooth"
            });

        } else {

            projectSlider.scrollBy({
                left: -cardWidth,
                behavior: "smooth"
            });

        }

    }


    function startProjectAutoSlide() {

        clearInterval(projectAutoSlide);

        projectAutoSlide =
            setInterval(
                moveProjectsForward,
                5000
            );

    }


    function stopProjectAutoSlide() {

        clearInterval(projectAutoSlide);

    }


    if (
        projectSlider &&
        projectNext &&
        projectPrev
    ) {

        projectNext.addEventListener(
            "click",
            function () {

                moveProjectsForward();

                startProjectAutoSlide();

            }
        );


        projectPrev.addEventListener(
            "click",
            function () {

                moveProjectsBackward();

                startProjectAutoSlide();

            }
        );


        projectSlider.addEventListener(
            "mouseenter",
            stopProjectAutoSlide
        );


        projectSlider.addEventListener(
            "mouseleave",
            startProjectAutoSlide
        );


        startProjectAutoSlide();

    }



    /* =====================================================
       DEVELOPER SLIDER
    ====================================================== */

    const developerSlider =
        document.querySelector(".developers-slider");

    const developerNext =
        document.querySelector(".developer-next");

    const developerPrev =
        document.querySelector(".developer-prev");


    if (
        developerSlider &&
        developerNext &&
        developerPrev
    ) {

        developerNext.addEventListener(
            "click",
            function () {

                developerSlider.scrollBy({

                    left: 290,

                    behavior: "smooth"

                });

            }
        );


        developerPrev.addEventListener(
            "click",
            function () {

                developerSlider.scrollBy({

                    left: -290,

                    behavior: "smooth"

                });

            }
        );

    }



    /* =====================================================
       MOBILE MENU
    ====================================================== */

    const menuButton =
        document.querySelector(
            ".mobile-menu-button"
        );

    const mobileNav =
        document.querySelector(
            ".mobile-nav"
        );


    if (
        menuButton &&
        mobileNav
    ) {

        menuButton.addEventListener(
            "click",
            function () {

                const isOpen =
                    mobileNav.classList.toggle(
                        "open"
                    );

                menuButton.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            }
        );


        const mobileLinks =
            mobileNav.querySelectorAll("a");


        mobileLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mobileNav.classList.remove(
                            "open"
                        );

                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );

    }



    /* =====================================================
       ENQUIRY FORM → FLASK
    ====================================================== */

    const enquiryForm =
        document.querySelector(
            "#enquiryForm"
        );

    const formMessage =
        document.querySelector(
            "#formMessage"
        );

    const formSubmitButton =
        enquiryForm
            ? enquiryForm.querySelector(
                ".form-submit"
            )
            : null;


    if (
        enquiryForm &&
        formMessage &&
        formSubmitButton
    ) {

        enquiryForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                formMessage.textContent = "";

                formMessage.className =
                    "form-message";


                formSubmitButton.disabled =
                    true;

                formSubmitButton.textContent =
                    "Sending...";


                const formData =
                    new FormData(
                        enquiryForm
                    );


                const enquiryData = {

                    name:
                        formData.get(
                            "name"
                        ),

                    phone:
                        formData.get(
                            "phone"
                        ),

                    email:
                        formData.get(
                            "email"
                        ),

                    property_type:
                        formData.get(
                            "property_type"
                        ),

                    location:
                        formData.get(
                            "location"
                        ),

                    message:
                        formData.get(
                            "message"
                        )

                };


                try {

                    const response =
                        await fetch(
                            "/submit-enquiry",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        enquiryData
                                    )
                            }
                        );


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Unable to submit enquiry."
                        );

                    }


                    formMessage.textContent =
                        result.message;

                    formMessage.classList.add(
                        "success"
                    );


                    enquiryForm.reset();


                } catch (error) {

                    console.error(
                        "Enquiry submission error:",
                        error
                    );


                    formMessage.textContent =
                        "Unable to send your enquiry right now. Please call or WhatsApp us directly.";

                    formMessage.classList.add(
                        "error"
                    );

                } finally {

                    formSubmitButton.disabled =
                        false;

                    formSubmitButton.textContent =
                        "Send Enquiry";

                }

            }
        );

    }



    /* =====================================================
       PROJECT FILTERS
       PROJECTS PAGE ONLY
    ====================================================== */

    const developerFilter =
        document.querySelector(
            "#developerFilter"
        );

    const locationFilter =
        document.querySelector(
            "#locationFilter"
        );

    const configurationFilter =
        document.querySelector(
            "#configurationFilter"
        );

    const clearFilters =
        document.querySelector(
            "#clearFilters"
        );

    const projectCards =
        document.querySelectorAll(
            ".projects-page-grid .project-card"
        );


    function filterProjects() {

        if (!developerFilter) {
            return;
        }


        const selectedDeveloper =
            developerFilter.value;

        const selectedLocation =
            locationFilter
                ? locationFilter.value
                : "all";

        const selectedConfiguration =
            configurationFilter
                ? configurationFilter.value
                : "all";


        projectCards.forEach(
            function (card) {

                const cardDeveloper =
                    card.getAttribute(
                        "data-developer"
                    );

                const cardLocation =
                    card.getAttribute(
                        "data-location"
                    );

                const configurations =
                    (
                        card.getAttribute(
                            "data-configurations"
                        ) || ""
                    )
                    .toLowerCase()
                    .split(",");


                const developerMatch =
                    selectedDeveloper === "all" ||
                    cardDeveloper === selectedDeveloper;


                const locationMatch =
                    selectedLocation === "all" ||
                    cardLocation === selectedLocation;


                /*
                 * A project can contain multiple
                 * configurations, so we check
                 * whether the selected configuration
                 * exists in its list.
                 */

                let configurationMatch = true;


                if (
                    selectedConfiguration !== "all"
                ) {

                    configurationMatch =
                        configurations.includes(
                            selectedConfiguration
                        );

                }


                if (
                    developerMatch &&
                    locationMatch &&
                    configurationMatch
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            }
        );

    }



    /* =====================================================
       APPLY URL DEVELOPER FILTER
    ====================================================== */

    if (
        developerFilter &&
        projectCards.length > 0
    ) {

        const urlParams =
            new URLSearchParams(
                window.location.search
            );


        const developerFromURL =
            urlParams.get(
                "developer"
            );


        if (
            developerFromURL === "godrej" ||
            developerFromURL === "prestige" ||
            developerFromURL === "puravankara" ||
            developerFromURL === "assetz"
        ) {

            developerFilter.value =
                developerFromURL;

        }


        // Read search filters from URL
const params = new URLSearchParams(window.location.search);

const developer = params.get("developer");
const location = params.get("location");

// Apply developer filter
if (developer && developerFilter) {
    developerFilter.value = developer;
}

// Apply location filter
if (location && locationFilter) {
    locationFilter.value = location;
}

// Show matching projects
filterProjects();


        developerFilter.addEventListener(
            "change",
            filterProjects
        );


        if (locationFilter) {

            locationFilter.addEventListener(
                "change",
                filterProjects
            );

        }


        if (configurationFilter) {

            configurationFilter.addEventListener(
                "change",
                filterProjects
            );

        }

    }



    /* =====================================================
       CLEAR FILTERS
    ====================================================== */

    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            function () {

                if (developerFilter) {

                    developerFilter.value =
                        "all";

                }


                if (locationFilter) {

                    locationFilter.value =
                        "all";

                }


                if (configurationFilter) {

                    configurationFilter.value =
                        "all";

                }


                filterProjects();

            }
        );

    }
/* =====================================================
   HEADER LIVE SEARCH
===================================================== */

const searchInput = document.querySelector("#siteSearchInput");
const searchResults = document.querySelector("#siteSearchResults");
const searchButton = document.querySelector("#siteSearchButton");

if (searchInput && searchResults) {

    let searchProjects = [];
    let searchLocations = [];
    let searchBuilders = [];

    // Load all project cards from projects.html
    async function loadSearchData() {

        try {

            const response = await fetch("/projects.html");

            if (!response.ok) {
                throw new Error("Unable to load projects");
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const cards = doc.querySelectorAll(".project-card");

            const locationMap = new Map();
            const builderMap = new Map();

            cards.forEach(function (card) {

                const name =
                    card.querySelector("h3")?.textContent.trim() || "";

                const developer =
                    card.querySelector(".project-developer")?.textContent.trim() || "";

                const location =
                    card.querySelector(".project-location")?.textContent.trim() || "";

                const link =
                    card.querySelector(".project-link")?.getAttribute("href") || "";

                const developerSlug =
                    card.dataset.developer || "";

                const locationSlug =
                    card.dataset.location || "";

                if (!name) return;

                searchProjects.push({
                    name,
                    developer,
                    location,
                    link,
                    developerSlug,
                    locationSlug
                });

                if (location && locationSlug) {
                    locationMap.set(locationSlug, {
                        name: location,
                        slug: locationSlug
                    });
                }

                if (developer && developerSlug) {
                    builderMap.set(developerSlug, {
                        name: developer,
                        slug: developerSlug
                    });
                }

            });

            searchLocations = Array.from(locationMap.values());
            searchBuilders = Array.from(builderMap.values());

        } catch (error) {

            console.error("Search loading error:", error);

        }

    }

    const searchDataReady = loadSearchData();


    // Display suggestions
    function displaySearchResults() {

        const keyword = searchInput.value.trim().toLowerCase();

        searchResults.innerHTML = "";

        if (keyword.length < 2) {
            searchResults.hidden = true;
            return;
        }

        const projectMatches = searchProjects
            .filter(function (project) {

                const searchableText =
                    `${project.name} ${project.location} ${project.developer}`;

                return searchableText.toLowerCase().includes(keyword);

            })
            .map(function (project) {

                return {
                    title: project.name,
                    subtitle: `${project.location} • ${project.developer}`,
                    type: "Project",
                    link: project.link
                };

            });

        const locationMatches = searchLocations
            .filter(function (location) {

                return location.name.toLowerCase().includes(keyword);

            })
            .map(function (location) {

                return {
                    title: location.name,
                    subtitle: "View projects in this location",
                    type: "Location",
                    link: `projects.html?location=${encodeURIComponent(location.slug)}`
                };

            });

        const builderMatches = searchBuilders
            .filter(function (builder) {

                return builder.name.toLowerCase().includes(keyword);

            })
            .map(function (builder) {

                return {
                    title: builder.name,
                    subtitle: "View projects by this builder",
                    type: "Builder",
                    link: `projects.html?developer=${encodeURIComponent(builder.slug)}`
                };

            });

        const matches = [
            ...projectMatches,
            ...locationMatches,
            ...builderMatches
        ].slice(0, 8);

        if (matches.length === 0) {

            const emptyMessage = document.createElement("div");
            emptyMessage.className = "search-no-results";
            emptyMessage.textContent = "No matching projects found";

            searchResults.appendChild(emptyMessage);
            searchResults.hidden = false;

            return;

        }

        matches.forEach(function (item) {

            const result = document.createElement("a");

            result.className = "search-result-item";
            result.href = item.link || "projects.html";

            const details = document.createElement("div");
            details.className = "search-result-details";

            const title = document.createElement("strong");
            title.textContent = item.title;

            const subtitle = document.createElement("small");
            subtitle.textContent = item.subtitle;

            const category = document.createElement("span");
            category.className = "search-result-category";
            category.textContent = item.type;

            details.appendChild(title);
            details.appendChild(subtitle);

            result.appendChild(details);
            result.appendChild(category);

            searchResults.appendChild(result);

        });

        searchResults.hidden = false;

    }


    // Search while typing
    searchInput.addEventListener("input", async function () {

        await searchDataReady;
        displaySearchResults();

    });


    // Search button opens the first suggestion
    if (searchButton) {

        searchButton.addEventListener("click", function () {

            const firstResult =
                searchResults.querySelector(".search-result-item");

            if (firstResult) {
                window.location.href = firstResult.href;
            }

        });

    }


    // Press Enter to open the first suggestion
    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            const firstResult =
                searchResults.querySelector(".search-result-item");

            if (firstResult) {
                window.location.href = firstResult.href;
            }

        }

        if (event.key === "Escape") {
            searchResults.hidden = true;
        }

    });


    // Close suggestions when clicking outside
    document.addEventListener("click", function (event) {

        if (!event.target.closest(".header-search")) {
            searchResults.hidden = true;
        }

    });
}

});