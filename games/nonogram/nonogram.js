function renderNonogram(cols, rows, target) {
    const groupSize = 5;

    const table = document.createElement("table");
    table.className = "nonogram";

    const thead = document.createElement("thead");
    const clueRow = document.createElement("tr");

    const corner = document.createElement("th");
    corner.className = "nonogram-corner";
    clueRow.appendChild(corner);

    cols.forEach((clue, colIndex) => {
        const th = document.createElement("th");
        th.className = "nonogram-column-clue";

        if (groupSize > 0 && (colIndex + 1) % groupSize === 0 &&
            colIndex !== cols.length - 1) {
            th.classList.add("group-right");
        }

        const inner = document.createElement("div");
        inner.className = "nonogram-column-clue-inner";

        clue.forEach(number => {
            const span = document.createElement("span");
            span.textContent = String(number);
            inner.appendChild(span);
        });

        th.appendChild(inner);
        clueRow.appendChild(th);
    });

    thead.appendChild(clueRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    rows.forEach((clue, rowIndex) => {
        const tr = document.createElement("tr");

        if (groupSize > 0 && (rowIndex + 1) % groupSize === 0 &&
            rowIndex !== rows.length - 1) {
            tr.classList.add("group-bottom");
            }

            const rowHeader = document.createElement("th");
        rowHeader.className = "nonogram-row-clue";
        rowHeader.scope = "row";
        rowHeader.textContent = clue.join(" ");
        tr.appendChild(rowHeader);

        cols.forEach((_, colIndex) => {
            const td = document.createElement("td");
            td.className = "nonogram-cell";

            if (groupSize > 0 && (colIndex + 1) % groupSize === 0 &&
                colIndex !== cols.length - 1) {
                    td.classList.add("group-right");
                }
                tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    if (target) {
        const container = typeof target === "string"
        ? document.querySelector(target)
        : target;

        if (!container || typeof container.appendChild !== "function") {
            throw new TypeError("target must be a valid CSS selector or DOM element.");
        }

        container.replaceChildren(table);
    }

    return table;
}

function loadPuzzle() {
    const index = Number(input.value) - 1;

    if (input.value === "" ||
        !Number.isInteger(index) ||
        index < 0 ||
        index >= col_data.length) {
        document.querySelector("#puzzle").innerHTML = "";
    return;
        }

        renderNonogram(col_data[index], row_data[index], "#puzzle");
}

function stepCounter(amount) {
    let value = Number(input.value) || 1;
    value += amount;

    value = Math.max(1, Math.min(value, col_data.length));

    input.value = value;
    loadPuzzle();
}

let playInterval = null;

function playPuzzle() {
    if (playInterval !== null) return;

    playInterval = setInterval(() => {
        stepCounter(1);

        if (Number(input.value) >= col_data.length) {
            pausePuzzle();
        }
    }, 1000 / 30);
}

function pausePuzzle() {
    clearInterval(playInterval);
    playInterval = null;
}

document.getElementById("play-puzzle").addEventListener("click", playPuzzle);
document.getElementById("pause-puzzle").addEventListener("click", pausePuzzle);

input = document.getElementById("puzzle-index");
input.addEventListener("input", loadPuzzle);

document.getElementById("previous-puzzle").addEventListener("click", () => {
    pausePuzzle();
    stepCounter(-1);
});

document.getElementById("next-puzzle").addEventListener("click", () => {
    pausePuzzle();
    stepCounter(1);
});
