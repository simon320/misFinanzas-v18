import { Router, RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { PATH } from '../../common/enums/enum';
import { AuthService } from '../services/auth.service';
import { emailPattern, notEmpty } from '../utils/utils';
import { ToastService } from '../../common/components/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, RouterLink ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  public loginForm!: FormGroup;
  public pathRegister: string = PATH.REGISTER;

  get mailErrorMsg(): string {
    const errors = this.loginForm.get('mail')?.errors;
    if( errors?.['required'] ) return 'Debe ingresar un mail'
    else if( errors?.['pattern'] ) return 'El formato del email es incorrecto.'
    else if( errors?.['USER_NOT_FOUND'] ) return 'El email no esta registrado.'
    return '';
  }

  get passErrorMsg(): string {
    const errors = this.loginForm.get('password')?.errors;
    if( errors?.['required'] ) return 'La contraseña es obligatoria.'
    else if( errors?.['minlength'] ) return 'La contraseña debe ser de 8 caracteres.'
    else if( errors?.['maxlength'] ) return 'La contraseña debe ser de 8 caracteres.'
    else if( errors?.['pattern'] ) return 'Solo puedes usar letras y numeros.'
    else if( errors?.['PASSWORD_INCORRECT'] ) return 'Contraseña incorrecta.'
    return '';
  }


  public ngOnInit(): void {
    this.createForm();
  }


  private createForm(): void {
    this.loginForm = this.fb.group({
      mail: ['', [ Validators.required, Validators.pattern( emailPattern )] ],
      password: ['', [ Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern( notEmpty ) ]],
    })
  }


  public inputInvalid(input: string): boolean | undefined {
    return this.loginForm.get(input)?.invalid && this.loginForm.get(input)?.touched;
  }


  public login(): void {
    if(this.loginForm.invalid)
      return this.loginForm.markAllAsTouched();

    const { mail, password } = this.loginForm.value;

    if( this.authService.login(mail, password) ) {
      this.router.navigateByUrl('');
    }
    else {
      this.toastService.show(
        'ERROR',
        'Lo siento...',
        'Los datos ingresados no son correctos.'
      );
    }

  }

}
