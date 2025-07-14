import React, { useEffect, useState } from "react";
import axios from "axios";
import { sendLog} from "../Question1/logMiddleware"
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";

const StatisticsPage = () => {
  const [urlStats, setUrlStats] = useState([]);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/statistics");
      setUrlStats(response.data);

      await sendLog({
        stack: "frontend",
        level: "info",
        pkg: "statistics-page",
        message: "Fetched statistics successfully",
      });
    } catch (err) {
      await sendLog({
        stack: "frontend",
        level: "error",
        pkg: "statistics-page",
        message: "Failed to fetch statistics",
      });
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        URL Statistics
      </Typography>

      {urlStats.map((url, idx) => (
        <Box key={idx} sx={{ mb: 5 }}>
          <Typography variant="h6">
            <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
              {url.shortUrl}
            </a>
          </Typography>
          <Typography variant="body2">
            Created At: {url.createdAt}
          </Typography>
          <Typography variant="body2">
            Expires At: {url.expiresAt}
          </Typography>
          <Typography variant="body2">
            Total Clicks: {url.clickCount}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1">Click Details</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {url.clickDetails.map((click, i) => (
                  <TableRow key={i}>
                    <TableCell>{click.timestamp}</TableCell>
                    <TableCell>{click.source}</TableCell>
                    <TableCell>{click.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Container>
  );
};

export default StatisticsPage;
