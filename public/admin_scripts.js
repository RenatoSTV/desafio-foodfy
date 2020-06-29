function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.value == "") return false;

    // Deixa o valor do input vazio
    newField.value = "";

    ingredients.appendChild(newField);
}

function addStep() {
    const preparo = document.querySelector("#preparo");
    const fieldContainer = document.querySelectorAll(".step");

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.value == "") return false;

    // Deixa o valor do input vazio
    newField.value = "";
    preparo.appendChild(newField);
}

document.querySelector(".add-ingredient").addEventListener("click", addIngredient);

document.querySelector(".add-step").addEventListener("click", addStep)


const itms = document.querySelectorAll('.ingredient')
const ingredients = document.querySelector('.ingredients .content')
const del = document.querySelectorAll('.delete')

for(let i = 0; i < del.length; i++){
    del[i].addEventListener('click', function(){
        ingredients.removeChild(itms[i])
        ingredients.removeChild(del[i])
    })
}