import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Badge, Row, Col, Container, Tabs, Tab } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LuShare } from "react-icons/lu";
import CATEGORY_EMOJIS from '../../hooks/categoryEmojis';
import L from "leaflet";


const EventDetailWithParams = (props) => <EventDetail {...props} params={useParams()} />;

// TODO merged DiscoverDetail and EventDetail, they have almost the same structure
class EventDetail extends Component {

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
    const { events, params } = this.props;
    const data = events.find((x) => x.id === String(params.id));

    if (!data) return <p>Event not found</p>;
    
    return (
      <>
        {/* Image */}
        <Card.Img
          variant="top"
          src={data.files.find((x) => x.category === "cover_image").path}
          alt="" /*{title}*/
          style={{ height: '400px', objectFit: 'cover', borderRadius: '0.5rem 0.5rem 0 0' }}
        />
    
        <Container className="my-5">
          {/* Event Header */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Badge bg="light" text="dark" className="me-2">{data.category}</Badge>
                <span className="text-muted">{data.start_date} - {data.start_date}</span>

                <h1 className="fw-bold mt-2">{data.name}</h1>
                <p className="text-muted">{data.address}</p>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {data.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      bg="light"
                      text="dark"
                      className="py-1 px-2"
                      style={{ fontSize: '0.9rem' }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Buttons aligned to the right */}
              <div className="d-flex gap-2">
                <Button variant="dark w-100">Save</Button>
                <Button variant="outline-dark"><LuShare /></Button>
              </div>
            </div>
          </div>

          <Tabs defaultActiveKey="info" id="event-detail-tabs" className="mb-4">
            <Tab eventKey="info" title="Information">
              <Row>
                {/* Tickets Section */}
                <Col md={8}>
                  {/* <Card className="p-3 mb-4">
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
                  </Card> */}

                  {/* Lineup Section */}
                  {/* <Card className="p-3 mb-4">
                    <h5 className="mb-3">Lineup:</h5>
                    <ListGroup>
                      <ListGroup.Item>20:00 - Bachata Beginner</ListGroup.Item>
                      <ListGroup.Item>21:00 - Bachata Intermediate</ListGroup.Item>
                      <ListGroup.Item>22:00 - Mix Bachata</ListGroup.Item>
                    </ListGroup>
                  </Card> */}

                  {/* Description Section */}
                  <Card className="p-3">
                    <h5 className="mb-3">Description:</h5>
                    <p>
                      {data.description}
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
                        <Popup>{data.address}</Popup>
                      </Marker>
                    </MapContainer>
                    <p className="text-muted mt-2">{data.location}</p>
                  </Card>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="similar" title="Similar events">
              <p>No similar events found at this time.</p>
            </Tab>
          </Tabs>
        </Container>
      </>
    );
  }
}

export default EventDetailWithParams;
