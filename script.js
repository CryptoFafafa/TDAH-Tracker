function actualizarFechaHora() {
    const ahora = new Date();
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const diaSemana = diasSemana[ahora.getDay()].toLowerCase();
    const numeroDia = ahora.getDate().toString().padStart(2, '0');
    const mesPalabra = obtenerMesPalabra(ahora.getMonth()).toLowerCase();

    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');

    document.getElementById('hours').textContent = horas;
    document.getElementById('minutes').textContent = minutos;
    document.getElementById('seconds').textContent = segundos;
    document.querySelector('.dia').textContent = diaSemana;
    document.querySelector('.fecha').textContent = numeroDia;
    document.querySelector('.mes').textContent = `de ${mesPalabra}`;

    document.documentElement.style.setProperty('--dia-spacing', obtenerEspaciadoPersonalizadoDia(diaSemana));
    document.documentElement.style.setProperty('--mes-spacing', obtenerEspaciadoPersonalizadoMes(mesPalabra));
}

function obtenerMesPalabra(numeroMes) {
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return meses[numeroMes];
}

function obtenerEspaciadoPersonalizadoDia(dia) {
    const espaciadoPorDia = {
        'domingo': '0.15em',
        'lunes': '0.545em',
        'martes': '0.28em',
        'miércoles': '0.028em',
        'jueves': '0.37em',
        'viernes': '0.216em',
        'sábado': '0.29em'
    };

    return espaciadoPorDia[dia] || '0.1em';
}

function obtenerEspaciadoPersonalizadoMes(mes) {
    const espaciadoPorMes = {
        'enero': '0.5em',
        'febrero': '0.3em',
        'marzo': '0.43em',
        'abril': '0.5em',
        'mayo': '0.5em',
        'junio': '0.4em',
        'julio': '0.4em',
        'agosto': '0.38em',
        'septiembre': '0.1em',
        'octubre': '0.3em',
        'noviembre': '0.13em',
        'diciembre': '0.18em'
    };

    return espaciadoPorMes[mes] || '0.1em';
}

setInterval(actualizarFechaHora, 1000);
actualizarFechaHora(); // Actualizar inmediatamente al cargar

document.addEventListener('DOMContentLoaded', () => {
    const displayBar = document.getElementById('displayBar');
    const app = document.querySelector('.app');
    const display = document.querySelector('.display');
    const clock = document.getElementById('clock');
    const taskSummaryList = document.getElementById('task-summary-list');
    const todoForm = document.getElementById("new-todo-form");
    const todoList = document.getElementById("todo-list");
    const contentInput = document.getElementById("content");
    const categoryInputs = document.querySelectorAll('input[name="category"]');

    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    let expandedCategories = JSON.parse(localStorage.getItem("expandedCategories")) || {};

    // Mostrar/ocultar la aplicación y display
displayBar.addEventListener('click', () => {
    const isVisible = app.classList.contains('show');
    app.classList.toggle('show');
    displayBar.innerText = isVisible ? 'Mostrar Aplicación' : 'Ocultar Aplicación';

    // Ocultar o mostrar la sección display
    if (isVisible) {
        display.style.display = 'flex'; // Muestra el display
        loadTaskSummary(); // Refrescar la sección de resumen de tareas al mostrar el display
        initializeTodos(); // Inicializar y ordenar la lista de tareas
    } else {
        display.style.display = 'none'; // Oculta el display
    }
});


    // Función para obtener el estilo basado en la urgencia
    function getStylesForUrgency(urgency) {
        let fontSize, opacity, letterSpacing, fontWeight;

        switch (urgency) {
    case 8:
        fontSize = '62px';
        opacity = '1';
        letterSpacing = '-0.103em';
        fontWeight = '900';
        break;
    case 7:
        fontSize = '54px';
        opacity = '1';
        letterSpacing = '-0.102em';
        fontWeight = '800';
        break;
    case 6:
        fontSize = '46px';
        opacity = '1';
        letterSpacing = '-0.101em';
        fontWeight = '700';
        break;
    case 5:
        fontSize = '40px';
        opacity = '0.9';
        letterSpacing = '0em';
        fontWeight = '600';
        break;
    case 4:
        fontSize = '32px';
        opacity = '0.7';
        letterSpacing = '0.05em';
        fontWeight = '500';
        break;
    case 3:
        fontSize = '24px';
        opacity = '0.5';
        letterSpacing = '0.1em';
        fontWeight = '400';
        break;
    case 2:
        fontSize = '16px';
        opacity = '0.2';
        letterSpacing = '0.15em';
        fontWeight = '300';
        break;
    case 1:
        fontSize = '12px';
        opacity = '0.1';
        letterSpacing = '0.2em';
        fontWeight = '200';
        break;
    case 0:
        fontSize = '12px';
        opacity = '0.1';
        letterSpacing = '0.25em';
        fontWeight = '100';
        break;
    default:
        fontSize = '12px';
        opacity = '0.1';
        letterSpacing = '0.3em';
        fontWeight = '100';
}

        return { fontSize, opacity, letterSpacing, fontWeight };
    }

	
	
	
	
	
	
    // Cargar el resumen de tareas en la sección display, ordenado por urgencia dentro de cada categoría
    function loadTaskSummary() {
    taskSummaryList.innerHTML = '';

    if (todos.length > 0) {
        const categoryOrder = Array.from(categoryInputs).map(input => input.value);

        const taskLimits = {
            'TDAH': 10,  // Mostrar hasta 10 tareas
            'Cocina': 2,
            'Pieza': 2,
            'Otras': 2,
            'Baño': 1,
            'patio': 2,
            'Ropa': 1,
            'Preparados': 4,
            'Proyectos': 3
        };

        categoryOrder.forEach(category => {
            const filteredTodos = todos.filter(todo => todo.category === category)
                                       .sort((a, b) => b.urgency - a.urgency);

            const limit = taskLimits[category] || 0;
            const tasksToShow = filteredTodos.slice(0, limit);

            tasksToShow.forEach(todo => {
                const li = document.createElement('li');
                const contentParts = todo.content.split(' ');

                let taskContent = '';
                if (contentParts.length > 1) {
                    taskContent += `<span class="first-words">${contentParts.slice(0, -1).join(' ')}</span>`;
                }
                taskContent += `<span class="last-word">${contentParts[contentParts.length - 1]}</span>`;

                li.innerHTML = taskContent;

                const styles = getStylesForUrgency(todo.urgency);
                li.style.fontSize = styles.fontSize;
                li.style.opacity = styles.opacity;
                li.style.letterSpacing = styles.letterSpacing;
                li.style.fontWeight = styles.fontWeight;

                // Agregar el evento de doble clic
                li.addEventListener('dblclick', () => {
                    // Establecer la urgencia de la tarea a 0
                    todo.urgency = 0;
                    // Actualizar la fecha de modificación y la siguiente modificación
                    todo.modifiedAt = new Date().toISOString();
                    todo.nextModification = calculateNewDate(new Date(), todo.frequency);

                    // Guardar los cambios en localStorage
                    localStorage.setItem("todos", JSON.stringify(todos));

                    // Recargar la lista de tareas
                    loadTaskSummary();
                });

                taskSummaryList.appendChild(li);
            });
        });
    } else {
        taskSummaryList.innerText = 'No hay tareas.';
    }
}

// Función para calcular la nueva fecha de modificación
function calculateNewDate(currentDate, frequency) {
    const minutesToAdd = (frequency * 24 * 60) / 9; 
    const newDate = new Date(currentDate.getTime() + minutesToAdd * 60 * 1000);
    return newDate.toISOString();
}

// Inicializa la lista al cargar la página
loadTaskSummary(); 


	
	
	
	
	
	


    // Manejo del formulario de tareas
    todoForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const content = contentInput.value.trim();
        const category = Array.from(categoryInputs).find(input => input.checked)?.value;

        if (content && category) {
            const todo = {
                content,
                category,
                urgency: Math.floor(Math.random() * 9), // 0 a 8
                importance: Math.floor(Math.random() * 5) + 1, // 1 a 5
                frequency: Math.floor(Math.random() * 2) + 1, // 1 a 30
                modifiedAt: new Date().toISOString(), // Fecha y hora actual en formato ISO
                done: false,
                nextModification: calculateNewDate(new Date(), Math.floor(Math.random() * 30) + 1)
            };

            todos.push(todo);
            localStorage.setItem("todos", JSON.stringify(todos));
            contentInput.value = ""; 
            categoryInputs.forEach(input => input.checked = false); 
            initializeTodos();
            loadTaskSummary(); // Refrescar la sección de resumen de tareas
        }
    });

    function calculateNewDate(currentDate, frequency) {
        const minutesToAdd = (frequency * 24 * 60) / 9; // Calcula los minutos a agregar
        const newDate = new Date(currentDate.getTime() + minutesToAdd * 60 * 1000); // Convierte los minutos a milisegundos y suma
        return newDate.toISOString(); // Devuelve la nueva fecha y hora en formato ISO
    }

    function initializeTodos() {
    todoList.innerHTML = "";

    // Obtener el orden de categorías desde los inputs en el DOM
    const categoryOrder = Array.from(categoryInputs).map(input => input.value);

    categoryOrder.forEach(category => {
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("category-item");

        const categoryHeader = document.createElement("div");
        categoryHeader.classList.add("category-header");
        categoryHeader.innerHTML = `
            <button class="toggle-category">
                <span class="material-symbols-outlined">
                    ${expandedCategories[category] ? "keyboard_arrow_down" : "keyboard_arrow_right"}
                </span>
            </button>
            <span>${category}</span>
        `;

        categoryElement.appendChild(categoryHeader);

        const taskList = document.createElement("div");
        taskList.classList.add("task-list");
        taskList.style.display = expandedCategories[category] ? "block" : "none";

        // Filtrar y ordenar las tareas por urgencia, importancia y frecuencia
        const filteredTodos = todos.filter(todo => todo.category === category);

        filteredTodos.sort((a, b) => {
            if (b.urgency !== a.urgency) return b.urgency - a.urgency;
            if (b.importance !== a.importance) return b.importance - a.importance;
            return a.frequency - b.frequency;
        });

        // Agregar las tareas ordenadas a la lista de la categoría
        filteredTodos.forEach((todo, index) => {
            const todoItem = document.createElement("div");
            todoItem.classList.add("todo-item");
            todoItem.dataset.index = todos.indexOf(todo); 
            todoItem.dataset.category = category; 
            todoItem.innerHTML = `
                <div class="todo-content">
                    <div class="todo-header">
                        <p>${todo.content}</p>
                        <input type="text" class="edit-input" style="display:none;" value="${todo.content}">
                        <div class="actions">
                            <button class="material-symbols-outlined edit">edit</button>
                            <button class="material-symbols-outlined save" style="display:none;">save</button>
                            <button class="material-symbols-outlined delete">delete</button>
                        </div>
                    </div>
                    <div class="details">
                        <div class="detail-card">
                            <button class="arrow left" data-index="${todos.indexOf(todo)}" data-type="urgency" data-category="${category}">&#9660;</button>
                            <span>${todo.urgency}</span>
                            <button class="arrow right" data-index="${todos.indexOf(todo)}" data-type="urgency" data-category="${category}">&#9650;</button>
                        </div>
                        <div class="detail-card">
                            <button class="arrow left" data-index="${todos.indexOf(todo)}" data-type="importance" data-category="${category}">&#9660;</button>
                            <span>${todo.importance}</span>
                            <button class="arrow right" data-index="${todos.indexOf(todo)}" data-type="importance" data-category="${category}">&#9650;</button>
                        </div>
                        <div class="detail-card">
                            <button class="arrow left" data-index="${todos.indexOf(todo)}" data-type="frequency" data-category="${category}">&#9660;</button>
                            <span>${todo.frequency}</span>
                            <button class="arrow right" data-index="${todos.indexOf(todo)}" data-type="frequency" data-category="${category}">&#9650;</button>
                        </div>
                    </div>
                    <div class="modified-at">
                        <small>Modificado: ${new Date(todo.modifiedAt).toLocaleString()}</small>
                        <small> ${new Date(todo.nextModification).toLocaleString()}</small>
                    </div>
                </div>
            `;

            taskList.appendChild(todoItem);
        });

        categoryElement.appendChild(taskList);
        todoList.appendChild(categoryElement);
    });

    addEventListeners();
}


    function addEventListeners() {
        document.querySelectorAll(".arrow").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                const type = e.target.dataset.type;
                const isRight = e.target.classList.contains("right");

                todos[index][type] = isRight ? Math.min(todos[index][type] + 1, type === 'urgency' ? 8 : 30)
                                             : Math.max(todos[index][type] - 1, 1);

                todos[index].modifiedAt = new Date().toISOString();
                todos[index].nextModification = calculateNewDate(new Date(), todos[index].frequency);
                localStorage.setItem("todos", JSON.stringify(todos));
                updateTodoItem(index);
                loadTaskSummary(); // Refrescar la sección de resumen de tareas
            });
        });

        document.querySelectorAll(".toggle-category").forEach(button => {
            button.addEventListener("click", (e) => {
                const categoryItem = e.target.closest(".category-item");
                const taskList = categoryItem.querySelector(".task-list");
                const categoryName = categoryItem.querySelector("span").innerText;
                const isExpanded = taskList.style.display === "block";

                taskList.style.display = isExpanded ? "none" : "block";
                expandedCategories[categoryName] = !isExpanded;
                localStorage.setItem("expandedCategories", JSON.stringify(expandedCategories));
                e.target.querySelector(".material-symbols-outlined").textContent = isExpanded ? "keyboard_arrow_right" : "keyboard_arrow_down";
            });
        });

        document.querySelectorAll(".edit").forEach(button => {
            button.addEventListener("click", (e) => {
                const todoItem = e.target.closest(".todo-item");
                todoItem.querySelector("p").style.display = "none";
                todoItem.querySelector(".edit-input").style.display = "block";
                todoItem.querySelector(".edit").style.display = "none";
                todoItem.querySelector(".save").style.display = "block";
            });
        });

        document.querySelectorAll(".save").forEach(button => {
            button.addEventListener("click", (e) => {
                const todoItem = e.target.closest(".todo-item");
                const newText = todoItem.querySelector(".edit-input").value.trim();
                const index = todoItem.dataset.index;

                if (newText) {
                    todos[index].content = newText;
                    todos[index].modifiedAt = new Date().toISOString();
                    todos[index].nextModification = calculateNewDate(new Date(), todos[index].frequency);
                    localStorage.setItem("todos", JSON.stringify(todos));
                    updateTodoItem(index);
                    loadTaskSummary(); // Refrescar la sección de resumen de tareas
                }
            });
        });

        document.querySelectorAll(".delete").forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.closest(".todo-item").dataset.index;
                todos.splice(index, 1);
                localStorage.setItem("todos", JSON.stringify(todos));
                initializeTodos();
                loadTaskSummary(); // Refrescar la sección de resumen de tareas
            });
        });
    }

    function updateTodoItem(index) {
        const todoItem = document.querySelector(`.todo-item[data-index="${index}"]`);
        const todo = todos[index];

        todoItem.querySelector(".todo-content p").innerText = todo.content;
        todoItem.querySelector(".edit-input").value = todo.content;
        todoItem.querySelector(".modified-at small").innerText = `Modificado: ${new Date(todo.modifiedAt).toLocaleString()}`;
        todoItem.querySelector(".modified-at small:nth-of-type(2)").innerText = ` ${new Date(todo.nextModification).toLocaleString()}`;

        todoItem.querySelectorAll(".detail-card span")[0].innerText = todo.urgency;
        todoItem.querySelectorAll(".detail-card span")[1].innerText = todo.importance;
        todoItem.querySelectorAll(".detail-card span")[2].innerText = todo.frequency;
    }

    function checkAndUpdateTodos() {
        const now = new Date();
        todos.forEach(todo => {
            const nextMod = new Date(todo.nextModification);
            if (nextMod <= now) {
                const etapas = (todo.frequency * 24 * 60) / 9; // Etapas
                const timeDiff = Math.floor((now - nextMod) / (1000 * 60)); // Diferencia en minutos
                const stepsCompleted = Math.floor(timeDiff / etapas); // Dividir por etapas y obtener valor entero
                
                todo.urgency = Math.min(todo.urgency + stepsCompleted, 8); // Sumar stepsCompleted a urgency
                todo.modifiedAt = now.toISOString();
                todo.nextModification = calculateNewDate(now, todo.frequency);
            }
        });
        localStorage.setItem("todos", JSON.stringify(todos));
        initializeTodos();
        loadTaskSummary(); // Refrescar la sección de resumen de tareas
    }

    checkAndUpdateTodos(); // Actualiza las tareas primero
    loadTaskSummary(); // Cargar el resumen de tareas inicialmente
});
