import { Router, RouterLink } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { PATH } from '../../common/enums/enum';
import { AuthService } from '../services/auth.service';
import { User } from '../../common/interfaces/interface';
import { ToastService } from '../../common/components/toast/toast.service';
import { compareFields, emailPattern, notEmpty, onlyLetter } from '../utils/utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  public userForm!: FormGroup;
  public pathLogin: string = PATH.LOGIN;

  get mailErrorMsg(): string {
    const errors = this.userForm.get('mail')?.errors;
    if( errors?.['required'] ) {
      return 'Debe ingresar un mail'
    } else if( errors?.['pattern'] ) {
      return 'El formato del email es incorrecto.'
    } else if( errors?.['USER_NOT_FOUND'] ) {
      return 'El email ya esta registrado.'// TODO: CAMBIAR BACKEND
    }
    return '';
  }

  get nameErrorMsg(): string {
    const errors = this.userForm.get('name')?.errors;
    if( errors?.['required'] ) {
      return 'Debe ingresar un nombre'
    } else if( errors?.['pattern'] ) {
      return 'Solo puede usar letras.'
    } else if( errors?.['minlength'] ) {
      return 'El nombre debe tener al menos 3 letras.'
    } else if( errors?.['maxlength'] ) {
      return 'No puede superar los 25 caracteres.'
    } else if( errors?.['USER_NOT_FOUND'] ) {
      return 'El email no esta registrado.'
    }
    return '';
  }

  get passErrorMsg(): string {
    const errors = this.userForm.get('password')?.errors;
    if( errors?.['required'] ) {
      return 'La contraseña es obligatoria.'
    } else if( errors?.['minlength'] ) {
      return 'La contraseña debe ser de 8 caracteres.'
    } else if( errors?.['maxlength'] ) {
      return 'La contraseña debe ser de 8 caracteres.'
    } else if( errors?.['pattern'] ) {
      return 'Solo puedes usar letras y numeros.'
    } else if( errors?.['PASSWORD_INCORRECT'] ) {
      return 'Contraseña incorrecta.'
    }
    return '';
  }

  get cofirmPassErrorMsg(): string {
    const errors = this.userForm.get('confirmPassword')?.errors;
    if( errors?.['required'] ) {
      return 'Debe repetir la contraseña.'
    } else if( errors?.['notEquals'] ) {
      return 'La Contraseña no coincide.'
    }
    return '';
  }


  public ngOnInit(): void {
    this.createUserForm();
  }

  private createUserForm(): void {
    this.userForm = this.fb.group({
      mail: ['', [ Validators.required, Validators.pattern( emailPattern )] ],
      name: ['', [ Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern( onlyLetter ) ]],
      password: ['', [ Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern( notEmpty ) ]],
      confirmPassword: ['', [ Validators.required ]]
    }, {
      validators: [ compareFields('password', 'confirmPassword') ]
    })
  }

  public inputInvalid(input: string): boolean | undefined {
    return (
      this.userForm.get(input)?.invalid && this.userForm.get(input)?.touched
    );
  }

  public registerNewUser(): void {
    if(this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { mail, name, password } = this.userForm.value
    if(name.trim().length === 0) {
      this.userForm.get('name')?.reset();
      this.userForm.markAllAsTouched();
      return;
    }

    const newUser: User = { mail, name, password };

    this.authService.register(newUser);
    this.toastService.show(
      'SUCCESS',
      '!Usuario creado!',
      'Ahora, ingrese esos datos para iniciar secion.'
    );
    this.router.navigateByUrl(PATH.LOGIN);
  }

}
