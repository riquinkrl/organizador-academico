import { ItemAcademico } from "./item-academico";
import type { AcoesAtividadePratica, Origem, SubtarefaChecklist } from "../contratos/acoes-atividade";

export class AtividadePratica extends ItemAcademico implements AcoesAtividadePratica {
    private readonly dataLimite: Date;
    private concluida: boolean = false;
    private dataConclusao?: Date;
    private readonly origem: Origem;
    private readonly checklist: Array<SubtarefaChecklist> = [];
    private linkEntrega?: string;

    constructor(titulo: string, descricao: string, workspaceId: string, dataLimite: Date, origem: Origem, linkEntrega?: string){
        super(titulo, descricao, workspaceId);

        if(!Number.isNaN(dataLimite.getTime())){
            this.dataLimite = new Date(dataLimite.getTime());
            this.origem = origem;

            if(linkEntrega && linkEntrega.trim() !== ""){
                this.linkEntrega = linkEntrega.trim();
            } else{
                this.linkEntrega = undefined;
            }
        } else{
            throw new Error("Data limite inválida.");
        }
    }

    private contarSubtarefas(): number {
        let feitas: number = 0;

        for(const sub of this.checklist){
            if(sub.feita){
                feitas++;
            }
        }
        return feitas;
    }

    obterCategoria(): string {
        return "Atividade Prática";
    }

    estaPendente(): boolean {
        return !this.concluida;
    }

    obterExibicaoFormatada(): string {
        let situacao: string;

        if(this.concluida){
            situacao = "Concluída";
        } else{
            situacao = "Pendente";
        }
        return `${this.getTitulo()} - ${situacao} (prazo: ${this.dataLimite.toLocaleDateString("pt-BR")})`;
    }

    override estaConcluido(): boolean {
        return this.concluida;
    }

    override exigeEntrega(): boolean {
        return true;
    }

    override obterPrazo(): Date | undefined {
        return new Date(this.dataLimite.getTime());
    }

    override obterOrigem(): Origem | undefined {
        return this.origem;
    }

    override obterDataConclusao(): Date | undefined {
        if(!this.dataConclusao){
            return undefined;
        }
        return new Date(this.dataConclusao.getTime());
    }

    override verificarSeAtrasada(agora?: Date): boolean {
        const dataReferencia: Date = ItemAcademico.obterDataReferencia(agora);
        
        return this.estaPendente() && dataReferencia.getTime() > this.dataLimite.getTime();
    }

    override marcarComoConcluida(agora?: Date): void {
        let dataReferencia: Date;

        if(agora){
            dataReferencia = agora;
        } else{
            dataReferencia = new Date();
        }

        if(!this.concluida){
            this.concluida = true;
            this.dataConclusao = new Date(dataReferencia.getTime());
        } else{
            throw new Error("A atividade já está concluída.");
        }
    }

    reabrirAtividade(): void {
        if(!this.concluida){
            throw new Error("A atividade já está pendente.");
        }
        this.concluida = false;
        this.dataConclusao = undefined;
    }

    calcularDiasRestantes(agora?: Date): number {
       return ItemAcademico.calcularDiasAte(this.dataLimite, ItemAcademico.obterDataReferencia(agora));
    }

    atualizarLinkEntrega(novoLink: string): void {
        this.linkEntrega = ItemAcademico.validarTextoObrigatorio(novoLink, "O link de entrega não pode ser vazio.");
    }

    adicionarSubtarefa(descricao: string): void {
        const limpa: string = ItemAcademico.validarTextoObrigatorio(descricao, "A subtarefa não pode ser vazia.");

        this.checklist.push({descricao: limpa, feita: false });
    }

    alternarSubtarefa(indice: number): void {
        const sub: SubtarefaChecklist | undefined = this.checklist[indice];

        if(!sub){
            throw new Error("Subtarefa inexistente.");
        }
        sub.feita = !sub.feita;
    }

    removerSubtarefa(indice: number): void {
        if(indice < 0 || indice >= this.checklist.length){
            throw new Error("Índice de subtarefa inválido.");
        }
          this.checklist.splice(indice, 1);  
    }

    calcularProgressoChecklist(): number {
        return ItemAcademico.calcularPorcentagem(this.contarSubtarefas(), this.checklist.length);
    }

    getChecklist(): readonly SubtarefaChecklist[] {
        return this.checklist.map((s) =>({descricao: s.descricao, feita: s.feita}));
    }

    getLinkEntrega(): string | undefined {
        return this.linkEntrega;
    }
}