export class Price{
  constructor(public readonly value: string){}

  getNumbers(){
    const match = this.value.match(/\d{1,}[,.]\d{2}/g)
    if(!match) return 0
    let numbers = match[0]
    numbers = numbers.replace(",", ".")
    return parseFloat(numbers)
  }

  getCurrency(){
    const match = this.value.match(/[^\d,.  ]{1,}/g)
    if(!match) return
    const currency = match[0]
    if(currency === "€") return "EUR"
    return currency
  }
}