export function isUrlMatch(windowUrl: URL | Location, testUrl: string): number {
  // path match
  if (testUrl === undefined) return -1;

  const windowUrlParts = windowUrl.pathname.replace(/^\//, "").split("/");
  const urlParts = testUrl.replace(/^\//, "").split("/");

  if (windowUrlParts.length < urlParts.length) {
    return -1;
  }

  // hash
  if (windowUrl.hash.length > 0 && windowUrl.hash === testUrl) {
    return 1;
  }

  // root url
  if (urlParts.length === 1 && urlParts[0] === "") {
    return 0;
  }

  let weight = -1;
  let index = 0;

  for (const part of windowUrlParts) {
    if (urlParts[index] !== part) {
      break;
    }
    weight += 1;
    index++;
  }

  // if weight was incremented once, then it actually has a value of 1, not 0
  return weight >= 0 ? weight + 1 : weight;
}

export function setCurrentUrl(el: HTMLElement) {
  const slot = el.querySelector("slot") as HTMLSlotElement;
  if (!slot) {
    return;
  }

  const links = slot
    .assignedElements()
    .filter((el: Element) => el.tagName === "A");

  let currentEl: Element | undefined = undefined;
  let maxWeight = 0;
  links.forEach((child: Element) => {
    const weight = isUrlMatch(
      document.location,
      child.getAttribute("href") || "",
    );

    if (weight > maxWeight) {
      maxWeight = weight;
      currentEl = child;
    }
    child.classList.remove("current");
  });

  if (!!currentEl) {
    // @ts-expect-error
    currentEl?.classList.add("current");
  }
}
