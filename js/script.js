// Tabs

document.addEventListener("DOMContentLoaded", () => {
  const tabsContent = document.querySelectorAll(".tabcontent");
  const tabHeader = document.querySelector(".tabheader");
  const tabHeaderItems = tabHeader.querySelectorAll(".tabheader__item");

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

    if (target && target.classList.contains("tabheader__item")) {
      hideElements(tabsContent);

      tabHeaderItems.forEach((item, i) => {
        item.classList.remove("tabheader__item_active");
        if (item == target) {
          item.classList.add("tabheader__item_active");
          showElement(tabsContent, i);
        }
      });
    }
  });
  //  Timer

  const deadline = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  const timer = document.querySelector(".timer");

  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / (1000 * 60)) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return "0" + num;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    days = selector.querySelector("#days");
    hours = selector.querySelector("#hours");
    minutes = selector.querySelector("#minutes");
    seconds = selector.querySelector("#seconds");
    timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerText = getZero(t.days);
      hours.innerText = getZero(t.hours);
      minutes.innerText = getZero(t.minutes);
      seconds.innerText = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock(timer, deadline);

  // Modal

  const modal = document.querySelector(".modal");
  const contactUsBtns = document.querySelectorAll("[data-modal]");
  const modelTimerId = setTimeout(showModal, 2000);

  function hideModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
  }

  function showModal() {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    clearInterval(modelTimerId);
    window.removeEventListener("scroll", showModalByScroll);
  }

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      showModal();
    }
  }

  contactUsBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      showModal();
    });
  });

  modal.addEventListener("click", (event) => {
    if (
      event.target === modal ||
      event.target.getAttribute("data-close") == ""
    ) {
      hideModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape") {
      hideModal();
    }
    window.addEventListener("scroll", showModalByScroll);
  });

  // Menu cards

  class MenuCard {
    constructor(img, alt, subtitle, description, price, ...classes) {
      this.img = img;
      this.alt = alt;
      this.subtitle = subtitle;
      this.description = description;
      this.transfer = 27;
      this.price = this.changeToUAH(price);
      this.classes = classes;
    }
    render() {
      const menuFieldContainer = document.querySelector(
        ".menu__field .container"
      );
      const menuItem = document.createElement("div");
      if (this.classes.length === 0) {
        menuItem.classList.add("menu__item");
      } else {
        this.classes.forEach((className) => menuItem.classList.add(className));
      }
      menuItem.innerHTML = `
			<img src="${this.img}" alt="${this.alt}">
			<h3 class="menu__item-subtitle">${this.subtitle}</h3>
			<div class="menu__item-descr">${this.description}</div>
			<div class="menu__item-divider"></div>
			<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
			</div>
		`;
      menuFieldContainer.appendChild(menuItem);
    }
    changeToUAH(price) {
      return +price * this.transfer;
    }
  }

  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  // getResource('http://localhost:3000/menu')
  //   .then(data =>{
  //     data.forEach(({img, altimg, title, descr, price}) => {
  //       new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
  //     });
  //   });

  getResource("http://localhost:3000/menu").then((data) => {
    createCard(data);
  });

  function createCard(data) {
    data.forEach(({ img, altimg, title, descr, price }) => {
      const element = document.createElement("div");
      element.classList.add("menu__item");
      element.innerHTML = `
      <img src="${img}" alt="${altimg}">
      <h3 class="menu__item-subtitle">${title}</h3>
      <div class="menu__item-descr">${descr}</div>
      <div class="menu__item-divider"></div>
      <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${price}</span> грн/день</div>
      </div>`;
      document.querySelector(".menu .container").append(element);
    });
  }
  // Forms

  const forms = document.querySelectorAll("form");

  const message = {
    loading: "img/form/spinner.svg",
    success: "Спасибо! Скоро мы с вами свяжемся!",
    failure: "Что-то пошло не так...",
  };

  forms.forEach((item) => {
    bindPostData(item);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: data,
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto; 
      `;
      form.insertAdjacentElement("afterend", statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData(" http://localhost:3000/requests", json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
        })
        .catch((e) => {
          console.error(e);
          showThanksModal(message.failure);
        })
        .finally(() => {
          statusMessage.remove();
          form.reset();
        });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector(".modal__dialog");
    prevModalDialog.classList.add("hide");
    prevModalDialog.classList.remove("show");

    showModal();

    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal_dialog");
    thanksModal.classList.add("show");

    thanksModal.innerHTML = `
      <div class="modal__content">
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector(".modal").append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add("show");
      prevModalDialog.classList.remove("hide");
      hideModal();
    }, 4000);
  }

  // Fetch API
  // fetch позволяет делать запросы
  // принимает 2 аргумента:
  //  1)  url
  //  2)  объект с параметрами запроса
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({ name: "Alex" }),
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));

  fetch("db.json")
    .then((data) => data.json())
    .then((data) => console.log(data));

  // Slider

  // const slider = {
  //   slides: document.querySelectorAll(".offer__slide"),
  //   currentSlide: document.querySelector("#current"),
  //   total: document.querySelector("#total"),
  //   nextSlideButton: document.querySelector(".offer__slider-next"),
  //   prevSlideButton: document.querySelector(".offer__slider-prev"),
  //   slideIndex: 0,

  //   updateCurrent() {
  //     this.currentSlide.textContent =
  //       this.slideIndex < 9 ? "0" + (this.slideIndex + 1) : this.slideIndex + 1;
  //   },

  //   updateTotal() {
  //     this.total.textContent =
  //       this.slides.length < 10 ? "0" + this.slides.length : this.slides.length;
  //   },

  //   showCurrentSlide() {
  //     this.slides.forEach((slide) => {
  //       slide.classList.add('hide');
  //     });
  //     this.slides[this.slideIndex].classList.remove('hide');
  //   },

  //   prevSlide(){
  //     if(this.slideIndex - 1 < 0){
  //       this.slideIndex = this.slides.length - 1;
  //     } else {
  //       this.slideIndex--;
  //     }
  //     this.updateCurrent();
  //     this.showCurrentSlide();
  //   },
  //   nextSlide(){
  //     if(this.slideIndex + 1 >= this.slides.length){
  //       this.slideIndex = 0;
  //     } else {
  //       this.slideIndex++;
  //     }
  //     this.updateCurrent();
  //     this.showCurrentSlide();
  //   },
  //   initSlider(){
  //     this.updateCurrent();
  //     this.updateTotal();
  //     this.showCurrentSlide();
  //     this.nextSlideButton.addEventListener('click', this.nextSlide.bind(this));
  //     this.prevSlideButton.addEventListener('click', this.prevSlide.bind(this));
  //   }
  // };
  // slider.initSlider();

  // Slider #2
  const slides = document.querySelectorAll(".offer__slide"),
    slider = document.querySelector(".offer__slider"),
    currentSlide = document.querySelector("#current"),
    total = document.querySelector("#total"),
    nextSlideButton = document.querySelector(".offer__slider-next"),
    prevSlideButton = document.querySelector(".offer__slider-prev"),
    slidesWrapper = document.querySelector(".offer__slider-wrapper"),
    slidesField = document.querySelector(".offer__slider-inner"),
    width = window.getComputedStyle(slidesWrapper).width;

  let slideIndex = 1;
  let offset = 0;

  function updateCurrent() {
    currentSlide.textContent = slideIndex < 10 ? "0" + slideIndex : slideIndex;
  }

  function updateTotal() {
    total.textContent =
      slides.length < 10 ? "0" + slides.length : slides.length;
  }

  slidesField.style.width = 100 * slides.length + "%";
  slidesField.style.display = "flex";
  slidesField.style.transition = "0.5s all";

  slidesWrapper.style.overflow = "hidden";

  slides.forEach((slide) => (slide.style.width = width));

  slider.style.position = "relative";

  const indicators = document.createElement("ol"),
    dots = [];
  indicators.classList.add("carousel-indicators");
  indicators.style.cssText = `
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 15;
  display: flex;
  justify-content: center;
  margin-right: 15%;
  margin-left: 15%;
  list-style: none;
  `;
  slider.append(indicators);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("li");
    dot.style.cssText = `
    box-sizing: content-box;
    flex: 0 1 auto;
    width: 30px;
    height: 6px;
    margin-right: 3px;
    margin-left: 3px;
    cursor: pointer;
    background-color: #fff;
    background-clip: padding-box;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    opacity: .5;
    transition: opacity .6s ease;
    `;
    dot.setAttribute("data-slide-to", i + 1);
    if (i == 0) {
      dot.style.opacity = "1";
    }
    indicators.append(dot);
    dots.push(dot);
  }

  nextSlideButton.addEventListener("click", () => {
    if (offset === +width.replace(/\D/g, '') * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.replace(/\D/g, '');
    }
    slidesField.style.transform = `translateX(-${offset}px)`;
    if (slideIndex === slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }
    dots.forEach(dot => dot.style.opacity = "0.5");

    dots[slideIndex - 1].style.opacity = 1;

    updateCurrent();
  });
  prevSlideButton.addEventListener("click", () => {
    if (offset === 0) {
      offset = +width.replace(/\D/g, '') * (slides.length - 1);
    } else {
      offset -= +width.replace(/\D/g, '');
    }
    slidesField.style.transform = `translateX(-${offset}px)`;
    slidesField.style.transform = `translateX(-${offset}px)`;
    if (slideIndex === 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }
    dots.forEach(dot => dot.style.opacity = "0.5");
    dots[slideIndex - 1].style.opacity = 1;
    updateCurrent();
  });

  updateTotal();
  updateCurrent();

dots.forEach(dot => {
  dot.addEventListener('click', (e)=> {
    const slideTo = e.target.getAttribute('data-slide-to');
    slideIndex = slideTo;
    offset = +width.replace(/\D/g, '') * (slideTo - 1);
    slidesField.style.transform = `translateX(-${offset}px)`;

    dots.forEach(dot => dot.style.opacity = "0.5");
    dots[slideIndex - 1].style.opacity = 1;
    updateCurrent();
  });
})
});
