# XR Spark Match - Submission Package

## 🚀 Tagline (140 characters)
**XR Spark Match: Instantly connect with professionals in AR. Scan a QR code to reveal shared interests and spark meaningful conversations.**

---

## 📝 Description (500 words max)

**The Problem:**
Professional networking events are often awkward and inefficient. You walk into a room full of strangers, unsure who to talk to or what you have in common. Physical business cards are outdated, and mobile apps disconnect you from the moment.

**The Solution:**
**XR Spark Match** reimagines networking using the power of **WebXR** and **Mixed Reality** on the Meta Quest 3. By leveraging the **Immersive Web SDK**, we bring professional profiles into the real world, overlaying digital context onto physical interactions.

**How It Works:**
1.  **Scan to Connect**: Using the Quest 3's high-fidelity passthrough camera, users simply look at another person's QR code badge.
2.  **Instant Insight**: A floating, interactive 3D profile card appears in AR, displaying the person's name, role, and key interests.
3.  **Spark a Conversation**: The "Spark Match" algorithm highlights shared skills and interests, giving you the perfect icebreaker.

**Key Features:**
*   **Seamless Passthrough**: Built with the **Immersive Web SDK**, the app blends digital content naturally with the real world, ensuring you never lose connection with the person in front of you.
*   **Instant QR Recognition**: Optimized computer vision algorithms detect and decode QR codes in milliseconds using the native camera feed.
*   **Interactive 3D UI**: Profile cards are spatial objects—you can reach out, grab them, and move them aside to keep your view clear.

**Why It Fits the Lifestyle Track:**
XR Spark Match enhances a core part of professional lifestyle: **Connection**. It removes the friction from networking, making social interactions more productive and meaningful without replacing the human element. It uses XR to *augment* reality, not escape it.

---

## 🛠 Technical Architecture

**Build Path:** Immersive Web SDK (WebXR)

**Tech Stack:**
*   **Frontend**: TypeScript, Three.js
*   **XR Framework**: Meta Immersive Web SDK (`@iwsdk/core`)
*   **Computer Vision**: Native Camera Access (`getUserMedia`) + `jsQR` for decoding
*   **Build Tool**: Vite (with SSL/HTTPS support)

**Implementation Details:**
The application runs entirely in the browser, making it accessible without large downloads. We utilize the **Immersive Web SDK** to manage the XR session and Passthrough layer. For QR scanning, we implemented a custom computer vision pipeline that accesses the Quest 3's camera feed via standard Web APIs, processes frames on a canvas, and decodes QR data in real-time.

---

## 🔮 Future Roadmap

**Phase 1: The "Spark" (Current)**
*   Basic QR scanning and profile retrieval.
*   Passthrough AR overlay.

**Phase 2: The "Connection" (Next 3 Months)**
*   **AI-Powered Matching**: Integrate Llama 3 to analyze profiles and suggest personalized conversation starters.
*   **Hand Tracking**: Use hand gestures to "save" a profile or "exchange" digital business cards.
*   **Multiplayer**: Shared AR sessions where two users see the same floating objects.

**Phase 3: The "Network" (6 Months+)**
*   **Spatial LinkedIn**: A persistent AR graph of your professional network.
*   **Venue Integration**: Event organizers can deploy "Topic Anchors" in the room to guide people to specific networking zones.

---

## 👥 Team
*   **Deepak Raut** - Lead Developer & XR Architect
