// variables
const navBtn = document.querySelector(".nav-toggler");
const mobileNav = document.querySelector(".mobile-nav");
const linksContainer = document.querySelector(".shorten-link__links");
const shortenLinkForm = document.querySelector(".shorten-link__form");
const shortenLinkFormBtn = document.querySelector(".shorten-link__form .btn");
const shortenLinkInput = document.querySelector(".shorten-link__form-input");
const errorMessage = document.querySelector(".error-message");
const links = JSON.parse(window.localStorage.getItem("shortened-links")) || [];

// functions
function toggleNavigation() {
  if (mobileNav.classList.contains("mobile-nav--active")) {
    mobileNav.classList.remove("mobile-nav--active");
    navBtn.classList.remove("nav-toggler--close");
  } else {
    navBtn.classList.add("nav-toggler--close");
    mobileNav.classList.add("mobile-nav--active");
  }
}

//create new child element and append it in a parent element
function createAndAppendElements(element, parent, classname, text, href) {
  let childElement = document.createElement(element);
  childElement.className = classname;
  const parentElement = parent.appendChild(childElement);

  if (text) {
    childElement.textContent = text;
  }

  if (href) {
    childElement.href = href;
  }
  return parentElement;
}

const copyLinkToClipboard = (e) => {
  const copytext = document.createElement("input");
  document.body.appendChild(copytext);
  copytext.value = e.target.previousElementSibling.textContent;

  /* Select the text field */
  copytext.select();
  copytext.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copytext.value);

  document.body.removeChild(copytext);

  e.target.classList.add("btn--copied");
  e.target.textContent = "Copied";
};

const showLinks = () => {
  linksContainer.innerHTML = "";
  links &&
    links.forEach((link) => {
      const linkWrapper = createAndAppendElements(
        "div",
        linksContainer,
        "link"
      );
      const fullLink = createAndAppendElements(
        "a",
        linkWrapper,
        "full-link",
        link.originalLink,
        link.originalLink
      );
      const shortenedLinkWrapper = createAndAppendElements(
        "div",
        linkWrapper,
        ""
      );
      const shortenedLink = createAndAppendElements(
        "a",
        shortenedLinkWrapper,
        "shortened-link",
        link.shortenedLink,
        link.shortenedLink
      );
      const copyBTn = createAndAppendElements(
        "button",
        shortenedLinkWrapper,
        "btn",
        "copy"
      );

      copyBTn.onclick = copyLinkToClipboard;
    });
};

const shortenLink = async (e) => {
  e.preventDefault();
  if (!shortenLinkInput.value) {
    errorMessage.style.display = "block";
    errorMessage.textContent = "Please add a link";
    shortenLinkInput.classList.add("shorten-link__form-input--error");
    return;
  }

  shortenLinkFormBtn.classList.add("btn--disabled");
  shortenLinkFormBtn.textContent = "Shortening Link...";

  const res = await fetch(
    ` https://api.shrtco.de/v2/shorten?url=${shortenLinkInput.value}`
  );

  const data = await res.json();
  const link = {
    originalLink: data.result.original_link,
    shortenedLink: data.result.full_short_link,
  };
  links.unshift(link);
  window.localStorage.setItem("shortened-links", JSON.stringify(links));
  shortenLinkFormBtn.classList.remove("btn--disabled");
  shortenLinkFormBtn.textContent = "Shorten It!";
  showLinks();
};

// evenl listeners
navBtn.addEventListener("click", toggleNavigation);
shortenLinkForm.addEventListener("submit", shortenLink);
shortenLinkInput.addEventListener("keydown", function (e) {
  if (e.target.classList.contains("shorten-link__form-input--error")) {
    e.target.classList.remove("shorten-link__form-input--error");
    errorMessage.style.display = "none";
  }
});

// initialize
showLinks();
