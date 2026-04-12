import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TuitionsInIndia — Find Home Tutors & Online Tutors Near You";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "system-ui, sans-serif",
                    padding: "60px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginBottom: "32px",
                    }}
                >
                    <div
                        style={{
                            width: "64px",
                            height: "64px",
                            background: "white",
                            borderRadius: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "32px",
                        }}
                    >
                        T
                    </div>
                    <span
                        style={{
                            color: "white",
                            fontSize: "36px",
                            fontWeight: 800,
                            letterSpacing: "-1px",
                        }}
                    >
                        TuitionsInIndia
                    </span>
                </div>
                <h1
                    style={{
                        color: "white",
                        fontSize: "52px",
                        fontWeight: 800,
                        textAlign: "center",
                        lineHeight: 1.2,
                        margin: "0 0 16px",
                        letterSpacing: "-2px",
                    }}
                >
                    Find the Right Tutor,
                    <br />
                    Near You
                </h1>
                <p
                    style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: "22px",
                        textAlign: "center",
                        margin: 0,
                        maxWidth: "600px",
                    }}
                >
                    Verified tutors for home tuition, online classes, and coaching across India
                </p>
                <div
                    style={{
                        display: "flex",
                        gap: "32px",
                        marginTop: "40px",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "16px",
                    }}
                >
                    <span>50,000+ Tutors</span>
                    <span>500+ Cities</span>
                    <span>4.7 Rating</span>
                </div>
            </div>
        ),
        { ...size }
    );
}
