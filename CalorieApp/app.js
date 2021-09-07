let mylocalStorage = (function () {
  return {
    SaveData: function (item) {
      let data
      if (localStorage.getItem("itemCalories") === null) {
        data = []
        data.push(item)
        localStorage.setItem("itemCalories", JSON.stringify(data))
      } else {
        //Get data
        data = JSON.parse(localStorage.getItem("itemCalories"))
        // add data
        data.push(item)
        // save data
        localStorage.setItem("itemCalories", JSON.stringify(data))
      }
    },

    LoadData: function () {
      let data

      if (localStorage.getItem("itemCalories") === null) {
        data = []
      } else {
        data = JSON.parse(localStorage.getItem("itemCalories"))
      }
      return data
    },
    updateItemLocalStorage: function (updateditem) {
      let data = JSON.parse(localStorage.getItem("itemCalories"))

      data.forEach((el, index) => {
        if (updateditem.id == el.id) {
          data.splice(index, 1, updateditem)
        }
      })

      localStorage.setItem("itemCalories", JSON.stringify(data))
    },
    deleteItemfromLocalStorage: function (id) {
      let data = JSON.parse(localStorage.getItem("itemCalories"))

      data.forEach((el, index) => {
        if (id == el.id) {
          data.splice(index, 1)
        }
      })
      localStorage.setItem("itemCalories", JSON.stringify(data))
    },
    clearAllFromLocalStorage: function () {
      localStorage.removeItem("itemCalories")
    },
  }
})()

let ItemController = (function () {
  let data = {
    items: mylocalStorage.LoadData(),
    CurrentItem: null,
    totalCalories: 0,
  }

  let item = function (id, itemName, caloriesAmount) {
    this.id = id
    this.itemName = itemName
    this.caloriesAmount = caloriesAmount
  }

  function totalCalories() {
    let total = 0
    data.items.forEach(el => {
      total += el.caloriesAmount
    })
    data.totalCalories = total

    return data.totalCalories
  }

  return {
    getitems: function () {
      return data.items
    },

    addItems: function (name, amount) {
      let ID, newItem
      if (data.items.length > 0) {
        // get last id and add one to it
        ID = data.items[data.items.length - 1].id + 1
      } else {
        ID = 1 // default id if item is empty
      }
      // convert calories into integer
      amount = parseInt(amount)
      // create new item
      newItem = new item(ID, name, amount)
      // add item into array
      data.items.push(newItem)

      return newItem // return item so we can use it for UI
    },

    getItemToEdit: function (id) {
      data.items.forEach(el => {
        if (id === el.id) {
          founditem = el
        }
      })
      return founditem
    },
    updateItem: function (mealInput, calories) {
      calories = parseInt(calories)
      console.log(calories)
      let updateditem = null

      data.items.forEach(el => {
        if (el.id === data.CurrentItem.id) {
          el.itemName = mealInput
          el.caloriesAmount = calories
          updateditem = el
        }
      })
      return updateditem
    },

    deleteItem: function () {
      // way 1
      // let id = this.getCurrentItem().id;
      //  data.items.forEach((el,index)=>{
      //     if(el.id === id){
      //       data.items.splice(index,1);
      //     }
      //  });

      // way 2
      let id = this.getCurrentItem().id
      const ids = data.items.map(el => {
        return el.id
      })
      let index = ids.indexOf(id)
      data.items.splice(index, 1)
      console.log(data.items)
    },
    setCurrentItem: function (curr) {
      data.CurrentItem = curr
    },
    getCurrentItem: function () {
      return data.CurrentItem
    },
    getTotalCalories: function () {
      return totalCalories()
    },

    clearAll: function () {
      data.items = []
    },
    getdata: data,
  }
})()

let UIController = (function () {
  let elements = {
    list: "#items-list",
    listtags: "#items-list li",
    addbtn: ".add",
    getMealInput: "#meal",
    getCaloriesInput: "#calories",
    totalCalories: ".total-calories",
    back_btn: ".back",
    update_btn: ".update",
    delete_btn: ".delete",
    edit_item: ".edit-item",
    addcontainer: ".add-container",
    othercontainer: ".other-container",
    Clearallbtn: ".clearAll",
  }

  let Updateactive = false

  return {
    populatelist: function (items) {
      let html = "",
        cal
      items.forEach(el => {
        cal = el.caloriesAmount >= 800 ? "cal red" : "cal"
        html += `<li id="item-${el.id}">
        ${el.itemName}
         <span class="${cal}">  ${el.caloriesAmount} - Calories</span> 
         <a class="edit-item" href="">Edit</a>
        </li>`
      })

      document.querySelector(elements.list).innerHTML = html
    },
    addItemIntoUi: function (obj) {
      let html = "",
        cal
      let id = obj.id
      let meal = obj.itemName
      let calories = obj.caloriesAmount

      cal = calories >= 800 ? "cal red" : "cal"

      let li = document.createElement("li")
      li.id = `item-${id}`

      li.innerHTML = `${meal}
      <span class="${cal}">  ${calories} - Calories</span> 
       <a class="edit-item" href="">Edit</a>
      `

      document
        .querySelector(elements.list)
        .insertAdjacentElement("beforeend", li)
    },

    updateItemOnUi: function (item) {
      let listItems = document.querySelectorAll(elements.listtags)
      // convert node list into array
      //  listItems = Array.from(listItems);
      listItems.forEach(el => {
        let itemID = el.getAttribute("id")

        if (itemID === `item-${item.id}`) {
          let cal = item.caloriesAmount >= 800 ? "cal red" : "cal"

          document.querySelector(`#${itemID}`).innerHTML = `
        ${item.itemName}
         <span class="${cal}">  ${item.caloriesAmount} - Calories</span> 
         <a class="edit-item" href="">Edit</a>
           `
        }
      })
    },

    getInputs: function () {
      return {
        mealInput: document.querySelector(elements.getMealInput).value,
        calorieInput: document.querySelector(elements.getCaloriesInput).value,
      }
    },

    viewTotalCalories: function (totalCalories) {
      if (totalCalories > 0)
        document.querySelector(
          elements.totalCalories
        ).textContent = `Total Calories : ${totalCalories}`
      else
        document.querySelector(elements.totalCalories).textContent = `No Meals`
    },

    // Hide Update and delete Button when click on backthen Only Show Add button
    BackBtnState: function (e) {
      Updateactive = false
      document.querySelector(elements.addcontainer).style.display = "block"
      document.querySelector(elements.othercontainer).style.display = "none"
      document.querySelectorAll(elements.edit_item).forEach(el => {
        el.textContent = "Edit"
        el.style.background = "#e74c3c"
        el.style.width = "100px"
        el.style.cursor = "pointer"
        el.removeAttribute("style")
      })
      this.clearInputs()

      if (e != null) e.preventDefault()
    },
    deleteItemUi: function (currentid) {
      // way 1
      // let listItems = document.querySelectorAll(elements.listtags);
      // listItems.forEach(el=>{
      // if(el.lastElementChild.textContent === "Updating..."){
      //   el.remove();
      //   this.BackBtnState();
      // }
      // });
      console.log(currentid)
      let itemToDelete = `#item-${currentid}`
      document.querySelector(itemToDelete).remove()
      this.BackBtnState()

      this.clearInputs()
    },
    // show Update and delete and Back Button When Edit button from the list clicked
    EditBtnActive: function (e) {
      if (e.target.className === "edit-item" && !Updateactive) {
        document.querySelectorAll(elements.edit_item).forEach(el => {
          el.textContent = ""
          el.style.background = "#cd201f"
          el.style.width = "5px"
          el.style.cursor = "wait"
        })

        document.querySelector(elements.addcontainer).style.display = "none"
        document.querySelector(elements.othercontainer).style.display = "block"
        e.target.textContent = "Updating..."
        e.target.style.background = "#353b48"
        e.target.style.width = "170px"

        Updateactive = true
      }
      e.preventDefault()
    },

    fillFields: function (currentData) {
      document.querySelector(elements.getMealInput).value = currentData.itemName
      document.querySelector(elements.getCaloriesInput).value =
        currentData.caloriesAmount
    },

    clearInputs: function () {
      document.querySelector(elements.getMealInput).value = ""
      document.querySelector(elements.getCaloriesInput).value = ""
    },
    clearAll: function () {
      // way 1
      // document.querySelector(elements.list).innerHTML = '';
      // way 2
      let AlllistItems = document.querySelectorAll(elements.listtags)
      AlllistItems.forEach(el => {
        el.remove()
      })

      this.clearInputs()
    },
    getElementSelector: function () {
      return elements
    },
  }
})()

let AppController = (function (item, storage, ui) {
  // to get item when press on edit button once
  let ItemAvailable = false

  let getElements = ui.getElementSelector()

  function LoadEvent() {
    document
      .querySelector(getElements.addbtn)
      .addEventListener("click", AddItems)
    // disable Enter Key
    document.addEventListener("keypress", e => {
      if (e.keyCode === 13 || e.which === 13) {
        // Enter key code
        e.preventDefault()
      }
    })
    document
      .querySelector(getElements.back_btn)
      .addEventListener("click", backbtnState)
    document
      .querySelector(getElements.list)
      .addEventListener("click", EditBtnPressed)
    document
      .querySelector(getElements.update_btn)
      .addEventListener("click", UpdateCurrentItem)
    document
      .querySelector(getElements.delete_btn)
      .addEventListener("click", DeleteCurrentItem)
    document
      .querySelector(getElements.Clearallbtn)
      .addEventListener("click", ClearAll)
  }

  function AddItems() {
    let Inputs = ui.getInputs()
    if (Inputs.mealInput !== "" && Inputs.calorieInput !== "") {
      let objItems = ItemController.addItems(
        Inputs.mealInput,
        Inputs.calorieInput
      )
      ui.addItemIntoUi(objItems)
      storage.SaveData(objItems)
      ui.clearInputs()
      ui.viewTotalCalories(item.getTotalCalories())
      console.log(ItemController.getdata)
    } else {
      alert("Empty Fields")
    }
  }

  function backbtnState(e) {
    ui.BackBtnState(e)
    item.setCurrentItem(null)
    ItemAvailable = false
  }

  function EditBtnPressed(e) {
    ui.EditBtnActive(e)
    if (!ItemAvailable) {
      let itemValue = e.target.parentElement.id
      let output = itemValue.split("-")
      let id = parseInt(output[1])

      let getitem = item.getItemToEdit(id)

      // console.log(getitem); //  {id:1 , itemName:"Steak" , caloriesAmount : 988}
      item.setCurrentItem(getitem)

      // Get Current Item to input field
      ui.fillFields(item.getCurrentItem())

      ItemAvailable = true
    }
  }

  function UpdateCurrentItem(e) {
    let getfieldsValue = ui.getInputs()
    let updatedItem = item.updateItem(
      getfieldsValue.mealInput,
      getfieldsValue.calorieInput
    )
    console.log(item.getdata)
    backbtnState()
    ui.updateItemOnUi(updatedItem)
    storage.updateItemLocalStorage(updatedItem)
    CalcandViewTotalCalories()
    e.preventDefault()
  }

  function DeleteCurrentItem(e) {
    let currentitemid = item.getCurrentItem().id
    ui.deleteItemUi(currentitemid)
    item.deleteItem()
    CalcandViewTotalCalories()
    storage.deleteItemfromLocalStorage(currentitemid)
    e.preventDefault()
  }

  function CalcandViewTotalCalories() {
    let total = item.getTotalCalories()
    ui.viewTotalCalories(total)
  }

  function ClearAll() {
    item.clearAll()
    ui.clearAll()
    storage.clearAllFromLocalStorage()
    CalcandViewTotalCalories()
  }

  return {
    run: function () {
      console.log("Start App")
      // get items from current data
      let items = item.getitems()
      // add Item lists from Data
      ui.populatelist(items)
      // invole Event Listener for Add Input btn
      LoadEvent()
      // view Total Calories

      CalcandViewTotalCalories()
    },
  }
})(ItemController, mylocalStorage, UIController)

AppController.run()
