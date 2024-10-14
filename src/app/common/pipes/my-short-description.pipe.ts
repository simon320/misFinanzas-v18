import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'showAmountCharacters',
})
export class ShowAmountCharactersPipe implements PipeTransform {

  transform(text: string, maxCharacter: number): string {

    if(text.length > maxCharacter)
      return text.substring(0, maxCharacter).trim() + "...";

    else
      return text;
  }

}
