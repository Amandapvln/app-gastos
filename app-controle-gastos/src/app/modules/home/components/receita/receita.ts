import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GastosService, Receita as ReceitaModel } from '../../../../core/service/gastos.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-receita',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  standalone: true,
  templateUrl: './receita.html',
  styleUrl: './receita.scss',
})
export class Receita {
  faDollarSign = faDollarSign;

  gastosService = inject(GastosService);
  receita$?: Observable<ReceitaModel>;
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
    descricao: new FormControl<string | null>(null),
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

    const novaReceita: ReceitaModel = {
      valor: valor!,
      descricao: descricao!,
      categoria: categoria!,
      data: data!,
    };

    this.receita$ = this.gastosService.setReceita(novaReceita);

    this.receita$?.subscribe({
      next: () => {
        this.successMessage = '✓ Receita adicionada com sucesso!';
        this.form.reset();
        this.isLoading = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err) => {
        console.error('Erro ao criar receita:', err);
        this.errorMessage = '✗ Erro ao adicionar receita. Tente novamente.';
        this.isLoading = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    })
  }
}
