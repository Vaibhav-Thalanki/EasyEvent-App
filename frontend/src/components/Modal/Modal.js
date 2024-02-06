import React from "react";
import './Modal.css'
const Modal = props=>{
    return <div className="modal">
        <header className="modal__header">{props.title}</header>
        <section className="modal__content">
            {props.children}
        </section>
        <section className="modal__actions">
            <button className="btn" onClick={props.closeModal}>Cancel</button>
            <button className="btn" onClick={props.actionButton}>{props.actionButtonText}</button>
        </section>
    </div>
}

export default Modal