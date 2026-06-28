"use client";

import { useEffect } from "react";
import { shouldUseLightTheme } from "@/lib/location";

export default function ThemeDetector() {
  useEffect(() => {
    console.log("ThemeDetector Loaded");

    if (!navigator.geolocation) {
      console.log("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();

          const state = data?.address?.state || "";

localStorage.setItem("userState", state);
          console.log("Detected State:", state);

          const light = shouldUseLightTheme(state);

          const app = document.getElementById("app-root");

          if (app) {
            app.style.transition = "all 0.5s ease";

            if (light) {
              app.style.backgroundColor = "white";
              app.style.color = "black";

              document.documentElement.classList.remove("dark");

              console.log("🌞 Light Theme Applied");
            } else {
              app.style.backgroundColor = "#111827";
              app.style.color = "white";

              document.documentElement.classList.add("dark");

              console.log("🌙 Dark Theme Applied");
            }
          }
        } catch (err) {
          console.log("Reverse Geocoding Error:", err);
        }
      },
      (error) => {
        console.log("Location Permission Error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return null;
}