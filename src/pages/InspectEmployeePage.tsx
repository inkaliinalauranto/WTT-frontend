
import { useState } from "react";
import { AccountTopBar } from "../assets/css/accounttopbar";
import { BlueButton, GreenButton, RedButton } from "../assets/css/button";
import { Layout } from "../assets/css/layout";
import { Popup } from "../components/PopUp";
import { Textfield } from "../assets/css/textfield";
import { Row } from "../assets/css/row";



export default function InspectEmployeePage() {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    return <Layout>
        <AccountTopBar justifyContent="space-between">
            <BlueButton onClick={() => console.log("Takaisin")}>Takaisin</BlueButton>
            <div>Työnkeijänm nimi</div>
            <RedButton>Poista työntekijä</RedButton>
        </AccountTopBar>
        <GreenButton onClick={openPopup}>Lisää työvuoro</GreenButton>
        <Popup
            isOpen={isPopupOpen}
            title="Lisää työvuoro"
            width="500px"
            height="400px"
        >
            <Textfield required
                type="text"
                placeholder="Päivämäärä"
            ></Textfield>
            <Textfield required
                type="text"
                placeholder="Alku"
            ></Textfield>
            <Textfield required
                type="text"
                placeholder="Loppu"
            ></Textfield>
            <Row>
                <BlueButton onClick={closePopup}>Takaisin</BlueButton>
                <GreenButton>✓</GreenButton>
            </Row>
        </Popup>
    </Layout>
}
