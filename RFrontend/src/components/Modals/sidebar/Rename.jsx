import React from 'react'
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Rename({ShowReplaceModal, setShowReplaceModal, newTitle, setNewTitle, handleUpdateChat}) {
  return (
        <Modal show={ShowReplaceModal} onHide={() => setShowReplaceModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Rename Chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <div className="mb-3">
                  <label htmlFor="chatTitle" className="form-label">New Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="chatTitle"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    minLength={3}
                    required
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowReplaceModal(false)}>Close</Button>
              <Button variant="primary" onClick={handleUpdateChat} disabled={!newTitle.trim()}>Update</Button>
            </Modal.Footer>
          </Modal>
    
  )
}

export default Rename