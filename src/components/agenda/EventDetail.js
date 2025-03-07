import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Badge, Row, Col, Container, Tabs, Tab, ListGroup } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import CATEGORY_EMOJIS from '../../hooks/CategoryEmojis';
import ShareButton from '../../hooks/ShareButton';
import SaveButton from '../../hooks/SaveButton';
import FormattedDateRangeWrapper from '../../hooks/FormattedDateRangeWrapper';
import FormattedAddressWrapper from '../../hooks/FormattedAddressWrapper';
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

    const formattedAddress = <FormattedAddressWrapper address={data.address} />
    
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
          <Card className="p-4 border-0">
            <Row className="align-items-center">
              <Col xs={12} md={9}>
                <Badge bg="light" text="dark" className="me-2">
                  {data.category}
                </Badge>
                <FormattedDateRangeWrapper startDate={data.start_date} endDate={data.end_date}>
                  {(formattedDateRange) => (
                    <span className="text-muted">
                      {formattedDateRange}
                    </span>
                  )}
                </FormattedDateRangeWrapper>

                <h1 className="fw-bold mt-2">{data.name}</h1>
                <p className="text-muted">{formattedAddress}</p>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {data.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      bg="light"
                      text="dark"
                      className="py-1 px-2"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </Col>

              {/* Buttons aligned responsively */}
              <Col
                xs={12}
                md={3}
                className="d-flex justify-content-center justify-content-md-end mt-3 mt-md-0 gap-2"
              >
                <SaveButton />
                <ShareButton />
              </Col>
            </Row>
          </Card>

          <Tabs defaultActiveKey="info" id="event-detail-tabs" className="my-4">
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
                  {data.activities && data.activities.length > 0 && (
                    <Card className="p-3 mb-4 shadow">
                      <Card.Header as="h5" className="fw-bold bg-white border-0">
                        Lineup
                      </Card.Header>
                      <Card.Body>
                        <ListGroup variant="flush">
                          {data.activities.map((activity, index) => (
                            <ListGroup.Item
                              key={index}
                              className="bg-transparent border-0 px-0"
                            >
                              <FormattedDateRangeWrapper
                                startDate={activity.start_date}
                                endDate={activity.end_date}
                                showDay={false}
                              >
                                {(formattedDateRange) => (
                                  <span className="text-muted">
                                    {formattedDateRange} - {activity.name}
                                  </span>
                                )}
                              </FormattedDateRangeWrapper>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  )}

                  {/* Description Section */}
                  <Card className="p-3 mb-4 shadow">
                    <Card.Header as="h5" className="fw-bold bg-white border-0">
                      Description
                    </Card.Header>
                    <Card.Body style={{ whiteSpace: 'pre-line' }}>{data.description}</Card.Body>
                  </Card>
                </Col>

                {/* Location Section */}
                <Col md={4}>
                  <Card className="p-3 shadow">
                    <Card.Header as="h5" className="fw-bold bg-white border-0">
                      Location
                    </Card.Header>
                    <Card.Body>
                      <MapContainer
                        center={[data.latitude, data.longitude]}
                        zoom={13}
                        style={{ height: '200px', width: '100%' }}
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[data.latitude, data.longitude]} icon={this.createIcon(CATEGORY_EMOJIS[data.category])}> 
                          <Popup>{formattedAddress}</Popup>
                        </Marker>
                      </MapContainer>
                      <p className="text-muted mt-2">{data.location}</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="similar" title="Similar events">
              <Card className="p-4 shadow mt-3">
                <Card.Header as="h5" className="fw-bold bg-white border-0">
                  Upcoming Events
                </Card.Header>
                <Card.Body>No events available</Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Container>
      </>
    );
  }
}

export default EventDetailWithParams;
