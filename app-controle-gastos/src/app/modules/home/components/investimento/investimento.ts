import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPiggyBank } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GastosService, Investimento as InvestimentoModel } from '../../../../core/service/gastos.service';

@Component({
  selector: 'app-investimento',
  imports: [CurrencyMaskModule, FontAwesomeModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './investimento.html',
  styleUrl: './investimento.scss',
})
export class Investimento {
  faPiggyBank = faPiggyBank;

  gastosService = inject(GastosService);
  investimento$?: Observable<InvestimentoModel>;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  form = new FormGroup<{
    valor: FormControl<number | null>;
    categoria: FormControl<string | null>;
    descricao: FormControl<string | null>;
    data: FormControl<string | null>;
  }>({
    valor: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    categoria: new FormControl<string | null>(null, [Validators.required]),
    descricao: new FormControl<string | null>(null, [Validators.required]),
    data: new FormControl<string | null>(null, [Validators.required]),
  })

  onSubmit(){
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const { valor, categoria, descricao, data } = this.form.value;

    const novoInvestimento: InvestimentoModel = {
      valor: valor!,
      categoria: categoria!,
      descricao: descricao!,
      data: data!,
    };

    this.investimento$ = this.gastosService.setInvestimento(novoInvestimento);

    this.investimento$?.subscribe({
      next: () => {
        this.successMessage = 'Investimento registrado com sucesso!';
        this.isLoading = false;
        this.form.reset();
      },
      error: (err) => {
        console.error('Erro ao criar investimento:', err);
        this.errorMessage = 'Erro ao registrar investimento';
        this.isLoading = false;
      }
    });
  }
}
