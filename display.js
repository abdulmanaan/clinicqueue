const serving = document.getElementById("nowToken");
const nextList = document.getElementById("nextList");
const clock = document.getElementById("clock");

function updateClock() {
    clock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit"});
}

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
        serving.textContent = "Token -";
    } else {
        serving.textContent = `Token ${patientInRoom.token}`;
    }

    serving.classList.toggle("on-break", onBreak);

    const avg = averageMinutes(patients);
    const top5 = patients.filter(p => p.status === "waiting").slice(0, 5);
    nextList.innerHTML = "";
    let count = 0;
    for (const p of top5) {
        count += 1;
        const li = document.createElement("li");
        const tokenSpan = document.createElement("span")
        const timeSpan = document.createElement("span");
        timeSpan.className = "next-time";
        tokenSpan.textContent = `Token ${p.token}`;
        if (onBreak) {
            timeSpan.textContent = "after break";
        } else {
            const minutes = Math.max(1, Math.round(count * avg));
            timeSpan.textContent = `about ${minutes} min`;
        }
        li.appendChild(tokenSpan);
        li.appendChild(timeSpan);
        nextList.appendChild(li);
    }
}

render();
window.addEventListener("storage", render);

updateClock();
setInterval(updateClock, 1000);
