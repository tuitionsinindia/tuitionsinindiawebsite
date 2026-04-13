"use client";

import { useEffect } from "react";
import { trackViewProfile } from "@/lib/analytics";

export default function TrackProfileView({ tutorId, subject }) {
    useEffect(() => {
        trackViewProfile(tutorId, subject);
    }, [tutorId, subject]);

    return null;
}
