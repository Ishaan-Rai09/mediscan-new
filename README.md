# MediScan AI

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0.2-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3.2-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-4.3.9-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
</div>

## Overview

MediScan AI is a cutting-edge medical diagnostic platform that leverages artificial intelligence to analyze medical scans and assist healthcare professionals in detecting anomalies and making accurate diagnoses. The platform supports various types of medical imaging, including brain MRIs, cardiac scans, lung CTs, and liver MRIs.

## Features

- **AI-Powered Scan Analysis**: Upload and analyze medical scans with advanced AI algorithms
- **Anomaly Detection**: Automatically identify and highlight potential anomalies in medical scans
- **Patient Management**: Comprehensive patient record management system
- **Diagnostic Reports**: Generate detailed diagnostic reports with findings and recommendations
- **Analytics Dashboard**: Track scan metrics, patient statistics, and diagnostic trends
- **Security Features**: HIPAA-compliant with AES-256 encryption and two-factor authentication
- **Dark Mode Support**: Comfortable viewing experience in different lighting conditions

## Dashboard Pages

- **Upload Scan**: Upload medical images for AI analysis
- **Diagnosis Results**: View detailed AI analysis results with anomaly detection
- **Reports**: Access and manage past diagnostic reports
- **Analytics**: Visualize diagnostic data and trends
- **Patient Management**: Manage patient records and medical history
- **Security Settings**: Configure security and privacy settings

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: Framer Motion for animations
- **Icons**: Lucide React
- **Authentication**: Clerk
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/mediscan-AI.git
   cd mediscan-AI
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── components/         # React components
│   │   ├── dashboard/      # Dashboard-specific components
│   │   │   ├── Analytics.tsx
│   │   │   ├── DiagnosisResults.tsx
│   │   │   ├── PastReports.tsx
│   │   │   ├── PatientManagement.tsx
│   │   │   ├── ScanUpload.tsx
│   │   │   └── SecuritySettings.tsx
│   │   ├── Dashboard.tsx   # Main dashboard layout
│   │   ├── LandingPage.tsx # Landing page component
│   │   └── ThemeToggle.tsx # Dark/light mode toggle
│   ├── contexts/           # React contexts
│   │   └── ThemeContext.tsx # Theme context for dark/light mode
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Clerk](https://clerk.dev/)
- [Vite](https://vitejs.dev/)