import { useState, useCallback } from "react";
import { Modal, Button, Card, Container, Row, Col, Image, Badge } from "react-bootstrap";

const DeleteConfirmationModal = ({ show, handleClose, handleConfirm, itemName }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete <strong>{itemName}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="danger" onClick={handleConfirm}>Delete</Button>
      </Modal.Footer>
    </Modal>
  );
};

const ItemList = ({ items = [], onDelete, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDeleteClick = useCallback((item) => {
    setShowModal(true);
    setSelectedItem(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedItem(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (selectedItem) {
      onDelete(selectedItem.id);
    }
    handleCloseModal();
  }, [selectedItem, onDelete, handleCloseModal]);

  return (
    <div style={{ maxHeight: "500px", overflowY: "auto" }}>
      {items.map((item) => {
        const profileImage = item.files?.find((x) => x.category === "profile_image")?.path || "default-image-path";
        
        return (
          <Card key={item.id} className="mb-3 shadow-sm">
            <Card.Body>
              <Container fluid>
                <Row className="align-items-center gy-2">
                  <Col md="auto" xs={3} className="text-center">
                    <Image
                      src={profileImage}
                      roundedCircle
                      fluid
                      className="mb-3 shadow-sm"
                      style={{
                        width: "75px",
                        height: "75px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </Col>

                  <Col className="d-flex flex-column justify-content-center">
                    <Badge bg="secondary" className="mb-1 align-self-start">{item.category}</Badge>
                    <Card.Title className="mb-0 fs-6 fw-bold">{item.name}</Card.Title>
                  </Col>

                  <Col md="auto" xs="12" className="d-flex justify-content-end gap-2">
                    <Button variant="dark" size="sm" onClick={() => onUpdate(item.id)}>Update</Button>
                    <Button variant="outline-dark" size="sm" onClick={() => handleDeleteClick(item)}>Delete</Button>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
          </Card>
        );
      })}
      {selectedItem && (
        <DeleteConfirmationModal
          show={showModal}
          handleClose={handleCloseModal}
          handleConfirm={handleConfirmDelete}
          itemName={selectedItem.name}
        />
      )}
    </div>
  );
};

export default ItemList;
