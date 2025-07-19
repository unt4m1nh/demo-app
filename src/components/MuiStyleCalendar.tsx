import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import dayjs from "dayjs";
import CustomDropdown, { DropdownOption } from "./CustomDropdown";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  description?: string;
  type?: "meeting" | "deadline" | "event" | "reminder";
}

interface MuiStyleCalendarProps {
  width?: string | number;
  height?: string | number;
}

const eventTypeColors = {
  meeting: { bg: "#1976d2", border: "#1565c0", text: "#fff" },
  deadline: { bg: "#d32f2f", border: "#c62828", text: "#fff" },
  event: { bg: "#388e3c", border: "#2e7d32", text: "#fff" },
  reminder: { bg: "#f57c00", border: "#ef6c00", text: "#fff" },
};

const MuiStyleCalendar: React.FC<MuiStyleCalendarProps> = ({
  width = "100%",
  height = 500,
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Meeting",
      start: dayjs().format("YYYY-MM-DD"),
      type: "meeting",
      description: "Weekly team standup meeting",
      ...eventTypeColors.meeting,
    },
    {
      id: "2",
      title: "Project Deadline",
      start: dayjs().add(2, "day").format("YYYY-MM-DD"),
      type: "deadline",
      description: "Final submission for the Q4 project",
      ...eventTypeColors.deadline,
    },
    {
      id: "3",
      title: "Company Event",
      start: dayjs().add(5, "day").format("YYYY-MM-DD"),
      type: "event",
      description: "Annual company celebration",
      ...eventTypeColors.event,
    },
    {
      id: "4",
      title: "Follow up",
      start: dayjs().add(10, "day").format("YYYY-MM-DD"),
      type: "reminder",
      description: "Check project status",
      ...eventTypeColors.reminder,
    },
  ]);

  // Generate month options
  const monthOptions: DropdownOption[] = Array.from(
    { length: 12 },
    (_, index) => ({
      value: index,
      label: dayjs().month(index).format("MMMM"),
    })
  );

  // Generate year options (current year ± 10 years)
  const currentYear = dayjs().year();
  const yearOptions: DropdownOption[] = Array.from(
    { length: 21 },
    (_, index) => {
      const year = currentYear - 10 + index;
      return {
        value: year,
        label: year.toString(),
      };
    }
  );
  const handleDateClick = (arg: any) => {
    alert(`Selected date: ${dayjs(arg.date).format("MMMM DD, YYYY")}`);
  };

  const handleMonthChange = (month: string | number) => {
    const newDate = currentDate.month(Number(month));
    setCurrentDate(newDate);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(newDate.toDate());
    }
  };

  const handleYearChange = (year: string | number) => {
    const newDate = currentDate.year(Number(year));
    setCurrentDate(newDate);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(newDate.toDate());
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate =
      direction === "prev"
        ? currentDate.subtract(1, "month")
        : currentDate.add(1, "month");
    setCurrentDate(newDate);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(newDate.toDate());
    }
  };
  const goToToday = () => {
    const today = dayjs();
    setCurrentDate(today);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

  const addDemoEvents = () => {
    const demoEvents: CalendarEvent[] = [
      {
        id: `demo-${Date.now()}-1`,
        title: "Sprint Planning",
        start: dayjs().add(1, "day").format("YYYY-MM-DD"),
        type: "meeting",
        description: "Plan the next development sprint",
        ...eventTypeColors.meeting,
      },
      {
        id: `demo-${Date.now()}-2`,
        title: "Review Meeting",
        start: dayjs().add(3, "day").format("YYYY-MM-DD"),
        type: "event",
        description: "Code review session",
        ...eventTypeColors.event,
      },
    ];
    setEvents([...events, ...demoEvents]);
  };

  const clearAllEvents = () => {
    setEvents([]);
  };

  // Get events for a specific date to show indicators
  const getEventsForDate = (dateStr: string) => {
    return events.filter(
      (event) => dayjs(event.start).format("YYYY-MM-DD") === dateStr
    );
  };

  return (
    <Box sx={{ width, p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Custom Header with Dropdowns */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Month/Year Navigation */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => navigateMonth("prev")}
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.light",
                    color: "white",
                  },
                }}
              >
                ◀
              </IconButton>

              <CustomDropdown
                options={monthOptions}
                value={currentDate.month()}
                onChange={handleMonthChange}
                width="140px"
                placeholder="Month"
              />

              <CustomDropdown
                options={yearOptions}
                value={currentDate.year()}
                onChange={handleYearChange}
                width="100px"
                placeholder="Year"
                searchable
              />

              <IconButton
                size="small"
                onClick={() => navigateMonth("next")}
                sx={{
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.light",
                    color: "white",
                  },
                }}
              >
                ▶
              </IconButton>
            </Box>{" "}
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={addDemoEvents}
                sx={{ fontSize: "0.75rem" }}
              >
                ➕ Add Demo
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={goToToday}
                sx={{ fontSize: "0.75rem" }}
              >
                Today
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={clearAllEvents}
                sx={{ fontSize: "0.75rem" }}
              >
                Clear
              </Button>
            </Stack>
          </Box>

          {/* Current Month/Year Display */}
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              color: "text.primary",
              fontWeight: 600,
            }}
          >
            {currentDate.format("MMMM YYYY")}
          </Typography>
        </Box>{" "}
        {/* MUI-Style Calendar */}
        <Box
          sx={{
            height,
            "& .fc": {
              fontFamily: "inherit",
              height: "100%",
            },
            // Hide default FullCalendar header
            "& .fc-header-toolbar": {
              display: "none",
            },
            // Hide all events to show only day numbers
            "& .fc-event": {
              display: "none !important",
            },
            "& .fc-daygrid-event": {
              display: "none !important",
            },
            // Grid structure
            "& .fc-scrollgrid": {
              border: "none",
              height: "100%",
            },
            "& .fc-scrollgrid-sync-table": {
              height: "100%",
            },
            // Week header styling (Sun, Mon, etc.)
            "& .fc-col-header": {
              backgroundColor: "#fafafa",
              borderBottom: "1px solid #e0e0e0",
            },
            "& .fc-col-header-cell": {
              border: "none",
              fontWeight: 600,
              color: "text.secondary",
              width: "14.28%", // 100% / 7 days

              fontSize: "0.75rem",
              padding: "12px 8px",
              textAlign: "center",
              borderRight: "1px solid #f5f5f5",
              "&:last-child": {
                borderRight: "none",
              },
            },
            // Day grid body
            "& .fc-daygrid-body": {
              border: "none",
            },
            "& .fc-daygrid": {
              fontFamily: "inherit",
            },
            // Individual day cells
            "& .fc-daygrid-day": {
              backgroundColor: "white",
              border: "none",
              width: "14.28%", // 100% / 7 days

              borderRight: "1px solid #f5f5f5",
              borderBottom: "1px solid #f5f5f5",
              "&:last-child": {
                borderRight: "none",
              },
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            },
            "& .fc-daygrid-day-frame": {
              padding: "8px",
              minHeight: "60px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            },
            "& .fc-daygrid-day-top": {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              gap: "4px",
            },
            // Day number styling - circular
            "& .fc-daygrid-day-number": {
              color: "text.primary",
              fontWeight: 500,
              fontSize: "0.875rem",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease-in-out",
              cursor: "pointer",
              textDecoration: "none",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.1)",
                transform: "scale(1.1)",
              },
            },
            // Custom day content container
            "& .custom-day-content": {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            },
            // Event indicators container
            "& .event-indicators": {
              display: "flex",
              gap: "2px",
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: "40px",
            },
            // Individual event indicator dots
            "& .event-indicator": {
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              flexShrink: 0,
            },
            // Today's date styling - highlighted circle
            "& .fc-day-today": {
              backgroundColor: "rgba(25, 118, 210, 0.08) !important",
              "& .fc-daygrid-day-number": {
                backgroundColor: "#1976d2",
                color: "white",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
              },
            },
            // Other month days - muted
            "& .fc-day-other": {
              "& .fc-daygrid-day-number": {
                color: "text.disabled",
                opacity: 0.5,
              },
            },
            // Remove default borders and styling
            "& .fc-theme-standard td": {
              border: "none",
            },
            "& .fc-theme-standard th": {
              border: "none",
            },
            // Ensure proper table layout
            "& .fc-scrollgrid table": {
              width: "100%",
              tableLayout: "fixed",
            },
          }}
        >
          {" "}
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            headerToolbar={false}
            initialView="dayGridMonth"
            editable={false}
            selectable={true}
            dayMaxEvents={0}
            events={[]}
            dateClick={handleDateClick}
            height={height}
            displayEventTime={false}
            fixedWeekCount={false}
            showNonCurrentDates={true}
            dayHeaders={true}
            weekends={true}
            initialDate={currentDate.toDate()}
            eventDisplay="none"
            dayCellContent={(arg) => {
              const dayEvents = getEventsForDate(
                arg.date.toISOString().split("T")[0]
              );
              const dayNumber = arg.dayNumberText;

              return (
                <div className="custom-day-content">
                  <div className="fc-daygrid-day-number">{dayNumber}</div>{" "}
                  {dayEvents.length > 0 && (
                    <div className="event-indicators">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="event-indicator"
                          style={{
                            backgroundColor: event.backgroundColor || "#1976d2",
                          }}
                          title={event.title}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div
                          className="event-indicator"
                          style={{
                            backgroundColor: "#666",
                            fontSize: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                          }}
                          title={`${dayEvents.length - 3} more events`}
                        >
                          +
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            }}
          />
        </Box>
        {/* Footer */}
        <Box
          sx={{
            p: 1.5,
            backgroundColor: "#f9f9f9",
            borderTop: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {events.length} events • Click on dates to select • Small dots
            indicate scheduled events
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default MuiStyleCalendar;
