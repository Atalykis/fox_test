import { sample_1 } from "./samples/sample_1"
import { sample_2 } from "./samples/sample_2"
import { sample_3 } from "./samples/sample_3"
import {result_1, result_2, result_3} from "../expectedResults"
import { DataExtractor } from "./data-extractor"


describe("DataExtraction", () => {
  it("should return extracted data as object of Sample1", () => {
    const extractor = new DataExtractor(sample_1.html)
    const extractedData = extractor.getExtractedData()
    expect(extractedData).toEqual(result_1)
  })

    it("should return extracted data as object of Sample2", () => {
      const extractor = new DataExtractor(sample_2.html)
      const extractedData = extractor.getExtractedData()
      expect(extractedData).toEqual(result_2)
  })

    it("should return extracted data as object of Sample3", () => {
      const extractor = new DataExtractor(sample_3.html)
      const extractedData = extractor.getExtractedData()
      expect(extractedData).toEqual(result_3)
  })
})