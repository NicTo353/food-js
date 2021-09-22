function tabs(tabsClass, tabsContentSelector, tabsHeaderSelector, activeClass) {
  const tabsContent = document.querySelectorAll(tabsContentSelector);
  const tabHeader = document.querySelector(tabsHeaderSelector);
  const tabHeaderItems = tabHeader.querySelectorAll('.' + tabsClass);

  function hideElements(arr) {
    arr.forEach((element) => {
      element.classList.remove("show", "fade");
      element.classList.add("hide");
    });
  }

  function showElement(arr, i = 0) {
    arr[i].classList.remove("hide");
    arr[i].classList.add("show", "fade");
  }

  hideElements(tabsContent);
  showElement(tabsContent);

  tabHeader.addEventListener("click", (event) => {
    const target = event.target;

    if (target && target.classList.contains(tabsClass)) {
      hideElements(tabsContent);

      tabHeaderItems.forEach((item, i) => {
        item.classList.remove(activeClass);
        if (item == target) {
          item.classList.add(activeClass);
          showElement(tabsContent, i);
        }
      });
    }
  });
}

export default tabs;
