import React, { useState, useRef } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
} from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import ResultDisplay from './ResultDisplay';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    text: {
      primary: "#ffffff",
      secondary: "#bbbbbb",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const App = () => {
  const [processes, setProcesses] = useState([
    { id: 1, name: "a", arrivalTime: "0", serviceTime: "2" },
    { id: 2, name: "b", arrivalTime: "0", serviceTime: "2" },
    { id: 3, name: "c", arrivalTime: "0", serviceTime: "2" },
  ]);
  const [action1Selected, setAction1Selected] = useState(false);
  const [action2Selected, setAction2Selected] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [option5Input, setOption5Input] = useState("");
  const [output, setOutput] = useState(null);
  const [heading, setHeading] = useState('');
  const optionsRef = useRef(null);

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

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleOption5InputChange = (event) => {
    setOption5Input(event.target.value);
  };

  const runSchedulingAlgorithm = (data) => {
    const { operation, algorithm, quantum, last_instant, process_count, processes } = data;

    let processList = processes.map(proc => [proc.name, parseInt(proc.arrivalTime), parseInt(proc.serviceTime)]);
    processList.sort((a, b) => a[1] - b[1]);

    let finishTime = new Array(process_count).fill(0);
    let turnAroundTime = new Array(process_count).fill(0);
    let normTurn = new Array(process_count).fill(0);
    let timeline = Array.from({ length: last_instant }, () => new Array(process_count).fill(' '));

    const fillInWaitTime = () => {
      for (let i = 0; i < process_count; i++) {
        let arrivalTime = processList[i][1];
        for (let j = arrivalTime; j < finishTime[i]; j++) {
          if (timeline[j][i] !== '*') {
            timeline[j][i] = '.';
          }
        }
      }
    };

    const firstComeFirstServe = () => {
      let time = processList[0][1];
      for (let i = 0; i < process_count; i++) {
        let arrivalTime = processList[i][1];
        let serviceTime = processList[i][2];

        finishTime[i] = time + serviceTime;
        turnAroundTime[i] = finishTime[i] - arrivalTime;
        normTurn[i] = turnAroundTime[i] / serviceTime;

        for (let j = arrivalTime; j < finishTime[i]; j++) {
          if (j < time) {
            timeline[j][i] = '.';
          } else {
            timeline[j][i] = '*';
          }
        }
        time += serviceTime;
      }
      fillInWaitTime();
    };

    const roundRobin = (quantum) => {
      let queue = [];
      let currentTime = 0;
      let remainingServiceTime = processes.map(proc => proc.serviceTime);
      let arrivalIndex = 0;

      while (queue.length > 0 || arrivalIndex < process_count) {
        while (arrivalIndex < process_count && processes[arrivalIndex].arrivalTime <= currentTime) {
          queue.push(arrivalIndex);
          arrivalIndex++;
        }

        if (queue.length === 0) {
          currentTime++;
          continue;
        }

        let currentProcess = queue.shift();
        let timeSlice = Math.min(quantum, remainingServiceTime[currentProcess]);

        for (let i = 0; i < timeSlice; i++) {
          timeline[currentTime][currentProcess] = '*';
          currentTime++;
        }

        remainingServiceTime[currentProcess] -= timeSlice;

        if (remainingServiceTime[currentProcess] > 0) {
          while (arrivalIndex < process_count && processes[arrivalIndex].arrivalTime <= currentTime) {
            queue.push(arrivalIndex);
            arrivalIndex++;
          }
          queue.push(currentProcess);
        } else {
          finishTime[currentProcess] = currentTime;
          turnAroundTime[currentProcess] = finishTime[currentProcess] - processes[currentProcess].arrivalTime;
          normTurn[currentProcess] = turnAroundTime[currentProcess] / processes[currentProcess].serviceTime;
        }
      }
      fillInWaitTime();
    };

    const shortestProcessNext = () => {
      let currentTime = 0;
      let completed = 0;
      let isCompleted = new Array(process_count).fill(false);

      while (completed < process_count) {
        let minIndex = -1;
        let minServiceTime = Number.MAX_VALUE;

        for (let i = 0; i < process_count; i++) {
          if (processes[i].arrivalTime <= currentTime && !isCompleted[i] && processes[i].serviceTime < minServiceTime) {
            minServiceTime = processes[i].serviceTime;
            minIndex = i;
          }
        }

        if (minIndex === -1) {
          currentTime++;
          continue;
        }

        for (let i = 0; i < processes[minIndex].serviceTime; i++) {
          timeline[currentTime][minIndex] = '*';
          currentTime++;
        }

        finishTime[minIndex] = currentTime;
        turnAroundTime[minIndex] = finishTime[minIndex] - processes[minIndex].arrivalTime;
        normTurn[minIndex] = turnAroundTime[minIndex] / processes[minIndex].serviceTime;
        isCompleted[minIndex] = true;
        completed++;
      }
      fillInWaitTime();
    };

    const shortestRemainingTime = () => {
      let currentTime = 0;
      let completed = 0;
      let remainingServiceTime = processes.map(proc => proc.serviceTime);
      let isCompleted = new Array(process_count).fill(false);

      while (completed < process_count) {
        let minIndex = -1;
        let minRemainingTime = Number.MAX_VALUE;

        for (let i = 0; i < process_count; i++) {
          if (processes[i].arrivalTime <= currentTime && !isCompleted[i] && remainingServiceTime[i] < minRemainingTime) {
            minRemainingTime = remainingServiceTime[i];
            minIndex = i;
          }
        }

        if (minIndex === -1) {
          currentTime++;
          continue;
        }

        timeline[currentTime][minIndex] = '*';
        remainingServiceTime[minIndex]--;
        currentTime++;

        if (remainingServiceTime[minIndex] === 0) {
          finishTime[minIndex] = currentTime;
          turnAroundTime[minIndex] = finishTime[minIndex] - processes[minIndex].arrivalTime;
          normTurn[minIndex] = turnAroundTime[minIndex] / processes[minIndex].serviceTime;
          isCompleted[minIndex] = true;
          completed++;
        }
      }
      fillInWaitTime();
    };

    const highestResponseRatioNext = () => {
      let currentTime = 0;
      let completed = 0;
      let isCompleted = new Array(process_count).fill(false);

      while (completed < process_count) {
        let maxIndex = -1;
        let maxResponseRatio = -1;

        for (let i = 0; i < process_count; i++) {
          if (processes[i].arrivalTime <= currentTime && !isCompleted[i]) {
            let responseRatio = (currentTime - processes[i].arrivalTime + processes[i].serviceTime) / processes[i].serviceTime;
            if (responseRatio > maxResponseRatio) {
              maxResponseRatio = responseRatio;
              maxIndex = i;
            }
          }
        }

        if (maxIndex === -1) {
          currentTime++;
          continue;
        }

        for (let i = 0; i < processes[maxIndex].serviceTime; i++) {
          timeline[currentTime][maxIndex] = '*';
          currentTime++;
        }

        finishTime[maxIndex] = currentTime;
        turnAroundTime[maxIndex] = finishTime[maxIndex] - processes[maxIndex].arrivalTime;
        normTurn[maxIndex] = turnAroundTime[maxIndex] / processes[maxIndex].serviceTime;
        isCompleted[maxIndex] = true;
        completed++;
      }
      fillInWaitTime();
    };

    switch (algorithm) {
      case 'FCFS':
        firstComeFirstServe();
        break;
      case 'RR':
        roundRobin(quantum);
        break;
      case 'SPN':
        shortestProcessNext();
        break;
      case 'SRT':
        shortestRemainingTime();
        break;
      case 'HRRN':
        highestResponseRatioNext();
        break;
      default:
        break;
    }

    return { timeline, finishTime, turnAroundTime, normTurn, processList };
  };

  const handleSubmit = () => {
    if (selectedOption === 'Option 5' && !option5Input) {
      alert("Time quantum is necessary for Round Robin scheduling.");
      return;
    }

    const algorithm = selectedOption === 'Option 1' ? 'FCFS' : 
                      selectedOption === 'Option 2' ? 'SPN' : 
                      selectedOption === 'Option 3' ? 'SRT' : 
                      selectedOption === 'Option 4' ? 'HRRN' : 
                      selectedOption === 'Option 5' ? 'RR' : '';
    const operation = action1Selected ? 'trace' : 'stats';
    const quantum = selectedOption === 'Option 5' ? parseInt(option5Input) : -1;
    setHeading(algorithm);
    const last_instant = 20; // Example last_instant value

    const data = {
      operation,
      algorithm,
      quantum,
      last_instant,
      process_count: processes.length,
      processes
    };

    const result = runSchedulingAlgorithm(data);
    setOutput(result);
  };

  const scrollToOptions = () => {
    if (optionsRef.current) {
      optionsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" className="main-container">
        <Typography variant="h4" className="header">
          Process Manager
        </Typography>
        {processes.map((process) => (
          <Box key={process.id} display="flex" alignItems="center" mb={2} className="process-box">
            <TextField
              InputLabelProps={{ shrink: true }}
              name="name"
              label="Process Name"
              variant="outlined"
              value={process.name}
              onChange={(event) => handleInputChange(process.id, event)}
              className="text-field"
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              name="arrivalTime"
              label="Arrival Time"
              variant="outlined"
              value={process.arrivalTime}
              onChange={(event) => handleInputChange(process.id, event)}
              className="text-field"
            />
            <TextField
              InputLabelProps={{ shrink: true }}
              name="serviceTime"
              label="Service Time"
              variant="outlined"
              value={process.serviceTime}
              onChange={(event) => handleInputChange(process.id, event)}
              className="text-field"
            />
            <IconButton color="secondary" onClick={() => deleteProcess(process.id)}>
              <Delete />
            </IconButton>
          </Box>
        ))}
        <Box display="flex" justifyContent="center" mb={4}>
          <Button
            onClick={addProcess}
            color="primary"
            variant="contained"
            startIcon={<AddCircleOutline />}
            className="add-button"
          >
            Add Process
          </Button>
          <Button
            onClick={scrollToOptions}
            color="secondary"
            variant="contained"
            className="next-button"
            style={{ marginLeft: '16px' }}
          >
            Next
          </Button>
        </Box>
      </Container>

      <Container maxWidth="lg" className="options-container" ref={optionsRef} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" className="sub-header">Select Algorithm</Typography>
        <Box display="flex" justifyContent="center" mb={4} style={{ padding: '10px', margin: '10px' }}>
          <Button
            variant={selectedOption === 'Option 1' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleOptionClick('Option 1')}
            className={`option-button ${selectedOption === 'Option 1' ? 'selected' : ''}`}
            style={{ margin: '0 5px' }}
          >
            FCFS
          </Button>
          <Button
            variant={selectedOption === 'Option 2' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleOptionClick('Option 2')}
            className={`option-button ${selectedOption === 'Option 2' ? 'selected' : ''}`}
            style={{ margin: '0 5px' }}
          >
            SPN
          </Button>
          <Button
            variant={selectedOption === 'Option 3' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleOptionClick('Option 3')}
            className={`option-button ${selectedOption === 'Option 3' ? 'selected' : ''}`}
            style={{ margin: '0 5px' }}
          >
            SRT
          </Button>
          <Button
            variant={selectedOption === 'Option 4' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleOptionClick('Option 4')}
            className={`option-button ${selectedOption === 'Option 4' ? 'selected' : ''}`}
            style={{ margin: '0 5px' }}
          >
            HRRN
          </Button>
          <Button
            variant={selectedOption === 'Option 5' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => handleOptionClick('Option 5')}
            className={`option-button ${selectedOption === 'Option 5' ? 'selected' : ''}`}
            style={{ margin: '0 5px' }}
          >
            RR
          </Button>
          
        </Box>
       
        <Box display="flex" justifyContent="center" gap={'10px'}>

          <p> Enter Time Quantum For RR : </p>

        {(
          <TextField
            label="Time Quantum"
            placeholder="Enter Time Quantum"
            value={option5Input}
            onChange={handleOption5InputChange}
            className="quantum-input"
            style={{ marginBottom: '20px'} }
          />
        )}
      
      </Box>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
            className="submit-button"
          >
            Submit
          </Button>
        </Box>
      </Container>

      {output && <ResultDisplay output={output} algorithm={heading} />}
    </ThemeProvider>
  );
};

export default App;
