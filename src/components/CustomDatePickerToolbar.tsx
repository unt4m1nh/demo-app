import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import CustomDropdown, { DropdownOption } from "./CustomDropdown";

interface CustomDatePickerToolbarProps {
  value?: Dayjs | null;
  onChange?: (
    value: Dayjs | null,
    selectionState?: "partial" | "shallow" | "finish"
  ) => void;
}

const CustomDatePickerToolbar: React.FC<CustomDatePickerToolbarProps> = ({
  value,
  onChange,
}) => {
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
    if (value && onChange) {
      const newDate = value.month(Number(month));
      onChange(newDate, "finish");
    }
  };

  const handleYearChange = (year: string | number) => {
    if (value && onChange) {
      const newDate = value.year(Number(year));
      onChange(newDate, "finish");
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (value && onChange) {
      const newDate =
        direction === "prev"
          ? value.subtract(1, "month")
          : value.add(1, "month");
      onChange(newDate, "finish");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        p: 2,
        backgroundColor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      {/* Display selected date */}
      <Typography variant="h6" sx={{ color: "inherit" }}>
        {value ? value.format("dddd, MMMM DD") : "Select Date"}
      </Typography>

      {/* Month and Year Navigation */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 1,
          p: 1,
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
            value={value?.month() ?? 0}
            onChange={handleMonthChange}
            width="140px"
            placeholder="Month"
          />

          <CustomDropdown
            options={yearOptions}
            value={value?.year() ?? currentYear}
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
    </Box>
  );
};

export default CustomDatePickerToolbar;
