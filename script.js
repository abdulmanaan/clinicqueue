let patients = [];
let nextToken = 1;
let onBreak = false;

const nameInput = document.getElementById("nameInput");
const addBtn = document.getElementById("addBtn");
const nextBtn = document.getElementById("nextBtn");
const breakBtn = document.getElementById("breakBtn");
const resumeBtn = document.getElementById("resumeBtn");
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

function renderList() {
    const waitingList = document.getElementById("waitingList");
    waitingList.innerHTML = "";
    const avg = averageMinutes(patients);
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
            li.textContent += ` ~${minutes} min `;
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

function updateButtons() {
    nextBtn.disabled = onBreak;
    breakBtn.disabled = onBreak;
    resumeBtn.disabled = !onBreak;
}

function saveData() {
    const clinicqueue = { nextToken: nextToken, patients: patients, onBreak: onBreak };
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
    onBreak = clinicqueue.onBreak === true;

    const inRoom = patients.find(p => p.status === "in room");
    if (onBreak) {
        serving.textContent = "Doctor on break";
    } else if (inRoom !== undefined) {
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

function finishCurrentPatient() {
    const patientInRoom = patients.find(p => p.status === "in room");
    if (patientInRoom !== undefined) {
        patientInRoom.status = "done";
        patientInRoom.endedAt = Date.now();
    }
}

function handleNext() {
    finishCurrentPatient();

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

function handleBreak() {
    finishCurrentPatient();
    onBreak = true;
    serving.textContent = "Doctor on break";
    updateButtons();
    saveData();
    renderList();
}

function handleResume() {
    onBreak = false;
    serving.textContent = "Doctor on duty now";
    updateButtons();
    saveData();
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
    onBreak = false;
    serving.textContent = "";
    updateButtons();
    saveData();
    renderList();
}

addBtn.addEventListener("click", handleAdd);
nextBtn.addEventListener("click", handleNext);
breakBtn.addEventListener("click", handleBreak);
resumeBtn.addEventListener("click", handleResume);
newDayBtn.addEventListener("click", handleNewDay);

nameInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleAdd();
    }
});

loadData();
updateButtons();
