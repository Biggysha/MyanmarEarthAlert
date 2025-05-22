import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';

const AlertRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    alertLevel: 'all',
    acknowledgment: false,
  });
  
  const [validated, setValidated] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    // In a real app, this would be an API call to register the user
    // For demonstration, we'll simulate a successful registration
    setShowSuccess(true);
    setError('');
    setValidated(false);
    
    // Reset the form after successful submission
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: '',
      alertLevel: 'all',
      acknowledgment: false,
    });
    
    // Scroll to the top to show the success message
    window.scrollTo(0, 0);
  };
  
  const cities = [
    'Yangon', 'Mandalay', 'Naypyidaw', 'Bago', 'Mawlamyine', 
    'Taunggyi', 'Pathein', 'Sittwe', 'Myitkyina', 'Dawei'
  ];
  
  return (
    <Container>
      <h1 className="mb-4">Register for Earthquake Alerts</h1>
      
      {showSuccess && (
        <Alert 
          variant="success" 
          onClose={() => setShowSuccess(false)} 
          dismissible
        >
          <Alert.Heading>Registration Successful!</Alert.Heading>
          <p>
            Thank you for registering for our earthquake alert service. You will now receive SMS 
            notifications about significant seismic events in Myanmar. You can unsubscribe at any 
            time by texting "STOP" to our service number.
          </p>
        </Alert>
      )}
      
      {error && (
        <Alert 
          variant="danger" 
          onClose={() => setError('')} 
          dismissible
        >
          <Alert.Heading>Registration Failed</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}
      
      <Row>
        <Col lg={8}>
          <Card className="registration-form mb-4">
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide your name.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="phone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+95 xxxxxxxxx"
                    required
                    pattern="^\+?[0-9]{10,15}$"
                  />
                  <Form.Text className="text-muted">
                    Please enter your Myanmar phone number in international format (e.g., +95 9xxxxxxxx).
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Myanmar phone number.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address (Optional)</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="city">
                  <Form.Label>City/Region</Form.Label>
                  <Form.Select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select your city/region</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))}
                    <option value="other">Other (All Myanmar)</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Please select your city or region.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="alertLevel">
                  <Form.Label>Alert Level Preference</Form.Label>
                  <div>
                    <Form.Check
                      type="radio"
                      label="All earthquakes (magnitude 4.0 and above)"
                      name="alertLevel"
                      id="all-alerts"
                      value="all"
                      checked={formData.alertLevel === 'all'}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="radio"
                      label="Significant earthquakes only (magnitude 5.0 and above)"
                      name="alertLevel"
                      id="significant-alerts"
                      value="significant"
                      checked={formData.alertLevel === 'significant'}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="radio"
                      label="Major earthquakes only (magnitude 6.0 and above)"
                      name="alertLevel"
                      id="major-alerts"
                      value="major"
                      checked={formData.alertLevel === 'major'}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="acknowledgment">
                  <Form.Check
                    type="checkbox"
                    name="acknowledgment"
                    checked={formData.acknowledgment}
                    onChange={handleChange}
                    label="I understand that this is an automated alert service and that message and data rates may apply."
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    You must agree before submitting.
                  </Form.Control.Feedback>
                </Form.Group>
                
                <Button type="submit" variant="danger" size="lg" className="w-100">
                  Register for Alerts
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header className="bg-danger text-white">
              <h5 className="mb-0">Why Register?</h5>
            </Card.Header>
            <Card.Body>
              <p>
                By registering for our SMS alert service, you'll receive immediate notifications when 
                earthquakes occur in Myanmar. This critical time advantage can help you:
              </p>
              <ul>
                <li>Take quick protective actions</li>
                <li>Alert your family members</li>
                <li>Stay informed during network outages</li>
                <li>Prepare for potential aftershocks</li>
              </ul>
            </Card.Body>
          </Card>
          
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">How It Works</h5>
            </Card.Header>
            <Card.Body>
              <ol>
                <li>Register your phone number</li>
                <li>Our system monitors seismic activity 24/7</li>
                <li>When an earthquake occurs, we analyze its magnitude and location</li>
                <li>If it meets your alert preference, you'll receive an immediate SMS</li>
                <li>SMS includes magnitude, location, and safety instructions</li>
              </ol>
              <p className="mt-3 text-muted">
                <small>
                  You can unsubscribe at any time by replying "STOP" to any alert message.
                </small>
              </p>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">Sample Alert</h5>
            </Card.Header>
            <Card.Body>
              <div className="border rounded p-3 bg-light">
                <p className="mb-0">
                  <strong>EARTHQUAKE ALERT:</strong> Magnitude 5.2 earthquake detected 25km NE of Mandalay at 2:30PM. 
                  Take protective measures if you are in the affected area. Stay indoors and away from windows. 
                  More info at myanmarearthquakealert.org
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AlertRegistration;
