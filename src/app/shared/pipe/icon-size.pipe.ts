import { Pipe, PipeTransform } from '@angular/core';
import { IconSize } from '../../core/type/icon-size';

@Pipe({
  name: 'iconSize'
})
export class IconSizePipe implements PipeTransform {

  transform(iconsize: IconSize): string {
      if (!iconsize) return '1rem';
      let dimension: string;
      switch (iconsize) {
        case '2xs':
        dimension = '0.625rem';
        break;
      case 'xs':
        dimension = '0.75rem';
        break;
      case 'sm':
        dimension = '0.875ren';
        break;
      case 'lg':
        dimension = '1.25rem';
        break;
      case 'xl':
        dimension = '1.5rem';
        break;
      case '2xl':
        dimension = '2rem';
        break;
      case '1x':
        dimension = '1rem';
        break;
      case '2x':
        dimension = '2rem';
        break;
      case '3x':
        dimension = '3rem';
        break;
      case '4x':
        dimension = '4rem';
        break;
      case '5x':
        dimension = '5rem';
        break;
      case '6x':
        dimension = '6rem';
        break;
      case '7x':
        dimension = '7rem';
        break;
      case '8x':
        dimension = '8rem';
        break;
      case '9x':
        dimension = '9rem';
        break;
      case '10x':
        dimension = '10rem';
        break;

      default:
        dimension = '1rem';
        break;
    }
    return dimension;

  }

}
