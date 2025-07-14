import React, { useState } from "react";
import axios from "axios";
import { sendLog } from "./logMiddleware";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
} from "@mui/material";

const ShortenerPage = () => {
  const [urlInputs, setUrlInputs] = useState([
    { originalUrl: "", validityMinutes: "", customCode: "" },
  ]);
  const [shortenedUrls, setShortenedUrls] = useState([]);

  const updateInputField = (index, fieldName, value) => {
    const updatedInputs = [...urlInputs];
    updatedInputs[index][fieldName] = value;
    setUrlInputs(updatedInputs);
  };

  const addUrlInputField = () => {
    if (urlInputs.length < 5) {
      setUrlInputs([
        ...urlInputs,
        { originalUrl: "", validityMinutes: "", customCode: "" },
      ]);
    }
  };

  const handleUrlShortening = async () => {
    const createdUrls = [];

    for (const input of urlInputs) {
      const { originalUrl, validityMinutes, customCode } = input;

      if (!/^https?:\/\/.+$/.test(originalUrl)) {
        await sendLog({
          stack: "frontend",
          level: "error",
          pkg: "shortener-page",
          message: `Invalid URL entered: ${originalUrl}`,
        });
        continue;
      }

      try {
        const response = await axios.post("http://localhost:8000/api/shorten", {
          longUrl: originalUrl,
          validity: validityMinutes ? parseInt(validityMinutes) : 30,
          shortcode: customCode || undefined,
        });

        createdUrls.push(response.data);

        await sendLog({
          stack: "frontend",
          level: "info",
          pkg: "shortener-page",
          message: `Short URL created: ${response.data.shortUrl}`,
        });
      } catch (err) {
        await sendLog({
          stack: "frontend",
          level: "error",
          pkg: "shortener-page",
          message: `Error creating short URL for: ${originalUrl}`,
        });
      }
    }

    setShortenedUrls(createdUrls);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {urlInputs.map((input, idx) => (
        <Box key={idx} sx={{ mb: 3, borderBottom: "1px solid #ddd", pb: 2 }}>
          <TextField
            fullWidth
            label="Long URL"
            value={input.originalUrl}
            onChange={(e) =>
              updateInputField(idx, "originalUrl", e.target.value)
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Validity (in minutes)"
            value={input.validityMinutes}
            onChange={(e) =>
              updateInputField(idx, "validityMinutes", e.target.value)
            }
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Custom Shortcode (optional)"
            value={input.customCode}
            onChange={(e) =>
              updateInputField(idx, "customCode", e.target.value)
            }
          />
        </Box>
      ))}

      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={addUrlInputField}
          disabled={urlInputs.length >= 5}
          sx={{ mr: 2 }}
        >
          Add Another URL
        </Button>

        <Button variant="contained" onClick={handleUrlShortening} sx={{ backgroundColor: '#FFA500', '&:hover': { backgroundColor: '#e69500' } }}
        >
          Generate Short Links
        </Button>
      </Box>

      {shortenedUrls.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Shortened Links
          </Typography>
          {shortenedUrls.map((entry, index) => (
            <Box key={index} sx={{ mt: 1 }}>
              <a href={entry.shortUrl} target="_blank" rel="noopener noreferrer">
                {entry.shortUrl}
              </a>
              <Typography variant="body2">
                Expires at: {entry.expiresAt}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ShortenerPage;
