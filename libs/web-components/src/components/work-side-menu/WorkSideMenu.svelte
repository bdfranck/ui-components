<svelte:options customElement="goa-work-side-menu" />

<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import { getSlottedChildren } from "../../common/utils";
  import { isUrlMatch, getMatchedLink } from "../../common/urls";
  import { SideMenuGroupProps } from "../side-menu-group/SideMenuGroup.svelte";

  export let heading: string;
  export let testid: string = "";

  let _open = true;

  let _rootEl: HTMLElement;
  let _sideMenuLinks: Element[] = [];
  let _sideMenuGroupItems: SideMenuGroupProps[] = [];
  let observer: MutationObserver | null = null;

  function handleToggleClick(e: Event) {
    _open = !_open;
    e.preventDefault();
  }

  onMount(async () => {
    await tick();
    getChildren();
    addEventListeners();
  });

  onDestroy(() => {
    removeEventListeners();
  });

  let noop = function() {

  };

  function getChildren() {
    if (!_rootEl) return;

    const slotChildren = getSlottedChildren(_rootEl);

    if (slotChildren.length === 0) return;

    _sideMenuLinks = slotChildren
      .filter((el) => el.tagName === "link-button")
      .map((el) => {
        el.classList.remove("current");
        return el;
      });

    _rootEl.addEventListener("sidemenugroup:mounted", handleSideMenuGroupMount);
  }

  function handleSideMenuGroupMount(e: Event) {
    const sideMenuGroupProps = (e as CustomEvent<SideMenuGroupProps>).detail;
    _sideMenuGroupItems = [..._sideMenuGroupItems, sideMenuGroupProps];
    setCurrentUrl();
  }

  function setCurrentUrl() {
    const url = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    // check all links under SideMenu and SideMenuGroups
    let links = [..._sideMenuLinks];
    _sideMenuGroupItems.forEach((el) => {
      links = [...links, ...el.links];
    });

    links.forEach((link) => link.classList.remove("current"));

    const currentEl = getMatchedLink(links, window.location);
    currentEl?.classList.add("current");

    // even nothing is matched, we should inform side menu group to close and remove current
    dispatchCurrentUrl(currentEl?.getAttribute("href") || "");
  }

  function dispatchCurrentUrl(href: string) {
    _sideMenuGroupItems.forEach((item) => {
      item.el.dispatchEvent(
        new CustomEvent("sidemenu:current:change", {
          composed: true,
          detail: href,
        }),
      );
    });
  }

  function addEventListeners() {
    // watch path changes
    let currentLocation = document.location.href;
    observer = new MutationObserver((_mutationList) => {
      if (isUrlMatch(document.location, currentLocation)) {
        currentLocation = document.location.href;
        setCurrentUrl();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // watch hash / browser history changes
    window.addEventListener("popstate", setCurrentUrl);
  }

  function removeEventListeners() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    window.removeEventListener("popstate", setCurrentUrl);
    if (_rootEl) {
      _rootEl.removeEventListener(
        "sidemenugroup:mounted",
        handleSideMenuGroupMount,
      );
    }
  }
</script>

<div bind:this={_rootEl} class="side-menu" data-testid={testid} class:open={_open} class:closed={!_open}>
  <div class="heading">
    <svg id="svg-ab-logo" width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_4514_103448)">
        <path d="M50 0C59.8891 0 69.5561 2.93245 77.7785 8.42652C86.001 13.9206 92.4096 21.7295 96.194 30.8658C99.9784 40.0021 100.969 50.0555 99.0393 59.7545C97.11 69.4536 92.348 78.3627 85.3553 85.3553C78.3627 92.348 69.4536 97.11 59.7545 99.0393C50.0555 100.969 40.0021 99.9784 30.8658 96.194C21.7295 92.4096 13.9206 86.001 8.42652 77.7785C2.93245 69.5561 0 59.8891 0 50C0 36.7392 5.26784 24.0215 14.6447 14.6447C24.0215 5.26784 36.7392 0 50 0V0Z" fill="#00B6ED"/>
        <path d="M64.6726 68.972C61.2506 67.7101 57.9108 66.2355 54.6726 64.557C57.6122 63.4775 60.4786 62.2081 63.2536 60.757C63.5366 63.5257 64.0101 66.2715 64.6706 68.975M83.0486 34.945C81.6166 34.764 82.3606 35.43 81.9616 37.317C80.2366 45.453 73.5826 51.317 66.9026 55.251C66.2026 45.934 66.4886 35.59 68.2426 29.251C69.7226 23.9 71.4826 24.882 69.2996 23.758C66.9996 22.575 64.5346 24.138 62.5376 28.124C60.5406 32.11 51.3446 53.748 36.6446 68.359C29.1256 75.838 22.3246 71.986 20.9626 70.836C19.8546 69.9 19.4456 71.345 20.8206 72.825C26.9016 79.382 35.7856 75.62 39.0206 72.387C47.9606 63.451 58.3546 44.215 62.5596 36.053C62.07 43.1618 62.1827 50.2993 62.8966 57.389C59.5099 59.0508 55.9777 60.3982 52.3446 61.414C50.2606 61.96 48.9716 62.809 48.9336 63.774C48.8926 64.831 50.2916 65.723 52.3146 66.683C55.9146 68.393 66.4626 73.376 69.0616 74.883C71.2866 76.174 72.3726 75.167 73.0316 73.773C73.8926 71.956 71.5316 70.906 69.2436 70.222C68.2339 66.3869 67.5479 62.4739 67.1926 58.524C72.5546 55.224 77.8336 50.824 80.8766 45.337C81.8592 43.4086 82.5895 41.3618 83.0496 39.247C83.3682 37.9447 83.4552 36.5965 83.3066 35.264C83.3066 35.264 83.2666 34.973 83.0496 34.945" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_4514_103448">
          <rect width="100" height="100" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    <h1>{heading}</h1>
  </div>
  <div class="main-menu">
    <slot />
  </div>

  <div class="secondary-menu">
    <a href="#support">
      <goa-icon size="small" type="help-circle" />
      <span>Support</span>
    </a>
    <a href="#settings">
      <goa-icon size="small"  type="settings" />
      <span>Settings</span>
    </a>
    <div class="account-menu">
      <div class="user-image"></div>
      <div class="account-name">
        <div class="user-name">Edna Mode</div>
        <div class="user-email">edna.mode@example.com</div>
      </div>
      <goa-icon type="chevron-up"/>
    </div>
    <div class="toggle">
      <goa-icon-button variant="color" size="small" icon={_open ? "chevron-back" : "chevron-forward"} onclick={handleToggleClick}></goa-icon-button>
    </div>
  </div>
</div>

<style>
  .side-menu {
    display: flex;
    flex-direction: column;
    position: relative;
    border-right: 1px solid var(--goa-color-greyscale-200);
    box-shadow: 0px 4px 6px -2px rgba(26, 26, 26, 0.2);
    height: 100vh;
    /* transition: width 33ms ease; */
  }

  .side-menu.closed a>span,
  .side-menu.closed .heading>h1,
  .side-menu.closed .account-name,
  .side-menu.closed .account-menu goa-icon {
    display: none;
  }

  /* Hack */
  .side-menu.closed :global(::slotted(a)) {
    width: 32px;
    overflow: hidden;
  }

  .side-menu.open {
    width: 245px;
  }

  .side-menu.closed {
    width: 48px;
  }

  .heading {
    display: flex;
    gap: 12px;
    align-items: center;
    border-bottom: 1px solid var(--goa-color-greyscale-200);
  }

  .side-menu.open .heading {
    padding: 16px 20px 12px 20px;
  }

  .side-menu.closed .heading {
    padding: 16px 8px 12px 8px;
  }

  .heading svg {
    flex-shrink: 0;
  }

  .heading h1 {
    font-size: 14px;
    color: var(--goa-color-greyscale-900);
    line-height: 1.2;
    font-weight: 600;
    margin: 0;
  }

  .main-menu,
  .secondary-menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .side-menu.open .main-menu,
  .side-menu.open .secondary-menu {
    padding: 12px;
  }

  .side-menu.closed .main-menu,
  .side-menu.closed .secondary-menu {
    padding: 8px;
  }

  .main-menu {
    flex-grow: 1;
  }

  .secondary-menu {
    position: relative;
    border-top: 1px solid var(--goa-color-greyscale-200);
  }

  .toggle {
    display: block;
    background-color: #fff;
    border-radius: 8px;
    position: absolute;
    right: -16px;
    top: -48px;
    border: 0.5px solid var(--Color-Greyscale-200, rgba(220, 220, 220, 1));
    box-shadow: 0px 1px 0px 0px rgba(26, 26, 26, 0.25);
  }

  .user-image {
    background-color: var(--goa-color-greyscale-400);
    border-radius: 100px;
    width: 32px;
    height: 32px;
  }

  .account-menu {
    display: flex;
    align-items: center;
    border: 1px solid var(--goa-color-greyscale-200);
    padding: 8px 8px;
    border-radius: 8px;
    cursor: pointer;
    gap: 8px;
  }

  .side-menu.closed .account-menu {
    padding: 0;
    border: none;
    border-radius: none;
  }

  .account-name {
    flex-grow: 1;
  }

  .user-name {
    font-size: 14px;
    line-height: 1.2;
    font-weight: 600;
  }

  .user-email {
    font-size: 11px;
    line-height: 1;
    color: var(--goa-color-text-secondary);
  }

  .secondary-menu a,
  :global(::slotted(a)),
  :global(::slotted(a:visited)) {
    /* required to override base styles */
    color: var(--goa-color-text-default) !important;
    font-size: 14px !important;
    display: flex;
    gap: 8px;
    font: var(--goa-typography-body-m);
    padding: 4px 8px;
    text-decoration: none;
  }

  .side-menu.closed .secondary-menu a,
  .side-menu.closed :global(::slotted(a)) {
    padding-left: 6px;
  }

  .secondary-menu a.current,
  :global(::slotted(a.current)) {
    font-weight: bold;
    background: var(--goa-color-greyscale-100);
    border-radius: 8px;
  }

  .secondary-menu a:hover:not(.current),
  :global(::slotted(a:hover:not(.current))) {
    background: var(--goa-color-greyscale-100);
    border-radius: 8px;
  }

  :global(::slotted(a:focus-visible)) {
    outline: var(--goa-border-width-l) solid var(--goa-color-interactive-focus);
  }
</style>
