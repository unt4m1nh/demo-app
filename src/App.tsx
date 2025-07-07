import React, { useState, ChangeEvent } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';
import CustomDialog from './components/CustomDialog.tsx';
import './App.css';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

interface FormData {
  name: string;
  email: string;
}

interface FormErrors {
  name?: string;
  email?: string;
}

const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const services: Service[] = [
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

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = (): boolean => {
    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    );
  };

  const handleFormSubmit = (): void => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setFormDialogOpen(false);
      setFormData({ name: '', email: '' });
      setFormErrors({});
    }
  };

  const handleFormChange =
    (field: keyof FormData) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error for this field when user starts typing
      if (formErrors[field]) {
        setFormErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const handleServiceClick = (serviceId: number): void => {
    setSelectedService(selectedService === serviceId ? null : serviceId);
  };

  return (
    <div className='app'>
      <header className='header'>
        <h1>Our Services</h1>
        <p>Choose from our comprehensive range of technology services</p>

        {/* Test Buttons for Custom Dialog */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            mt: 2,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant='contained'
            onClick={() => setDialogOpen(true)}
            sx={{ bgcolor: '#667eea' }}
          >
            Simple Dialog
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => setConfirmDialogOpen(true)}
          >
            Confirm Dialog
          </Button>
          <Button
            variant='contained'
            color='success'
            onClick={() => setFormDialogOpen(true)}
          >
            Form Dialog
          </Button>
        </Box>
      </header>

      <main className='services-container'>
        {services.map((service) => (
          <div
            key={service.id}
            className={`service-card ${
              selectedService === service.id ? 'selected' : ''
            }`}
            onClick={() => handleServiceClick(service.id)}
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

      {/* Simple Dialog Example */}
      <CustomDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title='Simple Information Dialog'
        actions={
          <Button onClick={() => setDialogOpen(false)} variant='contained'>
            Close
          </Button>
        }
      >
        <Typography>
          This is a simple custom dialog with customizable content. You can put
          any React components here!
        </Typography>
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant='body2' color='text.secondary'>
            The dialog supports custom styling, actions, and content.
          </Typography>
        </Box>
      </CustomDialog>

      {/* Confirmation Dialog Example */}
      <CustomDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth='xs'
        actions={
          <>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              sx={{
                width: '100%',
                borderRadius: 999,
                color: '#fff',
                backgroundColor: '#992934',
              }}
            >
              Cancel
            </Button>
          </>
        }
      >
        <Typography>
          Are you sure you want to delete this item? This action cannot be
          undone.
        </Typography>
      </CustomDialog>

      {/* Form Dialog Example */}
      <CustomDialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        title='User Information Form'
        maxWidth='md'
        actions={
          <>
            <Button
              onClick={() => {
                setFormDialogOpen(false);
                setFormData({ name: '', email: '' });
                setFormErrors({});
              }}
              color='inherit'
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              variant='contained'
              startIcon={<Save />}
              disabled={!isFormValid()}
            >
              Save
            </Button>
          </>
        }
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 300,
          }}
        >
          <TextField
            label='Name'
            value={formData.name}
            onChange={handleFormChange('name')}
            fullWidth
            variant='outlined'
            error={!!formErrors.name}
            helperText={formErrors.name}
            required
          />
          <TextField
            label='Email'
            type='email'
            value={formData.email}
            onChange={handleFormChange('email')}
            fullWidth
            variant='outlined'
            error={!!formErrors.email}
            helperText={formErrors.email}
            required
          />
          <Typography variant='body2' color='text.secondary'>
            Fill in the form above to see how the dialog handles form inputs.
          </Typography>
        </Box>
      </CustomDialog>
    </div>
  );
};

export default App;
