async function testSearchAPI() {
    console.log("🚀 Testing Search API with Matching Result...");
    // Rajesh Kumar: Mathematics, Mumbai, High School (9-10)
    const url = "http://localhost:3000/api/search/tutors?subject=Mathematics&location=Mumbai&grade=High%20School%20(9-10)&role=TUTOR";
    
    try {
        console.log(`📡 Fetching: ${url}`);
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
            console.log(`✅ Success! Received ${data.length} results.`);
            if (data.length > 0) {
                console.log("👤 Found Tutor:", data[0].name);
                console.log("📍 Location:", data[0].location);
                console.log("📚 Subject:", data[0].subject);
            } else {
                console.log("⚠️ No results found (but API is working).");
            }
        } else {
            console.error("❌ API Error:", data.error || "Unknown error");
            console.error("📄 Details:", data.details || "No details");
        }
    } catch (err) {
        console.error("💥 Request Failed:", err.message);
    }
}

testSearchAPI();
