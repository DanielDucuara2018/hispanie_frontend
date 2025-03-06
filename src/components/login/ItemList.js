import React, { Component } from 'react';
import { Modal, Button, Card, Container, Row, Col, Image, Badge } from 'react-bootstrap';

class DeleteConfirmationModal extends Component {
  render() {
    const { show, handleClose, handleConfirm, itemName } = this.props;
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{itemName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      selectedItem: null,
    };
  }

  handleDeleteClick = (item) => {
    this.setState({
      showModal: true,
      selectedItem: item,
    });
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      selectedItem: null,
    });
  };

  handleConfirmDelete = () => {
    const { selectedItem } = this.state;
    if (selectedItem) {
      this.props.onDelete(selectedItem.id);
    }
    this.handleCloseModal();
  };

  render() {
    const { items, onUpdate } = this.props;
    const { showModal, selectedItem } = this.state;

    return (
      <div>
        {items.map((item) => (
          <Card key={item.id} className="mb-3">
            <Card.Body>
              <Container>
              <Row className="align-items-center">
                {/* Image Column */}
                <Col md={2} xs={3} className="text-center">
                    <Image
                    src={item.files.find((x) => x.category === 'profile_image')?.path || 'default-image-path'}
                    roundedCircle
                    width={75}
                    height={75}
                    className="border border-3 shadow-sm"
                    />
                </Col>

                {/* Category Badge and Title Column */}
                <Col md={6} xs={5}>
                    <Badge bg="secondary" className="me-2">
                    {item.category}
                    </Badge>
                    <Card.Title className="d-inline">{item.name}</Card.Title>
                </Col>

                {/* Action Buttons Column */}
                <Col md={4} xs={4} className="text-end">
                    <Button variant="dark" className="me-2" onClick={() => onUpdate(item.id)}>
                    Update
                    </Button>
                    <Button variant="outline-dark" onClick={() => this.handleDeleteClick(item)}>
                    Delete
                    </Button>
                </Col>
                </Row>

              </Container>
            </Card.Body>
          </Card>
        ))}
        {selectedItem && (
          <DeleteConfirmationModal
            show={showModal}
            handleClose={this.handleCloseModal}
            handleConfirm={this.handleConfirmDelete}
            itemName={selectedItem.name}
          />
        )}
      </div>
    );
  }
}

export default ItemList;
