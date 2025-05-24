import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});

const Home = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestSignificantQuake, setLatestSignificantQuake] = useState(null);

  useEffect(() => {
    // Myanmar region approximate boundaries
    // Bounding box: min_latitude, min_longitude, max_latitude, max_longitude
    const fetchEarthquakeData = async () => {
      try {
        // USGS API - past 30 days earthquakes around Myanmar region with magnitude 3+
        // Myanmar approximate bounds: 9.5-28.5°N, 92.0-101.0°E
        const response = await axios.get(
          'https://earthquake.usgs.gov/fdsnws/event/1/query',
          {
            params: {
              format: 'geojson',
              starttime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              minlatitude: 9.5,
              maxlatitude: 28.5,
              minlongitude: 92.0,
              maxlongitude: 101.0,
              minmagnitude: 3.0
            }
          }
        );

        if (response.data && response.data.features) {
          const quakeData = response.data.features.map(quake => ({
            id: quake.id,
            title: quake.properties.title,
            magnitude: quake.properties.mag,
            location: quake.properties.place,
            coordinates: [quake.geometry.coordinates[1], quake.geometry.coordinates[0]], // Convert [lng, lat] to [lat, lng] for leaflet
            depth: `${quake.geometry.coordinates[2]} km`,
            time: new Date(quake.properties.time).toISOString(),
            alert: quake.properties.alert || 'none'
          }));
          
          setEarthquakes(quakeData);
          
          // Find latest significant earthquake (mag >= 4.5)
          const significantQuakes = quakeData.filter(q => q.magnitude >= 4.5);
          if (significantQuakes.length > 0) {
            // Sort by time (newest first)
            significantQuakes.sort((a, b) => new Date(b.time) - new Date(a.time));
            setLatestSignificantQuake(significantQuakes[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching earthquake data:', err);
        setError('Failed to load earthquake data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakeData();
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
      <Alert variant={latestSignificantQuake ? "danger" : "info"} className="alert-card">
        <h4><i className="fas fa-exclamation-circle me-2"></i>Current Alert Status</h4>
        {latestSignificantQuake ? (
          <p>
            The last significant earthquake was a magnitude {latestSignificantQuake.magnitude.toFixed(1)} event 
            {latestSignificantQuake.location} on {new Date(latestSignificantQuake.time).toLocaleDateString()}.
          </p>
        ) : (
          <p>
            No significant earthquakes (magnitude 4.5+) detected in the Myanmar region in the past 30 days.
          </p>
        )}
      </Alert>

      {/* Map Section */}
      <h2 className="mb-3 mt-5">Recent Earthquake Activity</h2>
      <div className="earthquake-map" style={{ height: '500px', width: '100%', borderRadius: '8px' }}>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <span className="ms-2">Loading earthquake data...</span>
          </div>
        ) : error ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <Alert variant="danger">{error}</Alert>
          </div>
        ) : (
       <MapContainer 
  center={[19.7633, 96.0785]} 
  zoom={6} 
  style={{ height: '100%', width: '100%' }}
>
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
                      <p>Magnitude: {quake.magnitude.toFixed(1)}</p>
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
        )}
      </div>

      {/* Recent Earthquakes List */}
      <Row className="mt-4">
        <Col md={12}>
          <h3>Recent Earthquakes</h3>
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-2">Loading earthquake data...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : earthquakes.length === 0 ? (
            <Alert variant="info">No earthquakes found in the Myanmar region for the past 30 days.</Alert>
          ) : (
            earthquakes.slice(0, 5).map(quake => (
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
                      {quake.magnitude.toFixed(1)}
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
