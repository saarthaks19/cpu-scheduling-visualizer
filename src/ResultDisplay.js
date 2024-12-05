import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import "./ResultDisplay.css"; // Create this CSS file

const algorithmNames = {
  FCFS: "First Come First Serve (FCFS)",
  SPN: "Shortest Process Next (SPN)",
  SRT: "Shortest Remaining Time (SRT)",
  HRRN: "Highest Response Ratio Next (HRRN)",
  RR: "Round Robin (RR)"
};

const ResultDisplay = ({ output, algorithm }) => {
  if (!output) return null;

  const meanTurnaround = (output.turnAroundTime.reduce((a, b) => a + b, 0) / output.turnAroundTime.length).toFixed(2);
  const meanNormTurn = (output.normTurn.reduce((a, b) => a + b, 0) / output.normTurn.length).toFixed(2);

  return (
    <Box mt={4} className="result-container">
      <Typography variant="h5" gutterBottom>
        {algorithmNames[algorithm] || "Unknown Algorithm"}
      </Typography>

      <Typography variant="h6" gutterBottom>
        Timeline
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              {Array.from({ length: 20 }, (_, i) => (
                <TableCell key={i} align="center">
                  {i}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {output.processList.map((process, index) => (
              <TableRow key={index}>
                <TableCell>{process[0]}</TableCell>
                {Array.from({ length: 20 }, (_, i) => (
                  <TableCell key={i} align="center">
                    {output.timeline[i][index] === '*' ? (
                      <span className="blue-dot" />
                    ) : output.timeline[i][index] === '.' ? (
                      <span className="orange-dot" />
                    ) : (
                      ' '
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" gutterBottom>
        Statistics
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Process</TableCell>
              {output.processList.map((process, index) => (
                <TableCell key={index} align="center">
                  {process[0]}
                </TableCell>
              ))}
              <TableCell align="center">Mean</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Arrival</TableCell>
              {output.processList.map((process, index) => (
                <TableCell key={index} align="center">
                  {process[1]}
                </TableCell>
              ))}
              <TableCell align="center">-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Service</TableCell>
              {output.processList.map((process, index) => (
                <TableCell key={index} align="center">
                  {process[2]}
                </TableCell>
              ))}
              <TableCell align="center">-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Finish</TableCell>
              {output.finishTime.map((time, index) => (
                <TableCell key={index} align="center">
                  {time}
                </TableCell>
              ))}
              <TableCell align="center">-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Turnaround</TableCell>
              {output.turnAroundTime.map((time, index) => (
                <TableCell key={index} align="center">
                  {time}
                </TableCell>
              ))}
              <TableCell align="center">{meanTurnaround}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>NormTurn</TableCell>
              {output.normTurn.map((time, index) => (
                <TableCell key={index} align="center">
                  {time.toFixed(2)}
                </TableCell>
              ))}
              <TableCell align="center">{meanNormTurn}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ResultDisplay;
