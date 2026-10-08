function averageMinutes(list) {
    const finished = list.filter(
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
