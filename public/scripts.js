const recipeCards = document.querySelectorAll('.card')

for (let i = 0; i < recipeCards.length; i++) {
	let recipeId = i
	recipeCards[i].addEventListener('click', function () {

		window.location.href = `/${recipeId}`
	});
}

// const spans = document.querySelectorAll('span')

// const esconderI = document.querySelector('.ingredients')
// const esconderP = document.querySelector('.preparation')
// const esconderIn = document.querySelector('.information')

// for (let span of spans) {
// 	span.addEventListener('click', function () {
// 		const spanId = span.getAttribute("id")
// 		if(spanId == esconderI){
// 			esconderI.classList.add("hide")
// 		}
// 	})

// }

const sectors = document.querySelectorAll('.recipe_showhide');
const showHide = document.querySelectorAll('.showhide_btn');

for(let i = 0; i < showHide.length; i++) {
    showHide[i].addEventListener('click', function() {
        if (showHide[i].innerHTML == 'ESCONDER') {
            sectors[i].setAttribute("hidden",true)
            showHide[i].innerHTML = 'MOSTRAR'
        } else {
            sectors[i].removeAttribute('hidden',true)
            showHide[i].innerHTML = 'ESCONDER'
        }
    })
}