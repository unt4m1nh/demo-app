import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Badge, styled, Box } from "@mui/material";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface StandardMuiDatePickerProps {
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
  maxDate?: Dayjs;
  /** Width of the component */
  width?: string | number;
  /** Dates with scheduled events - array of date strings or Dayjs objects */
  scheduledDates?: (string | Dayjs)[];
  /** Color for the schedule indicator dots */
  scheduleIndicatorColor?: string;
}

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    right: 6,
    bottom: 6,
    minWidth: 6,
    height: 6,
    borderRadius: "50%",
    border: "none",
    padding: 0,
  },
}));

const StandardMuiDatePicker: React.FC<StandardMuiDatePickerProps> = ({
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
  scheduledDates = [],
  scheduleIndicatorColor = "#4CAF50",
}) => {
  const CustomDay = React.useCallback(
    (dayProps: PickersDayProps) => {
      const { day, ...other } = dayProps;

      const hasScheduledEvents = scheduledDates.some((scheduledDate) => {
        const compareDate =
          typeof scheduledDate === "string"
            ? dayjs(scheduledDate)
            : scheduledDate;
        return (day as Dayjs).isSame(compareDate, "day");
      });

      if (hasScheduledEvents) {
        return (
          <StyledBadge
            key={day.toString()}
            overlap="circular"
            badgeContent=" "
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: scheduleIndicatorColor,
                boxShadow: "0 0 0 1px rgba(255,255,255,0.8)",
              },
            }}
          >
            <PickersDay {...other} day={day} />
          </StyledBadge>
        );
      }

      return <PickersDay {...other} day={day} />;
    },
    [scheduledDates, scheduleIndicatorColor]
  );

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
            day: CustomDay,
          }}
          slotProps={{
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

export default StandardMuiDatePicker;
