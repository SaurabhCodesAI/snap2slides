# Snap2Slides Funding Roadmap

> 💰 **Microgrant Request:** $400 for 6 weeks of focused improvements

---

## Current Project State

**What Actually Works:**
- ✅ Next.js 14 app with TypeScript
- ✅ Google Gemini Vision API integration
- ✅ PowerPoint generation (pptxgenjs)
- ✅ Image upload and processing
- ✅ 8 functional API endpoints
- ✅ Mobile-responsive UI
- ✅ Deployed on Vercel

**Current Limitations:**
- ⚠️ PDF processing is basic (needs improvement)
- ⚠️ Large files (>10MB) can timeout
- ⚠️ Error messages not user-friendly
- ⚠️ No test suite yet
- ⚠️ Documentation needs examples

**Stats:**
- 📊 3 GitHub stars, 1 fork
- 🚀 Deployed at snap2slides.me (if active)
- 👥 Solo developer project

---

## Funding Goal: $400

### Budget Breakdown

| Category | Amount | Details |
|----------|--------|---------|
| **PDF Processing** | $50 | Better library for PDF-to-slide conversion |
| **API Testing Credits** | $100 | Gemini API calls for testing edge cases |
| **Vercel Pro (2 months)** | $40 | Better performance for large file processing |
| **Development Time** | $210 | ~25 hours at OSS community rate |
| **Total** | **$400** | |

**Note:** Development rate is $7-8/hour (standard for open source microgrants, not commercial rates)

---

## 6-Week Development Plan

### Phase 1: PDF Improvements (Weeks 1-2)

**Goal:** Reliable PDF-to-slide conversion

**Tasks:**
- Integrate better PDF parsing library (pdf-parse or similar)
- Handle multi-page PDFs properly
- Extract images from PDFs
- Test with 20+ different PDF types

**Deliverable:** PDFs convert reliably to slides

---

### Phase 2: Robustness (Weeks 3-4)

**Goal:** Handle edge cases and large files

**Tasks:**
- Implement chunking for files >10MB
- Add progress indicators for slow uploads
- Better error handling with clear messages
- Timeout handling for long API calls

**Deliverable:** App works smoothly with various file sizes

---

### Phase 3: Polish (Week 5)

**Goal:** Better user experience

**Tasks:**
- Mobile UI improvements
- Loading states and animations
- Error message rewrites (user-friendly)
- Add usage examples to UI

**Deliverable:** Professional, polished interface

---

### Phase 4: Testing & Docs (Week 6)

**Goal:** Make project maintainable

**Tasks:**
- Write tests for core API routes
- Document all endpoints
- Add README examples with screenshots
- Create contribution guidelines

**Deliverable:** Well-documented, testable codebase

---

## Success Metrics (Realistic)

### Short-term (6 weeks)
- 🎯 10-15 GitHub stars (currently 3)
- 🎯 All phases completed and deployed
- 🎯 50+ test slide generations
- 🎯 Zero critical bugs reported

### Medium-term (3 months post-funding)
- 🎯 20-30 stars
- 🎯 100+ monthly active users
- 🎯 5+ community contributions
- 🎯 90%+ uptime

---

## Why This Project Matters

**Learning Value:**
- Real Next.js + TypeScript implementation
- Working AI API integration (Gemini Vision)
- File processing and generation
- Production deployment experience

**Community Benefit:**
- Helps others learn Next.js + AI integration
- Solves real problem (image → presentation)
- Open source reference implementation
- Documented learning journey

**Honest Assessment:**
This is a **learning project that works**. It's not going to scale to millions of users, but it's a solid example of how to build an AI-powered web app. The improvements will make it reliable enough for others to use and learn from.

---

## What Happens Without Funding?

Progress will be slower:
- ⏱️ 12-16 weeks instead of 6
- 🐌 Limited testing due to API costs
- 📉 Slower iterations
- 🤷 May not reach full polish

The project will continue, but funding accelerates development and ensures thorough testing.

---

## Open Questions for Community

1. **PDF Priority?** - Is better PDF handling the right focus?
2. **Other Features?** - What would make this more useful?
3. **Collaboration?** - Open to code reviews and contributions

---

## Contact

**Developer:** Saurabh Pareek  
**GitHub:** [@SaurabhCodesAI](https://github.com/SaurabhCodesAI)  
**Email:** saurabhpareek228@gmail.com  
**Project:** [snap2slides](https://github.com/SaurabhCodesAI/snap2slides)

---

**Last Updated:** November 17, 2025  
**Status:** Seeking $400 microgrant for 6-week development sprint
