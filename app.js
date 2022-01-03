const listDiv = document.querySelector('#list')
const submit = document.querySelector('#submit')
const options = document.querySelector('#selectOption')
const textInput = document.querySelector('#text-input')
const alertDiv = document.querySelector(".alertDiv")
const clearBtn = document.querySelector(".clearBtn")
const submitText = document.querySelector("#submit h3")
const dropdownMenu = document.querySelector(".dropdown-menu")
const fileOptions = document.querySelector(".file-options")
const fileName = document.querySelector(".fileName")
const fileNameInput = document.querySelector("#fileName")
const downloadButton = document.querySelector(".downloadButton")
const openFile = document.querySelector(".open-file")
const inputFile = document.querySelector(".input-file")
const fileChoice = document.querySelector(".fileChoice")


class Todo{
    constructor(text, id, completed){
        this.text = text
        this.id = id
        this.completed = completed
    }
}

class UI {
  
  constructor(){
    this.completed = false
    this.editFlag = false
    this.editID = ''
    this.editElement = ''
  }

  static checkItem(btn){
    let todo = btn.parentElement.parentElement
    const id = todo.dataset.id;
    if(!todo.classList.contains('todoCompleted')){
        todo.classList.add('todoCompleted')
        this.completed = true
        this.displayAlert('todo completed!','success')
    }else{
        todo.classList.remove('todoCompleted')
        this.completed = false
        this.displayAlert('todo uncompleted!','danger')
    } 
    Storage.toggleCompletedLocalStorage(completed, id)
    this.setToDefault()
 }

 static deleteItem(btn){
    let todo = btn.parentElement.parentElement
    const id = todo.dataset.id
    todo.remove()
    this.displayAlert('todo deleted!','danger')
    Storage.delStorageItem(id)
    this.setToDefault()

    if(listDiv.children.length === 0){
        clearBtn.classList.remove('show-container')
    }
 }

 static editItem(btn){
    this.editElement = btn.nextElementSibling
    const element = btn.parentElement
    
    let todoStorageItem = Storage.getStorageItem(element.dataset.id)
    this.editFlag = true

    if(todoStorageItem.completed && this.editFlag){
        this.displayAlert('cannot edit a completed todo!', 'danger')
    }else{
        textInput.value = this.editElement.innerHTML
        submitText.innerText="Edit"
        this.editID = element.dataset.id
    }
 }
    
 static displayAlert(text, action){
    alertDiv.innerText = text
    alertDiv.classList.add(`alert-${action}`)

    setTimeout(function(){
        alertDiv.innerText = ''
        alertDiv.classList.remove(`alert-${action}`)
    },1200)
 }

 static setToDefault(){
    textInput.value = ''
    this.editID = ''
    this.editFlag = false
    this.completed = false
    submitText.innerText='Submit'
 }

 static toggleFileMenu(){
    fileOptions.classList.toggle('show-file-options')
 }

 static downloadFile(filename, text){
    
        let element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
        element.setAttribute('download', filename)
      
        element.style.display = 'none'
        document.body.appendChild(element)
      
        element.click()
        document.body.removeChild(element)
 }

 static clearTodos(){
    const todos = listDiv.querySelectorAll(".todoDiv")
        todos.forEach(function(todo){
            listDiv.removeChild(todo)
        })
        clearBtn.classList.remove('show-container')
        localStorage.removeItem('Items')
 }

 appendTodo(todo){
    const itemDiv = document.createElement('div')
    const datasetAttr = document.createAttribute('data-id')

    itemDiv.classList.add('todoDiv')
    datasetAttr.value = todo.id
    itemDiv.setAttributeNode(datasetAttr)

    itemDiv.innerHTML = `<i class="fas fa-edit edit-btn"></i>
                         <h4>${todo.text}</h4>
                         <div><i class="fas fa-check-square fa-2x check-btn"></i>
                            <i class="fas fa-minus-square fa-2x del-btn"></i></div>`
    
    itemDiv.addEventListener('click', function(e){
        const el = e.target
        if(el.classList.contains('edit-btn')){
            UI.editItem(el)
        }else if(el.classList.contains('check-btn')){
            UI.checkItem(el)
        }else if(el.classList.contains('del-btn')){
            UI.deleteItem(el)
        }
    })

    if(todo.completed)
        itemDiv.classList.add('todoCompleted')

    listDiv.appendChild(itemDiv); 
 }

 getItems(){
    let Items = Storage.getLocalStorage()

    Items.forEach((Item)=>{
        const input_text = Item.text
        const id = Item.id
        const completed = Item.completed
        const todo = new Todo(input_text,id,completed)
        this.appendTodo(todo) 
    })
    if(Items.length > 0)
    clearBtn.classList.add('show-container')
 }
};

class Storage {

 static addStorageItem(text, id){
    let Items = this.getLocalStorage()
    let completed = false
    let todo = new Todo(text, id, completed)
    Items.push(todo);
    this.setLocalStorage(Items)
 }

 static delStorageItem(id){
    let Items = this.getLocalStorage()
    
    Items = Items.filter((Item)=>{
        if(Item.id !== id){
            return Item
        }
    })
    this.setLocalStorage(Items)
 }

 static editLocalStorage(text, id){
    let Items = this.getLocalStorage()

    Items = Items.map((Item)=>{
        if(Item.id === id){
            Item.text = text
        }
        return Item
    })
    this.setLocalStorage(Items)
 }

 static toggleCompletedLocalStorage(completed, id){
    let Items = this.getLocalStorage()

    Items = Items.map((Item)=>{
        if(Item.id === id){
            Item.completed = completed
        }
        return Item
    })
    this.setLocalStorage(Items)
 }

 static getLocalStorage(){
    let Items
    if(localStorage.getItem('Items') === null){
        Items = [];
    }else{
        Items = JSON.parse(localStorage.getItem('Items'))
    }
    return Items
 }

 static getStorageItem(id){
    let Items = this.getLocalStorage()

    let [Item] = Items.filter((item) => {
        if(item.id === id){
            return item
        }
    })
    return Item
 }

 static setLocalStorage(Items){
    localStorage.setItem('Items', JSON.stringify(Items))
 }

 static addToStorageFromFile(fileItems){
    let i = 0;
    fileItems.forEach((fileItem)=>{
        const id = new Date().getTime() + i
        this.addStorageItem(fileItem, id.toString()) 
        i++
    }) 
 }
};

document.addEventListener('DOMContentLoaded', function(){
    const ui = new UI()
    ui.getItems()

    dropdownMenu.addEventListener('click', function(e){
        UI.toggleFileMenu()
    })

    fileOptions.addEventListener('click', function(e){
        if(e.target.classList.contains('Save-as')){
            
            fileName.classList.toggle('show-fileName')
            
            downloadButton.addEventListener('click', function(e){
                let todos = Storage.getLocalStorage()
                let text = ""
                text=todos.map(todo => todo.text).join("\n")
                text = "Todos:\n" + text
                let fileName = fileNameInput.value
                UI.downloadFile(fileName, text)
                fileNameInput.value=""
            })
            
        }else if(e.target.classList.contains('Open')){
            openFile.classList.toggle('show-open-file')
            inputFile.addEventListener('change', function(e){
                
                let fileName = inputFile.files[0].name
                fileChoice.innerText = "current file: " + fileName

                let todos = Storage.getLocalStorage()
                if(todos.length != 0){
                    UI.clearTodos()
                }
                const reader = new FileReader()
                reader.readAsText(inputFile.files[0])
                    
                reader.onload = function(){
                    fileItems = reader.result.split('\n').slice(1)
                    Storage.addToStorageFromFile(fileItems)
                    ui.getItems()
                    UI.displayAlert("list opened from file", "success")
                } 
            }, false)
        }
    })

    submit.addEventListener('click', function(e) {
    
        e.preventDefault();
        //check is todo is already added
        let isAdded = false
        const input_text = textInput.value;
        const todos = Storage.getLocalStorage()

        todos.forEach(function(todo){
            let TodoText = todo.text
            if(TodoText === input_text)
                isAdded = true
        })

        const id = new Date().getTime().toString()
    //different submit cases
    if(input_text && !isAdded && !ui.editFlag){   

        const todo = new Todo(input_text,id,ui.completed)
        ui.appendTodo(todo)
        clearBtn.classList.add('show-container')
        UI.displayAlert('todo added!', 'success')
        Storage.addStorageItem(todo.text,todo.id)
        UI.setToDefault()
    }
    else if(input_text && !isAdded && ui.editFlag){

        ui.editElement.innerHTML = input_text
        UI.displayAlert('todo edited!', 'success') 
        Storage.editLocalStorage(input_text,ui.editID)
        UI.setToDefault()
    }
    else if(input_text && isAdded){
        UI.displayAlert('todo already added!', 'danger')
        UI.setToDefault()
    }
    else{
        UI.displayAlert('please submit a todo!', 'danger')
    }
});  

options.addEventListener('click', (e) => {
    const todos = listDiv.querySelectorAll('.todoDiv')
    todos.forEach(function(todo){
    switch(e.target.value){
        case "All":
             todo.style.display = "flex"
        break;
        case "Completed":
            if(todo.classList.contains("todoCompleted")){
                todo.style.display = "flex"
            }else{
                todo.style.display ="none"
            }
        break;
        case "Uncompleted":
            if(!todo.classList.contains("todoCompleted")){
                todo.style.display = "flex"
            }else{
                todo.style.display ="none"
            }  
        break; 
    }
    });
});

clearBtn.addEventListener('click', function(e){
    e.preventDefault()
    
    if(confirm('Are you sure?')){
        UI.clearTodos()
        UI.setToDefault()
        UI.displayAlert("todos removed!", "success")
    }  
})
});
