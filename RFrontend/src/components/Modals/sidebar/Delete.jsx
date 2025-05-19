import React from 'react'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Delete = ({showDeleteModal, handleCloseModal, handleConfirmDelete, chatToDelete}) => {
    return (
        <Modal
            show={showDeleteModal}
            onHide={handleCloseModal}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Delete Chat?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>
                    Are you sure you want to delete <span style={{ color: 'red' }}>{chatToDelete ? chatToDelete.title : ''}</span>?
                </h4>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Delete
