/**
 * Aura Match Engine v3.1 - Location Protocol & Role-Agnostic Intelligence
 * Calculates a confidence score (0-100) between two entities.
 * Supports Student-Tutor, Student-Institute, and Institute-Tutor vectors.
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
        factors.push({ label: "SUBJECT_SYNC", val: subjectScore, text: `${commonSubjects.length} SUBJECTS ALIGNED` });
    }

    // 2. Location Protocol Parity (CRITICAL - Weight: 30%)
    // Determines if Who Travels to Whom alignment exists
    const critModes = criterion.modes || [];
    const entModes = entity.teachingModes || [];
    const modeMatchCount = critModes.filter(m => entModes.includes(m)).length;

    if (modeMatchCount > 0) {
        totalScore += 20; // Base alignment
        
        // Specific Node Parity
        const criticalNodes = ['STUDENT_HOME', 'TUTOR_HOME', 'CENTER'];
        const hasNodeParity = critModes.find(m => criticalNodes.includes(m) && entModes.includes(m));
        if (hasNodeParity) {
            totalScore += 10;
            factors.push({ label: "LOCATION_PARITY", val: 30, text: "GEOSPATIAL PROTOCOL ALIGNED" });
        } else {
            factors.push({ label: "MODE_SYNC", val: 20, text: "DELIVERY MODE COMPATIBLE" });
        }
    } else {
        // Hard penalty for mode disconnect
        totalScore -= 40;
        factors.push({ label: "LOCATION_DISCONNECT", val: -40, text: "NO COMPATIBLE DELIVERY NODE" });
    }

    // 3. Proximity Vector (Weight: 15%) - Tactical distance scoring
    if (criterion.lat && criterion.lng && entity.lat && entity.lng) {
        const distance = calculateHaversine(criterion.lat, criterion.lng, entity.lat, entity.lng);
        if (distance < 5) {
            totalScore += 15;
            factors.push({ label: "PROXIMITY", val: 15, text: "HYPER-LOCAL (<5KM)" });
        } else if (distance < 15) {
            totalScore += 8;
            factors.push({ label: "PROXIMITY", val: 8, text: "REGIONAL RADIUS" });
        }
    }

    // 4. Interaction Model Eligibility (Weight: 10%)
    const leadPref = criterion.groupPreference || 'PRIVATE';
    const entType = entity.type || 'PRIVATE';
    
    if (leadPref === 'PRIVATE' && entType === 'GROUP') {
        totalScore -= 15; // Student wants private, entity is group-only
        factors.push({ label: "MODEL_FRICTION", val: -15, text: "BATCH VS PRIVATE MISMATCH" });
    } else if (leadPref === 'GROUP' && entType === 'GROUP') {
        totalScore += 10;
        factors.push({ label: "MODEL_SYNERGY", val: 10, text: "BATCH OPTIMIZED" });
    } else {
        totalScore += 5; // Default private match
    }

    // 5. Institutional Trust & Authority (Weight: 15%)
    let trustScore = 0;
    if (entity.isInstitute || entity.role === 'INSTITUTE') trustScore += 8;
    if (entity.isVerified) trustScore += 5;
    if (entity.rating >= 4.5) trustScore += 4;
    
    totalScore += Math.min(15, trustScore);
    if (trustScore > 0) factors.push({ label: "TRUST_INDEX", val: trustScore, text: "REPUTATION PROTOCOL" });

    // 6. Capacity Control (Safety Gate)
    if (entity.maxSeats && entity.enrolledCount >= entity.maxSeats) {
        totalScore = 0; // ABORT: Batch is full
        factors.push({ label: "NODE_SATURATED", val: 0, text: "ZERO CAPACITY REMAINING" });
    }

    return {
        score: Math.max(0, Math.min(100, Math.round(totalScore))),
        factors,
        label: totalScore >= 85 ? "PREMIUM_MATCH" : totalScore >= 60 ? "HIGH_AFFINITY" : "STABLE_PAIRING"
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
