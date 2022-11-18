export class Distance{
  constructor(public readonly value: number){
  }

  static format(distance: string){ 
    if(distance === ""){
      return new Distance(0)
    }
    let cleaned = parseFloat(distance)
    return new Distance(cleaned)
  }
}