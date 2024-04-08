const container = document.querySelector("#container")
const selection_btns = document.querySelectorAll('.selector-button')
let window_open
let shared

const options = {
    searchable: true,
    perPageSelect: false,
    perPage: 18,
    paging: true,
    sortable: true,
    footer: false,
    fixedHeight: false,
    truncatePager: true,
    pagerDelta: 2
}
const dataTable = new simpleDatatables.DataTable("#vehiclestable", options)

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

const destroyTable = () => {
    dataTable.data.data = []
    dataTable.data.headings = []
    dataTable.refresh()
}

const closeNUI = () => {
    window_open = false
    container.classList.add("hidden")
    fetch(`https://${GetParentResourceName()}/close`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'}
    }).then(res => {
    });
}

const renderVehiclesTable = async () => {
    dataTable.init()
    let table_data = []
    headings = ["Spawn Name", "Make & Model", "Category", "Shop", "Price"]
    Object.keys(shared.vehicles).forEach(function(key) {
        let new_row = [
            shared.vehicles[key].model,
            shared.vehicles[key].brand + " " + shared.vehicles[key].name, 
            shared.vehicles[key].category, 
            shared.vehicles[key].shop, 
            shared.vehicles[key].price
        ]
        table_data.push(new_row)
    });
    console.log(table_data)
    dataTable.insert({headings: headings, data: table_data})
}

const renderItemsTable = async () => {
    dataTable.init()
    let table_data = []
    headings = ["Name", "Description", "Weight"]
    Object.keys(shared.items).forEach(function(key) {
        let new_row = [
            shared.items[key].name,
            shared.items[key].description, 
            shared.items[key].weight
        ]
        table_data.push(new_row)
    });
    dataTable.insert({headings: headings, data: table_data})
}

const renderWeaponsTable = async () => {
    dataTable.init()
    let table_data = []
    headings = ["Spawn ID", "Label", "Ammo Type"]
    Object.keys(shared.weapons).forEach(function(key) {
        let new_row = [
            shared.weapons[key].name,
            shared.weapons[key].label, 
            (shared.weapons[key].ammotype || "none")
        ]
        table_data.push(new_row)
    });
    dataTable.insert({headings: headings, data: table_data})
}

const renderJobsTable = async () => {
    dataTable.init()
    let table_data = []
    headings = ["Job", "Label", "Grade 0", "Grade 1", "Grade 2", "Grade 3", "Grade 4"]
    Object.keys(shared.jobs).forEach(function(key) {
        let job_grades = []
        for (let i=0; i<=4; i++) {
            if (shared.jobs[key].grades[i]) {
                job_grades.push(shared.jobs[key].grades[i].name + " $" + shared.jobs[key].grades[i].payment)
            } else {
                job_grades.push("none")
            }
        }
        let new_row = [
            key,
            shared.jobs[key].label,
            job_grades[0],
            job_grades[1],
            job_grades[2],
            job_grades[3],
            job_grades[4]
        ]
        table_data.push(new_row)
    });
    dataTable.insert({headings: headings, data: table_data})
}

const renderGangsTable = async () => {
    dataTable.init()
    let table_data = []
    headings = ["Gang", "Label", "Grade 0", "Grade 1", "Grade 2", "Grade 3", "Grade 4"]
    Object.keys(shared.gangs).forEach(function(key) {
        let gang_grades = []
        for (let i=0; i<=4; i++) {
            if (shared.gangs[key].grades[i]) {
                gang_grades.push(shared.gangs[key].grades[i].name)
            } else {
                gang_grades.push("none")
            }
        }
        let new_row = [
            key,
            shared.gangs[key].label,
            gang_grades[0],
            gang_grades[1],
            gang_grades[2],
            gang_grades[3],
            gang_grades[4]
        ]
        table_data.push(new_row)
    });
    dataTable.insert({headings: headings, data: table_data})
}

function handleSelection() {
    switch (this.innerText) {
        case 'VEHICLES':
            destroyTable()
            renderVehiclesTable()
            document.querySelector("#fixed-title").innerHTML = "Vehicles"
            break
        case 'ITEMS':
            destroyTable()
            renderItemsTable()
            document.querySelector("#fixed-title").innerHTML = "Items"
            break
        case 'WEAPONS':
            destroyTable()
            renderWeaponsTable()
            document.querySelector("#fixed-title").innerHTML = "Weapons"
            break
        case 'JOBS':
            destroyTable()
            renderJobsTable()
            document.querySelector("#fixed-title").innerHTML = "Jobs"
            break
        case 'GANGS':
            destroyTable()
            renderGangsTable()
            document.querySelector("#fixed-title").innerHTML = "Gangs"
            break
    }
}

selection_btns.forEach((button) => {
    button.addEventListener('click', handleSelection);
})

window.addEventListener('message', (event) => {
    let data = event.data
    if (data.type === 'v-sharedlist') {
        shared = data
        console.log(shared)
        container.classList.remove("hidden")
        renderVehiclesTable()
        window_open = true
    }
});

document.addEventListener("keydown", function(ev) {
    let key_pressed = ev.key;
    let valid_keys = ['Escape'];
    if (window_open && valid_keys.includes(key_pressed)) {
        switch (key_pressed) {
            case 'Escape':
                destroyTable()
                closeNUI()
                break;
        }
    }
});