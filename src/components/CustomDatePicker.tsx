import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import CustomDropdown, { DropdownOption } from "./CustomDropdown";

interface CustomDatePickerProps {
  /** Current selected date */
  value?: Dayjs | null;
  /** Function called when date changes */
  onChange?: (date: Dayjs | null) => void;
  /** Label for the date picker */
  label?: string;
  /** Whether the date picker is disabled */
  disabled?: boolean;
  /** Whether to show error state */
  error?: boolean;
  /** Helper text to display */
  helperText?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Date format to display */
  format?: string;
  /** Minimum selectable date */
  minDate?: Dayjs;
  /** Maximum selectable date */
  maxDate?: Dayjs /** Whether to use custom dropdown for month/year selection */;
  useCustomDropdowns?: boolean;
  /** Width of the component */
  width?: string | number;
  /** Dates with scheduled events - array of date strings or Dayjs objects */
  scheduledDates?: (string | Dayjs)[];
  /** Color for the schedule indicator dots */
  scheduleIndicatorColor?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  label,
  disabled = false,
  error = false,
  helperText,
  placeholder = "Select a date...",
  format = "DD/MM/YYYY",
  minDate,
  maxDate,
  useCustomDropdowns = true,
  width = "100%",
  scheduledDates = [],
  scheduleIndicatorColor = "#4CAF50",
}) => {
  const [open, setOpen] = useState(false);
  const [internalDate, setInternalDate] = useState<Dayjs | null>(value || null);
  const [viewDate, setViewDate] = useState<Dayjs>(value || dayjs());

  // Generate month options
  const monthOptions: DropdownOption[] = Array.from(
    { length: 12 },
    (_, index) => ({
      value: index,
      label: dayjs().month(index).format("MMMM"),
    })
  );

  // Generate year options (current year ± 50 years)
  const currentYear = dayjs().year();
  const yearOptions: DropdownOption[] = Array.from(
    { length: 101 },
    (_, index) => {
      const year = currentYear - 50 + index;
      return {
        value: year,
        label: year.toString(),
      };
    }
  );

  useEffect(() => {
    setInternalDate(value || null);
    if (value) {
      setViewDate(value);
    }
  }, [value]);

  const handleDateChange = (newDate: Dayjs | null) => {
    setInternalDate(newDate);
    onChange?.(newDate);
    setOpen(false);
  };

  const handleMonthChange = (month: string | number) => {
    const newDate = viewDate.month(Number(month));
    setViewDate(newDate);
  };

  const handleYearChange = (year: string | number) => {
    const newDate = viewDate.year(Number(year));
    setViewDate(newDate);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate =
      direction === "prev"
        ? viewDate.subtract(1, "month")
        : viewDate.add(1, "month");
    setViewDate(newDate);
  };

  const formatDisplayDate = (date: Dayjs | null) => {
    return date ? date.format(format) : "";
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const startOfMonth = viewDate.startOf("month");
    const endOfMonth = viewDate.endOf("month");
    const startOfWeek = startOfMonth.startOf("week");
    const endOfWeek = endOfMonth.endOf("week");

    const days = [];
    let current = startOfWeek;

    while (current.isBefore(endOfWeek) || current.isSame(endOfWeek, "day")) {
      days.push(current);
      current = current.add(1, "day");
    }

    return days;
  };
  const isDateDisabled = (date: Dayjs) => {
    if (minDate && date.isBefore(minDate, "day")) return true;
    if (maxDate && date.isAfter(maxDate, "day")) return true;
    return false;
  };

  const hasScheduledEvents = (date: Dayjs) => {
    return scheduledDates.some((scheduledDate) => {
      const compareDate =
        typeof scheduledDate === "string"
          ? dayjs(scheduledDate)
          : scheduledDate;
      return date.isSame(compareDate, "day");
    });
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (useCustomDropdowns) {
    return (
      <Box sx={{ width }}>
        <TextField
          label={label}
          value={formatDisplayDate(internalDate)}
          placeholder={placeholder}
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          error={error}
          helperText={helperText}
          fullWidth
          variant="outlined"
          sx={{
            cursor: disabled ? "default" : "pointer",
            "& .MuiInputBase-input": {
              cursor: disabled ? "default" : "pointer",
            },
          }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" disabled={disabled}>
                  📅
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {open && (
          <Paper
            elevation={8}
            sx={{
              position: "absolute",
              zIndex: 1300,
              mt: 0.5,
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              minWidth: 320,
            }}
          >
            {/* Month and Year Dropdowns */}{" "}
            <Box sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}>
              <IconButton
                size="small"
                onClick={() => navigateMonth("prev")}
                sx={{ mr: 1 }}
              >
                ◀
              </IconButton>

              <CustomDropdown
                options={monthOptions}
                value={viewDate.month()}
                onChange={handleMonthChange}
                width="140px"
                placeholder="Month"
              />

              <CustomDropdown
                options={yearOptions}
                value={viewDate.year()}
                onChange={handleYearChange}
                width="100px"
                placeholder="Year"
                searchable
              />

              <IconButton
                size="small"
                onClick={() => navigateMonth("next")}
                sx={{ ml: 1 }}
              >
                ▶
              </IconButton>
            </Box>{" "}
            {/* Calendar Grid */}
            <Box>
              {/* Week day headers */}
              <Box sx={{ display: "flex", mb: 1 }}>
                {weekDays.map((day) => (
                  <Box key={day} sx={{ flex: 1, textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="bold"
                    >
                      {day}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Calendar days */}
              <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {" "}
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = day.month() === viewDate.month();
                  const isSelected =
                    internalDate && day.isSame(internalDate, "day");
                  const isToday = day.isSame(dayjs(), "day");
                  const disabled = isDateDisabled(day);
                  const hasSchedule = hasScheduledEvents(day);

                  return (
                    <Box
                      key={index}
                      sx={{
                        width: "calc(100% / 7)",
                        textAlign: "center",
                        p: 0.5,
                      }}
                    >
                      <Box
                        onClick={() =>
                          !disabled && isCurrentMonth && handleDateChange(day)
                        }
                        sx={{
                          width: 40,
                          height: 40,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor:
                            disabled || !isCurrentMonth ? "default" : "pointer",
                          borderRadius: "50%",
                          margin: "0 auto",
                          color: isCurrentMonth
                            ? disabled
                              ? "text.disabled"
                              : "text.primary"
                            : "text.disabled",
                          backgroundColor: isSelected
                            ? "primary.main"
                            : "transparent",
                          border: isToday && !isSelected ? "1px solid" : "none",
                          borderColor: "primary.main",
                          "&:hover": {
                            backgroundColor:
                              !disabled && isCurrentMonth && !isSelected
                                ? "action.hover"
                                : isSelected
                                ? "primary.main"
                                : "transparent",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: isSelected
                              ? "primary.contrastText"
                              : "inherit",
                            fontWeight: isToday ? "bold" : "normal",
                            lineHeight: 1,
                          }}
                        >
                          {day.date()}
                        </Typography>
                        {hasSchedule && isCurrentMonth && (
                          <Box
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              backgroundColor: isSelected
                                ? "primary.contrastText"
                                : scheduleIndicatorColor,
                              mt: 0.2,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
            {/* Quick Actions */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                onClick={() => handleDateChange(dayjs())}
                sx={{
                  cursor: "pointer",
                  color: "primary.main",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <Typography variant="caption">Today</Typography>
              </Box>
              <Box
                onClick={() => setOpen(false)}
                sx={{
                  cursor: "pointer",
                  color: "text.secondary",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                <Typography variant="caption">Close</Typography>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
    );
  }

  // Fallback to standard MUI DatePicker
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={internalDate}
        onChange={handleDateChange}
        disabled={disabled}
        format={format}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            error,
            helperText,
            placeholder,
            fullWidth: true,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
