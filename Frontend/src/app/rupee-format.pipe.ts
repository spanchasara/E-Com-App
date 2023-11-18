import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "rupeeFormat",
})
export class RupeeFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) {
      return "";
    }

    const formattedValue = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

    return formattedValue.replace(/^(\D+)/, "$1 ").replace(/\.00$/, "") + "/-";
  }
}
