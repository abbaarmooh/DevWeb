"use strict";

document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

if (menuToggle && navigation) {
  const setMenuOpen = (open) => {
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    navigation.classList.toggle("is-open", open);
  };

  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenuOpen(false);
    }
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });

  const desktop = matchMedia("(min-width: 1024px)");
  desktop.addEventListener("change", () => setMenuOpen(false));
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const searchInput = document.querySelector("#portfolio-search");
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const workCards = [...document.querySelectorAll("[data-work]")];
const resultStatus = document.querySelector("#result-status");
const emptyState = document.querySelector("#no-results");

if (searchInput && resultStatus && emptyState && workCards.length) {
  let activeCategory = "All";
  const normalize = (value) => value.normalize("NFKD").toLocaleLowerCase().trim();
  const searchIndex = workCards.map((card) => ({
    card,
    categories: (card.dataset.categories || "").split("|"),
    text: normalize(`${card.textContent} ${card.dataset.topics || ""} ${card.dataset.categories || ""}`),
  }));

  const updateResults = () => {
    const terms = normalize(searchInput.value).split(/\s+/).filter(Boolean);
    let count = 0;

    searchIndex.forEach(({ card, categories, text }) => {
      const matchesCategory = activeCategory === "All" || categories.includes(activeCategory);
      const matchesSearch = terms.every((term) => text.includes(term));
      const visible = matchesCategory && matchesSearch;
      card.hidden = !visible;
      if (visible) count += 1;
    });

    resultStatus.textContent = `${count} ${count === 1 ? "article" : "articles"} shown`;
    emptyState.hidden = count !== 0;
  };

  searchInput.addEventListener("input", updateResults);
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.filter;
      filterButtons.forEach((filter) => {
        filter.setAttribute("aria-pressed", String(filter === button));
      });
      updateResults();
    });
  });

  document.querySelectorAll("[data-search-control]").forEach((control) => {
    control.hidden = false;
  });
  updateResults();
}
