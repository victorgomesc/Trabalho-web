namespace Funcionarios.Models;

public record FuncionarioRequest(
    string name,
    string cargo,
    string cpf,
    float salario
);