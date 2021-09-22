import {getResource} from '../services/services';


function cards(){
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
  

  
  getResource('http://localhost:3000/menu')
    .then(data =>{
      data.forEach(({img, altimg, title, descr, price}) => {
        new MenuCard(img, altimg, title, descr, price).render();
      });
    });
}

export default cards;