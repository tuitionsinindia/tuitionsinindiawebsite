/**
 * Match Engine — calculates a compatibility score (0-100) between
 * a student requirement and a tutor/institute listing.
 */

export function calculateMatchScore(criterion, entity) {
    if (!criterion || !entity) return { score: 0, factors: [] };

    let totalScore = 0;
    const factors = [];

    // 1. Subject Alignment (Weight: 40%) - Semantic Overlap
    const critSubjects = (criterion.subjects || []).map(s => s.toLowerCase());
    const entSubjects = (entity.subjects || []).map(s => s.toLowerCase());
    const commonSubjects = critSubjects.filter(s => entSubjects.includes(s));
    
    if (commonSubjects.length > 0) {
        const subjectScore = Math.min(40, (commonSubjects.length / Math.max(1, critSubjects.length)) * 40);
        totalScore += subjectScore;
        factors.push({ label: "Subjects", val: subjectScore, text: `${commonSubjects.length} subject${commonSubjects.length > 1 ? "s" : ""} matched` });
    }

    // 2. Location Protocol Parity (CRITICAL - Weight: 30%)
    // Determines if Who Travels to Whom alignment exists
    // Expand "BOTH" to all physical modes for comparison
    const expandModes = (modes) => {
        const expanded = [...(modes || [])];
        if (expanded.includes("BOTH")) {
            expanded.push("ONLINE", "STUDENT_HOME", "TUTOR_HOME", "CENTER");
        }
        return [...new Set(expanded)];
    };
    const critModes = expandModes(criterion.modes);
    const entModes = expandModes(entity.teachingModes);
    const modeMatchCount = critModes.filter(m => entModes.includes(m)).length;

    if (modeMatchCount > 0) {
        totalScore += 20; // Base alignment
        
        // Specific Node Parity
        const criticalNodes = ['STUDENT_HOME', 'TUTOR_HOME', 'CENTER'];
        const hasNodeParity = critModes.find(m => criticalNodes.includes(m) && entModes.includes(m));
        if (hasNodeParity) {
            totalScore += 10;
            factors.push({ label: "Location", val: 30, text: "Location & mode match" });
        } else {
            factors.push({ label: "Mode", val: 20, text: "Teaching mode compatible" });
        }
    } else {
        // Hard penalty for mode disconnect
        totalScore -= 40;
        factors.push({ label: "Mode", val: -40, text: "No compatible teaching mode" });
    }

    // 3. Proximity (Weight: 15%) — distance between student and tutor
    if (criterion.lat && criterion.lng && entity.lat && entity.lng) {
        const distance = calculateHaversine(criterion.lat, criterion.lng, entity.lat, entity.lng);
        if (distance < 5) {
            totalScore += 15;
            factors.push({ label: "Proximity", val: 15, text: "Very close (under 5 km)" });
        } else if (distance < 15) {
            totalScore += 8;
            factors.push({ label: "Proximity", val: 8, text: "Nearby (under 15 km)" });
        }
    }

    // 4. Interaction Model Eligibility (Weight: 10%)
    const leadPref = criterion.groupPreference || 'PRIVATE';
    const entType = entity.type || 'PRIVATE';
    
    if (leadPref === 'PRIVATE' && entType === 'GROUP') {
        totalScore -= 15; // Student wants private, entity is group-only
        factors.push({ label: "Session type", val: -15, text: "Group vs private mismatch" });
    } else if (leadPref === 'GROUP' && entType === 'GROUP') {
        totalScore += 10;
        factors.push({ label: "Session type", val: 10, text: "Group session match" });
    } else {
        totalScore += 5; // Default private match
    }

    // 5. Institutional Trust & Authority (Weight: 15%)
    let trustScore = 0;
    if (entity.isInstitute || entity.role === 'INSTITUTE') trustScore += 8;
    if (entity.isVerified) trustScore += 5;
    if (entity.rating >= 4.5) trustScore += 4;
    
    totalScore += Math.min(15, trustScore);
    if (trustScore > 0) factors.push({ label: "Trust", val: trustScore, text: "Verified & well-rated" });

    // 6. Capacity Control (Safety Gate)
    if (entity.maxSeats && entity.enrolledCount >= entity.maxSeats) {
        totalScore = 0; // ABORT: Batch is full
        factors.push({ label: "Capacity", val: 0, text: "No seats available" });
    }

    return {
        score: Math.max(0, Math.min(100, Math.round(totalScore))),
        factors,
        label: totalScore >= 85 ? "Excellent Match" : totalScore >= 60 ? "Good Match" : "Partial Match"
    };
}

function calculateHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
