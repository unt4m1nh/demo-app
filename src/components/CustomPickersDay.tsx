import React from "react";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Badge, styled } from "@mui/material";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface ExtendedPickersDayProps extends PickersDayProps {
  scheduledDates?: (string | Dayjs)[];
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

const CustomPickersDay = React.forwardRef<
  HTMLButtonElement,
  ExtendedPickersDayProps
>(
  (
    { scheduledDates = [], scheduleIndicatorColor = "#4CAF50", day, ...other },
    ref
  ) => {
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
          <PickersDay {...other} day={day} ref={ref} />
        </StyledBadge>
      );
    }

    return <PickersDay {...other} day={day} ref={ref} />;
  }
);

CustomPickersDay.displayName = "CustomPickersDay";

export default CustomPickersDay;
