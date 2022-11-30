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
let SIZE = 4
let speed = 250
let timer
let resizedFlag = 0
let userDefColor = "#FFFFFF"
let timesPressed = 5;
let saveStateLimit = 20
let savedStates = []
for (let i=0; i < 20; i++) {
    savedStates.push([null])
}

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

const generate = () => {
    let mainframe = document.getElementById("mainframe");
    mainframe.innerHTML = ``;
    let exclusionary;
    let side = 480 / SIZE
    for (let i=1; i < SIZE+1; i++) {
        mainframe.innerHTML += `<tr id="row${i}">`;

        for (let j=1; j < SIZE+1; j++) {
            if (j == 1 || j == SIZE) {
                switch (j) {
                    case 1:
                        exclusionary = "left"
                        break;
                    case SIZE-resizedFlag:
                        exclusionary = "right"
                        break;
                }
            } else exclusionary = "none"

            cells.push(new Cell(idBar, false, 0, exclusionary))
            document.getElementById(`row${i}`).innerHTML += 
            `<td class="cells" id="cell${idBar}" onmouseup="convert(${idBar})" 
            style="height:${side}px;width:${side}px"></td>`
            idBar++;
            console.log(`idBar:${idBar}\nSize:${SIZE}\nside:${side}\ni:${i}\nj:${j}`)
            if (j == SIZE) {
                break;
            }
        }
        mainframe.innerHTML += `</tr>`
        if (i == SIZE) {
            break;
        }
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
            target.style.backgroundColor = userDefColor;
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
//<button id="begin" onclick="begin()">BEGIN</button>
const begin = () => {
    isActive = !isActive
    switch (isActive) {
        case true:
            document.getElementById("play").src = "./resources/pause.png"
            //document.getElementById("mainframe").style.pointerEvents = "none";
            buildQueue()
        break;
        case false:
            document.getElementById("play").src = "./resources/play.png"
            //document.getElementById("mainframe").style.pointerEvents = "all";
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

const saveState = () => {
    let temp = []
    for (let cell of cells) {
        if (cell.isAlive) {
            temp.push(cell.id)
        }
    }
    savedStates.push(temp)
    savedStates.shift()
}

const executeQueue = () => {
    queuedInversions.forEach(item => {
        convert(item)
    })
}

const gameflow = () => {
    timer = setInterval(() => {
        if (isActive) {
            timesPressed = saveStateLimit;
            saveState();
            buildQueue();
            //console.log("BUILD:" + queuedInversions)
            executeQueue();
            //console.log("EXEC:" + queuedInversions)
        }
    },speed)
}

const forward = () => {
    timesPressed = saveStateLimit
    saveState()
    buildQueue()
    executeQueue()
}

document.getElementById("speed").addEventListener("change", () => {
    speed = 1525 - document.getElementById("speed").value;
    clearInterval(timer)
    timer = null;
    gameflow()
})


const flush = () => {
    cells = []
    idBar = 1;
    queuedInversions = []
    isActive = false
    savedStates = []
    SIZE = Number(document.getElementById("size").value);
    document.getElementById("mainframe").innerHTML = ``;
    generate()
}

const backward = () => {
    if (timesPressed != 0) {
        timesPressed--
    }
    for (let cell of cells) {
        if (cell.isAlive) {
            convert(cell.id)
        }
    }
    for (let cell of savedStates[timesPressed]) {
        convert(cell)
    }
}

const updateSavestate = () => {
    savedStates = []
    saveStateLimit = Number(document.getElementById("ss--input").value)
    if (saveStateLimit > 100) {
        saveStateLimit = 100
        document.getElementById("ss--input").value = "100"
    }
    for (let i=0; i < saveStateLimit; i++) {
        savedStates.push([null])
    }
}

gameflow()
