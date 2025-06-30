import { useState } from 'react';
import './App.css';

function App() {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      title: 'Web Development',
      description: 'Create stunning, responsive websites and web applications',
      icon: '🌐',
      features: ['Responsive Design', 'Modern Frameworks', 'SEO Optimization'],
    },
    {
      id: 2,
      title: 'Mobile Apps',
      description: 'Build native and cross-platform mobile applications',
      icon: '📱',
      features: ['iOS & Android', 'React Native', 'Flutter'],
    },
  ];

  return (
    <div className='app'>
      <header className='header'>
        <h1>Our Services</h1>
        <p>Choose from our comprehensive range of technology services</p>
      </header>

      <main className='services-container'>
        {services.map((service) => (
          <div
            key={service.id}
            className={`service-card ${
              selectedService === service.id ? 'selected' : ''
            }`}
            onClick={() =>
              setSelectedService(
                selectedService === service.id ? null : service.id
              )
            }
          >
            <div className='service-icon'>{service.icon}</div>
            <h3 className='service-title'>{service.title}</h3>
            <p className='service-description'>{service.description}</p>
            <div className='service-features'>
              {service.features.map((feature, index) => (
                <span key={index} className='feature-tag'>
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
