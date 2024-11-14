import { LoginReq, LoginRes } from "../models/auth"
import wwtApi from "./api"


// Requesteille määritetään "model"
export async function login(req: LoginReq) {
  
  // Käytetään wwtApi nimistä apufunktiota, 
  // joka suorittaa itse fetchauksen rajapintaan
  // Siellä on määritetty base url
  // Määritellään TypeScriptille tässä responsen tyyppi

  const res: LoginRes = await wwtApi("/auth/login", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  })
  
  return res
}
