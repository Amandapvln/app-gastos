import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter, faCar, faUtensils, faHouse, faGamepad, faHeartPulse, faGraduationCap, faBox, faFileInvoiceDollar, faCreditCard, faDollarSign, faMoneyBillWave, faLaptopCode, faPlus, faStethoscope, faBook, faCalculator, faWifi, faPlayCircle, faPlane, faSpa, faHouseChimney } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { GastosService, Gasto as GastoModel, Receita as ReceitaModel, Investimento as InvestimentoModel } from '../../../../core/service/gastos.service';
import { CommonModule } from '@angular/common';

interface HistoricoItem {
  id: string;
  tipo: 'gasto' | 'receita' | 'investimento';
  valor: number;
  descricao: string;
  categoria: string;
  data: string | Date;
}

@Component({
  selector: 'app-historico',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './historico.html',
  styleUrl: './historico.scss',
})
export class Historico implements OnInit {

  faFilter = faFilter;

  historicoLista: HistoricoItem[] = [];
  isLoading = false;
  selectedFilter: string | null = null;

  gastosService = inject(GastosService);

  // Mapeamento de categorias para ícones
  categoriaIconMap: Record<string, IconDefinition> = {
    transporte: faCar,
    cartao_credito: faCreditCard,
    alimentacao: faUtensils,
    moradia: faHouse,
    lazer: faGamepad,
    saude: faStethoscope,
    educacao: faBook,
    imposto: faCalculator,
    internet_movel: faWifi,
    aplicativos_stream: faPlayCircle,
    imovel: faHouseChimney,
    viagem: faPlane,
    estetica: faSpa,
    outros: faBox,
    // Categorias de receita
    Salário: faMoneyBillWave,
    Freelance: faLaptopCode,
    Outros: faPlus,
  };

  ngOnInit() {
    this.carregarHistorico();
  }

  carregarHistorico() {
    this.isLoading = true;
    forkJoin({
      gastos: this.gastosService.getGastos(),
      receitas: this.gastosService.getReceitas(),
      investimentos: this.gastosService.getInvestimentos(),
    }).subscribe({
      next: ({ gastos, receitas, investimentos }) => {
                const historicoItems: HistoricoItem[] = [
                  ...gastos.map(gasto => ({
                    id: gasto.id || '',
                    tipo: 'gasto' as const,
                    valor: gasto.valor,
                    descricao: gasto.descricao,
                    categoria: gasto.categoria,
                    data: gasto.data
                  })),
                  ...investimentos.map(investimento => ({
                    id: investimento.id || '',
                    tipo: 'investimento' as const,
                    valor: investimento.valor,
                    descricao: investimento.descricao,
                    categoria: investimento.categoria,
                    data: investimento.data
                  })),
                  ...receitas.map(receita => ({
                    id: receita.id || '',
                    tipo: 'receita' as const,
                    valor: receita.valor,
                    descricao: receita.descricao,
                    categoria: receita.categoria,
                    data: receita.data
                  }))
                ];

                this.historicoLista = historicoItems.sort((a, b) => {
                  const dataA = new Date(a.data).getTime();
                  const dataB = new Date(b.data).getTime();
                  return dataB - dataA;
                });

                this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar gastos:', err);
        this.isLoading = false;
      }
    });
  }

  deleteItem(item: HistoricoItem) {
    const tipo = item.tipo === 'gasto' ? 'gasto' : item.tipo === 'receita' ? 'receita' : 'investimento';
    if (!confirm(`Tem certeza que deseja deletar este ${tipo}?`)) {
      return;
    }

    if (item.tipo === 'gasto') {
      this.gastosService.deleteGasto(item.id).subscribe({
        next: () => {
          console.log('Gasto deletado com sucesso');
          this.carregarHistorico();
        },
        error: (err) => {
          console.error('Erro ao deletar gasto:', err);
        }
      });
    } else if (item.tipo === 'receita') {
      this.gastosService.deleteReceita(item.id).subscribe({
        next: () => {
          console.log('Receita deletada com sucesso');
          this.carregarHistorico();
        },
        error: (err) => {
          console.error('Erro ao deletar receita:', err);
        }
      });
    } else {
      this.gastosService.deleteInvestimento(item.id).subscribe({
        next: () => {
          console.log('Investimento deletado com sucesso');
          this.carregarHistorico();
        },
        error: (err) => {
          console.error('Erro ao deletar investimento:', err);
        }
      });
    }
  }

  // Método para obter o ícone baseado na categoria
  getIconByCategoria(categoria: string): IconDefinition {
    return this.categoriaIconMap[categoria] || faCar;
  }

}
