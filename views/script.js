// Cargar los países al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    loadCountries();
    loadActors();
});

// Función para cargar los países desde el backend
function loadCountries() {
    fetch('../logica/gestor.php?action=getCountries')
        .then(response => response.json())
        .then(data => {
            const countrySelect = document.getElementById('actorCountry');
            data.forEach(country => {
                const option = document.createElement('option');
                option.value = country.idPais;
                option.textContent = country.nombrePais;
                countrySelect.appendChild(option);
            });
        });
}

// Función para cargar los actores desde el backend
function loadActors() {
    fetch('../logica/gestor.php?action=getActors')
        .then(response => response.json())
        .then(data => {
            const actorList = document.getElementById('actorList').getElementsByTagName('tbody')[0];
            actorList.innerHTML = ''; // Limpiar la tabla antes de cargar los datos
            data.forEach(actor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${actor.nombreActor}</td>
                    <td><img src="${actor.imagen}" alt="${actor.nombreActor}" width="50"></td>
                    <td>${actor.nacionalidad}</td>
                    <td><button onclick="deleteActor(${actor.idActor})">Eliminar</button></td>
                `;
                actorList.appendChild(row);
            });
        });
}

// Función para manejar la creación de un nuevo actor
document.getElementById('actorForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    fetch('../logica/gestor.php?action=createActor', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadActors(); // Recargar la lista de actores
            alert('Actor creado correctamente');
        } else {
            alert('Error al crear el actor');
        }
    });
});

// Función para eliminar un actor
function deleteActor(idActor) {
    fetch(`../logica/gestor.php?action=deleteActor&idActor=${idActor}`, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadActors(); // Recargar la lista de actores
                alert('Actor eliminado');
            } else {
                alert('Error al eliminar el actor');
            }
        });
}

// Función para buscar actores por nombre
document.getElementById('searchActorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchName = document.getElementById('searchActor').value;

    fetch(`../logica/gestor.php?action=searchActor&name=${searchName}`)
        .then(response => response.json())
        .then(data => {
            const actorList = document.getElementById('actorList').getElementsByTagName('tbody')[0];
            actorList.innerHTML = ''; // Limpiar la tabla antes de mostrar los resultados
            data.forEach(actor => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${actor.nombreActor}</td>
                    <td><img src="${actor.imagen}" alt="${actor.nombreActor}" width="50"></td>
                    <td>${actor.nacionalidad}</td>
                    <td><button onclick="deleteActor(${actor.idActor})">Eliminar</button></td>
                `;
                actorList.appendChild(row);
            });
        });
});
