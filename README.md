# 🎯 Snap2Slides Pro

> **AI-Powered Presentation Generator** - Transform images into professional slides with the power of AI

[![Next.js](https://img.shields.io/badge/Next.js-14.2.30-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google AI](https://img.shields.io/badge/Google-AI-orange?style=for-the-badge&logo=google)](https://ai.google/)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

## 🌟 About This Project

Snap2Slides Pro is a modern web application that leverages Google's Gemini AI to analyze images and automatically generate professional PowerPoint presentations. This project represents a comprehensive full-stack development journey, showcasing modern React patterns, AI integration, and production-ready deployment strategies.

## ✨ Key Features

- 🤖 **AI-Powered Analysis** - Google Gemini Vision API integration
- 📊 **Smart Content Generation** - Automatically creates structured presentation content  
- 📥 **Instant PowerPoint Export** - Download professional .pptx files
- 🎨 **Modern UI/UX** - Clean, responsive design with smooth interactions
- ⚡ **Real-time Processing** - Live progress tracking and status updates
- 🔒 **Secure & Private** - No data storage, processing happens in real-time
- 🚀 **Production Ready** - Optimized for deployment on Vercel

## 🛠️ Tech Stack & Architecture

**Frontend:**
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations

**Backend:**
- Next.js API Routes
- Google Gemini AI API
- PptxGenJS for PowerPoint generation
- Formidable for file handling

**DevOps:**
- Vercel deployment
- Environment-based configuration
- ESLint + TypeScript validation

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/SaurabhCodesAI/snap2slides.git
   cd snap2slides
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Add your Google AI API key:
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```
   Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

3. **Development Server**
   ```bash
   npm run dev
   ```

4. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

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

## 📚 Development Journey & Learning Outcomes

This project was built as a comprehensive learning experience, covering:

### **Frontend Development**
- Modern React patterns with hooks and context
- TypeScript integration for type safety
- Responsive design with Tailwind CSS
- Component composition and reusability

### **AI Integration**
- Google Gemini API integration
- Image processing and analysis
- Prompt engineering for content generation
- Error handling for AI services

### **Backend Development** 
- Next.js API routes architecture
- File upload handling with validation
- Environment configuration management
- Production optimization techniques

### **DevOps & Deployment**
- Vercel deployment configuration
- Environment variable management
- Build optimization and performance
- Git workflow and version control

## 🎓 Key Learning Points

1. **AI Integration Complexity** - Understanding API limits, error handling, and fallback strategies
2. **File Processing** - Handling large files, validation, and memory management
3. **User Experience** - Real-time feedback, loading states, and error messaging
4. **Production Deployment** - Environment configuration, build optimization, and monitoring
5. **Code Organization** - Modular architecture, TypeScript types, and maintainable code structure

## 🤝 Contributing

Feel free to contribute to this project! Whether it's bug fixes, feature additions, or documentation improvements.

## 📄 License

MIT License - See [LICENSE](LICENSE) for more information.

---

**Built with ❤️ as a learning journey in modern web development and AI integration**

> 🔗 **Live Demo:** [snap2slides.vercel.app](https://snap2slides.vercel.app) (Coming Soon)
