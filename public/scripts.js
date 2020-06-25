const recipeCards = document.querySelectorAll('.card')

for (let i = 0; i < recipeCards.length; i++) {
    let recipeId = i
    recipeCards[i].addEventListener('click', function () {

        window.location.href = `/${recipeId}`
    });
}

const sectors = document.querySelectorAll('.recipe_showhide');
const showHide = document.querySelectorAll('.showhide_btn');

for (let i = 0; i < showHide.length; i++) {
    showHide[i].addEventListener('click', function () {
        if (showHide[i].innerHTML == 'ESCONDER') {
            sectors[i].setAttribute("hidden", true)
            showHide[i].innerHTML = 'MOSTRAR'
        } else {
            sectors[i].removeAttribute('hidden', true)
            showHide[i].innerHTML = 'ESCONDER'
        }
    })
}

function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    ingredients.appendChild(newField);
}

document
    .querySelector(".add-ingredient")
    .addEventListener("click", addIngredient);

function addStep() {
    const preparo = document.querySelector("#preparo");
    const fieldContainer = document.querySelectorAll(".step");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false;

    // Deixa o valor do input vazio
    newField.children[0].value = "";
    preparo.appendChild(newField);
}

document
    .querySelector(".add-step")
    .addEventListener("click", addStep);