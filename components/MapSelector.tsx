import React, { useEffect, useState, useRef, useCallback } from "react";
import { Loader } from "lucide-react";

declare global {
  interface Window {
    google: any;
    initGoogleMapsCallback?: () => void;
    [key: string]: any;
  }
}

interface MapSelectorProps {
  initialPosition: { lat: number; lng: number };
  onLocationChange: (lat: number, lng: number) => void;
  useCurrentLocation?: boolean;
  viewOnly?: boolean; // New prop for read-only mode
}

const MapSelector: React.FC<MapSelectorProps> = ({
  initialPosition,
  onLocationChange,
  useCurrentLocation = true,
  viewOnly = false, // Default to false for backward compatibility
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [geoLocationError, setGeoLocationError] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Store current position state
  const [currentPosition, setCurrentPosition] = useState(initialPosition);

  // Use refs to break dependency cycles
  const onLocationChangeRef = useRef(onLocationChange);
  const initialPositionRef = useRef(initialPosition);
  const currentPositionRef = useRef(currentPosition);

  // Update refs when props/state change
  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  useEffect(() => {
    initialPositionRef.current = initialPosition;
  }, [initialPosition]);

  useEffect(() => {
    currentPositionRef.current = currentPosition;
  }, [currentPosition]);

  // Get current position if enabled - stable function
  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, []);

  // Helper function to update position - uses ref to avoid dependency issues
  const updatePosition = useCallback((lat: number, lng: number) => {
    setCurrentPosition({ lat, lng });
    onLocationChangeRef.current(lat, lng);
  }, []);

  // Load Google Maps script - only run once
  useEffect(() => {
    if (window.google && window.google.maps) {
      setGoogleLoaded(true);
      return;
    }
    const googleMapCallback = "initGoogleMapsCallback";

    // Create a global callback function
    window[googleMapCallback] = () => {
      setGoogleLoaded(true);
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setGoogleLoaded(true);
      return;
    }

    // Prevent duplicate script loading
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com/maps/api/js"]`
    );
    if (existingScript) {
      // If script exists but Google isn't loaded, wait for it
      if (!window.google || !window.google.maps) {
        // Original callback might be different, so we'll check periodically
        const checkGoogleInterval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogleInterval);
            setGoogleLoaded(true);
          }
        }, 100);

        // Cleanup interval after 10 seconds (timeout)
        setTimeout(() => clearInterval(checkGoogleInterval), 10000);
      } else {
        setGoogleLoaded(true);
      }
      return;
    }

    // Load the script with callback
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&callback=${googleMapCallback}&v=weekly&loading=async`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      console.error("Google Maps script failed to load");
    };
    document.head.appendChild(script);

    return () => {
      // Clean up global callback
      if (window[googleMapCallback]) {
        delete window[googleMapCallback];
      }
    };
  }, []); // Empty dependency array ensures this only runs once

  // Initialize map once Google is loaded
  useEffect(() => {
    if (!googleLoaded || !mapRef.current) return;

    let isMapInitialized = false;
    let mapObj: any = null;
    let markerObj: any = null;

    const initializeMap = async () => {
      if (isMapInitialized || !mapRef.current) return;
      isMapInitialized = true;

      try {
        if (!window.google || !window.google.maps) {
          console.error("Google Maps API not loaded correctly");
          setIsLoading(false);
          return;
        }

        // Always use initialPosition from props to ensure we start with correct coordinates
        let position =
          initialPosition && initialPosition.lat && initialPosition.lng
            ? initialPosition
            : { lat: 0, lng: 0 };

        // Try to get current location if enabled and not in viewOnly mode
        if (useCurrentLocation && !viewOnly) {
          try {
            const geoPosition = await getCurrentPosition();
            position = {
              lat: geoPosition.coords.latitude,
              lng: geoPosition.coords.longitude,
            };
            setCurrentPosition(position);
            onLocationChangeRef.current(position.lat, position.lng);
          } catch (error) {
            console.warn("Unable to get current location:", error);
            setGeoLocationError(
              "Could not get your location. Using provided position."
            );
          }
        }

        // Create the map
        mapObj = new window.google.maps.Map(mapRef.current, {
          center: position,
          zoom: 14,
          mapTypeControl: !viewOnly, // Disable map type control in viewOnly mode
          streetViewControl: false,
          fullscreenControl: !viewOnly, // Disable fullscreen control in viewOnly mode
          zoomControl: true, // Always keep zoom control enabled
          scrollwheel: !viewOnly, // Disable scroll wheel zoom in viewOnly mode
          draggable: true, // Always allow panning the map
        });

        setMapInstance(mapObj);

        // Create marker using standard Marker instead of AdvancedMarkerElement
        markerObj = new window.google.maps.Marker({
          position,
          map: mapObj,
          draggable: !viewOnly, // Disable dragging in viewOnly mode
        });

        setMarker(markerObj);

        // Only add interactive features if not in viewOnly mode
        if (!viewOnly) {
          // Handle marker drag events
          markerObj.addListener("dragend", () => {
            const pos = markerObj.getPosition();
            if (pos) {
              const newLat = pos.lat();
              const newLng = pos.lng();
              updatePosition(newLat, newLng);
            }
          });

          // Allow clicking on the map to move the marker
          mapObj.addListener("click", (event: any) => {
            const clickPosition = event.latLng;
            if (clickPosition && markerObj) {
              markerObj.setPosition(clickPosition);
              updatePosition(clickPosition.lat(), clickPosition.lng());
            }
          });

          // Only add search functionality in interactive mode
          if (!viewOnly) {
            // Add search functionality
            const searchContainer = document.createElement("div");
            searchContainer.className = "map-search-container";
            searchContainer.style.cssText = `
              box-sizing: border-box;
              width: 240px;
              margin-top: 10px;
              background-color: white;
              border-radius: 3px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
            `;

            mapObj.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
              searchContainer
            );

            const inputElement = document.createElement("input");
            inputElement.placeholder = "Search for a location";
            inputElement.style.cssText = `
              box-sizing: border-box;
              width: 240px;
              height: 32px;
              padding: 0 12px;
              font-size: 14px;
              outline: none;
              border: none;
              border-radius: 3px;
            `;

            searchContainer.appendChild(inputElement);

            // Only initialize autocomplete if Places library is available
            if (window.google.maps.places) {
              const autocomplete = new window.google.maps.places.Autocomplete(
                inputElement,
                {
                  types: ["establishment", "geocode"],
                }
              );

              autocomplete.bindTo("bounds", mapObj);

              autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();

                if (!place.geometry || !place.geometry.location) {
                  console.error("Place does not contain geometry information");
                  return;
                }

                if (place.geometry.viewport) {
                  mapObj.fitBounds(place.geometry.viewport);
                } else {
                  mapObj.setCenter(place.geometry.location);
                  mapObj.setZoom(17);
                }

                markerObj.setPosition(place.geometry.location);

                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                updatePosition(lat, lng);
              });
            }
          }

          // Add a current location button if not in viewOnly mode
          if (!viewOnly && useCurrentLocation) {
            const locationButton = document.createElement("button");
            locationButton.textContent = "📍 My Location";
            locationButton.style.cssText = `
              background-color: #fff;
              border: none;
              border-radius: 3px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
              cursor: pointer;
              margin: 10px;
              padding: 8px 12px;
              font-size: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
            `;

            locationButton.addEventListener("click", async () => {
              try {
                const geoPosition = await getCurrentPosition();
                const newPosition = {
                  lat: geoPosition.coords.latitude,
                  lng: geoPosition.coords.longitude,
                };

                mapObj.setCenter(newPosition);
                markerObj.setPosition(newPosition);
                updatePosition(newPosition.lat, newPosition.lng);
                setGeoLocationError(null);
              } catch (error) {
                console.error("Error getting current location:", error);
                setGeoLocationError(
                  "Location access failed. Please try again."
                );
              }
            });

            mapObj.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(
              locationButton
            );
          }
        }

        setMapInitialized(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      isMapInitialized = true;
    };
  }, [
    googleLoaded,
    getCurrentPosition,
    updatePosition,
    initialPosition,
    useCurrentLocation,
    viewOnly, // Add viewOnly to dependencies
  ]);

  useEffect(() => {
    // Only run this effect when both the map and marker exist AND initialPosition has valid coords
    // AND the initialPosition is different from what we already have
    if (
      !mapInstance ||
      !marker ||
      !initialPosition ||
      initialPosition.lat === undefined ||
      initialPosition.lng === undefined ||
      (initialPosition.lat === currentPosition.lat &&
        initialPosition.lng === currentPosition.lng)
    ) {
      return;
    }

    // Update marker and map without triggering additional effects
    marker.setPosition(initialPosition);
    mapInstance.setCenter(initialPosition);

    // Update local state without re-running this effect
    setCurrentPosition((prevPosition) => {
      // Only update if values are actually different
      if (
        prevPosition.lat !== initialPosition.lat ||
        prevPosition.lng !== initialPosition.lng
      ) {
        return initialPosition;
      }
      return prevPosition;
    });
  }, [initialPosition, mapInstance, marker, mapInitialized]); // Remove currentPosition from dependencies

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-10">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      )}
      {geoLocationError && !viewOnly && (
        <div className="absolute top-0 left-0 right-0 bg-yellow-50 text-yellow-800 text-sm px-4 py-2 text-center z-10">
          {geoLocationError}
        </div>
      )}
      <div ref={mapRef} className="w-full h-full min-h-64" />
    </div>
  );
};

export default MapSelector;
