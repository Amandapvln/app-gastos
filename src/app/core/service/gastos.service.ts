import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Gasto {
  id?: string;
  valor: number;
  categoria: string;
  descricao: string;
  data: string | Date;
}

export interface Receita {
  id?: string;
  valor: number;
  descricao: string;
  categoria: string;
  data: string | Date;
}

export interface Investimento {
  id?: string;
  valor: number;
  categoria: string;
  descricao: string;
  data: string | Date;
}

@Injectable({
  providedIn: 'root',
})
export class GastosService {
  url_api_gastos = 'http://localhost:3000/gastos';
  url_api_receitas = 'http://localhost:3000/receitas';
  url_api_investimentos = 'http://localhost:3000/investimentos';

  http = inject(HttpClient);

  // Gastos
  getGastos(): Observable<Gasto[]> {
    return this.http.get<Gasto[]>(this.url_api_gastos);
  }

  listaGastos(): Observable<Gasto[]> {
    return this.getGastos();
  }

  setGasto(gasto: Gasto): Observable<Gasto> {
    return this.http.post<Gasto>(this.url_api_gastos, gasto);
  }

  deleteGasto(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url_api_gastos}/${id}`);
  }

  updateGasto(id: string, gasto: Gasto): Observable<Gasto> {
    return this.http.put<Gasto>(`${this.url_api_gastos}/${id}`, gasto);
  }

  // Receitas
  getReceitas(): Observable<Receita[]> {
    return this.http.get<Receita[]>(this.url_api_receitas);
  }

  setReceita(receita: Receita): Observable<Receita> {
    return this.http.post<Receita>(this.url_api_receitas, receita);
  }

  deleteReceita(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url_api_receitas}/${id}`);
  }

  updateReceita(id: string, receita: Receita): Observable<Receita> {
    return this.http.put<Receita>(`${this.url_api_receitas}/${id}`, receita);
  }

  // Investimentos
  getInvestimentos(): Observable<Investimento[]> {
    return this.http.get<Investimento[]>(this.url_api_investimentos);
  }

  setInvestimento(investimento: Investimento): Observable<Investimento> {
    return this.http.post<Investimento>(this.url_api_investimentos, investimento);
  }

  deleteInvestimento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url_api_investimentos}/${id}`);
  }

  updateInvestimento(id: string, investimento: Investimento): Observable<Investimento> {
    return this.http.put<Investimento>(`${this.url_api_investimentos}/${id}`, investimento);
  }
}
