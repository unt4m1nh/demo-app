import React, { useState, ChangeEvent } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import CustomDialog from './components/CustomDialog.tsx';
import CustomDatePicker from './components/CustomDatePicker.tsx';
import EnhancedMuiDatePicker from './components/EnhancedMuiDatePicker.tsx';
import StandardMuiDatePicker from './components/StandardMuiDatePicker.tsx';
import FullCalendarView from './components/FullCalendarView.tsx';
import MuiStyleCalendar from './components/MuiStyleCalendar.tsx';
import FilteredChip from './components/FilteredChip.tsx';
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
  selectedDate: Dayjs | null;
  eventDate: Dayjs | null;
  enhancedMuiDate: Dayjs | null;
}

interface FormErrors {
  name?: string;
  email?: string;
  selectedDate?: string;
  eventDate?: string;
  enhancedMuiDate?: string;
}

const App: React.FC = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [datePickerDialogOpen, setDatePickerDialogOpen] =
    useState<boolean>(false);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState<boolean>(false);
  const [muiStyleCalendarDialogOpen, setMuiStyleCalendarDialogOpen] =
    useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    selectedDate: null,
    eventDate: null,
    enhancedMuiDate: null,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [standaloneDate, setStandaloneDate] = useState<Dayjs | null>(dayjs());

  // FilteredChip example states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(['react']);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [chipDialogOpen, setChipDialogOpen] = useState<boolean>(false);

  // Sample scheduled dates for demonstration
  const scheduledDates = [
    dayjs().add(2, 'day'),
    dayjs().add(5, 'day'),
    dayjs().add(10, 'day'),
    dayjs().add(15, 'day'),
    dayjs().subtract(3, 'day'),
    dayjs().subtract(7, 'day'),
    '2025-07-25', // String format example
    '2025-07-30',
  ];

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

    if (!formData.selectedDate) {
      errors.selectedDate = 'Date selection is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const isFormValid = (): boolean => {
    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.selectedDate !== null
    );
  };
  const handleFormSubmit = (): void => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setFormDialogOpen(false);
      setFormData({
        name: '',
        email: '',
        selectedDate: null,
        eventDate: null,
        enhancedMuiDate: null,
      });
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

  // FilteredChip handlers
  const handleCategoryToggle = (category: string): void => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleTagToggle = (tag: string): void => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFilterToggle = (filter: string): void => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
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
          </Button>{' '}
          <Button
            variant='contained'
            color='success'
            onClick={() => setFormDialogOpen(true)}
          >
            Form Dialog
          </Button>{' '}
          <Button
            variant='contained'
            color='info'
            onClick={() => setDatePickerDialogOpen(true)}
          >
            Date Picker Demo
          </Button>{' '}
          <Button
            variant='contained'
            color='secondary'
            onClick={() => setCalendarDialogOpen(true)}
          >
            Calendar Demo
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => setMuiStyleCalendarDialogOpen(true)}
          >
            MUI Style Calendar
          </Button>
          <Button
            variant='contained'
            sx={{ bgcolor: '#9c27b0' }}
            onClick={() => setChipDialogOpen(true)}
          >
            FilteredChip Demo
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
      {/* Standalone FilteredChip Examples */}
      <Box sx={{ mt: 4, p: 3, bgcolor: '#f8fafc', borderRadius: 2, mx: 2 }}>
        <Typography variant='h5' sx={{ mb: 3, textAlign: 'center' }}>
          FilteredChip Live Examples
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' sx={{ mb: 1 }}>
            Quick Filters (Level 1 - Size S):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {['All', 'Active', 'Recent', 'Favorites'].map((filter) => (
              <FilteredChip
                key={filter}
                type='level1'
                size='S'
                title={filter}
                selected={selectedCategories.includes(filter)}
                onClick={() => handleCategoryToggle(filter)}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant='h6' sx={{ mb: 1 }}>
            Technology Stack (Level 1 - Size M):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {['TypeScript', 'React', 'Material-UI', 'Vite'].map((tech) => (
              <FilteredChip
                key={tech}
                type='level1'
                size='M'
                title={tech}
                selected={selectedTags.includes(tech)}
                onClick={() => handleTagToggle(tech)}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant='h6' sx={{ mb: 1 }}>
            Status Filters (Gray Background - Size M):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {['Draft', 'Review', 'Published', 'Archived'].map((status) => (
              <FilteredChip
                key={status}
                type='gray-background'
                size='M'
                title={status}
                selected={selectedFilters.includes(status)}
                onClick={() => handleFilterToggle(status)}
              />
            ))}
          </Box>
        </Box>
      </Box>
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
                setFormData({
                  name: '',
                  email: '',
                  selectedDate: null,
                  eventDate: null,
                  enhancedMuiDate: null,
                });
                setFormErrors({});
              }}
              color='inherit'
            >
              Cancel
            </Button>{' '}
            <Button
              onClick={handleFormSubmit}
              variant='contained'
              disabled={!isFormValid()}
            >
              💾 Save
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
          </Typography>{' '}
        </Box>
      </CustomDialog>
      {/* Date Picker Dialog Example */}
      <CustomDialog
        open={datePickerDialogOpen}
        onClose={() => setDatePickerDialogOpen(false)}
        title='Custom Date Picker with Dropdown'
        maxWidth='md'
        actions={
          <>
            <Button
              onClick={() => {
                setDatePickerDialogOpen(false);
                setStandaloneDate(dayjs());
              }}
              color='inherit'
            >
              Reset
            </Button>
            <Button
              onClick={() => setDatePickerDialogOpen(false)}
              variant='contained'
            >
              Done
            </Button>
          </>
        }
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            minWidth: 400,
          }}
        >
          {' '}
          <Typography variant='h6' gutterBottom>
            Date Picker Comparison
          </Typography>{' '}
          <CustomDatePicker
            label='1. Custom Date Picker with Dropdowns & Schedule Indicators'
            value={standaloneDate}
            onChange={(date) => setStandaloneDate(date)}
            placeholder='Choose a date...'
            useCustomDropdowns={true}
            scheduledDates={scheduledDates}
            scheduleIndicatorColor='#FF5722'
          />{' '}
          <EnhancedMuiDatePicker
            label='2. Enhanced MUI DatePicker with Custom Toolbar & Schedule Indicators'
            value={formData.enhancedMuiDate}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, enhancedMuiDate: date }))
            }
            placeholder='Choose enhanced date...'
            useCustomToolbar={true}
            scheduledDates={scheduledDates}
            scheduleIndicatorColor='#2196F3'
          />
          <StandardMuiDatePicker
            label='3. Standard MUI DatePicker with Schedule Indicators'
            value={formData.eventDate}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, eventDate: date }))
            }
            placeholder='Choose event date...'
            scheduledDates={scheduledDates}
            scheduleIndicatorColor='#9C27B0'
          />
          <CustomDatePicker
            label='4. Standard MUI DatePicker (No Schedule Indicators)'
            value={formData.eventDate}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, eventDate: date }))
            }
            placeholder='Choose event date...'
            useCustomDropdowns={false}
          />
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              <strong>Custom Date Picker:</strong>{' '}
              {standaloneDate ? standaloneDate.format('MMMM DD, YYYY') : 'None'}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              <strong>Enhanced MUI Date:</strong>{' '}
              {formData.enhancedMuiDate
                ? formData.enhancedMuiDate.format('MMMM DD, YYYY')
                : 'None'}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              <strong>Standard MUI Date:</strong>{' '}
              {formData.eventDate
                ? formData.eventDate.format('MMMM DD, YYYY')
                : 'None'}
            </Typography>{' '}
          </Box>
          <Box sx={{ p: 2, bgcolor: '#E3F2FD', borderRadius: 1, mb: 2 }}>
            <Typography
              variant='body2'
              color='text.primary'
              fontWeight='bold'
              gutterBottom
            >
              📅 Schedule Indicators
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Small colored dots appear below dates with scheduled events. Red
              dots (🔴) for custom picker, blue dots (🔵) for enhanced MUI
              picker.
            </Typography>
          </Box>
          <Typography variant='body2' color='text.secondary'>
            Compare three approaches: 1) Fully custom implementation with
            dropdowns and schedule indicators, 2) Enhanced MUI DatePicker with
            custom toolbar using dropdowns and schedule indicators, 3) Standard
            MUI DatePicker without indicators. The enhanced version provides the
            best of both worlds!
          </Typography>{' '}
        </Box>
      </CustomDialog>{' '}
      {/* FullCalendar Demo Dialog */}
      <CustomDialog
        open={calendarDialogOpen}
        onClose={() => setCalendarDialogOpen(false)}
        title='FullCalendar Demo'
        maxWidth='xl'
        actions={
          <Button
            onClick={() => setCalendarDialogOpen(false)}
            variant='contained'
          >
            Close
          </Button>
        }
      >
        <FullCalendarView width='100%' height={600} />
      </CustomDialog>
      {/* MUI Style Calendar Demo Dialog */}
      <CustomDialog
        open={muiStyleCalendarDialogOpen}
        onClose={() => setMuiStyleCalendarDialogOpen(false)}
        title='MUI Style Calendar Demo'
        maxWidth='lg'
        actions={
          <Button
            onClick={() => setMuiStyleCalendarDialogOpen(false)}
            variant='contained'
          >
            Close
          </Button>
        }
      >
        <Box sx={{ p: 1 }}>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            A custom calendar that mimics MUI Date Calendar appearance using
            FullCalendar engine with custom month/year dropdowns. Features
            rounded styling, borderless design, and interactive event
            management.
          </Typography>
          <MuiStyleCalendar width='100%' height={500} />
        </Box>
      </CustomDialog>
      {/* FilteredChip Demo Dialog */}
      <CustomDialog
        open={chipDialogOpen}
        onClose={() => setChipDialogOpen(false)}
        title='FilteredChip Component Examples'
        maxWidth='md'
        actions={
          <Button onClick={() => setChipDialogOpen(false)} variant='contained'>
            Close
          </Button>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Level 1 Type Examples */}
          <Box>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Level 1 Type Chips
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              These chips have a clean white background with blue selection
              state. Perfect for primary filters.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant='subtitle2' sx={{ mb: 1 }}>
                Size S - Categories:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Frontend', 'Backend', 'DevOps', 'Mobile', 'AI/ML'].map(
                  (category) => (
                    <FilteredChip
                      key={category}
                      type='level1'
                      size='S'
                      title={category}
                      selected={selectedCategories.includes(category)}
                      onClick={() => handleCategoryToggle(category)}
                    />
                  )
                )}
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant='subtitle2' sx={{ mb: 1 }}>
                Size M - Technologies:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java'].map(
                  (tech) => (
                    <FilteredChip
                      key={tech}
                      type='level1'
                      size='M'
                      title={tech}
                      selected={selectedTags.includes(tech)}
                      onClick={() => handleTagToggle(tech)}
                    />
                  )
                )}
              </Box>
            </Box>

            <Box>
              <Typography variant='subtitle2' sx={{ mb: 1 }}>
                Disabled State:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <FilteredChip
                  type='level1'
                  size='S'
                  title='Disabled Small'
                  disabled
                />
                <FilteredChip
                  type='level1'
                  size='M'
                  title='Disabled Medium'
                  disabled
                />
              </Box>
            </Box>
          </Box>

          {/* Gray Background Type Examples */}
          <Box>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Gray Background Type Chips
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              These chips have a gray background and are perfect for secondary
              filters. Only available in size M.
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant='subtitle2' sx={{ mb: 1 }}>
                Project Status Filters:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Active', 'Completed', 'On Hold', 'Cancelled'].map(
                  (status) => (
                    <FilteredChip
                      key={status}
                      type='gray-background'
                      size='M'
                      title={status}
                      selected={selectedFilters.includes(status)}
                      onClick={() => handleFilterToggle(status)}
                    />
                  )
                )}
              </Box>
            </Box>

            <Box>
              <Typography variant='subtitle2' sx={{ mb: 1 }}>
                Disabled Gray Background:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <FilteredChip
                  type='gray-background'
                  size='M'
                  title='Disabled Gray'
                  disabled
                />
              </Box>
            </Box>
          </Box>

          {/* Usage Information */}
          <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Usage Notes:
            </Typography>
            <Typography variant='body2' component='div'>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                <li>Level 1 type: Supports both S and M sizes</li>
                <li>
                  Gray background type: Only supports M size (S will
                  auto-convert to M)
                </li>
                <li>
                  All chips support hover, active, focus, and disabled states
                </li>
                <li>
                  Click functionality is optional - chips can be display-only
                </li>
                <li>Fully customizable with MUI theme integration</li>
              </ul>
            </Typography>
          </Box>
        </Box>
      </CustomDialog>
    </div>
  );
};

export default App;
