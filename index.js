const taskName = document.querySelector("#name")
const description = document.querySelector("#description")
const date = document.querySelector("#date")
const form = document.querySelector(".form")
const list = document.querySelector(".todo-list")
const saveTask = document.querySelector(".submit")
const errorContainer = document.querySelector(".error-container")

const fragment = new DocumentFragment()
const templateList = document.querySelector(".template-list").content
const errorTemplate = document.querySelector(".template-error").content

const data = {name: taskName, desc: description, date : date}

saveTask.addEventListener('click', (e) => {
    e.preventDefault()

    let empty = isEmpty()
    let isCorrectDate

    if (empty) tempAlert("Error! 😢", "You must fill in all of the fields")
    
    else {
        isCorrectDate = calculateDate(date.value)
        
        if (isCorrectDate === false) {
            tempAlert("Ups... 😔", "Date is not correct...")
            date.value = ""
            
        } else addElements(isCorrectDate)
    }
})

const tempAlert = (title, text) => {
    errorTemplate.querySelector(".error-title").textContent = title
    errorTemplate.querySelector(".error-text").textContent = text

    const clone = errorTemplate.cloneNode(true);
    fragment.appendChild(clone)
    
    errorContainer.appendChild(fragment)

    errorContainer.style.display = "block"

    setTimeout(() => {
        errorContainer.style.display = "none"

        while (errorContainer.firstChild) {
            errorContainer.firstChild.remove()
        }
    }, 1500)
}

list.addEventListener('click', (e) => {
    const array = [ ...e.target.classList ] 

    if (array.includes("completed")) taskDone(array, e.target)
    if (array.includes("delete")) deleteTask(array, e.target)
})

const taskDone = (array, child) => {
    let siblings = getSiblings(array, child)

    
    siblings.forEach(sibling => {
        if (sibling.nodeType === 1) {
            sibling.style.textDecoration = "line-through"
            sibling.style.opacity = "0.5"
        }
    })
}

const getClass = (child, values) => {
    return child.hasChildNode ? child.firstChild.classList[0] 
        : `<div class="alert">${values}</div>`
}

const deleteTask = (array, child) => {
    siblings = getSiblings(array, child)
    
    siblings.forEach(sibling => {
        if (sibling.nodeType === 1) {
            sibling.classList.add("fade")

            const arr = Array.from(sibling.children)
            arr.forEach(item => item.classList.add("fade"))

            Promise.all(sibling.getAnimations().map( animation => {
                return animation.finished

            })).then( () => {
                sibling.parentElement.remove(); 
                    
                if (list.childElementCount === 1) {
                    list.style.display = "none"
                }
            })     
        }
    })
}

const getSiblings = (array, child) => {
    let siblings
    if (array.length === 1) {
        siblings = child.parentElement.parentElement.childNodes

    } else {
        siblings = child.parentElement.childNodes
        // console.log(`Sibling ${parent}`)
    }

    return siblings
}


const addElements = (isCorrectDate) => {
    templateList.querySelector('.name').textContent = data.name.value
    templateList.querySelector('.desc').textContent = data.desc.value
    templateList.querySelector('.date').textContent = data.date.value
    templateList.querySelector('.rem-days').textContent = isCorrectDate

    const clone = templateList.cloneNode(true);
    fragment.appendChild(clone)
    
    list.appendChild(fragment)
    
    list.style.display = "block"

    form.reset()
}


const isEmpty = () => {
    let empty;

    for (const property in data) {
        if (data[property].value === "") {
            empty = true
            break
        } else {
            empty = false
        }
    }

    return empty
}

const calculateDate = (dueDate) => {
    let diff = Date.parse(dueDate) - Date.now()
    let calc = 1000 * 3600 * 24

    let msToDays = Math.round(diff / calc) + 1

    return msToDays < 0 ? false : msToDays
}

