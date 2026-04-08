
let authorLinks = document.querySelectorAll("a");

for (let authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}

async function getAuthorInfo(event) {

    var myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();
    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    let author = data[0];

    let authorInfo = document.querySelector("#authorInfo");

    authorInfo.innerHTML = `
        <h2>${author.firstName} ${author.lastName}</h2>
        <img src="${author.portrait}" width="200"><br><br>

        <strong>Country:</strong> ${author.country} <br>
        <strong>Date of Birth:</strong> ${formatDate(author.dob)} <br>
        <strong>Date of Death:</strong> ${formatDate(author.dod)} <br><br>

        <strong>Biography:</strong><br>
        ${author.biography}
    `;
}

function formatDate(dateString) {
    let date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}