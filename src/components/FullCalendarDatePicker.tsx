import React, { useState, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  IconButton,
  Popover,
  Chip,
} from '@mui/material';
import {
  CalendarToday,
  ChevronLeft,
  ChevronRight,
  Today,
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';

interface FullCalendarDatePickerProps {
  value?: Dayjs | null;
  onChange?: (date: Dayjs | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disablePast?: boolean;
  disableFuture?: boolean;
  shouldDisableDate?: (date: Dayjs) => boolean;
  format?: string;
  size?: 'small' | 'medium';
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
}

const FullCalendarDatePicker: React.FC<FullCalendarDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select a date',
  disabled = false,
  readOnly = false,
  minDate,
  maxDate,
  disablePast = false,
  disableFuture = false,
  shouldDisableDate,
  format = 'YYYY-MM-DD',
  size = 'medium',
  error = false,
  helperText,
  fullWidth = false,
  required = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [calendarDate, setCalendarDate] = useState<Dayjs>(value || dayjs());
  const calendarRef = useRef<FullCalendar>(null);

  const open = Boolean(anchorEl);

  const handleInputClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled && !readOnly) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateSelect = useCallback(
    (selectInfo: any) => {
      const selectedDate = dayjs(selectInfo.dateStr);

      // Check if date should be disabled
      if (isDateDisabled(selectedDate)) {
        return;
      }

      onChange?.(selectedDate);
      handleClose();
    },
    [onChange, minDate, maxDate, disablePast, disableFuture, shouldDisableDate]
  );

  const isDateDisabled = (date: Dayjs): boolean => {
    const today = dayjs().startOf('day');

    if (disablePast && date.isBefore(today)) return true;
    if (disableFuture && date.isAfter(today)) return true;
    if (minDate && date.isBefore(minDate)) return true;
    if (maxDate && date.isAfter(maxDate)) return true;
    if (shouldDisableDate && shouldDisableDate(date)) return true;

    return false;
  };

  const navigateCalendar = (direction: 'prev' | 'next' | 'today') => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    switch (direction) {
      case 'prev':
        calendarApi.prev();
        break;
      case 'next':
        calendarApi.next();
        break;
      case 'today':
        calendarApi.today();
        break;
    }

    // Update the calendar date state
    const currentDate = calendarApi.getDate();
    setCalendarDate(dayjs(currentDate));
  };

  const getDateCellClass = (date: Dayjs): string => {
    const classes = [];

    if (isDateDisabled(date)) {
      classes.push('fc-day-disabled');
    }

    if (value && date.isSame(value, 'day')) {
      classes.push('fc-day-selected');
    }

    if (date.isSame(dayjs(), 'day')) {
      classes.push('fc-day-today');
    }

    return classes.join(' ');
  };

  const displayValue = value ? value.format(format) : '';

  return (
    <Box>
      <TextField
        label={label}
        value={displayValue}
        placeholder={placeholder}
        onClick={handleInputClick}
        disabled={disabled}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <IconButton
              onClick={handleInputClick}
              disabled={disabled}
              size='small'
            >
              <CalendarToday />
            </IconButton>
          ),
        }}
        size={size}
        error={error}
        helperText={helperText}
        fullWidth={fullWidth}
        required={required}
        sx={{
          cursor: disabled || readOnly ? 'default' : 'pointer',
          '& .MuiInputBase-input': {
            cursor: disabled || readOnly ? 'default' : 'pointer',
          },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            p: 2,
            minWidth: 320,
            maxWidth: 400,
          },
        }}
      >
        <Paper elevation={0}>
          <Stack spacing={2}>
            {/* Calendar Header */}
            <Stack
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              sx={{ mb: 1 }}
            >
              <IconButton onClick={() => navigateCalendar('prev')} size='small'>
                <ChevronLeft />
              </IconButton>

              <Typography variant='h6' component='div' sx={{ fontWeight: 600 }}>
                {calendarDate.format('MMMM YYYY')}
              </Typography>

              <Stack direction='row' spacing={1}>
                <IconButton
                  onClick={() => navigateCalendar('today')}
                  size='small'
                  title='Go to today'
                >
                  <Today />
                </IconButton>
                <IconButton
                  onClick={() => navigateCalendar('next')}
                  size='small'
                >
                  <ChevronRight />
                </IconButton>
              </Stack>
            </Stack>

            {/* Current Selection */}
            {value && (
              <Chip
                label={`Selected: ${value.format('MMM DD, YYYY')}`}
                size='small'
                color='primary'
                variant='outlined'
                onDelete={() => onChange?.(null)}
                sx={{ alignSelf: 'flex-start' }}
              />
            )}

            {/* FullCalendar */}
            <Box
              sx={{
                '& .fc': {
                  backgroundColor: 'transparent',
                },
                '& .fc-header-toolbar': {
                  display: 'none !important',
                },
                '& .fc-daygrid-day': {
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                },
                '& .fc-day-disabled': {
                  backgroundColor: 'action.disabledBackground !important',
                  color: 'text.disabled !important',
                  cursor: 'not-allowed !important',
                  '&:hover': {
                    backgroundColor: 'action.disabledBackground !important',
                  },
                },
                '& .fc-day-selected': {
                  backgroundColor: 'primary.main !important',
                  color: 'primary.contrastText !important',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'primary.dark !important',
                  },
                },
                '& .fc-day-today': {
                  backgroundColor: 'primary.light',
                  fontWeight: 'bold',
                },
                '& .fc-day-today.fc-day-selected': {
                  backgroundColor: 'primary.main !important',
                },
                '& .fc-daygrid-day-number': {
                  textDecoration: 'none',
                  color: 'inherit',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'inline-block',
                  minWidth: '24px',
                  textAlign: 'center',
                },
                '& .fc-scrollgrid': {
                  border: 'none',
                },
                '& .fc-col-header-cell': {
                  backgroundColor: 'grey.50',
                  borderColor: 'divider',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                },
                '& .fc-daygrid-day-frame': {
                  minHeight: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              }}
            >
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView='dayGridMonth'
                headerToolbar={false}
                height='auto'
                showNonCurrentDates={false}
                fixedWeekCount={false}
                dateClick={handleDateSelect}
                selectable={false}
                dayMaxEvents={false}
                moreLinkClick='popover'
                initialDate={calendarDate.toDate()}
                dayCellClassNames={(arg) => {
                  const date = dayjs(arg.date);
                  return getDateCellClass(date);
                }}
                dayCellContent={(arg) => {
                  const date = dayjs(arg.date);
                  const isDisabled = isDateDisabled(date);

                  return {
                    html: `<div class="fc-daygrid-day-number" style="${
                      isDisabled ? 'pointer-events: none; opacity: 0.5;' : ''
                    }">${arg.dayNumberText}</div>`,
                  };
                }}
              />
            </Box>

            {/* Action Buttons */}
            <Stack direction='row' spacing={1} justifyContent='flex-end'>
              <Button
                variant='outlined'
                size='small'
                onClick={() => {
                  onChange?.(null);
                  handleClose();
                }}
              >
                Clear
              </Button>
              <Button
                variant='outlined'
                size='small'
                onClick={() => {
                  const today = dayjs();
                  if (!isDateDisabled(today)) {
                    onChange?.(today);
                  }
                  handleClose();
                }}
              >
                Today
              </Button>
              <Button variant='contained' size='small' onClick={handleClose}>
                Close
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Popover>
    </Box>
  );
};

export default FullCalendarDatePicker;
