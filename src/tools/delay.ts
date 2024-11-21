// Fake delay, kutsu tätä async funtiossa await Delay(millisekunnit)
export const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));