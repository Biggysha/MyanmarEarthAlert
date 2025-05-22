import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Home = () => {
  // Sample earthquake data (in real app, this would come from an API)
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from API - here we're using sample data
    const sampleData = [
      {
        id: 1,
        title: "M 5.2 - 25km NE of Mandalay",
        magnitude: 5.2,
        location: "25km NE of Mandalay, Myanmar",
        coordinates: [21.9745, 96.0836], // [lat, lng]
        depth: "10 km",
        time: "2025-05-20T14:30:45",
        alert: "yellow"
      },
      {
        id: 2,
        title: "M 4.5 - 15km W of Yangon",
        magnitude: 4.5,
        location: "15km W of Yangon, Myanmar",
        coordinates: [16.8661, 96.1951], 
        depth: "8 km",
        time: "2025-05-19T09:15:22",
        alert: "green"
      },
      {
        id: 3,
        title: "M 3.8 - 30km SE of Bago",
        magnitude: 3.8,
        location: "30km SE of Bago, Myanmar",
        coordinates: [17.3350, 96.4821],
        depth: "12 km",
        time: "2025-05-18T21:45:10",
        alert: "green"
      }
    ];
    
    setEarthquakes(sampleData);
    setLoading(false);
  }, []);

  // Calculate color based on magnitude
  const getMagnitudeColor = (magnitude) => {
    if (magnitude >= 6.0) return "#d73027"; // Red
    if (magnitude >= 5.0) return "#fc8d59"; // Orange
    if (magnitude >= 4.0) return "#fee08b"; // Yellow
    return "#91cf60"; // Green
  };

  // Myanmar center coordinates
  const myanmarCenter = [19.7633, 96.0785];

  return (
    <Container>
      {/* Hero Section */}
      <div className="hero-section text-center">
        <h1>Myanmar Earthquake Alert System</h1>
        <p className="lead">
          Stay informed about earthquake activity in Myanmar. Register for SMS alerts to receive
          real-time notifications about significant earthquakes.
        </p>
        <Button as={Link} to="/register" variant="danger" size="lg" className="mt-3">
          Register for SMS Alerts
        </Button>
      </div>

      {/* Current Alert Section */}
      <Alert variant="danger" className="alert-card">
        <h4><i className="fas fa-exclamation-circle me-2"></i>Current Alert Status</h4>
        <p>
          No active earthquake warnings at this time. The last significant earthquake was a magnitude 
          5.2 event near Mandalay on May 20, 2025.
        </p>
      </Alert>

      {/* Map Section */}
      <h2 className="mb-3 mt-5">Recent Earthquake Activity</h2>
      <div className="earthquake-map">
        <MapContainer center={myanmarCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {earthquakes.map(quake => (
            <React.Fragment key={quake.id}>
              <Marker position={quake.coordinates}>
                <Popup>
                  <div>
                    <h6>{quake.title}</h6>
                    <p>Magnitude: {quake.magnitude}</p>
                    <p>Depth: {quake.depth}</p>
                    <p>Time: {new Date(quake.time).toLocaleString()}</p>
                  </div>
                </Popup>
              </Marker>
              <Circle 
                center={quake.coordinates}
                radius={quake.magnitude * 10000}
                fillColor={getMagnitudeColor(quake.magnitude)}
                weight={1}
                opacity={0.8}
                fillOpacity={0.4}
              />
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      {/* Recent Earthquakes List */}
      <Row className="mt-4">
        <Col md={12}>
          <h3>Recent Earthquakes</h3>
          {loading ? (
            <p>Loading earthquake data...</p>
          ) : (
            earthquakes.map(quake => (
              <Card key={quake.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Card.Title>{quake.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{quake.location}</Card.Subtitle>
                      <Card.Text>
                        Depth: {quake.depth} | Time: {new Date(quake.time).toLocaleString()}
                      </Card.Text>
                    </div>
                    <div 
                      className="rounded-circle d-flex justify-content-center align-items-center" 
                      style={{ 
                        backgroundColor: getMagnitudeColor(quake.magnitude),
                        width: '60px',
                        height: '60px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                      }}
                    >
                      {quake.magnitude}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
          <div className="text-center mt-3">
            <Button as={Link} to="/news" variant="primary">
              View All Earthquake News
            </Button>
          </div>
        </Col>
      </Row>

      {/* Information Sections */}
      <Row className="mt-5">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <i className="fas fa-book-open me-2"></i>
                Earthquake Education
              </Card.Title>
              <Card.Text>
                Learn about earthquakes, safety measures, and how to prepare yourself and your family
                for seismic events in Myanmar.
              </Card.Text>
              <Button as={Link} to="/education" variant="outline-primary">
                Learn More
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>
                <i className="fas fa-mobile-alt me-2"></i>
                SMS Alert Service
              </Card.Title>
              <Card.Text>
                Register your mobile number to receive SMS alerts when significant earthquakes occur
                in your area. This free service is available to all residents of Myanmar.
              </Card.Text>
              <Button as={Link} to="/register" variant="outline-danger">
                Register Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
