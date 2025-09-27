# 🎯 Snap2Slides Pro

> **Transform any document into professional presentations with AI** 

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Available-success)](https://snap2slides.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**Snap2Slides** is a production-ready, AI-powered presentation generator built from scratch over 3 weeks. It transforms images, PDFs, and documents into professional PowerPoint slides using Google's Gemini Vision API, featuring enterprise-grade reliability with multi-API failover and comprehensive mobile support.

## 🎬 **[Watch Live Demo Video](https://youtu.be/your-video-id)**

[![Demo Video Thumbnail](https://img.shields.io/badge/▶️_Demo_Video-Watch_Now-red?style=for-the-badge)](https://youtu.be/your-video-id)

## 🌐 **[Try It Live - No Registration Required](https://snap2slides.vercel.app)**

> **Real application, real AI processing, real PowerPoint downloads**

## ✨ **What Makes This Special**

This isn't just another AI tool - it's a **complete production application** built with real-world challenges in mind:

### 🚀 **Core Features**
- 🤖 **Multi-API AI Processing** - Google Gemini Vision with automatic failover
- 📄 **Universal File Support** - Images, PDFs, Word docs, PowerPoint (up to 50MB)
- 📱 **True Mobile-First** - Tested on real devices, works perfectly on phones
- ⚡ **Real-time Processing** - Live progress tracking, no fake loading screens
- 💾 **Instant Downloads** - Professional PowerPoint files ready for presentation
- 🔧 **Admin Monitoring** - Built-in system health dashboard

### 🛠 **Production-Grade Architecture**
- **Enterprise Reliability** - Multi-API rotation prevents downtime
- **Cross-Device Compatibility** - Network-enabled testing across devices  
- **Performance Optimized** - React.memo, code splitting, hardware acceleration
- **Comprehensive Error Handling** - Graceful degradation and user feedback
- **Security First** - Input validation, file type restrictions, API protection

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Gemini API**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add it to `.env.local`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - Navigate to `http://localhost:3000` (or the port shown in terminal)

## Usage

1. **Upload Image**: Drag and drop or click to select an image file (JPG, PNG, WebP up to 10MB)
2. **Generate Slides**: Click "Generate Slides" to process with AI
3. **Download Result**: PowerPoint file will automatically download when ready

## Technical Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Google Gemini AI**: Advanced image analysis and content generation
- **PptxGenJS**: PowerPoint file generation

## API Routes

- `POST /api/gemini-vision`: Process images with AI
- `POST /api/generate-pptx-slides`: Create PowerPoint presentations

## File Structure

```
app/
├── api/
│   ├── gemini-vision/route.ts    # AI image processing
│   └── generate-pptx-slides/route.ts  # PowerPoint generation
├── globals.css                   # Clean, professional styling
├── layout.tsx                    # Root layout
└── page.tsx                      # Main application interface
```

## Environment Variables

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

Make sure to set the `GEMINI_API_KEY` environment variable in your production environment.
- **TypeScript**: Full type safety and excellent developer experience

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Google Gemini AI** - Image analysis and content generation
- **MongoDB** - Database for storing presentations
- **Framer Motion** - Smooth animations

## 🎯 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   # Add your API keys
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── api/          # API routes
│   ├── components/   # Reusable components
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Homepage
├── public/           # Static assets
├── next.config.js    # Next.js configuration
└── tailwind.config.js # Tailwind configuration
```

## 🔧 Development

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript checking

## 🎨 Features in Detail

### Image Upload & Analysis
- Drag & drop interface
- Multiple file support
- AI-powered content extraction
- Smart title generation

### Slide Generation
- Professional templates
- Automatic layout optimization
- Content suggestions
- Export capabilities

## 🚀 Deployment

Ready to deploy on Vercel, Netlify, or any Node.js hosting platform.

## 📝 License

MIT License - feel free to use for personal and commercial projects.

---

**Built with ❤️ for the future of presentations**
