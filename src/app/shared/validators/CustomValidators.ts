import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static whiteSpacesOnlyValidation = (
    input: AbstractControl
  ): ValidationErrors | null => {
    if (!input) return null;
    if (input.value === null || input.value.length === 0) return null;
    if (input.value.trim().length === 0) return { whiteSpaceOnly: 'required' };
    return null;
  };

  static isNotWhiteSpace = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  };
}
