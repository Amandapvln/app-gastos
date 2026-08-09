import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GastosService, Gasto as GastoModel, Receita as ReceitaModel } from '../../../../core/service/gastos.service';
import { CommonModule } from '@angular/common';

interface CategoriaResumo {
  nome: string;
  total: number;
  percentual: number;
  participacao: number;
}

@Component({
  selector: 'app-resumo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumo.html',
  styleUrl: './resumo.scss',
})
export class Resumo implements OnInit {
  gastosService = inject(GastosService);

  gastos: GastoModel[] = [];
  receitas: ReceitaModel[] = [];
  saldo = 0;
  totalGastos = 0;
  totalReceitas = 0;
  categorias: CategoriaResumo[] = [];
  isLoading = false;

  ngOnInit() {
    this.carregarResumo();
  }

  carregarResumo() {
    this.isLoading = true;

    forkJoin({
      gastos: this.gastosService.getGastos(),
      receitas: this.gastosService.getReceitas(),
    }).subscribe({
      next: ({ gastos, receitas }) => {
        this.gastos = gastos;
        this.totalGastos = gastos.reduce((acc, gasto) => acc + gasto.valor, 0);
        this.atualizarCategorias();
        this.atualizarSaldo();
        this.receitas = receitas;
        this.totalReceitas = receitas.reduce((acc, receita) => acc + receita.valor, 0);
        this.atualizarSaldo();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar resumo:', err);
        this.isLoading = false;
      }
    });
  }

  atualizarSaldo() {
    this.saldo = this.totalReceitas - this.totalGastos;
  }

  formatarCategoria(categoria: string): string {
    return categoria
      .replaceAll('_', ' ')
      .replace(/\b\w/g, letra => letra.toUpperCase());
  }

  atualizarCategorias() {
    const totais = this.gastos.reduce<Record<string, number>>((acumulado, gasto) => {
      acumulado[gasto.categoria] = (acumulado[gasto.categoria] || 0) + gasto.valor;
      return acumulado;
    }, {});
    const maiorTotal = Math.max(...Object.values(totais), 0);

    this.categorias = Object.entries(totais)
      .map(([nome, total]) => ({
        nome,
        total,
        percentual: maiorTotal ? (total / maiorTotal) * 100 : 0,
        participacao: this.totalGastos ? (total / this.totalGastos) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }
}
