import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Box, Paper, Typography, Button, Chip, Stack } from "@mui/material";
import dayjs from "dayjs";

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

interface FullCalendarViewProps {
  width?: string | number;
  height?: string | number;
}

const eventTypeColors = {
  meeting: { bg: "#2196F3", border: "#1976D2", text: "#fff" },
  deadline: { bg: "#F44336", border: "#D32F2F", text: "#fff" },
  event: { bg: "#4CAF50", border: "#388E3C", text: "#fff" },
  reminder: { bg: "#FF9800", border: "#F57C00", text: "#fff" },
};

const FullCalendarView: React.FC<FullCalendarViewProps> = ({
  width = "100%",
  height = 650,
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Meeting",
      start: dayjs().format("YYYY-MM-DD") + "T10:00:00",
      end: dayjs().format("YYYY-MM-DD") + "T11:00:00",
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
      start: dayjs().add(5, "day").format("YYYY-MM-DD") + "T14:00:00",
      end: dayjs().add(5, "day").format("YYYY-MM-DD") + "T17:00:00",
      type: "event",
      description: "Annual company celebration",
      ...eventTypeColors.event,
    },
    {
      id: "4",
      title: "Doctor Appointment",
      start: dayjs().add(7, "day").format("YYYY-MM-DD") + "T09:30:00",
      end: dayjs().add(7, "day").format("YYYY-MM-DD") + "T10:30:00",
      type: "reminder",
      description: "Annual health checkup",
      ...eventTypeColors.reminder,
    },
    {
      id: "5",
      title: "Client Presentation",
      start: dayjs().subtract(3, "day").format("YYYY-MM-DD") + "T15:00:00",
      end: dayjs().subtract(3, "day").format("YYYY-MM-DD") + "T16:30:00",
      type: "meeting",
      description: "Q4 results presentation to key clients",
      ...eventTypeColors.meeting,
    },
  ]);
  const handleDateClick = (arg: any) => {
    // Simple alert for demonstration - no dialog
    alert(`Clicked on date: ${arg.dateStr}`);
  };

  const handleEventClick = (arg: any) => {
    const event = events.find((e) => e.id === arg.event.id);
    if (event) {
      // Simple alert for demonstration - no dialog
      alert(
        `Event: ${event.title}\nDescription: ${
          event.description || "No description"
        }\nType: ${event.type}`
      );
    }
  };
  const handleEventDrop = (arg: any) => {
    const updatedEvents = events.map((event) => {
      if (event.id === arg.event.id) {
        return {
          ...event,
          start: arg.event.startStr,
          end: arg.event.endStr || undefined,
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const addDemoEvents = () => {
    const demoEvents: CalendarEvent[] = [
      {
        id: `demo-${Date.now()}-1`,
        title: "Sprint Planning",
        start: dayjs().add(1, "day").format("YYYY-MM-DD") + "T09:00:00",
        end: dayjs().add(1, "day").format("YYYY-MM-DD") + "T10:30:00",
        type: "meeting",
        description: "Plan the next development sprint",
        ...eventTypeColors.meeting,
      },
      {
        id: `demo-${Date.now()}-2`,
        title: "Code Review Session",
        start: dayjs().add(3, "day").format("YYYY-MM-DD") + "T14:00:00",
        end: dayjs().add(3, "day").format("YYYY-MM-DD") + "T15:30:00",
        type: "meeting",
        description: "Review recent pull requests",
        ...eventTypeColors.meeting,
      },
      {
        id: `demo-${Date.now()}-3`,
        title: "Product Launch",
        start: dayjs().add(10, "day").format("YYYY-MM-DD"),
        type: "deadline",
        description: "Official product launch deadline",
        ...eventTypeColors.deadline,
      },
      {
        id: `demo-${Date.now()}-4`,
        title: "Team Building",
        start: dayjs().add(8, "day").format("YYYY-MM-DD") + "T12:00:00",
        end: dayjs().add(8, "day").format("YYYY-MM-DD") + "T17:00:00",
        type: "event",
        description: "Quarterly team building activity",
        ...eventTypeColors.event,
      },
      {
        id: `demo-${Date.now()}-5`,
        title: "Follow up on proposals",
        start: dayjs().add(4, "day").format("YYYY-MM-DD") + "T16:00:00",
        type: "reminder",
        description: "Check status of pending client proposals",
        ...eventTypeColors.reminder,
      },
    ];

    setEvents([...events, ...demoEvents]);
  };

  const clearAllEvents = () => {
    setEvents([]);
  };

  const goToToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

  return (
    <Box sx={{ width, p: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}{" "}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            📅 FullCalendar View
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={addDemoEvents} size="small">
              ➕ Add Demo Events
            </Button>
            <Button variant="outlined" onClick={goToToday} size="small">
              Today
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={clearAllEvents}
              size="small"
            >
              Clear All
            </Button>
          </Stack>
        </Box>
        {/* Event Type Legend */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Event Types:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {Object.entries(eventTypeColors).map(([type, colors]) => (
              <Chip
                key={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                size="small"
                sx={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                  fontWeight: "bold",
                }}
              />
            ))}
          </Stack>
        </Box>{" "}
        {/* Calendar */}
        <Box
          sx={{
            height,
            "& .fc": {
              fontFamily: "inherit",
            },
            "& .fc-button-primary": {
              backgroundColor: "#1976d2",
              borderColor: "#1976d2",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#1565c0",
                borderColor: "#1565c0",
              },
            },
            "& .fc-button": {
              borderRadius: "6px",
            },
            "& .fc-daygrid-day": {
              borderRadius: "0px",
              border: "none",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.04)",
              },
            },
            "& .fc-daygrid-day-frame": {
              borderRadius: "8px",
              margin: "2px",
              minHeight: "40px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                transform: "scale(1.02)",
              },
            },
            "& .fc-daygrid-day-number": {
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "4px auto",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "white",
                transform: "scale(1.1)",
              },
            },
            "& .fc-day-today": {
              backgroundColor: "rgba(25, 118, 210, 0.1) !important",
              "& .fc-daygrid-day-frame": {
                backgroundColor: "rgba(25, 118, 210, 0.15)",
                border: "2px solid #1976d2",
              },
              "& .fc-daygrid-day-number": {
                backgroundColor: "#1976d2",
                color: "white",
                fontWeight: "bold",
              },
            },
            "& .fc-event": {
              cursor: "pointer",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
              padding: "2px 6px",
              margin: "1px",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              },
            },
            "& .fc-daygrid-event": {
              borderRadius: "6px",
              margin: "1px 2px",
            },
            "& .fc-h-event": {
              borderRadius: "6px",
            },
            "& .fc-timegrid-event": {
              borderRadius: "6px",
            },
            "& .fc-col-header": {
              backgroundColor: "rgba(25, 118, 210, 0.05)",
            },
            "& .fc-col-header-cell": {
              borderRadius: "6px 6px 0 0",
              fontWeight: "600",
              color: "#1976d2",
              backgroundColor: "rgba(25, 118, 210, 0.08)",
              border: "1px solid rgba(25, 118, 210, 0.2)",
              borderBottom: "1px solid rgba(25, 118, 210, 0.1)",
            },
            "& .fc-scrollgrid": {
              borderRadius: "12px",
              overflow: "hidden",
              border: "none",
            },
            "& .fc-scrollgrid-sync-table": {
              borderRadius: "12px",
            },
            "& .fc-theme-standard td": {
              border: "none",
            },
            "& .fc-theme-standard th": {
              border: "none",
              borderBottom: "1px solid rgba(25, 118, 210, 0.1)",
            },
            "& .fc-daygrid-body": {
              border: "none",
            },
          }}
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            height={height}
            eventDisplay="block"
            displayEventTime={true}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              omitZeroMinute: false,
              meridiem: "short",
            }}
          />
        </Box>
        {/* Event Count */}{" "}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Total Events: {events.length} | Click on a date to add an event |
            Drag events to reschedule
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default FullCalendarView;
