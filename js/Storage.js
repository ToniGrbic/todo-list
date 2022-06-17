import {Todo} from './Todo.js'

export class Storage {

    static addStorageItem(text, id){
       let Items = this.getLocalStorage()
       let completed = false;
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
   
    static editLocalStorage(text, editID){
       let Items = this.getLocalStorage()
   
       Items = Items.map((Item)=>{
           if(Item.id === editID){
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
   