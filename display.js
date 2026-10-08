const serving = document.getElementById("nowToken");
const nextList = document.getElementById("nextList");

function render() {
    const text = localStorage.getItem("clinicqueue");
    if (text === null) {
        return;
    }
    const clinicqueue = JSON.parse(text);
    const patients = clinicqueue.patients;
    const onBreak = clinicqueue.onBreak === true;

    const patientInRoom = patients.find(p => p.status === "in room");
    if (onBreak) {
        serving.textContent = "Doctor on break";
    } else if (patientInRoom === undefined) {
        serving.textContent = "In Room: Token -";
    } else {
        serving.textContent = `In Room: Token ${patientInRoom.token}`;
    }

    const avg = averageMinutes(patients);
    const top5 = patients.filter(p => p.status === "waiting").slice(0, 5);
    nextList.innerHTML = "";
    let count = 0;
    for (const p of top5) {
        count += 1;
        const li = document.createElement("li");
        if (onBreak) {
            li.textContent = `Token ${p.token} (after break)`;
        } else {
            const minutes = Math.max(1, Math.round(count * avg));
            li.textContent = `Token ${p.token} ~${minutes} min`;
        }
        nextList.appendChild(li);
    }
}

render();
window.addEventListener("storage", render);
