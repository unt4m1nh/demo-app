import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Box,
  Paper,
  IconButton,
  ClickAwayListener,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import CustomDropdown, { DropdownOption } from "./CustomDropdown";
import CustomPickersDay from "./CustomPickersDay";

interface EnhancedMuiDatePickerProps {
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
  maxDate?: Dayjs /** Width of the component */;
  width?: string | number;
  /** Whether to use custom toolbar with dropdowns */
  useCustomToolbar?: boolean;
  /** Dates with scheduled events - array of date strings or Dayjs objects */
  scheduledDates?: (string | Dayjs)[];
  /** Color for the schedule indicator dots */
  scheduleIndicatorColor?: string;
}

const EnhancedMuiDatePicker: React.FC<EnhancedMuiDatePickerProps> = ({
  value,
  onChange,
  label,
  disabled = false,
  error = false,
  helperText,
  placeholder,
  format = "DD/MM/YYYY",
  minDate,
  maxDate,
  width = "100%",
  useCustomToolbar = true,
  scheduledDates = [],
  scheduleIndicatorColor = "#4CAF50",
}) => {
  const [open, setOpen] = useState(false);
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

  const hasScheduledEvents = (date: Dayjs) => {
    return scheduledDates.some((scheduledDate) => {
      const compareDate =
        typeof scheduledDate === "string"
          ? dayjs(scheduledDate)
          : scheduledDate;
      return date.isSame(compareDate, "day");
    });
  };

  if (useCustomToolbar) {
    return (
      <Box sx={{ width }}>
        <TextField
          label={label}
          value={formatDisplayDate(value || null)}
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
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <Paper
              elevation={8}
              sx={{
                position: "absolute",
                zIndex: 1300,
                mt: 0.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                minWidth: 350,
                overflow: "hidden",
              }}
            >
              {/* Custom Month/Year Header */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  p: 2,
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => navigateMonth("prev")}
                  sx={{
                    color: "inherit",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  ◀
                </IconButton>

                <Box sx={{ flex: 1, display: "flex", gap: 1 }}>
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
                </Box>

                <IconButton
                  size="small"
                  onClick={() => navigateMonth("next")}
                  sx={{
                    color: "inherit",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  ▶
                </IconButton>
              </Box>

              {/* Standard MUI DatePicker Calendar */}
              <Box
                sx={{ "& .MuiPickersCalendarHeader-root": { display: "none" } }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={value}
                    onChange={(newValue) => {
                      onChange?.(newValue);
                      setOpen(false);
                    }}
                    disabled={disabled}
                    format={format}
                    minDate={minDate}
                    maxDate={maxDate}
                    open={true}
                    views={["day"]}
                    slotProps={{
                      popper: {
                        sx: { display: "none" },
                      },
                      desktopPaper: {
                        sx: {
                          boxShadow: "none",
                          "& .MuiPickersCalendarHeader-root": {
                            display: "none",
                          },
                          "& .MuiDateCalendar-root": {
                            margin: 0,
                            width: "100%",
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            </Paper>
          </ClickAwayListener>
        )}
      </Box>
    );
  }
  // Fallback to standard MUI DatePicker
  return (
    <Box sx={{ width }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          disabled={disabled}
          format={format}
          minDate={minDate}
          maxDate={maxDate}
          slots={{
            day: CustomPickersDay,
          }}
          slotProps={{
            day: {
              scheduledDates,
              scheduleIndicatorColor,
            } as any,
            textField: {
              error,
              helperText,
              placeholder,
              fullWidth: true,
              variant: "outlined",
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default EnhancedMuiDatePicker;
