import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Badge, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  // Function to get appropriate image for each category
  const getCategoryImage = (category, place) => {
    const placeName = place ? place.replace(/,.*$/, '').trim() : 'Earthquake';
    
    switch(category) {
      case 'recent':
        return `https://source.unsplash.com/800x450/?earthquake,damage,${placeName}`;
      case 'warning':
        return 'https://source.unsplash.com/800x450/?earthquake,warning,danger';
      case 'updates':
        return 'https://source.unsplash.com/800x450/?seismograph,monitoring,technology';
      case 'education':
        return 'https://source.unsplash.com/800x450/?classroom,training,safety';
      default:
        return `https://source.unsplash.com/800x450/?earthquake,${placeName}`;
    }
  };

  // Function to categorize news based on magnitude and time
  const categorizeNews = (magnitude, daysAgo) => {
    if (magnitude >= 6.0) return 'warning';
    if (magnitude >= 5.0 && daysAgo <= 3) return 'warning';
    if (daysAgo <= 7) return 'recent';
    if (magnitude >= 4.5) return 'updates';
    return 'education';
  };

  useEffect(() => {
    const fetchEarthquakeNews = async () => {
      try {
        // USGS API - significant earthquakes globally from the past 30 days
        const significantResponse = await axios.get(
          'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
        );
        
        // USGS API - All 4.5+ earthquakes globally from the past 30 days
        const response45 = await axios.get(
          'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson'
        );
        
        // Additional response for Myanmar region earthquakes (using same params as home page)
        const myanmarResponse = await axios.get(
          'https://earthquake.usgs.gov/fdsnws/event/1/query',
          {
            params: {
              format: 'geojson',
              starttime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              minlatitude: 9.5,
              maxlatitude: 28.5,
              minlongitude: 92.0,
              maxlongitude: 101.0,
              minmagnitude: 3.5
            }
          }
        );

        // Combine and process the responses
        const allFeatures = [
          ...significantResponse.data.features,
          ...response45.data.features,
          ...myanmarResponse.data.features
        ];
        
        // Remove duplicates by earthquake ID
        const uniqueFeatures = Array.from(
          new Map(allFeatures.map(item => [item.id, item])).values()
        );
        
        // Sort by time (newest first)
        uniqueFeatures.sort((a, b) => b.properties.time - a.properties.time);
        
        // Convert to news format
        const newsItems = uniqueFeatures.map(feature => {
          const magnitude = feature.properties.mag;
          const time = new Date(feature.properties.time);
          const daysAgo = Math.floor((Date.now() - time.getTime()) / (1000 * 60 * 60 * 24));
          const category = categorizeNews(magnitude, daysAgo);
          
          return {
            id: feature.id,
            title: `Magnitude ${magnitude.toFixed(1)} Earthquake ${feature.properties.place}`,
            content: `A ${magnitude >= 6.0 ? 'major' : magnitude >= 5.0 ? 'moderate' : 'minor'} earthquake with a magnitude of ${magnitude.toFixed(1)} was detected ${feature.properties.place} on ${time.toLocaleString()}. The earthquake occurred at a depth of ${(feature.geometry.coordinates[2]).toFixed(1)} kilometers. ${feature.properties.tsunami === 1 ? 'A tsunami warning was issued following this earthquake.' : ''}`,
            source: 'USGS Earthquake Hazards Program',
            date: time.toISOString().split('T')[0],
            category: category,
            place: feature.properties.place,
            coordinates: feature.geometry.coordinates,
            url: feature.properties.url,
            image: getCategoryImage(category, feature.properties.place)
          };
        });
        
        setNews(newsItems);
      } catch (err) {
        console.error('Error fetching earthquake news:', err);
        setError('Failed to load earthquake news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakeNews();
  }, []);

  // Filter news based on selected category
  const filteredNews = filter === 'all' 
    ? news 
    : news.filter(item => item.category === filter);

  // Format date to local string
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get badge variant based on category
  const getCategoryBadge = (category) => {
    switch(category) {
      case 'recent': return 'primary';
      case 'warning': return 'danger';
      case 'updates': return 'info';
      case 'education': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <Container>
      <h1 className="mb-4">Earthquake News and Updates</h1>
      
      {/* Filter Controls */}
      <Form className="mb-4">
        <Form.Group>
          <Form.Label>Filter by category:</Form.Label>
          <div>
            <Form.Check
              inline
              type="radio"
              label="All News"
              name="newsFilter"
              id="filter-all"
              checked={filter === 'all'}
              onChange={() => setFilter('all')}
            />
            <Form.Check
              inline
              type="radio"
              label="Recent Earthquakes"
              name="newsFilter"
              id="filter-recent"
              checked={filter === 'recent'}
              onChange={() => setFilter('recent')}
            />
            <Form.Check
              inline
              type="radio"
              label="Warnings"
              name="newsFilter"
              id="filter-warning"
              checked={filter === 'warning'}
              onChange={() => setFilter('warning')}
            />
            <Form.Check
              inline
              type="radio"
              label="Updates"
              name="newsFilter"
              id="filter-updates"
              checked={filter === 'updates'}
              onChange={() => setFilter('updates')}
            />
            <Form.Check
              inline
              type="radio"
              label="Education"
              name="newsFilter"
              id="filter-education"
              checked={filter === 'education'}
              onChange={() => setFilter('education')}
            />
          </div>
        </Form.Group>
      </Form>
      
      {/* News Articles */}
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading earthquake news...</p>
        </div>
      ) : (
        <Row>
          {error ? (
            <Col xs={12}>
              <Alert variant="danger">{error}</Alert>
            </Col>
          ) : filteredNews.length > 0 ? (
            filteredNews.map(article => (
              <Col md={6} lg={4} key={article.id} className="mb-4">
                <Card className="news-card h-100">
                  <div style={{ height: '200px', overflow: 'hidden' }}>
                    <Card.Img 
                      variant="top" 
                      src={article.image} 
                      alt={article.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/800x450?text=${article.category.charAt(0).toUpperCase() + article.category.slice(1)}+Earthquake`;
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Badge bg={getCategoryBadge(article.category)} className="mb-2">
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                    </Badge>
                    <Card.Title>{article.title}</Card.Title>
                    <Card.Text>{article.content.substring(0, 120)}...</Card.Text>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-between align-items-center bg-white">
                    <small className="text-muted">{formatDate(article.date)}</small>
                    {article.url ? (
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Read More
                      </Button>
                    ) : (
                      <Button variant="outline-primary" size="sm">Read More</Button>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <p className="text-center my-5">No articles found for the selected category.</p>
            </Col>
          )}
        </Row>
      )}
      
      {/* Subscribe Section */}
      <div className="bg-light p-4 rounded my-5">
        <Row>
          <Col md={8}>
            <h3>Stay Updated</h3>
            <p>Subscribe to our newsletter to receive the latest earthquake news and updates directly to your inbox.</p>
          </Col>
          <Col md={4}>
            <Form className="d-flex">
              <Form.Control type="email" placeholder="Your email" className="me-2" />
              <Button variant="primary">Subscribe</Button>
            </Form>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default News;
