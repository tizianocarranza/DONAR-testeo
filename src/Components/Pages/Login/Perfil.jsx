import React, { useState, useEffect, useMemo } from "react";
import "./Styles/Perfil.css";
import { etiquetas } from "../Categorias/Etiquetas/index";
import { useFetch } from "../../../logic/useFetch";
import { getUserData } from "../../../logic/getUserData";
import useFetchImage from "../../../logic/useFetchImage";

const Perfil = () => {
    const [modoEdicion, setModoEdicion] = useState(false);
    const [mostrarGestionCuenta, setMostrarGestionCuenta] = useState(false);
    const [perfilInicial, setPerfilInicial] = useState({});
    const [mensaje, setMensaje] = useState("");
    const [errores, setErrores] = useState({});

    const [contrasenaActual, setContrasenaActual] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");
    const [infoCuenta, setInfoCuenta] = useState({
        email: "",
        contrasena: "",
        nuevaContrasena: ""
    });

    const [perfil, setPerfil] = useState({
        logo: "Foto de perfil",
        titulo: "Nombre de la organización",
        horario: "Horarios de atención",
        email: "correo@example.com",
        telefono: "123456789",
        direccion: "Dirección de la organización",
        descripcion: "Cambiar descripción",
        tituloEtiquetas: []
    });

    const categorias = Object.entries(etiquetas);
    const { token, userId } = getUserData();

    const opciones = useMemo(() => ({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        }
    }), [token]);

    const { data, error, loading } = useFetch(`https://api-don-ar.vercel.app/fundaciones/${userId}`, opciones);
    
    const { document } = data ? data : {};
    const logoUrl = document ? document.logo : "";
    console.log("Logo url: ", logoUrl)
    
    const {
        data: imageBlob,
        error: imageError,
        isLoading: isImageLoading,
        isError: isImageError,
        isSuccess: isImageSuccess,
    } = useFetchImage(logoUrl);

    let imageUrl;
    if (imageBlob) {
        imageUrl = URL.createObjectURL(imageBlob);
    }

    const datosFundacion = document ? {
        logo: imageUrl || "",
        titulo: document.titulo || "No especificado",
        horario: document.horario || "No especificado",
        email: document.email || "No especificado",
        telefono: document.telefono || "No especificado",
        direccion: document.direccion || "No especificado",
        descripcion: document.descripcion || "No especificado",
        tituloEtiquetas: document.tituloEtiquetas || []
    } : {};
    
    useEffect(() => {
        if (data) {
            setPerfil(datosFundacion);
            setPerfilInicial(datosFundacion);
        }
    }, [data]);

    console.log("El document es: ", document);
    console.log("El perfil es: ", perfil);

    useEffect(() => {
        setPerfilInicial({ ...perfil });
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPerfil({ ...perfil, [name]: value });
    };

    const handleCheckChange = (e) => {
        const { name, checked } = e.target;
        if (checked) {
            setPerfil({ ...perfil, tituloEtiquetas: [...perfil.tituloEtiquetas, name] });
        } else {
            setPerfil({ ...perfil, tituloEtiquetas: perfil.tituloEtiquetas.filter(donacion => donacion !== name) });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const opciones = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(perfil)
        };

        try {
            const response = await fetch(`https://api-don-ar.vercel.app/fundaciones/${userId}`, opciones);
            if (!response.ok) {
                throw new Error('Error al actualizar el perfil');
            }

            const data = await response.json();
            const perfilActualizado = data.updated;

            console.log(perfil)
            setPerfil(perfilActualizado);
            setPerfilInicial(perfilActualizado);
            setModoEdicion(false);
            setMensaje('Perfil actualizado con éxito');
        } catch (error) {
            setErrores({ ...errores, form: error.message });
        }
    };

    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();

        if (infoCuenta.nuevaContrasena !== confirmarContrasena) {
            setErrores({ ...errores, confirmPassword: 'Las contraseñas no coinciden' });
            return;
        }

        const opciones = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ 
                password: infoCuenta.contrasena,
                newPassword: infoCuenta.nuevaContrasena
            })
        };

        try {
            const response = await fetch(`https://api-don-ar.vercel.app/fundaciones/${userId}/change-password`, opciones);
            if (!response.ok) {
                throw new Error('Error al cambiar contraseña');
            }

            const data = await response.json();

            setMensaje('Contraseña cambiada con éxito');
        } catch (error) {
            setErrores({ ...errores, form: error.message });
        }
    };

    const handleCancelEdit = () => {
        setPerfil(perfilInicial);
        setModoEdicion(false);
    };

    const handleEditClick = () => {
        setModoEdicion(true);
    };

    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setInfoCuenta({ ...infoCuenta, [name]: value });
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmarContrasena(e.target.value);
    };

    const handleAccountSubmit = async (e) => {
        e.preventDefault();
        // Lógica para manejar la actualización de la información de la cuenta
    };

    const handleDeleteAccount = async () => {
        // Lógica para manejar la eliminación de la cuenta
    };

    return (
        <div className="PerfilContainer">
            <h2 className="TituloPerfil">Configuración de tu Perfil</h2>
            <div className="ProfileInformation">
                <div className="InfoGridContainer">
                    <div className="containerFoto">
                        <img src={perfil.logo} alt="Foto de perfil" className="ImagePerfil" />
                    </div>
                    <div className="containerTextoPerfil">
                        {modoEdicion ? (
                            <form onSubmit={handleSubmit} className="FormPerfil">
                                <div className="mb-3">
                                    <label className="form-label">Nombre de la Organización</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errores.titulo ? 'is-invalid' : ''}`}
                                        name="titulo"
                                        value={perfil.titulo}
                                        onChange={handleChange}
                                    />
                                    {errores.titulo && <div className="invalid-feedback">{errores.titulo}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Horarios de atención</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errores.horario ? 'is-invalid' : ''}`}
                                        name="horario"
                                        value={perfil.horario}
                                        onChange={handleChange}
                                    />
                                    {errores.horario && <div className="invalid-feedback">{errores.horario}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Dirección</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                                        name="direccion"
                                        value={perfil.direccion}
                                        onChange={handleChange}
                                    />
                                    {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                                        name="telefono"
                                        value={perfil.telefono}
                                        onChange={handleChange}
                                    />
                                    {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                                        name="email"
                                        value={perfil.email}
                                        onChange={handleChange}
                                    />
                                    {errores.email && <div className="invalid-feedback">{errores.email}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Descripción</label>
                                    <textarea
                                        className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                                        name="descripcion"
                                        value={perfil.descripcion}
                                        onChange={handleChange}
                                    />
                                    {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Cambiar Imagen de Perfil</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        // onChange={handleImageChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <h3 className="TituloDropdown">Seleccione qué donaciones recibe</h3>
                                    {categorias?.map(([key, categoria]) => (
                                        <div className="form-check" key={key}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name={key}
                                                checked={perfil.tituloEtiquetas?.includes(key)}
                                                onChange={handleCheckChange}
                                            />
                                            <label className="form-check-label" htmlFor={key}>
                                                {categoria.titulo}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" className="btn btn-primary" id="BotonGuardarPerfil">Guardar</button>
                                <button type="button" onClick={handleCancelEdit} className="btn btn-secondary" id="btnCancelarEdicion">Cancelar</button>
                            </form>
                        ) : mostrarGestionCuenta ? (
                            <div className="AccountManagement">
                                <h3 className="ManejoDeCuentaTitulo">Gestión de cuenta</h3>
                                <form onSubmit={handleChangePasswordSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                                            name="email"
                                            value={infoCuenta.email}
                                            onChange={handleAccountChange}
                                        />
                                        {errores.email && <div className="invalid-feedback">{errores.email}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Contraseña Actual</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errores.contrasenaActual ? 'is-invalid' : ''}`}
                                            name="contrasena"
                                            value={infoCuenta.contrasena}
                                            onChange={handleAccountChange}
                                        />
                                        {errores.contrasenaActual && <div className="invalid-feedback">{errores.contrasenaActual}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errores.nuevaContrasena ? 'is-invalid' : ''}`}
                                            name="nuevaContrasena"
                                            value={infoCuenta.nuevaContrasena}
                                            onChange={handleAccountChange}
                                        />
                                        {errores.nuevaContrasena && <div className="invalid-feedback">{errores.nuevaContrasena}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Confirmar Nueva Contraseña</label>
                                        <input
                                            type="password"
                                            className={`form-control ${errores.confirmarContrasena ? 'is-invalid' : ''}`}
                                            name="confirmarContrasena"
                                            value={confirmarContrasena}
                                            onChange={handleConfirmPasswordChange}
                                        />
                                        {errores.confirmarContrasena && <div className="invalid-feedback">{errores.confirmarContrasena}</div>}
                                    </div>
                                    <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                                    <button type="button" onClick={() => setMostrarGestionCuenta(false)} className="btn btn-secondary" id="btnCancelarGestionCuenta">Cancelar</button>
                                    {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
                                </form>
                            </div>
                        ) : (
                            <div className="Perfil">
                                <h3>{perfil.titulo}</h3>
                                <p>Horarios de atención: {perfil.horario}</p>
                                <p>Dirección: {perfil.direccion}</p>
                                <p>Teléfono: {perfil.telefono}</p>
                                <p>Correo Electrónico: {perfil.email}</p>
                                <p>Descripción: {perfil.descripcion}</p>
                                <div>
                                    <h3 className="TituloDropdown">Donaciones que recibe</h3>
                                    <ul>
                                        {perfil.tituloEtiquetas?.map((donacion) => (
                                            <li key={donacion}>{categorias?.find(([key]) => key === donacion)[1].titulo}</li>
                                        ))}
                                    </ul>
                                </div>
                                {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
                                <button onClick={handleEditClick} className="btn btn-primary">Editar Perfil</button>
                                <button onClick={() => setMostrarGestionCuenta(!mostrarGestionCuenta)} className="btn btn-secondary">Gestión de Cuenta</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Perfil;
