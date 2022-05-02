const voteForm = document.querySelector("#voteForm")
const candidateForm = document.querySelector("#candidateForm")

document.addEventListener("DOMContentLoaded", () => {
    App.init()
})

voteForm.addEventListener("submit", e => {
    e.preventDefault() //con esto cancelamos el refresh de la pagina que era automatico
    App.doVote(voteForm["fullname"].value, voteForm["option"].value)
})

candidateForm.addEventListener("submit", e => {
    e.preventDefault() //con esto cancelamos el refresh de la pagina que era automatico
    App.addCandidate(candidateForm["fullname"].value, candidateForm["agrupation"].value)
})