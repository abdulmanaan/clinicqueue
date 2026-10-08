let patients = [];
let nextToken = 1;

const nameInput = document.getElementById("nameInput");
const addBtn = document.getElementById("addBtn");
const nextBtn = document.getElementById("nextBtn");
const newDayBtn = document.getElementById("newDayBtn");
const serving = document.getElementById("nowServing");

function addPatient(name) {
    if (name.trim() === "") {
        return null;
    }
    const newPatient = { token: nextToken, name: name, status: "waiting" };
    patients.push(newPatient);
    nextToken += 1;
    return newPatient;
}

function averageMinutes() {
    const finished = patients.filter(
        p => p.status === "done" && p.startedAt !== undefined && p.endedAt !== undefined
    );
    if (finished.length === 0) {
        return 5;
    }
    let total = 0;
    for (const p of finished) {
        total += p.endedAt - p.startedAt;
    }
    const averageMs = total / finished.length;
    return averageMs / 60000;
}

function renderList() {
    const waitingList = document.getElementById("waitingList");
    waitingList.innerHTML = "";
    const avg = averageMinutes();
    let count = 0;
    for (const p of patients) {
        const li = document.createElement("li");
        li.textContent = `Token ${p.token}: ${p.name} (${p.status})`;
        if (p.status === "done" || p.status === "skipped") {
            li.style.color = "gray";
        }
        if (p.status === "waiting") {
            count += 1;
            const minutes = Math.max(1, Math.round(count * avg));
            li.textContent += ` ~${minutes} min`;
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

function saveData() {
    const clinicqueue = { nextToken: nextToken, patients: patients };
    localStorage.setItem("clinicqueue", JSON.stringify(clinicqueue));
}

function loadData() {
    const text = localStorage.getItem("clinicqueue");
    if (text === null) {
        return;
    }
    const clinicqueue = JSON.parse(text);
    patients = clinicqueue.patients;
    nextToken = clinicqueue.nextToken;
    const inRoom = patients.find(p => p.status === "in room");
    if (inRoom !== undefined) {
        serving.textContent = `In Room: Token ${inRoom.token}`;
    }
    renderList();
}

function handleAdd() {
    const newPatient = addPatient(nameInput.value);
    if (newPatient !== null) {
        saveData();
        renderList();
        nameInput.value = "";
    }
}

function handleNext() {
    const patientInRoom = patients.find(p => p.status === "in room");
    if (patientInRoom !== undefined) {
        patientInRoom.status = "done";
        patientInRoom.endedAt = Date.now();
    }

    const firstWaiting = patients.find(p => p.status === "waiting");
    if (firstWaiting === undefined) {
        serving.textContent = "No one in room";
        alert("No patient is waiting");
    } else {
        firstWaiting.status = "in room";
        firstWaiting.startedAt = Date.now();
        serving.textContent = `In Room: Token ${firstWaiting.token}`;
    }
    saveData();
    renderList();
}

function handleSkip(patient) {
    patient.status = "skipped";
    saveData();
    renderList();
}

function handleNewDay() {
    const waitingPatients = patients.filter(p => p.status === "waiting");
    const sure = confirm(`${waitingPatients.length} patients are waiting. Are you sure you want to start a new day?`);
    if (!sure) {
        return;
    }
    patients = [];
    nextToken = 1;
    serving.textContent = "";
    saveData();
    renderList();
}

addBtn.addEventListener("click", handleAdd);
nextBtn.addEventListener("click", handleNext);
newDayBtn.addEventListener("click", handleNewDay);

nameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleAdd();
    }
});

loadData();
