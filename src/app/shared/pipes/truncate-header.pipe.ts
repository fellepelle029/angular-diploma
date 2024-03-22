import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateHeader'
})
export class TruncateHeaderPipe implements PipeTransform {
  transform(value: string): string {
    const limit: number = 70;
    const trail: '...' = '...';

    if (value.length > limit) {
      return value.substring(0, limit) + trail;
    } else {
      return value;
    }
  }
}
