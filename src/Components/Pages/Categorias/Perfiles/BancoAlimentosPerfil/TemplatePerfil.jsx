import React, { Component } from "react";
import PropTypes from 'prop-types';
import "./Styles/Dinero.css";

class TemplatePerfil extends Component {
    render() {
        const { opciones } = this.props; // Cambio aquí
        const { logo, titulo, horario, direccion, telefono, sitioWeb, email, mapaBoton, mapa, descripcion } = opciones; // Cambio aquí
        return (
            <section id="ContainerDineroPadre">
                <div className="DineroHijo">
                    <img src={logo} alt="Logo" id="LogoDinero" />

                    <div className="TextoDinero">
                        <div id="ContainerTituloBtn">
                            <div id="Box1Texto">
                                <h2 id="TituloDinero">{titulo}</h2>
                                <p>{horario}</p>
                                <a href={mapa}>{direccion}</a>
                            </div>
                           
                            <div className="Box2Btn">

                            <a href={`tel:${telefono}`}>
                                <ion-icon name="call-outline" size='large' id='icon'></ion-icon>
                            </a>
                            <a href={sitioWeb}>
                                <ion-icon name="globe-outline" size='large' id='icon'></ion-icon>
                            </a>
                            <a href={mapaBoton}>
                                <ion-icon name="map-outline" size='large' id='icon'></ion-icon>
                            </a>
                            <a href={`mailto:${email}`}>
                                <ion-icon name="mail-outline" size='large' id='icon'></ion-icon>
                            </a>

                            </div>
                        </div>

                        <p>{descripcion}</p>
                    </div>

                    <div className="Mapa">
                        <iframe id="MapaGoogle" src={mapa} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                </div>
            </section>
        );
    }
}

TemplatePerfil.propTypes = {
    opciones: PropTypes.object.isRequired, // Cambio aquí
};

export default TemplatePerfil;