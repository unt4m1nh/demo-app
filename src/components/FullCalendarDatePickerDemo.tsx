import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Divider,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import FullCalendarDatePicker from './FullCalendarDatePicker';

const FullCalendarDatePickerDemo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [eventDate, setEventDate] = useState<Dayjs | null>(null);
  const [birthdayDate, setBirthdayDate] = useState<Dayjs | null>(null);
  const [meetingDate, setMeetingDate] = useState<Dayjs | null>(null);

  // Demo configuration states
  const [disablePast, setDisablePast] = useState(false);
  const [disableFuture, setDisableFuture] = useState(false);
  const [disableWeekends, setDisableWeekends] = useState(false);

  const shouldDisableDate = (date: Dayjs): boolean => {
    if (disableWeekends) {
      return date.day() === 0 || date.day() === 6; // Sunday = 0, Saturday = 6
    }
    return false;
  };

  const resetDates = () => {
    setSelectedDate(null);
    setEventDate(null);
    setBirthdayDate(null);
    setMeetingDate(null);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant='h4' gutterBottom>
        FullCalendar DatePicker Demo
      </Typography>

      <Typography variant='body1' color='text.secondary' paragraph>
        A custom DatePicker component that uses FullCalendar for an enhanced
        calendar view experience.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant='h6' gutterBottom>
          Demo Configuration
        </Typography>
        <Stack direction='row' spacing={2} flexWrap='wrap'>
          <FormControlLabel
            control={
              <Switch
                checked={disablePast}
                onChange={(e) => setDisablePast(e.target.checked)}
              />
            }
            label='Disable Past Dates'
          />
          <FormControlLabel
            control={
              <Switch
                checked={disableFuture}
                onChange={(e) => setDisableFuture(e.target.checked)}
              />
            }
            label='Disable Future Dates'
          />
          <FormControlLabel
            control={
              <Switch
                checked={disableWeekends}
                onChange={(e) => setDisableWeekends(e.target.checked)}
              />
            }
            label='Disable Weekends'
          />
        </Stack>
        <Button variant='outlined' onClick={resetDates} sx={{ mt: 2 }}>
          Reset All Dates
        </Button>
      </Paper>

      <Stack spacing={4}>
        {/* Basic Usage */}
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Basic DatePicker
          </Typography>
          <Box sx={{ maxWidth: 300 }}>
            <FullCalendarDatePicker
              label='Select Date'
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder='Choose a date...'
              disablePast={disablePast}
              disableFuture={disableFuture}
              shouldDisableDate={
                disableWeekends ? shouldDisableDate : undefined
              }
            />
          </Box>
          {selectedDate && (
            <Alert severity='info' sx={{ mt: 2 }}>
              Selected: {selectedDate.format('dddd, MMMM DD, YYYY')}
            </Alert>
          )}
        </Paper>

        <Divider />

        {/* Multiple DatePickers */}
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Multiple DatePickers
          </Typography>
          <Stack spacing={3}>
            <Box sx={{ maxWidth: 300 }}>
              <FullCalendarDatePicker
                label='Event Date'
                value={eventDate}
                onChange={setEventDate}
                placeholder='Select event date'
                disablePast={disablePast}
                disableFuture={disableFuture}
                shouldDisableDate={
                  disableWeekends ? shouldDisableDate : undefined
                }
                helperText='Choose a date for your event'
              />
            </Box>

            <Box sx={{ maxWidth: 300 }}>
              <FullCalendarDatePicker
                label='Birthday'
                value={birthdayDate}
                onChange={setBirthdayDate}
                placeholder='Select birthday'
                disableFuture={true} // Always disable future for birthdays
                format='DD/MM/YYYY'
                helperText='Your date of birth'
              />
            </Box>

            <Box sx={{ maxWidth: 300 }}>
              <FullCalendarDatePicker
                label='Meeting Date'
                value={meetingDate}
                onChange={setMeetingDate}
                placeholder='Schedule meeting'
                disablePast={true} // Always disable past for meetings
                shouldDisableDate={shouldDisableDate} // Always disable weekends for meetings
                size='small'
                helperText='Business days only'
              />
            </Box>
          </Stack>
        </Paper>

        <Divider />

        {/* Date Range Example */}
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Date Range Restrictions
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ maxWidth: 300 }}>
              <FullCalendarDatePicker
                label='Within Next 30 Days'
                value={null}
                onChange={() => {}}
                placeholder='Select date'
                minDate={dayjs()}
                maxDate={dayjs().add(30, 'day')}
                helperText='Only next 30 days available'
              />
            </Box>

            <Box sx={{ maxWidth: 300 }}>
              <FullCalendarDatePicker
                label='This Year Only'
                value={null}
                onChange={() => {}}
                placeholder='Select date'
                minDate={dayjs().startOf('year')}
                maxDate={dayjs().endOf('year')}
                helperText='Current year only'
              />
            </Box>
          </Stack>
        </Paper>

        <Divider />

        {/* Different Sizes and States */}
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Different Sizes and States
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ maxWidth: 300 }}>
              <FullCalendarDatePicker
                label='Small Size'
                value={dayjs()}
                onChange={() => {}}
                size='small'
                helperText='Small size variant'
              />
            </Box>

            <Box sx={{ maxWidth: 300 }}>
              <FullCalendarDatePicker
                label='Required Field'
                value={null}
                onChange={() => {}}
                required
                error={true}
                helperText='This field is required'
              />
            </Box>

            <Box sx={{ maxWidth: 300 }}>
              <FullCalendarDatePicker
                label='Disabled DatePicker'
                value={dayjs()}
                onChange={() => {}}
                disabled
                helperText='This picker is disabled'
              />
            </Box>

            <Box sx={{ maxWidth: '100%' }}>
              <FullCalendarDatePicker
                label='Full Width'
                value={null}
                onChange={() => {}}
                fullWidth
                helperText='This picker takes full width'
              />
            </Box>
          </Stack>
        </Paper>

        {/* Summary */}
        <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant='h6' gutterBottom>
            Current Selections Summary
          </Typography>
          <Stack spacing={1}>
            <Typography>
              <strong>Basic Date:</strong>{' '}
              {selectedDate
                ? selectedDate.format('YYYY-MM-DD')
                : 'Not selected'}
            </Typography>
            <Typography>
              <strong>Event Date:</strong>{' '}
              {eventDate ? eventDate.format('YYYY-MM-DD') : 'Not selected'}
            </Typography>
            <Typography>
              <strong>Birthday:</strong>{' '}
              {birthdayDate
                ? birthdayDate.format('DD/MM/YYYY')
                : 'Not selected'}
            </Typography>
            <Typography>
              <strong>Meeting Date:</strong>{' '}
              {meetingDate ? meetingDate.format('YYYY-MM-DD') : 'Not selected'}
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default FullCalendarDatePickerDemo;
