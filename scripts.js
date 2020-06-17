const modal = document.querySelector(".modal")
const cards = document.querySelectorAll(".card")
const modalContent = document.querySelector(".modal-content")

for (let card of cards) {
    card.addEventListener("click", function () {
        const imgId = card.getAttribute("id")
        const h3 = card.querySelector("h3").textContent
        const p = card.querySelector("p").textContent
        const h3Modal = document.createElement("h3")
        const pModal = document.createElement("p")
        const close = document.createElement("h6")

        h3Modal.innerText = h3
        pModal.innerHTML = p
        close.innerHTML = "Close"

        modalContent.appendChild(h3Modal)
        modalContent.appendChild(pModal)
        modalContent.appendChild(close)

        document.querySelector(".modal-content h6").setAttribute("id", "close")


        modal.classList.add("active")

        modal.querySelector("img").src = `assets/${imgId}.png`
        modal.querySelector("img").alt = `${imgId}`


        document.querySelector("#close").addEventListener("click", function () {
            modal.classList.remove("active")
            modalContent.removeChild(h3Modal)
            modalContent.removeChild(pModal)
            modalContent.removeChild(close)
        })
    })
}
