
namespace Funcionarios.Models;

public class FuncionarioModel{
    public FuncionarioModel(string name, string cargo, string cpf, float salario){
        Name = name;
        Cargo = cargo;
        Cpf = cpf;
        Salario = salario;
        Id =  Guid.NewGuid();
    }

    public Guid Id { get; set; }
    public string Name { get; set; }  = string.Empty; 
    public string Cargo { get; set; }
    public string Cpf { get; set; }
    public float Salario { get; set; }

    public void ChangeName(string name){
        Name = name;
    }

    public void ChangeCargo(string cargo){
        Cargo = cargo;
    }

    public void ChangeCpf(string cpf){
        Cpf = cpf;
    }

    public void ChangeSalario(float salario){
        Salario = salario;
    }

    public void SetFinish(){
        Name = "Demitido";
    }
}