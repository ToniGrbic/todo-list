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

let completed = false
let editFlag = false
let editElement
let editID = ''

class UI {
 static checkItem(btn){
    let todo = btn.parentElement.parentElement;
    const id = todo.dataset.id;
    if(!todo.classList.contains('todoCompleted')){
        todo.classList.add('todoCompleted')
        completed = true
        this.displayAlert('todo completed!','success')
    }else{
        todo.classList.remove('todoCompleted')
        completed = false
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
    editElement = btn.nextElementSibling;
    const element = btn.parentElement
    
    let todoStorageItem = Storage.getStorageItem(element.dataset.id)
    editFlag = true

    if(todoStorageItem.completed && editFlag){
        this.displayAlert('cannot edit a completed todo!', 'danger')
    }else{
        textInput.value = editElement.innerHTML
        submitText.innerText="Edit"
        editID = element.dataset.id
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
    editID = ''
    editFlag = false
    completed = false
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

 appendTodo(text, id, completed){
    const itemDiv = document.createElement('div')
    const datasetAttr = document.createAttribute('data-id')

    itemDiv.classList.add('todoDiv')
    datasetAttr.value = id
    itemDiv.setAttributeNode(datasetAttr)

    itemDiv.innerHTML = `<i class="fas fa-edit edit-btn"></i>
                         <h4>${text}</h4>
                         <div><i class="fas fa-check-square fa-2x check-btn"></i>
                            <i class="fas fa-minus-square fa-2x del-btn"></i></div>`;
    
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

    if(completed)
        itemDiv.classList.add('todoCompleted')

    listDiv.appendChild(itemDiv); 
 }

 getItems(){
    let Items = Storage.getLocalStorage();

    Items.forEach((Item)=>{
        const input_text = Item.text;
        const id = Item.id
        const completed = Item.completed
        this.appendTodo(input_text,id,completed); 
    })
    if(Items.length > 0)
    clearBtn.classList.add('show-container')
 }
};

class Storage {

 static addStorageItem(text, id){
    let Items = this.getLocalStorage();

    let todo = { text, id, completed:false }
    Items.push(todo);
    this.setLocalStorage(Items)
 }

 static delStorageItem(id){
    let Items = this.getLocalStorage();
    
    Items = Items.filter((Item)=>{
        if(Item.id !== id){
            return Item
        }
    })
    this.setLocalStorage(Items)
 }

 static editLocalStorage(text, id){
    let Items = this.getLocalStorage();

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
        Items = JSON.parse(localStorage.getItem('Items'));
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
            let todos = Storage.getLocalStorage()
            let text = todos.map(todo => todo.text).join("\n")
            
            downloadButton.addEventListener('click', function(e){
                let fileName = fileNameInput.value;
                text = "todos:\n" + text
                console.log(text)
                UI.downloadFile(fileName, text)
                fileNameInput.value=""
            })
            
        }else if(e.target.classList.contains('Open')){
            openFile.classList.toggle('show-open-file')
            inputFile.addEventListener('change', function(e){
                
                let fileName = inputFile.files[0].name
                fileChoice.innerText = "current file: " + fileName;

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
        const todos = listDiv.querySelectorAll('div');

        todos.forEach(function(todo){
            let TodoText = todo.children[1].innerText;

            if(TodoText === input_text)
                isAdded = true
        })

        const id = new Date().getTime().toString()
    //different submit cases
    if(input_text && !isAdded && !editFlag){   

        ui.appendTodo(input_text,id,completed)
        clearBtn.classList.add('show-container')
        UI.displayAlert('todo added!', 'success')
        Storage.addStorageItem(input_text,id)
        UI.setToDefault()
    }
    else if(input_text && !isAdded && editFlag){

        editElement.innerHTML = input_text
        UI.displayAlert('todo edited!', 'success') 
        Storage.editLocalStorage(input_text,editID)
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
    const todos = listDiv.querySelectorAll('.todoDiv');
    todos.forEach(function(todo){
    switch(e.target.value){
        case "All":
             todo.style.display = "flex";
        break;
        case "Completed":
            if(todo.classList.contains("todoCompleted")){
                todo.style.display = "flex";
            }else{
                todo.style.display ="none";
            }
        break;
        case "Uncompleted":
            if(!todo.classList.contains("todoCompleted")){
                todo.style.display = "flex";
            }else{
                todo.style.display ="none";
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
