let openShopping = document.querySelector(".shopping");
let closeShopping = document.querySelector(".closeShopping");
let list = document.querySelector(".list");
let listCard = document.querySelector(".listCart");
let body = document.querySelector("body");
let total = document.querySelector(".total");
let quantity = document.querySelector(".quantity");
let totalBill = document.querySelector(".totalBill");
let modal = document.getElementById("myModal");
let closeModal = document.querySelector(".modal-cancel");
let modalForm = document.querySelector(".modal-content");
let modalQuantityInput = document.getElementById("modal-quantity-input");
let modalListSize = document.querySelector(".modal-list-size");
let modalLabelQuantity = document.querySelector(
  ".modal-quantity .modal-label-size"
);
let modalQuantity = document.querySelector(".modal-quantity");
let tableList = document.getElementById("table-list");
let customerInput = document.getElementById("customer-input");
let customerNote = document.getElementById("customer-note");
let cartForm = document.querySelector(".cart");

let currentKey = null;
let tables = null;
let products = null;

openShopping.addEventListener("click", () => {
  body.classList.add("active");
});
closeShopping.addEventListener("click", () => {
  body.classList.remove("active");
});

closeModal.addEventListener("click", (event) => {
  event.preventDefault();
  modal.style.display = "none";
  modalListSize.replaceChildren();

  modalLabelQuantity.textContent = "";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

modalForm.addEventListener("submit", (event) =>
  submitHandler(event, currentKey)
);

cartForm.addEventListener("submit", (event) => {
  submitCart(event);
});

// get data from file json

fetch("tables.json")
  .then((response) => response.json())
  .then((data) => {
    tables = data;
  });

fetch("product.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    initApp();
  });

let listCards = [];
function initApp() {
  products.forEach((value, key) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("item");
    newDiv.innerHTML = `
            <div class="image-container">
                <img src="image/${value.image}">
            </div>
            <div class="title">${value.name}</div>
            <div class="price">${value.price.toLocaleString()}</div>
            <button onclick="addToCart(${key})">Add To Cart</button>`;
    list.appendChild(newDiv);
  });

  tables.forEach((table) => {
    const option = document.createElement("option");
    option.value = Number(table);
    option.text = table;
    tableList.appendChild(option);
  });
}

// initApp();

function addToCart(key) {
  const value = products[key];
  loadSizeAndInput(value);
  modal.style.display = "block";

  currentKey = key;
}

const submitHandler = (event, key) => {
  let value = products[key];
  event.preventDefault();

  let currentSize = modalLabelQuantity.textContent;
  currentSize = currentSize.replace("Size ", "size");

  const cartItem = {
    id: key,
    name: value.name,
    image: value.image,
    [currentSize]: value[currentSize],
    price: value[currentSize],
    size: modalLabelQuantity.textContent,
    quantity: Number(modalQuantityInput.value),
  };
  console.log("cart item: ", cartItem);

  let flag = false;

  listCards.forEach((item) => {
    if (item.id === cartItem.id && item[currentSize] !== undefined) {
      flag = true;
      console.log("exist");
      item.quantity += cartItem.quantity;
      return;
    }
  });

  if (flag === false) {
    console.log("new");
    listCards.push(cartItem);
  }

  console.log("list carts: ", listCards);

  modal.style.display = "none";
  quantity.innerText = listCards.reduce(
    (total, product) => total + product.quantity,
    0
  );
  modalQuantityInput.value = 1;

  modalListSize.replaceChildren();
  reloadCard();
};

function loadSizeAndInput(value) {
  let currentSize;
  if (value["sizeM"]) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("modal-size");
    newDiv.innerHTML = `
    <button class="" type="button">Size M</button>
    <span>${value.sizeM.toLocaleString()}đ</span>
    `;
    modalListSize.appendChild(newDiv);
  }

  if (value["sizeL"]) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("modal-size");
    newDiv.innerHTML = `
    <button class="" type="button">Size L</button>
    <span>${value.sizeL.toLocaleString()}đ</span>
    `;
    modalListSize.appendChild(newDiv);
  }

  if (value["sizeXL"]) {
    let newDiv = document.createElement("div");
    newDiv.classList.add("modal-size");
    newDiv.innerHTML = `
    <button class="" type="button">Size XL</button>
    <span>${value.sizeXL.toLocaleString()}đ</span>
    `;
    modalListSize.appendChild(newDiv);
  }

  let buttonSizes = document.querySelectorAll(".modal-size button");
  buttonSizes.forEach((button) => {
    button.addEventListener("click", () => {
      // Toggle the "active" class on the clicked button
      button.classList.toggle("modal-size-active");
      currentSize = button.textContent;
      modalLabelQuantity.textContent = `${currentSize}`;

      // callback(currentSize);

      // Remove the "active" class from other size buttons
      buttonSizes.forEach((otherButton) => {
        if (otherButton !== button) {
          otherButton.classList.remove("modal-size-active");
        }
      });
    });
  });
}

function reloadCard() {
  listCard.innerHTML = "";
  let count = 0;
  let totalPrice = 0;
  listCards.forEach((value, key) => {
    totalPrice = totalPrice + value.price;
    count = count + value.quantity;
    if (value != null) {
      let newDiv = document.createElement("li");
      newDiv.innerHTML = `
                <div class="image-cart-container">
                    <img src="image/${value.image}"/>
                </div>
                <div class="item-name">${value.name}</div>
                <div class="item-price">
                  <div>${value.price.toLocaleString()}</div>
                  <div>${value.size}</div>
                </div>
                <div class="item-button">
                    <button onclick="changeQuantity(${key}, ${
        value.quantity - 1
      })">-</button>
                    <div class="count">${value.quantity}</div>
                    <button onclick="changeQuantity(${key}, ${
        value.quantity + 1
      })">+</button>
                </div>`;
      listCard.appendChild(newDiv);
    }
  });
  totalBill.innerText = totalPrice.toLocaleString();
  quantity.innerText = count;

  total.innerText = `Order (${count})`;
}

function changeQuantity(key, quantity) {
  if (quantity == 0) {
    delete listCards[key];
  } else {
    listCards[key].quantity = quantity;
    listCards[key].price = quantity * products[key].price;
  }
  reloadCard();
}

function submitCart(event) {
  event.preventDefault();

  const dataSubmit = {
    products: listCards,
    customer: customerInput.value,
    table: Number(tableList.value),
    note: customerNote.value,
  };
  console.log("data submit", dataSubmit);

  customerInput.value = "";
  tableList.value = 1;
  customerNote.value = "";
  listCards = [];
  reloadCard();
}
