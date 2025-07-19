import React, { useState, ChangeEvent } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import CustomDialog from "./components/CustomDialog.tsx";
import CustomDatePicker from "./components/CustomDatePicker.tsx";
import EnhancedMuiDatePicker from "./components/EnhancedMuiDatePicker.tsx";
import StandardMuiDatePicker from "./components/StandardMuiDatePicker.tsx";
import FullCalendarView from "./components/FullCalendarView.tsx";
import MuiStyleCalendar from "./components/MuiStyleCalendar.tsx";
import "./App.css";

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
    name: "",
    email: "",
    selectedDate: null,
    eventDate: null,
    enhancedMuiDate: null,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [standaloneDate, setStandaloneDate] = useState<Dayjs | null>(dayjs());

  // Sample scheduled dates for demonstration
  const scheduledDates = [
    dayjs().add(2, "day"),
    dayjs().add(5, "day"),
    dayjs().add(10, "day"),
    dayjs().add(15, "day"),
    dayjs().subtract(3, "day"),
    dayjs().subtract(7, "day"),
    "2025-07-25", // String format example
    "2025-07-30",
  ];

  const services: Service[] = [
    {
      id: 1,
      title: "Web Development",
      description: "Create stunning, responsive websites and web applications",
      icon: "🌐",
      features: ["Responsive Design", "Modern Frameworks", "SEO Optimization"],
    },
    {
      id: 2,
      title: "Mobile Apps",
      description: "Build native and cross-platform mobile applications",
      icon: "📱",
      features: ["iOS & Android", "React Native", "Flutter"],
    },
  ];
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.selectedDate) {
      errors.selectedDate = "Date selection is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const isFormValid = (): boolean => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.selectedDate !== null
    );
  };
  const handleFormSubmit = (): void => {
    if (validateForm()) {
      console.log("Form submitted:", formData);
      setFormDialogOpen(false);
      setFormData({
        name: "",
        email: "",
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
  const handleServiceClick = (serviceId: number): void => {
    setSelectedService(selectedService === serviceId ? null : serviceId);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Our Services</h1>
        <p>Choose from our comprehensive range of technology services</p>

        {/* Test Buttons for Custom Dialog */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            mt: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            sx={{ bgcolor: "#667eea" }}
          >
            Simple Dialog
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setConfirmDialogOpen(true)}
          >
            Confirm Dialog
          </Button>{" "}
          <Button
            variant="contained"
            color="success"
            onClick={() => setFormDialogOpen(true)}
          >
            Form Dialog
          </Button>{" "}
          <Button
            variant="contained"
            color="info"
            onClick={() => setDatePickerDialogOpen(true)}
          >
            Date Picker Demo
          </Button>{" "}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setCalendarDialogOpen(true)}
          >
            Calendar Demo
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setMuiStyleCalendarDialogOpen(true)}
          >
            MUI Style Calendar
          </Button>
        </Box>
      </header>
      <main className="services-container">
        {services.map((service) => (
          <div
            key={service.id}
            className={`service-card ${
              selectedService === service.id ? "selected" : ""
            }`}
            onClick={() => handleServiceClick(service.id)}
          >
            <div className="service-icon">{service.icon}</div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <div className="service-features">
              {service.features.map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </main>
      {/* Simple Dialog Example */}
      <CustomDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Simple Information Dialog"
        actions={
          <Button onClick={() => setDialogOpen(false)} variant="contained">
            Close
          </Button>
        }
      >
        <Typography>
          This is a simple custom dialog with customizable content. You can put
          any React components here!
        </Typography>
        <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            The dialog supports custom styling, actions, and content.
          </Typography>
        </Box>
      </CustomDialog>
      {/* Confirmation Dialog Example */}
      <CustomDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        maxWidth="xs"
        actions={
          <>
            <Button
              onClick={() => setConfirmDialogOpen(false)}
              sx={{
                width: "100%",
                borderRadius: 999,
                color: "#fff",
                backgroundColor: "#992934",
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
        title="User Information Form"
        maxWidth="md"
        actions={
          <>
            <Button
              onClick={() => {
                setFormDialogOpen(false);
                setFormData({
                  name: "",
                  email: "",
                  selectedDate: null,
                  eventDate: null,
                  enhancedMuiDate: null,
                });
                setFormErrors({});
              }}
              color="inherit"
            >
              Cancel
            </Button>{" "}
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              disabled={!isFormValid()}
            >
              💾 Save
            </Button>
          </>
        }
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 300,
          }}
        >
          <TextField
            label="Name"
            value={formData.name}
            onChange={handleFormChange("name")}
            fullWidth
            variant="outlined"
            error={!!formErrors.name}
            helperText={formErrors.name}
            required
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleFormChange("email")}
            fullWidth
            variant="outlined"
            error={!!formErrors.email}
            helperText={formErrors.email}
            required
          />
          <Typography variant="body2" color="text.secondary">
            Fill in the form above to see how the dialog handles form inputs.
          </Typography>{" "}
        </Box>
      </CustomDialog>
      {/* Date Picker Dialog Example */}
      <CustomDialog
        open={datePickerDialogOpen}
        onClose={() => setDatePickerDialogOpen(false)}
        title="Custom Date Picker with Dropdown"
        maxWidth="md"
        actions={
          <>
            <Button
              onClick={() => {
                setDatePickerDialogOpen(false);
                setStandaloneDate(dayjs());
              }}
              color="inherit"
            >
              Reset
            </Button>
            <Button
              onClick={() => setDatePickerDialogOpen(false)}
              variant="contained"
            >
              Done
            </Button>
          </>
        }
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            minWidth: 400,
          }}
        >
          {" "}
          <Typography variant="h6" gutterBottom>
            Date Picker Comparison
          </Typography>{" "}
          <CustomDatePicker
            label="1. Custom Date Picker with Dropdowns & Schedule Indicators"
            value={standaloneDate}
            onChange={(date) => setStandaloneDate(date)}
            placeholder="Choose a date..."
            useCustomDropdowns={true}
            scheduledDates={scheduledDates}
            scheduleIndicatorColor="#FF5722"
          />{" "}
          <EnhancedMuiDatePicker
            label="2. Enhanced MUI DatePicker with Custom Toolbar & Schedule Indicators"
            value={formData.enhancedMuiDate}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, enhancedMuiDate: date }))
            }
            placeholder="Choose enhanced date..."
            useCustomToolbar={true}
            scheduledDates={scheduledDates}
            scheduleIndicatorColor="#2196F3"
          />
          <StandardMuiDatePicker
            label="3. Standard MUI DatePicker with Schedule Indicators"
            value={formData.eventDate}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, eventDate: date }))
            }
            placeholder="Choose event date..."
            scheduledDates={scheduledDates}
            scheduleIndicatorColor="#9C27B0"
          />
          <CustomDatePicker
            label="4. Standard MUI DatePicker (No Schedule Indicators)"
            value={formData.eventDate}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, eventDate: date }))
            }
            placeholder="Choose event date..."
            useCustomDropdowns={false}
          />
          <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Custom Date Picker:</strong>{" "}
              {standaloneDate ? standaloneDate.format("MMMM DD, YYYY") : "None"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Enhanced MUI Date:</strong>{" "}
              {formData.enhancedMuiDate
                ? formData.enhancedMuiDate.format("MMMM DD, YYYY")
                : "None"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Standard MUI Date:</strong>{" "}
              {formData.eventDate
                ? formData.eventDate.format("MMMM DD, YYYY")
                : "None"}
            </Typography>{" "}
          </Box>
          <Box sx={{ p: 2, bgcolor: "#E3F2FD", borderRadius: 1, mb: 2 }}>
            <Typography
              variant="body2"
              color="text.primary"
              fontWeight="bold"
              gutterBottom
            >
              📅 Schedule Indicators
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Small colored dots appear below dates with scheduled events. Red
              dots (🔴) for custom picker, blue dots (🔵) for enhanced MUI
              picker.
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Compare three approaches: 1) Fully custom implementation with
            dropdowns and schedule indicators, 2) Enhanced MUI DatePicker with
            custom toolbar using dropdowns and schedule indicators, 3) Standard
            MUI DatePicker without indicators. The enhanced version provides the
            best of both worlds!
          </Typography>{" "}
        </Box>
      </CustomDialog>{" "}
      {/* FullCalendar Demo Dialog */}
      <CustomDialog
        open={calendarDialogOpen}
        onClose={() => setCalendarDialogOpen(false)}
        title="FullCalendar Demo"
        maxWidth="xl"
        actions={
          <Button
            onClick={() => setCalendarDialogOpen(false)}
            variant="contained"
          >
            Close
          </Button>
        }
      >
        <FullCalendarView width="100%" height={600} />
      </CustomDialog>
      {/* MUI Style Calendar Demo Dialog */}
      <CustomDialog
        open={muiStyleCalendarDialogOpen}
        onClose={() => setMuiStyleCalendarDialogOpen(false)}
        title="MUI Style Calendar Demo"
        maxWidth="lg"
        actions={
          <Button
            onClick={() => setMuiStyleCalendarDialogOpen(false)}
            variant="contained"
          >
            Close
          </Button>
        }
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            A custom calendar that mimics MUI Date Calendar appearance using
            FullCalendar engine with custom month/year dropdowns. Features
            rounded styling, borderless design, and interactive event
            management.
          </Typography>
          <MuiStyleCalendar width="100%" height={500} />
        </Box>
      </CustomDialog>
    </div>
  );
};

export default App;
