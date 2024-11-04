## Projektin lataaminen ja riippuvuuksien asentaminen

1. Avaa komentoterminaali, navigoi kansioon, johon haluat kloonata projektin, ja kloona projekti ajamalla seuraava komento:
```
git clone https://github.com/inkaliinalauranto/WTT-frontend.git
```
2. Siirry kloonattuun projektikansioon ajamalla komentoterminaalissa seuraava cd-komento. (Jos nimesit projektin muulla nimellä, kirjoita nimi WTT-backend-nimen tilalle.)
```
cd WTT-frontend
```
3. Aja sen jälkeen komentoterminaalissa seuraava riippuvuudet asentava komento:
```
npm install
```
4. Avaa projekti Visual Studio Code -editorilla ajamalla komentoterminaalissa seuraava komento:
```
code .
```
5. Käynnistä kehitysympäristö ajamalla seuraava komento:
```
npm run dev
```
6. Siirry sen jälkeen osoitteeseen http://localhost:5173/, jossa sovellus on nyt käynnissä.