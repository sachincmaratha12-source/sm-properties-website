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
                            "http://127.0.0.1:5000/submit-enquiry",
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


});