import React from 'react';
import { useNavigate } from 'react-router-dom';

const courses = [
  { title: 'Advanced Data Analytics with Python', duration: '3 Days', level: 'Intermediate', category: 'technical' },
  { title: 'Microsoft Excel with VBA', duration: '2 Days', level: 'Intermediate', category: 'technical' },
  { title: 'Cloud Computing Essentials', duration: '2 Days', level: 'Beginner', category: 'technical' },
  { title: 'Effective Leadership', duration: '2 Days', level: 'All Levels', category: 'soft' },
  { title: 'AI in Business', duration: '2 Days', level: 'Beginner', category: 'ai' },
  { title: 'Project Management (PMP)', duration: '5 Days', level: 'Intermediate', category: 'competency' }
];

const LearningMobile = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Simple Header */}
      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderBottom: '1px solid #ddd',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <img 
            src="AmazingCubeFullLogo.png"
            alt="Amazing Cube"
            style={{ height: '35px' }}
          />
          <button 
            onClick={() => navigate('/')}
            style={{
              padding: '8px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              fontSize: '14px'
            }}
          >
            Home
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 15px' }}>
        <h1 style={{ 
          fontSize: '1.8rem', 
          textAlign: 'center', 
          marginBottom: '10px',
          color: '#333'
        }}>
          Learning & Development
        </h1>
        
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '30px',
          fontSize: '0.9rem'
        }}>
          Professional training programs for modern workforce
        </p>

        {/* HRDC Banner */}
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '25px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏆 📋</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#856404' }}>
            HRDC Certified Training Provider
          </h3>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#856404' }}>
            All eligible courses are claimable under HRD Corp scheme
          </p>
        </div>

        {/* Course List */}
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#333' }}>
            Available Courses
          </h2>
          {courses.map((course, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '10px'
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#333' }}>
                {course.title}
              </h3>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                {course.duration} • {course.level}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          marginTop: '30px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>
            Ready to Transform Your Team?
          </h3>
          <p style={{ margin: '0 0 15px 0', fontSize: '0.9rem' }}>
            Contact us for training consultation
          </p>
          <button 
            onClick={() => navigate('/contact')}
            style={{
              backgroundColor: 'white',
              color: '#007bff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningMobile;