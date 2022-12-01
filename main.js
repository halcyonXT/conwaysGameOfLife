/********************************************************************* */
/*                                                                     */
/*                             Copyright ©                             */
/*                             11/30/2022                              */
/*                    Holder: Github - halcyonXT                       */
/*                 Contact: halcyonXT1987@gmail.com                    */
/*                                                                     */
/***********************************************************************/

class Cell {
    constructor(id, isAlive, aliveNeighbors, borderExc) {
        this.id = id;
        this.isAlive = isAlive;
        this.aliveNeighbors = aliveNeighbors;
        this.borderExc = borderExc;
    }

}

let toolMode = "invert"
let selectedTool = 1
let brushFlag = false;
let cells = []
let idBar = 1
let SIZE = 16
let speed = 250
let timer
let resizedFlag = 0
let userDefColor = "#FFFFFF"
let timesPressed = 5;
let saveStateLimit = 20
let savedStates = []

let startingIndex = 0;
let endingIndex = 0; //for copy
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
            `<td class="cells" id="cell${idBar}" onmouseup="ifPen(${idBar})" onmousedown="ifBrush(${idBar}, true)" onmouseover="ifBrush(${idBar})" 
            style="height:${side}px;width:${side}px"></td>`
            idBar++;
            //console.log(`idBar:${idBar}\nSize:${SIZE}\nside:${side}\ni:${i}\nj:${j}`)
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

const updateTool = (tool) => {
    selectedTool = tool
    document.getElementById("copy").style.boxShadow = "#ff1361 0px 0px 0px"
    document.getElementById("pen").style.boxShadow = "#ff1361 0px 0px 0px"
    document.getElementById("brush").style.boxShadow = "#ff1361 0px 0px 0px"
    document.getElementById("paste").style.boxShadow = "#ff1361 0px 0px 0px"
    switch(tool) {
        case 1:
            document.getElementById("pen").style.boxShadow = "#ff1361 0px 0px 12px"
            break;
        case 2:
            document.getElementById("brush").style.boxShadow = "#ff1361 0px 0px 12px"
            break;
        case 3:
            document.getElementById("copy").style.boxShadow = "#ff1361 0px 0px 12px"
            break;
        case 4:
            document.getElementById("paste").style.boxShadow = "#ff1361 0px 0px 12px"
            break;
    }
}
updateTool(1)

const initiateCopy = (id) => {
    let targetId = id--
    
}

const ifPen = (id) => {
    switch(selectedTool) {
        case 1:
            convert(id, true);
            break;
        case 2:
            break;
    }
}

const ifBrush = (id, md = false) => {
    switch(selectedTool) {
        case 1:
            return;
        case 2:
            if (md) {
                convert(id, true);
            }
            if (brushFlag) {
                convert(id, true);
            }
            break;
        case 3:
            initiateCopy(id)
            break;
    }
}

document.getElementById("mainframe").addEventListener("mousedown", () => {
    if (selectedTool == 2) {
        brushFlag = true;
        //console.log("TRIGGERED")
        document.getElementById("mainframe").addEventListener("mouseup", () => {
            if (brushFlag) {
                brushFlag = false
                //console.log("LEFT")
            }
        })
        document.getElementById("mainframe").addEventListener("mouseleave", () => {
            if (brushFlag) {
                brushFlag = false
                //console.log("LEFT")
            }
        })
    }
})

const convert = (id, user = false) => {
    let target = document.getElementById(`cell${id}`)
    let targetId = id-1
    switch(cells[targetId].isAlive) {
        case true:
            if (toolMode == "alive" && user) {
                break;
            }
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
            if (toolMode == "dead" && user) {
                break;
            }
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
    for (let i=0; i < saveStateLimit; i++) {
        savedStates.push([null])
    }
    SIZE = Number(document.getElementById("size").value);
    document.getElementById("mainframe").innerHTML = ``;
    generate()
}

const backward = () => {
    document.getElementById("mainframe").style.boxShadow = "white 0px 0px 10px"
    if (timesPressed != 0) {
        timesPressed--
    } else {
        document.getElementById("mainframe").style.boxShadow = "red 0px 0px 10px"
        document.getElementById("ss--input").style.boxShadow = "red 0px 0px 6px"
        setTimeout(() => {
            document.getElementById("mainframe").style.boxShadow = "white 0px 0px 0px"
            document.getElementById("ss--input").style.boxShadow = "red 0px 0px 0px"
        }, 150)
        return
    }
    for (let cell of cells) {
        if (cell.isAlive) {
            convert(cell.id)
        }
    }
    for (let cell of savedStates[timesPressed]) {
        convert(cell)
    }
    setTimeout(() => {
        document.getElementById("mainframe").style.boxShadow = "white 0px 0px 0px"
    }, 200)
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


async function SavePhoto(inp) 
{
    let formData = new FormData();
    let photo = inp.files[0];      
         
    formData.append("photo", photo);
    
    const ctrl = new AbortController()    // PLEASE IGNORE NAMES THANKS
    setTimeout(() => ctrl.abort(), 5000);
    
    let reader = new FileReader()
    reader.onload = runImport;
    reader.readAsText(photo)
    
}

function runImport (event) {
	let str = event.target.result;
	let json = JSON.parse(str);
	SIZE = json.size
    let loadState = json.state
    cells = []
    idBar = 1;
    queuedInversions = []
    isActive = false
    savedStates = []
    for (let i=0; i < saveStateLimit; i++) {
        savedStates.push([null])
    }
    document.getElementById("mainframe").innerHTML = ``;
    generate()
    for (let cell of loadState) {
        convert(cell)
    }
}

const exportFunction = () => {
    let randomNumbers = String(Math.floor(Math.random() * 100000000))
    let exportData = []
    for (let cell of cells) {
        if (cell.isAlive) {
            exportData.push(cell.id)
        }
    }
    let data = `
    {
        "size": ${SIZE},
        "state": [${exportData}]
    }`
    let blob = new Blob([data], {type: "application/json"});
    let href = URL.createObjectURL(blob)
    document.getElementById("export").href = href
    document.getElementById("export").download = `${randomNumbers}.json`
    console.log(data)
}

gameflow()
