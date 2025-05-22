import React from 'react';
import { Container, Row, Col, Card, Accordion, Button } from 'react-bootstrap';

const Education = () => {
  return (
    <Container>
      <h1 className="mb-4">Earthquake Education</h1>
      <p className="lead">
        Learn about earthquakes, safety measures, and how to prepare yourself and your family for 
        seismic events in Myanmar.
      </p>

      {/* What are Earthquakes Section */}
      <div className="education-card p-4 bg-light rounded">
        <h2>What are Earthquakes?</h2>
        <Row className="mt-4">
          <Col md={6}>
            <p>
              Earthquakes are the shaking, rolling or sudden shock of the earth's surface. They are the 
              Earth's natural means of releasing stress. More than a million earthquakes occur each year, 
              and many go undetected because they hit remote areas or have very small magnitudes.
            </p>
            <p>
              When an earthquake occurs, the energy released travels in waves through the earth's crust and 
              causes the shaking we feel. The location below the earth's surface where the earthquake starts 
              is called the hypocenter, and the location directly above it on the surface of the earth is called 
              the epicenter.
            </p>
          </Col>
          <Col md={6}>
            <img 
              src="https://via.placeholder.com/600x350?text=Earthquake+Diagram" 
              alt="Earthquake diagram showing fault lines" 
              className="img-fluid rounded"
            />
            <p className="text-center mt-2 text-muted">
              <small>Diagram showing how earthquakes occur along fault lines</small>
            </p>
          </Col>
        </Row>
      </div>

      {/* Myanmar-Specific Information */}
      <div className="education-card p-4 bg-light rounded mt-4">
        <h2>Earthquakes in Myanmar</h2>
        <Row className="mt-4">
          <Col md={6}>
            <img 
              src="https://via.placeholder.com/600x350?text=Myanmar+Fault+Map" 
              alt="Map of major fault lines in Myanmar" 
              className="img-fluid rounded"
            />
            <p className="text-center mt-2 text-muted">
              <small>Major fault lines in Myanmar</small>
            </p>
          </Col>
          <Col md={6}>
            <p>
              Myanmar is located in a seismically active region, with the Sagaing Fault being the most 
              significant geological feature responsible for earthquakes in the country. This fault runs 
              north-south through the central part of Myanmar.
            </p>
            <p>
              Over the years, Myanmar has experienced several major earthquakes, including the 2016 
              Chauk earthquake (magnitude 6.8), the 2012 Thabeikkyin earthquake (magnitude 6.8), and 
              the historical 1956 Sagaing earthquake (magnitude 7.0).
            </p>
            <p>
              The areas with the highest seismic risk in Myanmar include Bago, Yangon, Mandalay, and 
              regions along the Sagaing Fault line.
            </p>
          </Col>
        </Row>
      </div>

      {/* Before, During, After an Earthquake */}
      <h2 className="mt-5 mb-4">Earthquake Safety</h2>
      
      <Accordion defaultActiveKey="0" className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <strong>Before an Earthquake</strong> - How to Prepare
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={8}>
                <ul>
                  <li>
                    <strong>Prepare an emergency kit</strong> containing first aid supplies, food, water, 
                    flashlight, batteries, and other essentials.
                  </li>
                  <li>
                    <strong>Create a family emergency plan</strong> including meeting places and 
                    emergency contact information.
                  </li>
                  <li>
                    <strong>Secure heavy furniture</strong> to walls and place heavy items on lower shelves.
                  </li>
                  <li>
                    <strong>Know how to turn off gas, water, and electricity</strong> at the main switches.
                  </li>
                  <li>
                    <strong>Identify safe places in each room</strong> - under sturdy furniture or against 
                    an interior wall.
                  </li>
                  <li>
                    <strong>Practice drop, cover, and hold on drills</strong> with all family members.
                  </li>
                </ul>
              </Col>
              <Col md={4}>
                <img 
                  src="https://via.placeholder.com/300x250?text=Emergency+Kit" 
                  alt="Emergency Kit Contents" 
                  className="img-fluid rounded"
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <strong>During an Earthquake</strong> - How to Stay Safe
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={8}>
                <h5>If you are indoors:</h5>
                <ul>
                  <li>
                    <strong>DROP to the ground</strong> onto your hands and knees.
                  </li>
                  <li>
                    <strong>COVER your head and neck</strong> with your arms. If possible, crawl under 
                    a sturdy table or desk.
                  </li>
                  <li>
                    <strong>HOLD ON</strong> to your shelter until the shaking stops.
                  </li>
                  <li>
                    <strong>Stay away</strong> from glass, windows, outside doors and walls, and anything 
                    that could fall.
                  </li>
                  <li>
                    <strong>Do NOT run outside</strong> during the shaking.
                  </li>
                </ul>
                
                <h5>If you are outdoors:</h5>
                <ul>
                  <li>
                    <strong>Stay outdoors</strong> and move away from buildings, streetlights, and utility wires.
                  </li>
                  <li>
                    <strong>Find a clear spot</strong> and drop to the ground until the shaking stops.
                  </li>
                </ul>
              </Col>
              <Col md={4}>
                <img 
                  src="https://via.placeholder.com/300x250?text=Drop+Cover+Hold" 
                  alt="Drop, Cover, and Hold On Illustration" 
                  className="img-fluid rounded"
                />
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
        
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            <strong>After an Earthquake</strong> - What to Do Next
          </Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>
                <strong>Check yourself and others for injuries</strong>. Provide first aid if needed.
              </li>
              <li>
                <strong>Check your home for damage</strong>. If there is major damage, especially to 
                support columns, walls, or utility lines, evacuate the building.
              </li>
              <li>
                <strong>Check utilities</strong>. If you smell gas, turn off the main gas valve. If 
                there is electrical damage, turn off the main circuit breaker.
              </li>
              <li>
                <strong>Be prepared for aftershocks</strong>, which can cause additional damage.
              </li>
              <li>
                <strong>Listen to a battery-operated radio</strong> for emergency information.
              </li>
              <li>
                <strong>Avoid using phones</strong> except for serious emergencies.
              </li>
              <li>
                <strong>Stay out of damaged buildings</strong> until authorities declare them safe.
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Educational Resources */}
      <h2 className="mt-5 mb-4">Educational Resources</h2>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 education-card">
            <Card.Img variant="top" src="https://via.placeholder.com/400x225?text=Children's+Guide" />
            <Card.Body>
              <Card.Title>Children's Guide to Earthquakes</Card.Title>
              <Card.Text>
                Age-appropriate resources to help children understand earthquakes and what to do 
                during seismic events.
              </Card.Text>
              <Button variant="outline-primary">Download PDF</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 education-card">
            <Card.Img variant="top" src="https://via.placeholder.com/400x225?text=Home+Safety" />
            <Card.Body>
              <Card.Title>Home Safety Checklist</Card.Title>
              <Card.Text>
                A comprehensive checklist to help you prepare your home and reduce potential 
                earthquake hazards.
              </Card.Text>
              <Button variant="outline-primary">Download PDF</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card className="h-100 education-card">
            <Card.Img variant="top" src="https://via.placeholder.com/400x225?text=Emergency+Plan" />
            <Card.Body>
              <Card.Title>Family Emergency Plan Template</Card.Title>
              <Card.Text>
                Create a customized emergency plan for your family with this easy-to-use template.
              </Card.Text>
              <Button variant="outline-primary">Download PDF</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Video Resources */}
      <h3 className="mt-5 mb-4">Educational Videos</h3>
      
      <Row>
        <Col md={6} className="mb-4">
          <div className="ratio ratio-16x9">
            <div className="bg-dark d-flex align-items-center justify-content-center text-white">
              <div className="text-center">
                <i className="fas fa-play-circle fa-3x mb-3"></i>
                <h5>Understanding Earthquakes in Myanmar</h5>
                <p className="text-muted">Video placeholder - In a real app, this would be an embedded video</p>
              </div>
            </div>
          </div>
        </Col>
        
        <Col md={6} className="mb-4">
          <div className="ratio ratio-16x9">
            <div className="bg-dark d-flex align-items-center justify-content-center text-white">
              <div className="text-center">
                <i className="fas fa-play-circle fa-3x mb-3"></i>
                <h5>Earthquake Safety Demonstration</h5>
                <p className="text-muted">Video placeholder - In a real app, this would be an embedded video</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      
      {/* Workshops and Training */}
      <div className="bg-light p-4 rounded mt-5">
        <h3>Workshops and Training</h3>
        <p>
          We regularly conduct earthquake preparedness workshops and training sessions across Myanmar. 
          Check the schedule below for upcoming events in your area.
        </p>
        
        <Row className="mt-4">
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Earthquake Preparedness Workshop</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Yangon, June 15, 2025</Card.Subtitle>
                <Card.Text>
                  A comprehensive workshop covering earthquake basics, safety procedures, and 
                  hands-on emergency response training.
                </Card.Text>
                <Button variant="primary" size="sm">Register</Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>School Safety Training</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Mandalay, July 5, 2025</Card.Subtitle>
                <Card.Text>
                  Specialized training for teachers and school administrators on earthquake 
                  preparedness and student safety protocols.
                </Card.Text>
                <Button variant="primary" size="sm">Register</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Education;
