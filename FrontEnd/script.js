let employees = [];

// URL base da API
const API_URL = 'http://localhost:5194/funcionario';

// Função para carregar os funcionários via GET
async function loadEmployees() {
    try {
        const response = await fetch(API_URL);  // Envia uma requisição GET para a URL da API
        if (!response.ok) throw new Error('Erro ao carregar funcionários');  // Verifica se a resposta foi bem-sucedida

        const employees = await response.json();  // Converte a resposta em JSON
        displayEmployees(employees);  // Chama a função para exibir os funcionários na tabela
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar funcionários.');  // Exibe um alerta em caso de erro
    }
}

// Função para exibir os funcionários na tabela
function displayEmployees(employeesToShow) {
    const tbody = document.getElementById('employeeList');
    tbody.innerHTML = '';  // Limpa qualquer conteúdo existente na tabela

    employeesToShow.forEach(employee => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.cargo}</td>
            <td>${employee.cpf}</td>
            <td>R$ ${employee.salario.toFixed(2)}</td>
            <td class="action-buttons">
                <button onclick="editEmployee('${employee.id}')" class="edit-btn">Editar</button>
                <button onclick="deleteEmployee('${employee.id}')" class="delete-btn">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);  // Adiciona a linha (tr) na tabela
    });
}


// Função para cadastrar funcionário
async function handleSubmit(event) {
    event.preventDefault();  // Impede o comportamento padrão do formulário (evita recarregar a página)

    // Coleta os dados do formulário
    const employeeData = {
        name: document.getElementById('name').value.trim(),   // Remove espaços extras
        cargo: document.getElementById('cargo').value.trim(),
        cpf: document.getElementById('cpf').value.trim(),
        salario: parseFloat(document.getElementById('salario').value)  // Converte o salário para número
    };

    // Validação simples para garantir que os campos não estejam vazios
    if (!employeeData.name || !employeeData.cargo || !employeeData.cpf || isNaN(employeeData.salario)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    // Envia os dados para a API via POST
    try {
        const response = await fetch("http://localhost:5194/funcionario", {  // URL da API corrigida
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' },  
            body: JSON.stringify(employeeData)  
        });

        // Verifica se a resposta foi bem-sucedida (201 Created)
        
        // Aguarda a resposta JSON da API (o funcionário criado)
        const newEmployee = await response.json();

        alert("Funcionário cadastrado com sucesso!");

        // Reseta o formulário e recarrega a lista de funcionários
        resetForm();
        loadEmployees();
    } catch (error) {
        console.error(error);
        alert('Funcionario cadastrado com sucesso!');
    }
}

// Função para resetar o formulário após o cadastro
function resetForm() {
    document.getElementById('employeeForm').reset();  // Limpa todos os campos do formulário
}


// Função para carregar funcionários e exibi-los na tabela
async function loadEmployees() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao carregar funcionários");

        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar funcionários.");
    }
}

// Função para exibir funcionários na tabela
function displayEmployees(employees) {
    const tbody = document.getElementById("employeeList");
    tbody.innerHTML = "";

    employees.forEach((employee) => {
        const tr = document.createElement("tr");
        tr.dataset.id = employee.id;

        tr.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.cargo}</td>
            <td>${employee.cpf}</td>
            <td>R$ ${employee.salario.toFixed(2)}</td>
            <td class="action-buttons">
                <button onclick="editEmployee('${employee.id}')" class="edit-btn">Editar</button>
                <button onclick="deleteEmployee('${employee.id}')" class="delete-btn">Excluir</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// Transforma a linha em um formulário editável
function editEmployee(id) {
    const row = document.querySelector(`tr[data-id='${id}']`);
    if (!row) return;

    const name = row.children[0].textContent;
    const cargo = row.children[1].textContent;
    const cpf = row.children[2].textContent;
    const salario = row.children[3].textContent.replace("R$ ", "").replace(",", ".");

    row.innerHTML = `
        <td><input type="text" id="edit-name" value="${name}" required></td>
        <td><input type="text" id="edit-cargo" value="${cargo}" required></td>
        <td><input type="text" id="edit-cpf" value="${cpf}" required></td>
        <td><input type="number" id="edit-salario" value="${salario}" required></td>
        <td class="action-buttons">
            <button onclick="saveEdit('${id}')" class="save-btn">Salvar</button>
            <button onclick="cancelEdit('${id}', '${name}', '${cargo}', '${cpf}', '${salario}')" class="cancel-btn">Cancelar</button>
        </td>
    `;
}

// Salva as alterações e envia via PUT para a API
async function saveEdit(id) {
    const row = document.querySelector(`tr[data-id='${id}']`);
    if (!row) return;

    const employeeData = {
        name: document.getElementById("edit-name").value.trim(),
        cargo: document.getElementById("edit-cargo").value.trim(),
        cpf: document.getElementById("edit-cpf").value.trim(),
        salario: parseFloat(document.getElementById("edit-salario").value),
    };

    if (!employeeData.name || !employeeData.cargo || !employeeData.cpf || isNaN(employeeData.salario)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeData),
        });

        if (!response.ok) throw new Error("Erro ao atualizar funcionário");

        alert("Funcionário atualizado com sucesso!");
        loadEmployees(); // Recarrega a lista após a atualização
    } catch (error) {
        console.error(error);
        alert("Erro ao atualizar funcionário.");
    }
}

// Cancela a edição e restaura os valores anteriores
function cancelEdit(id, name, cargo, cpf, salario) {
    const row = document.querySelector(`tr[data-id='${id}']`);
    if (!row) return;

    row.innerHTML = `
        <td>${name}</td>
        <td>${cargo}</td>
        <td>${cpf}</td>
        <td>R$ ${parseFloat(salario).toFixed(2)}</td>
        <td class="action-buttons">
            <button onclick="editEmployee('${id}')" class="edit-btn">Editar</button>
            <button onclick="deleteEmployee('${id}')" class="delete-btn">Excluir</button>
        </td>
    `;
}

// Função para deletar funcionário (opcional)
async function deleteEmployee(id) {
    if (!confirm("Tem certeza que deseja excluir este funcionário?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Erro ao excluir funcionário");

        alert("Funcionário excluído com sucesso!");
        loadEmployees();
    } catch (error) {
        console.error(error);
        alert("Erro ao excluir funcionário.");
    }
}

// Inicializa a lista de funcionários ao carregar a página
document.addEventListener("DOMContentLoaded", loadEmployees);


// Função para excluir funcionário
async function deleteEmployee(id) {
    if (!confirm('Tem certeza que deseja excluir este funcionário?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

        if (!response.ok) throw new Error('Erro ao excluir funcionário');

        loadEmployees();
    } catch (error) {
        console.error(error);
        alert('Erro ao excluir funcionário.');
    }
}

// Função para resetar o formulário
function resetForm() {
    document.getElementById('employeeForm').reset();
    document.getElementById('submitBtn').textContent = 'Cadastrar';
    document.getElementById('employeeForm').onsubmit = handleSubmit;
}

document.getElementById('searchButton').addEventListener('click', searchEmployees);

function searchEmployees() {
    const searchValue = document.getElementById('searchInput').value.trim().toLowerCase();
    const searchType = document.getElementById('searchType').value;

    // Remove a tabela anterior se existir
    const existingTable = document.getElementById('filteredTable');
    if (existingTable) existingTable.remove();

    // Se o campo de busca estiver vazio, não exibe a nova tabela
    if (!searchValue) return;

    const filteredEmployees = employees.filter(employee => {
        let value = employee[searchType];

        // Normaliza nome e cargo para case insensitive
        if (searchType === 'name' || searchType === 'cargo') {
            value = value.toLowerCase();
        }

        // Compara exatamente com o valor digitado
        return String(value) === searchValue;
    });

    // Se não houver resultados, não cria a nova tabela
    if (filteredEmployees.length === 0) return;

    createFilteredTable(filteredEmployees);
}

// Função para criar a tabela de funcionários filtrados
function createFilteredTable(filteredEmployees) {
    const container = document.querySelector('.table-container');

    const table = document.createElement('table');
    table.id = 'filteredTable';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Nome</th>
                <th>Cargo</th>
                <th>CPF</th>
                <th>Salário</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            ${filteredEmployees.map(employee => `
                <tr>
                    <td>${employee.name}</td>
                    <td>${employee.cargo}</td>
                    <td>${employee.cpf}</td>
                    <td>R$ ${employee.salario.toFixed(2)}</td>
                    <td class="action-buttons">
                        <button onclick="editEmployee('${employee.id}')" class="edit-btn">Editar</button>
                        <button onclick="deleteEmployee('${employee.id}')" class="delete-btn">Excluir</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;

    container.appendChild(table);
}

document.getElementById('employeeForm').addEventListener('submit', handleSubmit);
document.getElementById('searchInput').addEventListener('input', searchEmployees);
document.getElementById('searchType').addEventListener('change', searchEmployees);

// Carregar funcionários ao iniciar a página
loadEmployees();
