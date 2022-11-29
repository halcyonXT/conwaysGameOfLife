class Cell {
    constructor(id, isAlive, aliveNeighbors, borderExc) {
        this.id = id;
        this.isAlive = isAlive;
        this.aliveNeighbors = aliveNeighbors;
        this.borderExc = borderExc;
    }

}

let cells = []
let idBar = 1
let SIZE = 48

const isQueued = (id) => {
    id--
    switch(cells[id].isAlive) {
        case true:
            switch(cells[id].aliveNeighbors) {
                case 2:
                case 3:
                    return false;
                default:
                    return true;
            }
        break;
        case false:
            if (cells[id].aliveNeighbors == 3) {
                return true;
            } else return false;
            break;
        default:
            console.error("FATAL ERROR IN isQueued METHOD:\nisAlive:" + cells[id].isAlive)
    }
}

function generate() {
    let mainframe = document.getElementById("mainframe");
    let exclusionary;
    for (let i=1; i < 49; i++) {
        mainframe.innerHTML += `<tr id="row${i}">`;

        for (let j=1; j < 49; j++) {
            if (j == 1 || j == SIZE) {
                switch (j) {
                    case 1:
                        exclusionary = "left"
                        break;
                    case SIZE:
                        exclusionary = "right"
                        break;
                }
            } else exclusionary = "none"

            cells.push(new Cell(idBar, false, 0, exclusionary))
            document.getElementById(`row${i}`).innerHTML += 
            `<td class="cells" id="cell${idBar}" onmouseup="convert(${idBar})"></td>`
            idBar++;
        }
        mainframe.innerHTML += `</tr>`
    }
}

generate()

/* ------------------------- ABOVE IS GENERATION CODE --------------------------- */

let isActive = false;
let queuedInversions = []

const convert = (id) => {
    let target = document.getElementById(`cell${id}`)
    let targetId = id-1
    switch(cells[targetId].isAlive) {
        case true:
            target.style.backgroundColor = "black";
            cells[targetId].isAlive = false;
            switch(cells[targetId].borderExc) {
                case "right":
                    cells[targetId-1].aliveNeighbors--
                    if (targetId + SIZE <= SIZE*SIZE) {
                        cells[targetId+SIZE].aliveNeighbors--
                        cells[targetId+SIZE-1].aliveNeighbors--
                    }
                    if (targetId - SIZE >= 0) {
                        cells[targetId-SIZE].aliveNeighbors--
                        cells[targetId-SIZE-1].aliveNeighbors--
                    }
                    break;
                case "left":
                    cells[targetId+1].aliveNeighbors--
                    if (targetId + SIZE <= SIZE*SIZE) {
                        cells[targetId+SIZE].aliveNeighbors--
                        cells[targetId+SIZE+1].aliveNeighbors--
                    }
                    if (targetId - SIZE >= 0) {
                        cells[targetId-SIZE].aliveNeighbors--
                        cells[targetId-SIZE+1].aliveNeighbors--
                    }
                    break;
                case "none":
                    cells[targetId+1].aliveNeighbors--
                    cells[targetId-1].aliveNeighbors--
                    if (targetId + SIZE <= SIZE*SIZE) {
                        cells[targetId+SIZE].aliveNeighbors--
                        cells[targetId+SIZE+1].aliveNeighbors--
                        cells[targetId+SIZE-1].aliveNeighbors--
                    }
                    if (targetId - SIZE >= 0) {
                        cells[targetId-SIZE].aliveNeighbors--
                        cells[targetId-SIZE+1].aliveNeighbors--
                        cells[targetId-SIZE-1].aliveNeighbors--
                    }
                    break;
            }

        break;
        case false:
            target.style.backgroundColor = "white";
            cells[targetId].isAlive = true;
            switch(cells[targetId].borderExc) {
                case "right":
                    cells[targetId-1].aliveNeighbors++
                    if (targetId + SIZE <= SIZE*SIZE) {
                        cells[targetId+SIZE].aliveNeighbors++
                        cells[targetId+SIZE-1].aliveNeighbors++
                    }
                    if (targetId - SIZE >= 0) {
                        cells[targetId-SIZE].aliveNeighbors++
                        cells[targetId-SIZE-1].aliveNeighbors++
                    }
                    break;
                case "left":
                    cells[targetId+1].aliveNeighbors++
                    if (targetId + SIZE <= SIZE*SIZE) {
                        cells[targetId+SIZE].aliveNeighbors++
                        cells[targetId+SIZE+1].aliveNeighbors++
                    }
                    if (targetId - SIZE >= 0) {
                        cells[targetId-SIZE].aliveNeighbors++
                        cells[targetId-SIZE+1].aliveNeighbors++
                    }
                    break;
                case "none":
                    cells[targetId+1].aliveNeighbors++
                    cells[targetId-1].aliveNeighbors++
                    if (targetId + SIZE <= SIZE*SIZE) {
                        cells[targetId+SIZE].aliveNeighbors++
                        cells[targetId+SIZE+1].aliveNeighbors++
                        cells[targetId+SIZE-1].aliveNeighbors++
                    }
                    if (targetId - SIZE >= 0) {
                        cells[targetId-SIZE].aliveNeighbors++
                        cells[targetId-SIZE+1].aliveNeighbors++
                        cells[targetId-SIZE-1].aliveNeighbors++
                    }
                    break;
            }
        break;
    }
    //console.log(cells[targetId])
}

const begin = () => {
    isActive = !isActive
    switch (isActive) {
        case true:
            document.getElementById("begin").innerText = "PAUSE"
            document.getElementById("mainframe").style.pointerEvents = "none";
            buildQueue()
        break;
        case false:
            document.getElementById("begin").innerText = "BEGIN"
            document.getElementById("mainframe").style.pointerEvents = "all";
        break;
    }
}

const buildQueue = () => {
    queuedInversions = []
    for (let cell of cells) {
        if (cell.aliveNeighbors == 0 && !cell.isAlive) {
            continue;
        }
        switch(isQueued(cell.id)) {
            case true:
                queuedInversions.push(cell.id)
                break;
            case false:
                break;
        }
    }
}

const executeQueue = () => {
    queuedInversions.forEach(item => {
        convert(item)
    })
}

const gameflow = () => {
    setInterval(() => {
        if (isActive) {
            buildQueue();
            //console.log("BUILD:" + queuedInversions)
            executeQueue();
            //console.log("EXEC:" + queuedInversions)
        }
    },250)
}

gameflow()
