const patients = [];
let nextToken = 1;

function addPatient(name) {
    if (name.trim() === "") {
        return null
    }
    const newPatient = { token: nextToken, name: name, status: "waiting"};
    patients.push(newPatient);
    nextToken += 1;
    return newPatient;
}

function renderList() {
    const waitingList = document.getElementById("waitingList");
    waitingList.innerHTML = "";
    for (const p of patients) {
        const li = document.createElement("li");
        li.textContent = `Token ${p.token}: ${p.name} (${p.status})`;
        if (p.status === "done" || p.status === "skipped") {
            li.style.color = "gray";
        }
        if (p.status === "waiting") {
            const btn = document.createElement("button");
            btn.textContent = "Skip";
            btn.addEventListener("click", function () {
                handleSkip(p);
            });
            li.appendChild(btn);
        }
        waitingList.appendChild(li);
    }
}

const nameInput = document.getElementById("nameInput");
const addBtn = document.getElementById("addBtn");
const nextBtn = document.getElementById("nextBtn");

function handleAdd() {
    const newPatient = addPatient(nameInput.value);
    if (newPatient !== null) {
        renderList();
        nameInput.value = "";
    }
}

const serving = document.getElementById("nowServing");

function handleNext() {
    const patientInRoom = patients.find(p => p.status === "in room");
    if (patientInRoom !== undefined) {
        patientInRoom.status = "done";
    }

    const firstWaiting = patients.find(p => p.status === "waiting");
    if (firstWaiting === undefined) {
        serving.textContent = `No one in room`;
        alert("No patient is waiting");
    } else {
        firstWaiting.status = "in room";
        serving.textContent = `In Room: Token ${firstWaiting.token}`;
    }
    renderList();
}

function handleSkip(patient) {
    patient.status = "skipped";
    renderList();
}

addBtn.addEventListener("click", handleAdd);
nextBtn.addEventListener("click", handleNext);

nameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleAdd();
    }
});

