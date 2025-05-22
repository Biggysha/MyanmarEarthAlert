import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h5>Myanmar Earthquake Alert</h5>
            <p className="text-muted">
              Providing timely earthquake alerts and education to keep Myanmar citizens safe.
            </p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light">Home</a></li>
              <li><a href="/news" className="text-light">Earthquake News</a></li>
              <li><a href="/education" className="text-light">Education</a></li>
              <li><a href="/register" className="text-light">Register for Alerts</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact</h5>
            <ul className="list-unstyled text-muted">
              <li><i className="fas fa-phone me-2"></i> Emergency: 199</li>
              <li><i className="fas fa-envelope me-2"></i> info@myanmarearthquakealert.org</li>
              <li><i className="fas fa-map-marker-alt me-2"></i> Yangon, Myanmar</li>
            </ul>
          </Col>
        </Row>
        <hr />
        <div className="text-center text-muted">
          <small>&copy; {currentYear} Myanmar Earthquake Alert System. All rights reserved.</small>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
