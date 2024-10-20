/*A interface HiringCostType serve para definir a estrutura de um objeto que contém informações sobre o custo de contratações. 
Ele deve ter:
    month: um texto que indica o mês (pode ser um formato de data ou o nome do mês).
    totalCost: um número que representa o custo total desse mês. */
export interface HiringCostType {
    ano: number; // Pode ser uma string como "2024-01" ou um nome do mês
    somaDoCusto: number;
    mes: number // O custo total para aquele mês
}
