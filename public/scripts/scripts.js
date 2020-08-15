// const recipeCards = document.querySelectorAll('.card')

// for (recipeCard of recipeCards) {
//     recipeCard.addEventListener('click', function () {
//         let recipeId = recipeCard.getAttribute('id')
//         console.log(recipeId)

//         window.location.href = `/${recipeId}`
//     });
// }

const currentPage = location.pathname
const menuItems = document.querySelectorAll("header .header-infos a")

for (item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
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

function paginate(selectedPage, totalPages) {
    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

        const firstAndLastPage = currentPage <= 2 || currentPage >= totalPages - 1
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if (firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {

            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }

            if (oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }

            pages.push(currentPage)

            oldPage = currentPage
        }

    }

    return pages
}

function createPagination(pagination) {
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total

    const pages = paginate(page, total)


    let elements = ""

    for (let page of pages) {
        if (String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            if (filter) {
                elements += `<a href="recipes/?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="recipes/?page=${page}">${page}</a>`
            }
        }
    }

    pagination.innerHTML = elements
}

const pagination = document.querySelector(".pagination")

if(pagination){
    createPagination(pagination)
}

ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

        target.classList.add('active')

        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }

}

Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0

    },
    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "inicial"
        Lightbox.closeButton.style.top = "-80px"
    }
}