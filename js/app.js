import { listDiv, submit, options, textInput,clearBtn, dropdownMenu, fileOptions, 
         fileName, fileNameInput, downloadButton, openFile, inputFile, fileChoice } from './DOM_elements.js' 

import { Todo } from './Todo.js'
import { UI } from './UI.js'
import { Storage } from './Storage.js'
import { completed, editFlag, editID, editElement } from './UI.js'

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
                    let fileItems = reader.result.split('\n').slice(1)
                    Storage.addToStorageFromFile(fileItems)
                    ui.getItems()
                    UI.displayAlert("list opened from file", "success")
                } 
            }, false)
        }
    })

    submit.addEventListener('click', function(e) {
        
        e.preventDefault()
        const input_text = textInput.value
        const id = new Date().getTime().toString()
        //different submit cases
        if(input_text && !editFlag){   

            const todo = new Todo(input_text,id,completed)
            ui.appendTodo(todo)
            clearBtn.classList.add('show-container')
            UI.displayAlert('todo added!', 'success')
            Storage.addStorageItem(todo.text,todo.id)
            UI.setToDefault()
        }
        else if(input_text && editFlag){

            editElement.innerHTML = input_text
            UI.displayAlert('todo edited!', 'success') 
            Storage.editLocalStorage(input_text, editID)
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
