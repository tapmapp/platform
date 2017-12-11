import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[product-host]',
})
export class ProductDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}