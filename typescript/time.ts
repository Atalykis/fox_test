export class Time{
  constructor(public readonly value: string){}

  static format(time: string){
    let cleaned = ""
    let previous = ""
    for(const char of time.trim()){
      if(previous === " " && char === previous){
        continue
      }
      if(char === "|"){
        continue
      }
      previous = char
      cleaned += char
    }
    if(cleaned.length < 5){
      cleaned = "0" + cleaned
    }
    return new Time(cleaned.trim())
  }
}