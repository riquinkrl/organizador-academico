import type { AcoesItemAcademico } from "../contratos/acoes-item";
import type { Origem } from "../contratos/acoes-atividade";

const msPorDia: number = 24 * 60 * 60 * 1000;

export abstract class ItemAcademico implements AcoesItemAcademico {
    private static contador: number = 0;
    protected readonly id: string;
    protected readonly titulo: string;
    protected readonly descricao: string;
    protected readonly dataCriacao: Date;
    protected readonly workspaceId: string;

    constructor(titulo: string, descricao: string, workspaceId: string){
        this.titulo = ItemAcademico.validarTitulo(titulo);
        this.descricao = descricao.trim();
        this.workspaceId = workspaceId;
        this.dataCriacao = new Date();

        ItemAcademico.contador += 1;
        this.id = `item-${Date.now()}-${ItemAcademico.contador}`;
    }

    protected static validarTitulo(titulo: string): string {
        return ItemAcademico.validarTextoObrigatorio(titulo, "O título não pode ser vazio.");
    }

    protected static validarTextoObrigatorio(valor: string, mensagem: string): string {

        const limpo: string = valor.trim();

        if(limpo === ""){
            throw new Error(mensagem);
        }
        return limpo;
    }

    protected static validarEClonarData(data: Date, mensagem: string): Date {
        if(Number.isNaN(data.getTime())){
            throw new Error(mensagem);
        }
        return new Date(data.getTime());
    }

    protected static obterDataReferencia(agora?: Date): Date {
        if(agora){
           return new Date(agora.getTime());
        } else {
           return new Date();
        }
    }

    protected static calcularDiasAte(prazo: Date, referencia: Date): number {
        const diferenca: number = prazo.getTime() - referencia.getTime();
        const resto: number = diferenca % msPorDia;
        let dias: number = (diferenca - resto) / msPorDia;
        
        if(resto > 0){
            dias++;
        }
        return dias;
    }

    protected static calcularPorcentagem(parte: number, total: number): number {
        if(total === 0){
            return 0;
        }
        const porcentagem: number = (parte / total) * 100;
        return Number(porcentagem.toFixed(0));
    }
    
    getId(): string {
        return this.id;
    }

    getTitulo(): string {
        return this.titulo;
    }

    getDescricao(): string {
        return this.descricao;
    }

    getDataCriacao(): Date {
        return new Date(this.dataCriacao.getTime());
    }

    getWorkspaceId(): string {
        return this.workspaceId;
    }

    obterResumo(): string {
        return `${this.obterCategoria()}: ${this.titulo}`;
    }

    verificarSeAtrasada(agora?: Date): boolean {
        return false;
    }
    
    estaConcluido(): boolean {
        return false;
    }

    estaFixado(): boolean {
        return false;
    }

    exigeEntrega(): boolean {
        return false;
    }

    obterPrazo(): Date | undefined {
        return undefined;
    }

    obterOrigem(): Origem | undefined {
        return undefined;
    }

    obterDataConclusao(): Date | undefined {
        return undefined;
    }

    marcarComoConcluida(agora?: Date): void {
        throw new Error("Este tipo de item não pode ser concluído.");
    }

    abstract obterCategoria(): string;
    abstract estaPendente(agora?: Date): boolean;
    abstract obterExibicaoFormatada(): string;
}