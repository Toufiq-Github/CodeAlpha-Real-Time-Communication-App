# **App Name**: Opticare AI

## Core Features:

- User Authentication & Authorization: Enable secure registration and login for patients, doctors, and system administrators, controlling access based on user roles.
- AI Symptom Analysis Tool: Patients can describe symptoms, and the system will provide preliminary guidance and potential conditions (not a diagnosis) as a tool for immediate informational assistance.
- Doctor & Hospital Finder: Provide functionality for patients to search for specialist doctors and visualize nearby eye care hospitals using an integrated map interface (Google Maps API).
- Appointment Booking & Management: Enable patients to book appointments with available doctors and provide doctors with a dashboard to view, accept, or reject incoming requests. Includes integration for Google Meet links for consultations.
- Doctor Image Upload: Provide doctors with the capability to upload and store patient retinal/fundus images for their records.
- Admin Doctor Management: A secure admin interface to add, remove, and manage doctor accounts and their credentials within the system, using a PostgreSQL database.
- Data Persistence (PostgreSQL): Securely store and retrieve all user profiles, appointment details, image metadata, and system configurations using a PostgreSQL database.

## Style Guidelines:

- Primary brand color: Deep Blue (#1E3A8A) for trust and stability. Soft Blue (#3B82F6) for interactive elements like buttons and links.
- Secondary colors: Light Gray Background (#F9FAFB) and Border Gray (#E5E7EB).
- Status colors: Success (#10B981) for accepted, Warning (#F59E0B) for pending, Error (#EF4444) for rejected. Avoid gradients, neon colors, and limit total colors to 4-5.
- Primary font: Inter (or system font fallback) for a clean, legible look. No decorative fonts or ALL CAPS paragraphs.
- Hierarchy: Heading (text-2xl / font-semibold), Subheading (text-lg / font-medium), Body (text-base), Small text (text-sm / text-gray-500). Line spacing should be comfortable (1.5-1.6).
- Use an 8px spacing system (8 / 16 / 24 / 32 / 40) for consistent spacing. Ensure clean sections with clear separation.
- Structure content using cards for important information. Cards should have a white background, subtle shadow, rounded-xl corners, and 16-24px padding.
- The main container should have a max width of 1200px and be center-aligned. Prioritize increasing spacing if elements feel crowded and adding content if areas feel empty.
- Buttons: Primary with solid blue background and white text, rounded-lg. Secondary with border only and blue text. Disabled with gray background and no hover effect. Input fields: Light gray border, blue outline on focus, comfortable padding.
- Tables (for appointments): Clean rows, light borders, and highlight on hover.
- Dashboard Structure: Patient dashboard prioritizes symptom input and AI results. Doctor dashboard focuses on appointment lists. Admin dashboard on doctor management and system stats. Visual tone should be calm, clean, reliable, and slightly formal.
- Use simple line icons only; avoid filled, cartoon, or colorful icons. Examples: Eye, Calendar, User.
- Subtle micro-interactions: Button hover slightly darker, card hover slight shadow increase. Animations should be quick and no longer than 200ms.
- Avoid Glassmorphism, heavy shadows, gradient overload, and fancy charts. The UI should be professional and functional, not 'fun'.