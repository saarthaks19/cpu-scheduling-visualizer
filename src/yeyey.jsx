import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e88e5",
    },
    secondary: {
      main: "#e53935",
    },
    teal: {
      main: "#009688",
    },
    default: {
      main: "grey",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  spacing: 8,
});

const App = () => {
  const [processes, setProcesses] = useState([
    { id: 1, name: "", arrivalTime: "", serviceTime: "" },
    { id: 2, name: "", arrivalTime: "", serviceTime: "" },
    { id: 3, name: "", arrivalTime: "", serviceTime: "" },
  ]);
  const [action1Selected, setAction1Selected] = useState(false);
  const [action2Selected, setAction2Selected] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [option5Input, setOption5Input] = useState("");

  const handleInputChange = (id, event) => {
    const { name, value } = event.target;
    const updatedProcesses = processes.map((process) =>
      process.id === id ? { ...process, [name]: value } : process
    );
    setProcesses(updatedProcesses);
  };

  const addProcess = () => {
    const newId = processes.length
      ? Math.max(...processes.map((process) => process.id)) + 1
      : 1;
    setProcesses([
      ...processes,
      { id: newId, name: "", arrivalTime: "", serviceTime: "" },
    ]);
  };

  const deleteProcess = (id) => {
    const updatedProcesses = processes.filter((process) => process.id !== id);
    setProcesses(updatedProcesses);
  };

  const handlePerformAction1 = () => {
    setAction1Selected(!action1Selected);
  };

  const handlePerformAction2 = () => {
    setAction2Selected(!action2Selected);
  };

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleOption5InputChange = (event) => {
    setOption5Input(event.target.value);
  };

  const handleSubmit = () => {
    // Log all the relevant data
    console.log("Processes:", processes);
    console.log("Selected Options:", selectedOptions);
    console.log("Option 5 Input:", option5Input);
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: "linear-gradient(to right, #e0eafc, #cfdef3)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        padding: "24px",
        transition: "box-shadow 0.3s ease-in-out",
        border: "1px solid #ccc",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Container
          maxWidth="md"
          style={{
            marginTop: "0",
            textAlign: "center",
            padding: "20px",
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Minimalist Process Manager
          </Typography>
          {processes.map((process) => (
            <Box
              key={process.id}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <TextField
                InputLabelProps={{ shrink: true }}
                name="name"
                label="Process Name"
                variant="outlined"
                value={process.name}
                onChange={(event) => handleInputChange(process.id, event)}
                style={{ marginRight: "8px", flex: 1 }}
              />
              <TextField
                InputLabelProps={{ shrink: true }}
                name="arrivalTime"
                label="Arrival Time"
                variant="outlined"
                value={process.arrivalTime}
                onChange={(event) => handleInputChange(process.id, event)}
                style={{ marginRight: "8px", flex: 1 }}
              />
              <TextField
                InputLabelProps={{ shrink: true }}
                name="serviceTime"
                label="Service Time"
                variant="outlined"
                value={process.serviceTime}
                onChange={(event) => handleInputChange(process.id, event)}
                style={{ marginRight: "8px", flex: 1 }}
              />
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => deleteProcess(process.id)}
                startIcon={<DeleteIcon />}
                style={{ marginLeft: "8px" }}
              />
            </Box>
          ))}
          <Box display="flex" justifyContent="center" mb={4}>
            <Button
              onClick={addProcess}
              color="primary"
              variant="outlined"
              startIcon={<AddCircleOutline />}
            >
              Add Process
            </Button>
          </Box>
          <Box mt={4} style={{ padding: "16px" }}>
            <Button
              variant={action1Selected ? "contained" : "outlined"}
              color="primary"
              onClick={handlePerformAction1}
              style={{ marginRight: "16px" }}
            >
              TRACE THE TIMELINE
            </Button>
            <Button
              variant={action2Selected ? "contained" : "outlined"}
              color="secondary"
              onClick={handlePerformAction2}
            >
              SHOW STATS
            </Button>
          </Box>
        </Container>

        <Container maxWidth="sm" style={{ marginTop: "50px" }}>
          {(action1Selected || action2Selected) && (
            <Box style={{ padding: "32px 0", minHeight: "95vh" }}>
              <Typography
                variant="h5"
                gutterBottom
                style={{ marginBottom: "32px" }}
              >
                Select Options
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center">
                {[
                  "Option 1",
                  "Option 2",
                  "Option 3",
                  "Option 4",
                  "Option 5",
                ].map((option) => (
                  <Box
                    key={option}
                    style={{
                      marginBottom: "16px",
                      width: "100%", // Full width for each box (flex container)
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant={
                        selectedOptions.includes(option)
                          ? "contained"
                          : "outlined"
                      }
                      color="primary"
                      onClick={() => handleOptionClick(option)}
                      style={{
                        backgroundColor: selectedOptions.includes(option)
                          ? theme.palette.primary.main
                          : "transparent",
                        color: selectedOptions.includes(option)
                          ? "#fff"
                          : theme.palette.primary.main,
                        width: "100%", // Full width for the button
                        height: "60px",
                        borderRadius: "20px",
                      }}
                    >
                      {option}
                    </Button>
                    {option === "Option 5" &&
                      selectedOptions.includes("Option 5") && (
                        <TextField
                          label="Additional Input"
                          variant="outlined"
                          value={option5Input}
                          onChange={handleOption5InputChange}
                          style={{
                            width: "25%", // 25% width for the TextField
                            marginLeft: "16px",
                          }}
                        />
                      )}
                  </Box>
                ))}
                {selectedOptions.length > 0 && (
                  <Box
                    mt={4}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: theme.palette.teal.main,
                        color: "#fff",
                        width: "40%", // Adjusted width for Submit button
                        height: "60px",
                        borderRadius: "20px",
                        marginTop: "24px", // Added separation from options
                      }}
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default App;
