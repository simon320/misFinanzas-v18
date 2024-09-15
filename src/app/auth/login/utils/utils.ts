export const emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
export const notEmpty: string = '[A-Za-z0-9]+';
  // public onlyLetter: string = '[A-Za-z ]+';

  // compareFields(field1: string, field2: string): ValidationErrors | null {
  //   return (form: AbstractControl): ValidationErrors | null => {
  //     const pass1 = form.get(field1)?.value;
  //     const pass2 = form.get(field2)?.value;

  //     if (String(pass1) !== String(pass2)) {
  //       form.get(field2)?.setErrors({ notEquals: true });
  //       return { notEquals: true };
  //     }

  //     if (form.get(field2)?.touched) {
  //       form.get(field2)?.setErrors(null);
  //     }
  //     return null;
  //   };
  // }


  // // TODO: ELIMINAR!!!!
  // empty(input: string): ValidationErrors | null {
  //   return (form: AbstractControl): ValidationErrors | null => {
  //     const text = form.get(input)?.value;

  //     if (text) {
  //       if (text.trim().length === 0) {
  //         form.get(input)?.setErrors({ empty: true });
  //         return { empty: true };
  //       }
  //     }

  //     return null;
  //   };
  // }
