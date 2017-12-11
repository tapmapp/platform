import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
 name: 'ratesPipe'
})
export class RatesPipe implements PipeTransform {

 transform(value: number, args: number) {
  return (new Array(args[0])).fill('');
 }

}