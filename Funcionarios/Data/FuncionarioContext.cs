using Microsoft.EntityFrameworkCore;

using Funcionarios.Models;

namespace Funcionarios.Data;

public class FuncionarioContext: DbContext {
     public DbSet<FuncionarioModel> Funcionario { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=funcionario.sqlite");
        base.OnConfiguring(optionsBuilder);
    }
}