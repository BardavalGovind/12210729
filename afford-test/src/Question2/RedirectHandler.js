import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { sendLog } from "../Question1/logMiddleware";

const RedirectHandler = () => {
  const { shortCode } = useParams();

  useEffect(() => {
    const redirectToOriginalUrl = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/redirect/${shortCode}`);
        const { longUrl } = response.data;

        await sendLog({
          stack: "frontend",
          level: "info",
          pkg: "redirect-handler",
          message: `Redirecting to original URL for ${shortCode}`,
        });

        window.location.href = longUrl;
      } catch (err) {
        await sendLog({
          stack: "frontend",
          level: "error",
          pkg: "redirect-handler",
          message: `Failed to redirect for ${shortCode}`,
        });
        window.location.href = "/not-found";
      }
    };

    redirectToOriginalUrl();
  }, [shortCode]);

  return <p>Redirecting...</p>;
};

export default RedirectHandler;
