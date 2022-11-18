// ValueObjects

class Address{
  constructor(value){
    this.value = value
  }

  static format(address){
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

class Time{
  constructor(value){
    this.value = value
  }

  static format(time){
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

class Duration{
  constructor(value){
    this.value = value
  }
}

class DistanceUnit{
  constructor(value){
    this.value = value
  }
}

class Distance{
  constructor(value){
    this.value = value
  }

  static format(distance){
    
    if(distance === ""){
      return new Distance(0)
    }
    let cleaned = parseFloat(distance)
    return new Distance(cleaned)
  }
}

class Price{
  constructor(value){
    this.value = value
  }

  getNumbers(){
    if(this.value === ""){
      return 0
    }
    let numbers = this.value.match(/\d{1,}[,.]\d{2}/g)[0]
    numbers = numbers.replace(",", ".")
    return parseFloat(numbers)
  }

  getCurrency(){
    const currency = this.value.match(/[^\d,.  ]{1,}/g)[0]
    if(currency === "€") return "EUR"
    return currency
  }
}

// Extractor

class DataExtractor {
  constructor(sample){
    this.sample = sample
  }

  extractAdresses(){
    const ADDRESS = /<\w+?.+?class="address ?.+?".+?<\/span>([^<>]{100,}?)<\/\w+?>|<\w+?.+?class="address ?.+?".+?>([^<>]+?)<\/\w+?>/sg
    const matchedSample = this.sample.matchAll(ADDRESS)
    const addresses = []
    for(const match of matchedSample){
      let address = match[1]
      if(address === undefined){
        address = match[2]
      }
      if(addresses.includes(address)){
        continue
      }
      addresses.push(address)
    }
    return addresses.map((address) => Address.format(address))
  }
  
  extractTimes(){
    const TIME = /<span[\n ]+?class="[\w ]+ime.+?>([\d: \n|]+?)<\/span>/sg
    const matchedSample = this.sample.matchAll(TIME)
    const times = []
    for(const match of matchedSample){
      if(times.includes(match)){
        continue
      }
      times.push(match[1])
    }
    return times.map((time) => Time.format(time))
  }

  extractDuration(){
    const DURATION = />[\n ]*(\d{2}:\d{2}:\d{2})[\n ]*</sg
    const matchedSample = this.sample.matchAll(DURATION)
    let duration = ""
    for(const match of matchedSample){
      if(match[1] === duration){
        continue
      }
      if(match[1] === null){
        continue
      }
      duration = match[1]
    }
    return new Duration(duration)
  }

  extractFinalPrice(){
    const FINAL_PRICE = /<.+?class=".+?charge.+?>[\n ]*([\d,.CHF€  ]{2,}) *<\//gs
    const matchedSample = this.sample.matchAll(FINAL_PRICE)
    let price = ""
    for(const match of matchedSample){
      if(match[1].trim() === ""){
        continue
      }
      price = match[1]
    }
    return new Price(price)
  }

  extractDitanceUnit(){
    const DISTANCE_UNITS = /<td.+?class="trip.+?>[ \n]*([a-z.è]+?)[ \n]*<\//gms
    const matchedSample = this.sample.matchAll(DISTANCE_UNITS)
    let unit = ""
    for(const match of matchedSample){
      unit = match[1]
    }
    return new DistanceUnit(unit)
  }

  extractDistance(){
    const DISTANCE = /<td.+?class="trip.+?>[ \n]*([\d.]+?)[ \n]*<\//gms
    const matchedSample = this.sample.matchAll(DISTANCE)
    let distance = ""
    for(const match of matchedSample){
      distance = match[1]
    }
    return Distance.format(distance)
  }

  extractDistanceFee(){
    const DISTANCE_FEE = /<td.+?Distance.+?>[ \n]*([\d,CHF ]+)[ \n]*<\//gms
    const matchedSample = this.sample.matchAll(DISTANCE_FEE)
    let fee = ""
    for(const match of matchedSample){
      fee = match[1]
    }
    return new Price(fee)
  }

  extractTimeFee(){
    const TIME_FEE = /<td.+?Temps.+?>[ \n]*([\d,CHF ]+)[ \n]*<\//gms
    const matchedSample = this.sample.matchAll(TIME_FEE)
    let fee = ""
    for(const match of matchedSample){
      fee = match[1]
    }
    return new Price(fee)
  }

  getExtractedData(){
    const addresses = this.extractAdresses()
    const duration = this.extractDuration().value
    const times = this.extractTimes()
    const timeFee = this.extractTimeFee()
    const distance = this.extractDistance().value
    const distanceUnit = this.extractDitanceUnit().value
    const distanceFee = this.extractDistanceFee()
    const totalPrice = this.extractFinalPrice()

    return {
      arrivalAddress: addresses[1].value,
      arrivalTime: times[1].value,
      currency: totalPrice.getCurrency(),
      departureAddress: addresses[0].value,
      departureTime: times[0].value,
      distance: distance,
      distanceFee: distanceFee.getNumbers(),
      distanceUnit: distanceUnit,
      duration: duration,
      timeFee: timeFee.getNumbers(),
      totalPricePaid: totalPrice.getNumbers(),
    }
  }

}       

function parseSample(sample) {
  const extractor = new DataExtractor(sample.html)
  return extractor.getExtractedData();
}


exports.parseSample = parseSample;