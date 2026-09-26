// Estado de la aplicación
let tasks = [];
const STORAGE_KEY = 'accounting_tasks';

// Elementos del DOM
const taskForm = document.getElementById('taskForm');
const tasksBody = document.getElementById('tasksBody');
const noTasks = document.getElementById('noTasks');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModal = document.querySelector('.close');
const cancelEdit = document.getElementById('cancelEdit');
const downloadReport = document.getElementById('downloadReport');
const filterState = document.getElementById('filterState');
const filterCategory = document.getElementById('filterCategory');
const filterPriority = document.getElementById('filterPriority');
const filterClient = document.getElementById('filterClient');
const clearFilters = document.getElementById('clearFilters');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    updateStats();

    // Event listeners
    taskForm.addEventListener('submit', handleAddTask);
    editForm.addEventListener('submit', handleEditTask);
    downloadReport.addEventListener('click', downloadExcel);
    closeModal.addEventListener('click', () => editModal.classList.remove('active'));
    cancelEdit.addEventListener('click', () => editModal.classList.remove('active'));
    filterState.addEventListener('change', renderTasks);
    filterCategory.addEventListener('change', renderTasks);
    filterPriority.addEventListener('change', renderTasks);
    filterClient.addEventListener('input', renderTasks);
    clearFilters.addEventListener('click', clearAllFilters);

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            editModal.classList.remove('active');
        }
    });
});

// Cargar tareas de localStorage
function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
}

// Guardar tareas en localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Manejar agregar tarea
function handleAddTask(e) {
    e.preventDefault();

    const newTask = {
        id: Date.now(),
        name: document.getElementById('taskName').value,
        client: document.getElementById('client').value,
        category: document.getElementById('category').value,
        dueDate: document.getElementById('dueDate').value,
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value,
        responsible: document.getElementById('responsible').value,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    saveTasks();
    taskForm.reset();
    renderTasks();
    updateStats();

    // Scroll a la tabla
    document.querySelector('.table-section').scrollIntoView({ behavior: 'smooth' });
}

// Manejar edición de tarea
function handleEditTask(e) {
    e.preventDefault();

    const taskId = parseInt(document.getElementById('editTaskId').value);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            name: document.getElementById('editTaskName').value,
            client: document.getElementById('editClient').value,
            category: document.getElementById('editCategory').value,
            dueDate: document.getElementById('editDueDate').value,
            priority: document.getElementById('editPriority').value,
            status: document.getElementById('editStatus').value,
            responsible: document.getElementById('editResponsible').value
        };

        saveTasks();
        renderTasks();
        updateStats();
        editModal.classList.remove('active');
    }
}

// Abrir modal de edición
function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editClient').value = task.client;
    document.getElementById('editCategory').value = task.category;
    document.getElementById('editDueDate').value = task.dueDate;
    document.getElementById('editPriority').value = task.priority;
    document.getElementById('editStatus').value = task.status;
    document.getElementById('editResponsible').value = task.responsible;

    editModal.classList.add('active');
}

// Eliminar tarea
function deleteTask(taskId) {
    if (confirm('¿Está seguro de que desea eliminar esta tarea?')) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Marcar tarea como completada
function toggleComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = task.status === 'Completado' ? 'Pendiente' : 'Completado';
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Obtener tareas filtradas
function getFilteredTasks() {
    return tasks.filter(task => {
        const stateMatch = !filterState.value || task.status === filterState.value;
        const categoryMatch = !filterCategory.value || task.category === filterCategory.value;
        const priorityMatch = !filterPriority.value || task.priority === filterPriority.value;
        const clientMatch = !filterClient.value || task.client.toLowerCase().includes(filterClient.value.toLowerCase());

        return stateMatch && categoryMatch && priorityMatch && clientMatch;
    });
}

// Renderizar tareas
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        tasksBody.innerHTML = '';
        noTasks.style.display = 'block';
        return;
    }

    noTasks.style.display = 'none';
    tasksBody.innerHTML = filteredTasks.map(task => `
        <tr class="${task.status === 'Completado' ? 'completed' : ''}">
            <td class="col-checkbox">
                <input type="checkbox" ${task.status === 'Completado' ? 'checked' : ''}
                       onchange="toggleComplete(${task.id})" title="Marcar completada">
            </td>
            <td class="col-name"><strong>${escapeHtml(task.name)}</strong></td>
            <td class="col-client">${escapeHtml(task.client)}</td>
            <td class="col-category"><span class="category-badge">${task.category}</span></td>
            <td class="col-date">${formatDate(task.dueDate)}</td>
            <td class="col-priority"><span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span></td>
            <td class="col-status"><span class="status-badge ${getStatusClass(task.status)}">${task.status}</span></td>
            <td class="col-responsible">${escapeHtml(task.responsible)}</td>
            <td class="col-actions">
                <div class="actions">
                    <button class="btn btn-edit btn-sm" onclick="openEditModal(${task.id})">Editar</button>
                    <button class="btn btn-delete btn-sm" onclick="deleteTask(${task.id})">Eliminar</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Obtener clase de estado
function getStatusClass(status) {
    const statusMap = {
        'Pendiente': 'pending',
        'En proceso': 'in-progress',
        'Completado': 'completed'
    };
    return statusMap[status] || 'pending';
}

// Actualizar estadísticas
function updateStats() {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'Pendiente').length;
    const inProgress = tasks.filter(t => t.status === 'En proceso').length;
    const completed = tasks.filter(t => t.status === 'Completado').length;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('inProgressTasks').textContent = inProgress;
    document.getElementById('completedTasks').textContent = completed;
}

// Descargar reporte en Excel
function downloadExcel() {
    if (tasks.length === 0) {
        alert('No hay tareas para exportar');
        return;
    }

    // Preparar datos para Excel
    const excelTasks = tasks.map(task => ({
        'Nombre': task.name,
        'Cliente': task.client,
        'Categoría': task.category,
        'Fecha de Vencimiento': formatDate(task.dueDate),
        'Prioridad': task.priority,
        'Estado': task.status,
        'Responsable': task.responsible,
        'Fecha de Creación': formatDate(task.createdAt.split('T')[0])
    }));

    // Crear libro de trabajo
    const workbook = XLSX.utils.book_new();

    // Hoja 1: Tareas
    const ws1 = XLSX.utils.json_to_sheet(excelTasks);
    XLSX.utils.book_append_sheet(workbook, ws1, 'Tareas');

    // Ajustar ancho de columnas
    ws1['!cols'] = [
        { wch: 30 },
        { wch: 20 },
        { wch: 18 },
        { wch: 15 },
        { wch: 12 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 }
    ];

    // Hoja 2: Resumen
    const summary = [
        ['RESUMEN DE TAREAS'],
        [''],
        ['Total de Tareas', tasks.length],
        ['Pendientes', tasks.filter(t => t.status === 'Pendiente').length],
        ['En Proceso', tasks.filter(t => t.status === 'En proceso').length],
        ['Completadas', tasks.filter(t => t.status === 'Completado').length],
        [''],
        ['Distribución por Categoría'],
    ];

    // Agregar conteos por categoría
    const categories = [...new Set(tasks.map(t => t.category))];
    categories.forEach(cat => {
        const count = tasks.filter(t => t.category === cat).length;
        summary.push([cat, count]);
    });

    summary.push(['']);
    summary.push(['Distribución por Prioridad']);

    // Agregar conteos por prioridad
    ['Alta', 'Media', 'Baja'].forEach(pri => {
        const count = tasks.filter(t => t.priority === pri).length;
        if (count > 0) {
            summary.push([pri, count]);
        }
    });

    const ws2 = XLSX.utils.aoa_to_sheet(summary);
    ws2['!cols'] = [{ wch: 30 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, ws2, 'Resumen');

    // Descargar archivo
    const fileName = `Reporte-Tareas-Contables-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
}

// Limpiar filtros
function clearAllFilters() {
    filterState.value = '';
    filterCategory.value = '';
    filterPriority.value = '';
    filterClient.value = '';
    renderTasks();
}

// Funciones utilitarias
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Datos de ejemplo (opcional - comentar si no se desea)
function loadSampleData() {
    if (tasks.length > 0) return;

    const sampleTasks = [
        {
            id: Date.now(),
            name: 'Declaración de Impuestos - Enero 2026',
            client: 'ABC Corp S.A.',
            category: 'Impuestos',
            dueDate: '2026-10-31',
            priority: 'Alta',
            status: 'En proceso',
            responsible: 'Juan García',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 1,
            name: 'Conciliación Bancaria - Septiembre',
            client: 'XYZ Industries',
            category: 'Conciliación bancaria',
            dueDate: '2026-10-15',
            priority: 'Media',
            status: 'Pendiente',
            responsible: 'María López',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            name: 'Cierre de Período Contable',
            client: 'Global Ventures LLC',
            category: 'Cierre contable',
            dueDate: '2026-10-20',
            priority: 'Alta',
            status: 'Pendiente',
            responsible: 'Carlos Rodríguez',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 3,
            name: 'Facturación - Clientes Regulares',
            client: 'ABC Corp S.A.',
            category: 'Facturación',
            dueDate: '2026-10-05',
            priority: 'Media',
            status: 'Completado',
            responsible: 'Ana Martínez',
            createdAt: new Date().toISOString()
        },
        {
            id: Date.now() + 4,
            name: 'Procesamiento de Nómina - Octubre',
            client: 'Tech Solutions Inc',
            category: 'Nómina',
            dueDate: '2026-10-25',
            priority: 'Alta',
            status: 'En proceso',
            responsible: 'Roberto Sánchez',
            createdAt: new Date().toISOString()
        }
    ];

    tasks = sampleTasks;
    saveTasks();
}

// Descomentar la siguiente línea para cargar datos de ejemplo al abrir la app por primera vez
// loadSampleData();
