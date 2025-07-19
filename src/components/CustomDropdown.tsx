import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  ClickAwayListener,
  Popper,
  Fade,
  TextField,
  InputAdornment,
} from "@mui/material";

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface CustomDropdownProps {
  /** Array of options to display */
  options: DropdownOption[];
  /** Currently selected value */
  value?: string | number;
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Label for the dropdown */
  label?: string;
  /** Whether the dropdown is disabled */
  disabled?: boolean;
  /** Whether the dropdown shows an error state */
  error?: boolean;
  /** Helper text to display below the dropdown */
  helperText?: string;
  /** Function called when selection changes */
  onChange?: (value: string | number) => void;
  /** Custom width for the dropdown */
  width?: string | number;
  /** Whether to show search functionality */
  searchable?: boolean;
  /** Maximum height of the dropdown menu */
  maxHeight?: number;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  placeholder = "Select an option...",
  label,
  disabled = false,
  error = false,
  helperText,
  onChange,
  width = "100%",
  searchable = false,
  maxHeight = 300,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const anchorRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleToggle = () => {
    if (!disabled) {
      setOpen(!open);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSearchTerm("");
  };

  const handleSelect = (optionValue: string | number) => {
    onChange?.(optionValue);
    handleClose();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  return (
    <Box sx={{ width }}>
      {label && (
        <Typography
          variant="body2"
          component="label"
          sx={{
            display: "block",
            mb: 0.5,
            color: error ? "error.main" : "text.primary",
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      )}

      <ClickAwayListener onClickAway={handleClose}>
        <Box sx={{ position: "relative" }}>
          <TextField
            ref={anchorRef}
            value={selectedOption?.label || ""}
            placeholder={placeholder}
            onClick={handleToggle}
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
                  {" "}
                  <IconButton
                    size="small"
                    disabled={disabled}
                    sx={{
                      transform: open ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease-in-out",
                    }}
                  >
                    ▼
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement="bottom-start"
            transition
            style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={200}>
                <Paper
                  elevation={8}
                  sx={{
                    mt: 0.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  {searchable && (
                    <Box
                      sx={{
                        p: 1,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <TextField
                        size="small"
                        placeholder="Search options..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        fullWidth
                        variant="outlined"
                        autoFocus
                      />
                    </Box>
                  )}

                  <Box
                    sx={{
                      maxHeight,
                      overflow: "auto",
                      "&::-webkit-scrollbar": {
                        width: 6,
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "transparent",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "rgba(0,0,0,0.2)",
                        borderRadius: 3,
                      },
                    }}
                  >
                    {filteredOptions.length === 0 ? (
                      <Box sx={{ p: 2, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          No options found
                        </Typography>
                      </Box>
                    ) : (
                      filteredOptions.map((option, index) => (
                        <Box
                          key={`${option.value}-${index}`}
                          onClick={() =>
                            !option.disabled && handleSelect(option.value)
                          }
                          sx={{
                            p: 1.5,
                            cursor: option.disabled ? "not-allowed" : "pointer",
                            backgroundColor:
                              option.value === value
                                ? "action.selected"
                                : "transparent",
                            opacity: option.disabled ? 0.5 : 1,
                            "&:hover": {
                              backgroundColor: option.disabled
                                ? "transparent"
                                : option.value === value
                                ? "action.selected"
                                : "action.hover",
                            },
                            borderBottom:
                              index < filteredOptions.length - 1
                                ? "1px solid"
                                : "none",
                            borderColor: "divider",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color={
                              option.disabled ? "text.disabled" : "text.primary"
                            }
                          >
                            {option.label}
                          </Typography>
                        </Box>
                      ))
                    )}
                  </Box>
                </Paper>
              </Fade>
            )}
          </Popper>
        </Box>
      </ClickAwayListener>
    </Box>
  );
};

export default CustomDropdown;
