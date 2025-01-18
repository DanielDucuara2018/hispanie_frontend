import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Badge, Row, Col, Container, Tabs, Tab, ListGroup } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import CATEGORY_EMOJIS from '../../hooks/categoryEmojis';
import L from "leaflet";

const DiscoverDetailWithParams = (props) => <DiscoverDetail {...props} params={useParams()} />;

// TODO merged DiscoverDetail and EventDetail, they have almost the same structure
class DiscoverDetail extends Component {

  // Custom marker icons using Leaflet TODO centralize this is dupicated code
  createIcon = (emoji) =>
  new L.DivIcon({
    className: "custom-icon",
    html: `
      <div class="d-flex justify-content-center align-items-center bg-white border rounded-circle shadow"
            style="width: 40px; height: 40px; border: 2px solid #ccc;">
        <span style="font-size: 20px;">${emoji}</span>
      </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });

  render() {
    const { businesses , params } = this.props;
    const data = businesses.find(x => x.id === String(params.id));

    if (!data) return <p>Business not found</p>;

    return (
      <>
        {/* Image */}
        <Card.Img
          variant="top"
          src="https://cdn.shopify.com/s/files/1/0640/6704/3388/files/350108700_263112186224533_8746143785201406498_n.jpg?v=1734832072" /*{image}*/
          alt="" /*{title}*/
          style={{ height: '400px', objectFit: 'cover', borderRadius: '0.5rem 0.5rem 0 0' }}
        />
    
        <Container className="my-5">
          {/* Bussiness Header */}
          <div className="mb-4">
            <h5 className="text-muted mb-2">{data.category}</h5>
            <h1 className="fw-bold mb-1">{data.name}</h1>
            <p className="text-muted">{data.location}</p>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <Badge bg="light" text="dark">Bachata</Badge>
              <Badge bg="light" text="dark">Latino</Badge>
              <Badge bg="light" text="dark">Modern Bachata</Badge>
            </div>
            <Button variant="dark" className="me-2">Save</Button>
            <Button variant="outline-dark">Share</Button>
          </div>

          <Tabs defaultActiveKey="info" id="event-detail-tabs" className="mb-4">
            <Tab eventKey="info" title="Information">
              <Row>
                {/* Tickets Section */}
                <Col md={8}>
                  <Card className="p-3 mb-4">
                    <h5 className="mb-3">Tickets:</h5>
                    <ListGroup>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span>1 course (with 1 drink included)</span>
                        <strong>€8.00</strong>
                        <Button variant="dark" size="sm">Buy</Button>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <span>2 courses (with 2 drinks included)</span>
                        <strong>€14.00</strong>
                        <Button variant="dark" size="sm">Buy</Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>

                  {/* Lineup Section */}
                  <Card className="p-3 mb-4">
                    <h5 className="mb-3">Lineup:</h5>
                    <ListGroup>
                      <ListGroup.Item>20:00 - Bachata Beginner</ListGroup.Item>
                      <ListGroup.Item>21:00 - Bachata Intermediate</ListGroup.Item>
                      <ListGroup.Item>22:00 - Mix Bachata</ListGroup.Item>
                    </ListGroup>
                  </Card>

                  {/* Description Section */}
                  <Card className="p-3">
                    <h5 className="mb-3">Description:</h5>
                    <p>
                      {data.description}
                      {/* <strong>🎉 Bachatero SAO 🎉</strong>
                      <br />
                      Join us every Wednesday at SAO for an evening full of rhythm and dance! 🕺💃
                      <ul>
                        <li>20:00 - Bachata Beginner: Learn the basics and feel the energy of bachata!</li>
                        <li>21:00 - Bachata Intermediate: Perfect your movements and learn more complex figures.</li>
                        <li>22:00 - Mix Bachata: Dance freely with something for everyone!</li>
                      </ul>
                      Come to have fun, learn, and improve in a festive and friendly atmosphere! 🎶 */}
                    </p>
                  </Card>
                </Col>

                {/* Location Section */}
                <Col md={4}>
                  <Card className="p-3">
                    <h5 className="mb-3">Location:</h5>
                    <MapContainer
                      center={[data.latitude, data.longitude]}
                      zoom={13}
                      style={{ height: '200px', width: '100%' }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[data.latitude, data.longitude]} icon={this.createIcon(CATEGORY_EMOJIS[data.category])}>
                        <Popup>{data.location}</Popup>
                      </Marker>
                    </MapContainer>
                    <p className="text-muted mt-2">{data.location}</p>
                  </Card>
                </Col>
              </Row>
            </Tab>
            <Tab bussinessKey="similar" title="Similar bussinesses">
              <p>No similar bussiness found at this time.</p>
            </Tab>
          </Tabs>

          {/* Tags Section */}
          <div className="d-flex gap-2 mt-4">
            <Badge bg="light" text="dark">Bachata</Badge>
            <Badge bg="light" text="dark">Latino</Badge>
            <Badge bg="light" text="dark">Modern Bachata</Badge>
          </div>
        </Container>
      </>
    );
  }
}

export default DiscoverDetailWithParams;
