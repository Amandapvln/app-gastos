import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GastosService, Gasto as GastoModel } from '../../../../core/service/gastos.service';

@Component({
  selector: 'app-gasto',
  imports: [CurrencyMaskModule, FontAwesomeModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './gasto.html',
  styleUrl: './gasto.scss',
})
export class Gasto {
  faWallet = faWallet;

  gastosService = inject(GastosService);
  gasto$?: Observable<GastoModel>;
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

    const novoGasto: GastoModel = {
      valor: valor!,
      categoria: categoria!,
      descricao: descricao!,
      data: data!,
    };

    this.gasto$ = this.gastosService.setGasto(novoGasto);

    this.gasto$?.subscribe({
      next: () => {
        this.successMessage = '✓ Gasto adicionado com sucesso!';
        this.form.reset();
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Erro ao criar gasto:', err);
        this.errorMessage = '✗ Erro ao adicionar gasto. Tente novamente.';
        this.isLoading = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    })
  }
}