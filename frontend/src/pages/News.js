import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Badge, Form, Button } from 'react-bootstrap';

const News = () => {
  // Sample news data (in a real app, this would come from an API)
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // In a real app, fetch from API - here we're using sample data
    const sampleNews = [
      {
        id: 1,
        title: "Magnitude 5.2 Earthquake Hits Near Mandalay",
        content: "A moderate earthquake with a magnitude of 5.2 struck 25 kilometers northeast of Mandalay early Wednesday morning. According to the Myanmar Department of Meteorology and Hydrology, the earthquake occurred at 14:30 local time at a depth of 10 kilometers. There have been no immediate reports of damage or injuries.",
        source: "Myanmar Times",
        date: "2025-05-20",
        category: "recent",
        image: "https://via.placeholder.com/800x450?text=Mandalay+Earthquake"
      },
      {
        id: 2,
        title: "Myanmar Upgrades National Seismic Monitoring Network",
        content: "The Department of Meteorology and Hydrology announced yesterday the completion of a major upgrade to the country's seismic monitoring network. The project, funded by international partners, includes the installation of 15 new state-of-the-art seismic stations across the country, significantly improving Myanmar's ability to detect and analyze earthquakes.",
        source: "Myanmar National News",
        date: "2025-05-15",
        category: "updates",
        image: "https://via.placeholder.com/800x450?text=Seismic+Monitoring+Upgrade"
      },
      {
        id: 3,
        title: "Scientists Warn of Increased Seismic Activity Along Sagaing Fault",
        content: "A team of international geologists has published research indicating an increased probability of seismic activity along Myanmar's Sagaing Fault in the coming years. The study, published in the Journal of Seismology, analyzed patterns of strain accumulation along the fault line and suggests a higher than normal risk for earthquakes of magnitude 6.0 or greater.",
        source: "Science Daily",
        date: "2025-05-10",
        category: "warning",
        image: "https://via.placeholder.com/800x450?text=Sagaing+Fault+Warning"
      },
      {
        id: 4,
        title: "Government Conducts Earthquake Preparedness Drills in Yangon Schools",
        content: "The Myanmar Disaster Management Department conducted earthquake preparedness drills in 50 schools across Yangon this week. The initiative aims to educate students and teachers on proper safety protocols during seismic events. Officials emphasized the importance of regular drills, especially in a country with significant earthquake risk.",
        source: "Yangon Daily",
        date: "2025-05-08",
        category: "education",
        image: "https://via.placeholder.com/800x450?text=School+Earthquake+Drills"
      },
      {
        id: 5,
        title: "Minor Earthquake Shakes Bago Region",
        content: "A minor earthquake with a magnitude of 3.8 was recorded in the Bago Region on Tuesday evening. The epicenter was located approximately 30 kilometers southeast of Bago city. Residents reported feeling light shaking, but no damage or injuries have been reported.",
        source: "Myanmar News Network",
        date: "2025-05-18",
        category: "recent",
        image: "https://via.placeholder.com/800x450?text=Bago+Earthquake"
      }
    ];
    
    // Simulate API call delay
    setTimeout(() => {
      setNews(sampleNews);
      setLoading(false);
    }, 500);
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
          {filteredNews.length > 0 ? (
            filteredNews.map(article => (
              <Col md={6} lg={4} key={article.id} className="mb-4">
                <Card className="news-card h-100">
                  <Card.Img variant="top" src={article.image} alt={article.title} />
                  <Card.Body>
                    <Badge bg={getCategoryBadge(article.category)} className="mb-2">
                      {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                    </Badge>
                    <Card.Title>{article.title}</Card.Title>
                    <Card.Text>{article.content.substring(0, 120)}...</Card.Text>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-between align-items-center bg-white">
                    <small className="text-muted">{formatDate(article.date)}</small>
                    <Button variant="outline-primary" size="sm">Read More</Button>
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
