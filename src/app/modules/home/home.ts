import { Component } from '@angular/core';

import { Gasto } from './components/gasto/gasto';
import { Historico } from './components/historico/historico';
import { Receita } from './components/receita/receita';
import { Resumo } from './components/resumo/resumo';
import { Investimento } from './components/investimento/investimento';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Gasto, Receita, Investimento, Historico, Resumo],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}