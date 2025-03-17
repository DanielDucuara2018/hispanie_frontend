import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Badge, Row, Col, Container, Tabs, Tab, Image, ListGroup } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaInstagram, FaFacebook  } from 'react-icons/fa';
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import ShareButton from '../../hooks/ShareButton';
import SaveButton from '../../hooks/SaveButton';
import FormattedAddressWrapper from '../../hooks/FormattedAddressWrapper';
import CATEGORY_EMOJIS from '../../hooks/CategoryEmojis';
import L from "leaflet";


const DiscoverDetailWithParams = (props) => <DiscoverDetail {...props} params={useParams()} />;

const SOCIAL_NETWORK_ICONS = {
  web: <TbWorld size={24} className="me-3" /> ,
  facebook: <FaFacebook size={24} className="me-3" /> ,
  instagram: <FaInstagram size={24} className="me-3" /> ,
};

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

    
    const webSites = data.social_networks.filter((x) => x.category === 'web')
    const socialNetworks = data.social_networks.filter((x) => x.category !== 'web')

    const formattedAddress = data.address !== null ? <FormattedAddressWrapper address={data.address} /> : null

    return (
      <>
        {/* Image */}
        <Card.Img
          variant="top"
          src={data.files.find((x) => x.category === "cover_image").path}
          style={{ height: '400px', objectFit: 'cover', borderRadius: '0.5rem 0.5rem 0 0' }}
        />
    
        <Container className="my-5">
          {/* Header */}
          <Card className="p-4 border-0">
            <Row className="align-items-center">
              {/* Profile Image */}
              <Col xs={12} sm={3} md={2} className="text-center mb-3 mb-sm-0">
                <Image
                  src={data.files.find((x) => x.category === "profile_image")?.path}
                  roundedCircle
                  fluid
                  className="shadow-sm"
                  style={{ width: '150px', height: '150px' }}
                />
              </Col>
              {/* Name & Association */}
              <Col xs={12} sm={6} className="text-center text-sm-start">
                <h2 className="fw-bold">{data.name}</h2>
                <h5 className="text-muted">
                  {data.category.charAt(0).toUpperCase() + data.category.slice(1)}
                </h5>
                {formattedAddress && <p className="text-muted">{formattedAddress}</p>}
                <div>
                  {data.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      bg="light"
                      text="dark"
                      className="me-2"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </Col>
              {/* Save & Share Buttons */}
              <Col xs={12} sm={3} className="d-flex justify-content-center justify-content-sm-end mt-3 mt-sm-0 gap-2">
                <SaveButton />
                <ShareButton />
              </Col>
            </Row>
          </Card>

          <Row className="mt-4">
            {/* Left Section - Tabs */}
            <Col xs={12}>
              <Tabs defaultActiveKey="info" className="mb-3">
                <Tab eventKey="info" title="Information">
                  <Row className="g-3">
                    {/* Description Section */}
                    <Col xs={12} md={8}>
                      <Card className="p-4 shadow">
                        <Card.Header as="h5" className="fw-bold bg-white border-0">
                          Description
                        </Card.Header>
                        <Card.Body style={{ whiteSpace: 'pre-line' }}>{data.description}</Card.Body>
                      </Card>
                    </Col>
                    {/* Contact and Follow Sections */}
                    <Col xs={12} md={4}>
                      <Row className="g-3">
                        {/* Contact Section */}
                        <Col xs={12}>
                          <Card className="p-4 shadow h-100">
                            <Card.Header as="h5" className="fw-bold bg-white border-0">
                              Contact
                            </Card.Header>
                            <Card.Body>
                              <ListGroup variant="flush">
                                {data.email && (
                                  <ListGroup.Item className="bg-transparent border-0 px-0">
                                    <h6 className="my-1">
                                      <a href={`mailto:${data.email}`} className="text-decoration-none text-dark">
                                        <MdOutlineMail size={24} className="me-3" />
                                        {data.email}
                                      </a>
                                    </h6>
                                  </ListGroup.Item>
                                )}
                                {data.phone && (
                                  <ListGroup.Item className="bg-transparent border-0 px-0">
                                    <h6 className="my-1">
                                      <a href={`tel:${data.phone}`} className="text-decoration-none text-dark">
                                        <BsTelephone size={24} className="me-3" />
                                        {data.phone}
                                      </a>
                                    </h6>
                                  </ListGroup.Item>
                                )}
                                {webSites.map((webSite, index)  => (
                                  <ListGroup.Item key={index} className="bg-transparent border-0 px-0">
                                    <h6 className="my-1">
                                      <a
                                        href={webSite.url}
                                        className="text-decoration-none text-dark"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        {SOCIAL_NETWORK_ICONS[webSite.category]}
                                        Visit our website
                                      </a>
                                    </h6>
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            </Card.Body>
                          </Card>
                        </Col>
                        {/* Follow Section */}
                        <Col xs={12}>
                          <Card className="p-4 shadow h-100">
                            <Card.Header as="h5" className="fw-bold bg-white border-0">
                              Follow
                            </Card.Header>
                            <Card.Body>
                              {socialNetworks.map((socialNetwork, index)  => (
                                <Button
                                  key={index}
                                  variant="outline-dark"
                                  className="w-100 mb-2"
                                  href={socialNetwork.url}
                                  target="_blank"
                                >
                                  {SOCIAL_NETWORK_ICONS[socialNetwork.category]} 
                                  Follow on {socialNetwork.category.charAt(0).toUpperCase() + socialNetwork.category.slice(1)}
                                </Button>
                              ))}
                            </Card.Body>
                          </Card>
                        </Col>

                        {/* Location Section */}
                        {formattedAddress && <Col xs={12}>
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
                                <Marker
                                  position={[data.latitude, data.longitude]}
                                  icon={this.createIcon(CATEGORY_EMOJIS[data.category])}
                                >
                                  <Popup>{formattedAddress}</Popup>
                                </Marker>
                              </MapContainer>

                              <p className="text-muted mt-2">{data.location}</p>

                              {/* Google Maps Link */}
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-dark w-100 mt-2"
                              >
                                Open in Google Maps
                              </a>
                            </Card.Body>
                          </Card>
                        </Col>}
                      </Row>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="events" title="Events">
                  <Card className="p-4 shadow mt-3">
                    <Card.Header as="h5" className="fw-bold bg-white border-0">
                      Upcoming Events
                    </Card.Header>
                    <Card.Body>No events available</Card.Body>
                  </Card>
                </Tab>
                <Tab eventKey="course" title="Course">
                  <Card className="p-4 shadow mt-3">
                    <Card.Header as="h5" className="fw-bold bg-white border-0">
                      Courses Offered
                    </Card.Header>
                    <Card.Body>No courses available</Card.Body>
                  </Card>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default DiscoverDetailWithParams;
