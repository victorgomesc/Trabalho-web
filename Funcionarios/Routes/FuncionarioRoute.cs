using Microsoft.EntityFrameworkCore;
using Funcionarios.Models;
using Funcionarios.Data;

namespace Funcionarios.Routes;

public static class TaskRoute {
    public static void FuncionarioRoutes(this WebApplication app)
    {
        var route = app.MapGroup("funcionario");

        route.MapPost("", async (FuncionarioRequest req, FuncionarioContext context ) => 
        {
        var funcionario = new FuncionarioModel(req.name, req.cargo, req.cpf, req.salario);
        await context.AddAsync(funcionario);
        await context.SaveChangesAsync();
    
         return Results.Ok(funcionario);
        });

        route.MapGet("", async (FuncionarioContext context) => 
        {
            var funcionario = await context.Funcionario.ToListAsync();
            return Results.Ok(funcionario);
        });

        route.MapPut("{id:guid}", async (Guid id, FuncionarioRequest req, FuncionarioContext context) => 
        {
            var funcionario = await context.Funcionario.FirstOrDefaultAsync(x => x.Id == id);

            if (funcionario == null){
                return Results.NotFound();
            }

            funcionario.ChangeName(req.name);
            await context.SaveChangesAsync(); 

            funcionario.ChangeCargo(req.cargo);
            await context.SaveChangesAsync();

            funcionario.ChangeCpf(req.cpf);
            await context.SaveChangesAsync();

            funcionario.ChangeSalario(req.salario);
            await context.SaveChangesAsync();

            return Results.Ok(funcionario);
        });

        route.MapDelete("{id:guid}", async (Guid id, FuncionarioContext context) => 
        {
            var funcionario = await context.Funcionario.FirstOrDefaultAsync(x => x.Id == id);

            if (funcionario == null){
                return Results.NotFound();
            }


            context.Funcionario.Remove(funcionario);
            await context.SaveChangesAsync();

            return Results.NoContent();
        });

    }
}