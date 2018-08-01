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

        logdata: () => data,

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
        addBtn: '.add-btn',
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

        clearInputs: () => {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        }, 

        showTotalCalories: totalCalories => document.querySelector(UISelectors.totalCalories).textContent = totalCalories
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

    // Métodos públicos
    return {
        init: () => {
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