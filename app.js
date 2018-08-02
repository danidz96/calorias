// Controlador almacenamiento - TODO

// Controlador de items
const ItemCtrl = (() => {

    // Constructor de items
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
      }

    // Estructura de los datos
    const data = {
        items: [
            // {id: 0, name: 'Entrecot', calories: 1200},
            // {id: 1, name: 'Galleta', calories: 400},
            // {id: 2, name: 'Huevos', calories: 300}
        ],
        currentItem: null,
        totalCalories: 0
    }

    // Métodos públicos
    return {
        getItems: () => data.items,
         
        addItems: (name, calories) => {
            let ID;

            // Crear nueva id
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;    
            } else {
                ID = 0;
            }

            // Pasar calorías a número
            calories = parseInt(calories);

            // Crear nuevo item
            newItem = new Item(ID, name, calories);

            // Guardar el nuevo item en los datos
            data.items.push(newItem);

            return newItem;
        },

        getItemById: id => {
            let found = null;

            // Loop items
            data.items.forEach(item => {
                if (item.id === id) {
                    found = item;
                }
            });

            return found;
        },

        updateItem: (name, calories) => {
            // Calorías a número
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;

                    found = item;
                }
            });

            return found;
        },

        setCurrentItem: item => {
            data.currentItem = item
        },

        getCurrentItem: () => {
            return data.currentItem;
        },

        logdata: () => data,

        // Calcular total de calorías
        getTotalCalories: () => {
            let total = 0;

            // Añadir las calorías al total 
            data.items.forEach(item => {
                total += item.calories;
            });

            // Añadir el total a la estructura de datos
            data.totalCalories = total;

            return data.totalCalories;
        }
    }

})();

// Controlador de la UI
const UICtrl = (() => {
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }

    // Métodos públicos
    return {
        populateItemList: items => {
            let html = '';

            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} calorías</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                </li>
                `;
            });

            // Instertar los items al DOM
            document.querySelector(UISelectors.itemList).insertAdjacentHTML('beforeend', html);
        },

        getUISelectors: () => UISelectors,

        // Ocultar lista cuando no hay ningún item
        hideList: () => {
            document.querySelector(UISelectors.itemList).style.visibility = 'hidden';
        },

        // Obtener el valor de los inputs
        getItemInput: () => {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },

        addListItem: item => {

            // Mostrar lista cuando existe algún item
            document.querySelector(UISelectors.itemList).style.visibility = 'visible';
            
            let html = `
            <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} calorías</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>
            `;

            // Añadir el nuevo item al final de la lista
            document.querySelector(UISelectors.itemList).insertAdjacentHTML('beforeend', html);

        },

        updateListItem: item => {
            // Obtener todos los li de la lista
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Convertir Node list a un Array
            listItems = Array.from(listItems);

            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id');

                if (itemID === `item-${item.id}`) {
                    let html = `
                        <strong>${item.name}: </strong> <em>${item.calories} calorías</em>
                        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                    `;
                    document.querySelector(`#${itemID}`).innerHTML = html;
                }
            });
        },

        clearInputs: () => {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        }, 

        showTotalCalories: totalCalories => document.querySelector(UISelectors.totalCalories).textContent = totalCalories,

        clearEditState: () => {
            UICtrl.clearInputs();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },

        showEditState: () => {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },

        addItemToForm: () => {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        }
    }
})();

// Controlador de la aplicación
const AppCtrl = ((ItemCtrl, UICtrl) => {
    // Cargar event listeners
    const loadEventListeners = () => {
        // Devolver selectores UI
        const UISelectors = UICtrl.getUISelectors();

        // Añadir evento a los items
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Desactivar enter al submit
        document.addEventListener('keypress', e => {
            if (e.keyCode === 13 || e.which ===13) {
                e.preventDefault(); 
                return false;
            }
        })

        // Evento para el botón de editar (hay que usar event delegation porque es un elemento que no esta creado desde el principio)
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Añadir eveto para actualizar el item
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    }

    const itemAddSubmit = e => {
        e.preventDefault();
        // Obtener el valor del formulario desde el controlador UI
        const input = UICtrl.getItemInput();
        
        // Comprobar el input de nombre y calorias
        if (input.name !== '' && input.calories !== '') {

            // Añadir items
            const newItem = ItemCtrl.addItems(input.name, input.calories);

            // Añadir item a la UI
            UICtrl.addListItem(newItem);

            // Obtener las calorías totales
            const totalCalories = ItemCtrl.getTotalCalories();

            // Añadir el total de calorías a la UI
            UICtrl.showTotalCalories(totalCalories);

            // Limpiar campos del formulario
            UICtrl.clearInputs();
        }

        
    }

    // Click editar item
    const itemEditClick = e => {
        e.preventDefault();

        if (e.target.classList.contains('edit-item')) {
            // Obtener la id del item
            const listId = e.target.parentNode.parentNode.id;

            // Separar en array
            const listIdArr = listId.split('-');

            // Obtener el id actual
            const id = parseInt(listIdArr[1]);

            // Obtener el item
            const itemToEdit = ItemCtrl.getItemById(id);

            // Set el item actual
            ItemCtrl.setCurrentItem(itemToEdit);

            // Añadir item al formulario
            UICtrl.addItemToForm();
        }
    }

    // Actualizar item
    const itemUpdateSubmit = e => {
        e.preventDefault();

        // Obtener item input
        const input = UICtrl.getItemInput();

        // Actualizar item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Actualizar la UI
        UICtrl.updateListItem(updatedItem);

        // Obtener las calorías totales
        const totalCalories = ItemCtrl.getTotalCalories();

        // Añadir el total de calorías a la UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.clearEditState();

        

    }

    // Métodos públicos
    return {
        init: () => {
            // Ocultar botones edición
            UICtrl.clearEditState();

            // Buscar items de la estructura de datos
            const items = ItemCtrl.getItems();

            // Comprobar si hay items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Rellenar lista con los items
                UICtrl.populateItemList(items);
            }

            // Obtener las calorías totales
            const totalCalories = ItemCtrl.getTotalCalories();

            // Añadir el total de calorías a la UI
            UICtrl.showTotalCalories(totalCalories);

            // Cargar event listeners
            loadEventListeners();
        }
    }

})(ItemCtrl, UICtrl);

// Iniciar app
AppCtrl.init();