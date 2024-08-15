import { Pipe, PipeTransform } from '@angular/core';
import { IconColor } from '../../core/type/icon-color';
import { Color } from '../../core/enums/color.enum';

@Pipe({
  name: 'iconColor'
})
export class IconColorPipe implements PipeTransform {

  transform(iconColor: IconColor | undefined): string {
    if (!iconColor) return Color.PRIMARY;
    let color: string;
    switch (iconColor) {
      case 'primary':
        color = Color.PRIMARY;
        break;
      case 'white':
        color = Color.WHITE;
        break;
      case 'success':
        color = Color.SUCCESS;
        break;
      case 'warning':
        color = Color.WARNING;
        break;
      case 'error':
        color = Color.ERROR;
        break;
      case 'gray':
        color = Color.GRAY;
        break;
    }
    return color;
  }


}
