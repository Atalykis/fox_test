export class Address{
  constructor(public readonly value: string){}

  static format(address: string){
    let cleaned = ""
    let previous = ""
    for(const char of address.trim()){
      if(previous === " " && char === previous){
        continue
      }
      previous = char
      cleaned += char
    }
    return new Address(cleaned)
  }
}