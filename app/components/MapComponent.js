"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";

// Approximate city centres for tutors without precise coordinates
const CITY_COORDS = {
    "mumbai": [19.0760, 72.8777], "delhi": [28.7041, 77.1025],
    "new delhi": [28.6139, 77.2090], "bangalore": [12.9716, 77.5946],
    "bengaluru": [12.9716, 77.5946], "kolkata": [22.5726, 88.3639],
    "hyderabad": [17.3850, 78.4867], "chennai": [13.0827, 80.2707],
    "pune": [18.5204, 73.8567], "ahmedabad": [23.0225, 72.5714],
    "jaipur": [26.9124, 75.7873], "lucknow": [26.8467, 80.9462],
    "chandigarh": [30.7333, 76.7794], "noida": [28.5355, 77.3910],
    "gurgaon": [28.4595, 77.0266], "gurugram": [28.4595, 77.0266],
    "kochi": [9.9312, 76.2673], "indore": [22.7196, 75.8577],
    "bhopal": [23.2599, 77.4126], "nagpur": [21.1458, 79.0882],
    "patna": [25.5941, 85.1376], "surat": [21.1702, 72.8311],
    "vadodara": [22.3072, 73.1812], "coimbatore": [11.0168, 76.9558],
    "visakhapatnam": [17.6868, 83.2185], "bhubaneswar": [20.2961, 85.8245],
    "online": null,
};

function getCoordsForTutor(tutor) {
    if (tutor.lat && tutor.lng) return [tutor.lat, tutor.lng];
    const city = (tutor.location || "").toLowerCase().trim().split(",")[0].trim();
    const base = CITY_COORDS[city];
    if (!base) return null;
    // Small random offset so tutors in same city don't stack exactly
    return [
        base[0] + (Math.random() - 0.5) * 0.08,
        base[1] + (Math.random() - 0.5) * 0.08,
    ];
}

export default function MapComponent({ tutors = [], userLat, userLng }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersGroupRef = useRef(null);
    const userMarkerRef = useRef(null);
    const [mapReady, setMapReady] = useState(false);

    // Initialize map once
    useEffect(() => {
        if (typeof window === "undefined" || !mapRef.current || mapInstanceRef.current) return;

        let L;
        const init = async () => {
            L = (await import("leaflet")).default;
            await import("leaflet/dist/leaflet.css");
            await import("leaflet.markercluster");
            await import("leaflet.markercluster/dist/MarkerCluster.css");
            await import("leaflet.markercluster/dist/MarkerCluster.Default.css");

            const map = L.map(mapRef.current, {
                center: [20.5937, 78.9629], // India centre
                zoom: 5,
                zoomControl: false,
            });
            mapInstanceRef.current = map;

            // Custom zoom controls (top-right)
            L.control.zoom({ position: "topright" }).addTo(map);

            // OpenStreetMap tiles
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                maxZoom: 18,
            }).addTo(map);

            setMapReady(true);
        };
        init();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                setMapReady(false);
            }
        };
    }, []);

    // Update markers when tutors or user location changes
    useEffect(() => {
        if (!mapReady || !mapInstanceRef.current) return;

        const map = mapInstanceRef.current;

        import("leaflet").then(mod => {
            const L = mod.default;

            // Remove old markers group
            if (markersGroupRef.current) {
                map.removeLayer(markersGroupRef.current);
            }

            // Create cluster group with custom styling
            const cluster = L.markerClusterGroup({
                chunkedLoading: true,
                maxClusterRadius: 60,
                iconCreateFunction: (c) => {
                    const count = c.getChildCount();
                    const size = count < 10 ? 36 : count < 50 ? 42 : 48;
                    return L.divIcon({
                        html: `<div style="
                            width:${size}px;height:${size}px;
                            background:#2563eb;color:#fff;
                            border-radius:50%;display:flex;align-items:center;justify-content:center;
                            font-size:13px;font-weight:700;
                            border:3px solid #fff;
                            box-shadow:0 2px 8px rgba(37,99,235,0.4);
                        ">${count}</div>`,
                        className: "",
                        iconSize: [size, size],
                        iconAnchor: [size / 2, size / 2],
                    });
                },
            });
            markersGroupRef.current = cluster;

            const bounds = [];

            tutors.forEach((tutor) => {
                const coords = getCoordsForTutor(tutor);
                if (!coords) return;
                bounds.push(coords);

                const initial = (tutor.name || "?").charAt(0).toUpperCase();
                const rate = tutor.rate ? `₹${tutor.rate}` : "";
                const dist = tutor.distance && tutor.distance < 999 ? `${tutor.distance.toFixed(1)} km` : "";
                const verified = tutor.isVerified ? `<span style="color:#2563eb;font-size:10px;font-weight:600"> ✓ Verified</span>` : "";

                const icon = L.divIcon({
                    html: `<div style="
                        background:#fff;
                        border:2px solid #2563eb;
                        border-radius:20px 20px 20px 4px;
                        padding:4px 8px;
                        display:flex;align-items:center;gap:5px;
                        box-shadow:0 2px 8px rgba(0,0,0,0.15);
                        white-space:nowrap;
                        font-family:sans-serif;
                    ">
                        <div style="
                            width:22px;height:22px;border-radius:50%;
                            background:#2563eb;color:#fff;
                            display:flex;align-items:center;justify-content:center;
                            font-size:11px;font-weight:700;flex-shrink:0;
                        ">${initial}</div>
                        <span style="font-size:12px;font-weight:700;color:#1e293b;">${rate}</span>
                    </div>`,
                    className: "",
                    iconSize: null,
                    iconAnchor: [0, 36],
                });

                const popup = L.popup({ maxWidth: 220, className: "tutor-popup" }).setContent(`
                    <div style="font-family:sans-serif;padding:4px 2px">
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
                            <div style="width:36px;height:36px;border-radius:50%;background:#dbeafe;color:#2563eb;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;flex-shrink:0">${initial}</div>
                            <div>
                                <p style="font-weight:700;font-size:13px;margin:0;color:#111">${tutor.name || "Tutor"}</p>
                                <p style="font-size:11px;color:#2563eb;margin:0">${(tutor.subjects || [])[0] || "Academics"}${verified}</p>
                            </div>
                        </div>
                        <div style="display:flex;gap:12px;font-size:11px;color:#64748b;border-top:1px solid #f1f5f9;padding-top:8px">
                            <span>💰 <b style="color:#111">${rate}/hr</b></span>
                            ${dist ? `<span>📍 <b style="color:#111">${dist}</b></span>` : ""}
                            ${tutor.experience ? `<span>🎓 <b style="color:#111">${tutor.experience} yrs</b></span>` : ""}
                        </div>
                        <a href="/search/${tutor.id}" style="
                            display:block;margin-top:8px;
                            background:#2563eb;color:#fff;
                            text-align:center;padding:6px;border-radius:8px;
                            font-size:11px;font-weight:600;text-decoration:none;
                        ">View Profile →</a>
                    </div>
                `);

                const marker = L.marker(coords, { icon }).bindPopup(popup);
                cluster.addLayer(marker);
            });

            map.addLayer(cluster);

            // User location marker
            if (userMarkerRef.current) {
                map.removeLayer(userMarkerRef.current);
                userMarkerRef.current = null;
            }
            if (userLat && userLng) {
                const userIcon = L.divIcon({
                    html: `<div style="
                        width:16px;height:16px;border-radius:50%;
                        background:#22c55e;border:3px solid #fff;
                        box-shadow:0 0 0 3px rgba(34,197,94,0.3);
                    "></div>`,
                    className: "",
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                });
                userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon, zIndexOffset: 1000 })
                    .addTo(map)
                    .bindPopup("<b>Your location</b>");
                bounds.push([userLat, userLng]);
            }

            // Fit map to show all markers
            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
            }
        });
    }, [mapReady, tutors, userLat, userLng]);

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
            <div ref={mapRef} className="w-full h-full" />

            {/* Loading overlay */}
            {!mapReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                    <MapPin size={28} className="text-blue-400 mb-2 animate-bounce" />
                    <p className="text-xs text-gray-500">Loading map...</p>
                </div>
            )}

            {/* No tutors with location */}
            {mapReady && tutors.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 pointer-events-none">
                    <MapPin size={28} className="text-gray-300 mb-2" />
                    <p className="text-sm font-medium text-gray-500">No tutors to show</p>
                    <p className="text-xs text-gray-400">Try adjusting your filters</p>
                </div>
            )}
        </div>
    );
}
