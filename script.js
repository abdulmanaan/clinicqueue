const patients = [];
let nextToken = 1;

function addPatient(name) {
    if (name.trim() === "") {
        return "Please write a valid name";
    }
    const newPatient = { token: nextToken, name: name, status: "waiting"};
    patients.push(newPatient);
    nextToken += 1;
    return newPatient;
};

function renderList() {
    const waitingList = document.getElementById("waitingList");
    waitingList.innerHTML = "";
    for (const p of patients) {
        const li = document.createElement("li");
        li.textContent = `Token ${p.token}: ${p.name} ${p.status}`;
        waitingList.appendChild(li);
    }
};

const nameInput = document.getElementById("nameInput");
const btn = document.getElementById("addBtn");

function handleAdd() {
    const newPatient = addPatient(nameInput.value);
    if (newPatient !== null) {
        renderList();
        nameInput.value = "";
    }
};

btn.addEventListener("click", handleAdd);

nameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleAdd();
    }
});
