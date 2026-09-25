const cacheBuster = () => Date.now().toString();

const freshUrl = (href) => {
  const url = new URL(href, window.location.href);
  url.searchParams.set("_fresh", cacheBuster());
  return url;
};

document.addEventListener("click", (event) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const link = event.target.closest("a[href]");
  if (
    !link ||
    link.hasAttribute("download") ||
    (link.target && link.target !== "_self")
  ) {
    return;
  }

  const url = new URL(link.href, window.location.href);
  if (
    url.origin !== window.location.origin ||
    ["mailto:", "tel:", "javascript:"].includes(url.protocol) ||
    (url.pathname === window.location.pathname && url.hash)
  ) {
    return;
  }

  event.preventDefault();
  window.location.assign(freshUrl(url).href);
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    window.location.replace(freshUrl(window.location.href).href);
  }
});
