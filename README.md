# Snap2Slides

**AI-Powered Image-to-PowerPoint Converter**

> 💡 **Seeking Microgrant:** $300 for PDF improvements and better error handling. [See funding details →](./ROADMAP.md)

A Next.js web app that converts images and documents into PowerPoint presentations using Google Gemini Vision API. Built as a learning project to understand AI integration, file processing, and Next.js deployment.

![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC) ![AI Powered](https://img.shields.io/badge/AI-Powered-orange)

---

## What It Does

1. Upload images (JPG, PNG, WebP) or PDFs
2. AI analyzes content with Gemini Vision
3. Generates structured slide content
4. Downloads as editable PowerPoint (.pptx)

---

## Current Features

✅ **Image Analysis** - Google Gemini Vision API integration  
✅ **PowerPoint Generation** - Creates editable .pptx files (pptxgenjs)  
✅ **File Upload** - Drag & drop, up to 10MB  
✅ **Mobile Responsive** - Works on phones and tablets  
✅ **8 API Endpoints** - analyze, generate, health checks  
✅ **Production Ready** - Deployed on Vercel  

---

## Quick Start

```bash
# Clone and install
git clone https://github.com/SaurabhCodesAI/snap2slides.git
cd snap2slides
npm install

# Set up environment
cp .env.example .env.local
# Add your Google Gemini API key

# Run development server
npm run dev
```

Visit http://localhost:3000

**Get API Key:** [Google AI Studio](https://makersuite.google.com/app/apikey)

---

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Google Gemini AI** - Image analysis and content generation
- **pptxgenjs** - PowerPoint file generation

---

## Project Structure

```
snap2slides/
├── app/
│   ├── api/          # 8 API routes (analyze, generate, health, etc.)
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Homepage
├── components/       # React components
├── lib/              # Utilities and API handlers
├── public/           # Static assets
├── next.config.js    # Next.js configuration
└── package.json      # Dependencies
```

---

## Current Limitations (Honest)

⚠️ **PDF processing is basic** - Works but needs improvement  
⚠️ **Large files (>10MB) can timeout** - Need better chunking  
⚠️ **Error messages** - Could be more user-friendly  
⚠️ **No test suite yet** - Adding tests in next phase  
⚠️ **Limited document formats** - Focusing on images first  

---

## Roadmap

**Current Focus:** PDF improvements and error handling ([funded by microgrant](./ROADMAP.md))

### Next 6 Weeks
- Better PDF-to-slide conversion
- Improved error handling for large files
- Mobile UI optimization
- Comprehensive test suite

### Future Possibilities
- More document formats (Word, Excel)
- Custom slide templates
- Batch processing
- API access for developers

See [ROADMAP.md](./ROADMAP.md) for detailed timeline and budget.

---

## Development

```bash
# Development server
npm run dev

# Production build
npm run build
npm start

# Type checking and linting
npm run type-check
npm run lint
```

---

## Contributing

This is a learning project, but contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**Areas Where Help Is Needed:**
- PDF parsing improvements
- Test coverage
- Error handling
- Documentation

---

## Support This Project

⭐ **Star this repo** if you find it useful  
💰 **Sponsor development** via [GitHub Sponsors](https://github.com/sponsors/SaurabhCodesAI)  
🐛 **Report bugs** via [Issues](https://github.com/SaurabhCodesAI/snap2slides/issues)  
🤝 **Contribute** via [Pull Requests](https://github.com/SaurabhCodesAI/snap2slides/pulls)

---

## License

MIT License - See [LICENSE](./LICENSE) for details.

---

**Built by:** Saurabh Pareek ([@SaurabhCodesAI](https://github.com/SaurabhCodesAI))  
**Contact:** saurabhpareek228@gmail.com  
**Status:** Active development, seeking $300 microgrant for improvements
