import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { emailPattern, notEmpty } from './utils/utils';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

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


  constructor(
    private router: Router,
    private fb: FormBuilder,
    // private validateService: ValidateService,
    // private authService: AuthService,
    // private userSignal: UserStoreService,
    // private walletService: WalletService,
    // private walletSignal: WalletStoreService,
    ) { }

  ngOnInit(): void {
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
    // this.authService.login({ mail, password })
    //   .subscribe({
    //     next: (data) => {
    //       if (data) {
    //         localStorage.setItem('token', data.token);
    //         localStorage.setItem('id', data.user._id!);
    //         this.userSignal.setState(data.user);

    //         if(data.user._id)
    //           this.walletService.getWallet(data.user._id!).subscribe( wallet => this.walletSignal.setState(wallet) );

    //         // if (data.user.first)
    //         //   this.router.navigate([URL.FIRST_ADMISSION], { queryParams: {id: data.user._id?.toString(), name: data.user.nickname }});
    //         // else
    //           this.router.navigate([URL.HOME]);
    //       }
    //     },
    //     error: err => {
    //       if (err.error.message === 'USER_NOT_FOUND')
    //         this.loginForm.get('mail')!.setErrors({ USER_NOT_FOUND: true })

    //       if (err.error.message === 'PASSWORD_INCORRECT')
    //         this.loginForm.get('password')!.setErrors({ PASSWORD_INCORRECT: true })
    //     }
    //   })
  }

}
