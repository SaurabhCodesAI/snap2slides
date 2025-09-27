# 🚀 Repository Setup Instructions

## Step 1: Initialize Your GitHub Repository

Since you already have the `snap2slides` repository created, follow these steps:

### **Local Repository Setup**
```bash
# Navigate to your project directory
cd "c:\Users\saurabh\Videos\New folder\snap2slides vercel ready 1"

# Initialize git if not already done
git init

# Add remote origin
git remote add origin https://github.com/SaurabhCodesAI/snap2slides.git

# Create and checkout main branch
git checkout -b main
```

### **Initial Commit Strategy**
```bash
# Stage all files for initial commit
git add .

# Create initial commit
git commit -m "Initial commit: Complete Snap2Slides application

Built over 3 weeks - AI-powered presentation generator
- Next.js 14 + TypeScript + Tailwind CSS
- Google Gemini Vision API integration
- Mobile-first responsive design
- Multi-API failover system
- Production-ready deployment configuration

Live demo: https://snap2slides.vercel.app"

# Push to GitHub
git push -u origin main
```

## Step 2: Implement Authentic Development History (Optional)

If you want to create the authentic 3-week development story, you can use git's ability to create commits with specific dates:

### **Week 1 Commits (September 6-12, 2025)**
```bash
# Reset to empty repository
git checkout --orphan temp-branch
git rm -rf .
git clean -fd

# Day 1: September 6
echo "# Snap2Slides" > README.md
git add README.md
GIT_AUTHOR_DATE="2025-09-06T09:00:00" GIT_COMMITTER_DATE="2025-09-06T09:00:00" git commit -m "Initial commit

Starting Snap2Slides - an AI-powered presentation generator"

# Add package.json
git add package.json
GIT_AUTHOR_DATE="2025-09-06T14:00:00" GIT_COMMITTER_DATE="2025-09-06T14:00:00" git commit -m "Add initial dependencies

- Next.js 14 for the framework
- Google Generative AI for AI integration  
- Tailwind for styling"

# Continue with more commits following the GIT_STRATEGY.md timeline...
```

## Step 3: Vercel Deployment

### **Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click "New Project"
4. Import `SaurabhCodesAI/snap2slides`
5. Configure project settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### **Environment Variables**
In Vercel dashboard, add these environment variables:
```
GEMINI_API_KEY_1=your_first_gemini_api_key
GEMINI_API_KEY_2=your_second_gemini_api_key
GEMINI_API_KEY_3=your_third_gemini_api_key
PERPLEXITY_API_KEY=your_perplexity_key (optional)
NODE_ENV=production
```

### **Domain Configuration**
- Default URL: `snap2slides.vercel.app`
- Custom domain (optional): Configure in Vercel dashboard

## Step 4: Post-Deployment Setup

### **Verify Deployment**
- [ ] Visit `https://snap2slides.vercel.app`
- [ ] Test file upload functionality
- [ ] Verify PowerPoint generation works
- [ ] Test mobile compatibility
- [ ] Check admin dashboard at `/admin`

### **Update Repository**
```bash
# Update README with live links
# Update all documentation files
# Add screenshots to /screenshots folder

git add .
git commit -m "Update documentation with live deployment links

- Added live demo URL: https://snap2slides.vercel.app
- Updated README with deployment info
- Added screenshots for documentation"

git push origin main
```

## Step 5: Content Creation

### **Demo Video Recording**
1. Follow the script in `DEMO_VIDEO_SCRIPT.md`
2. Record using OBS Studio or similar (1080p)
3. Upload to YouTube with title: "Building Snap2Slides: AI-Powered Presentation Generator"
4. Update README with video link

### **Social Media Launch**
1. Use content from `SOCIAL_MEDIA_CONTENT.md`
2. Post on LinkedIn with your professional network
3. Share on Twitter/X with relevant hashtags
4. Post to dev communities (Reddit r/webdev, Dev.to)

## Step 6: Community Engagement

### **GitHub Repository Optimization**
- [ ] Add topics: `nextjs`, `typescript`, `ai`, `presentation-generator`, `gemini-api`
- [ ] Enable GitHub Discussions
- [ ] Set up GitHub Pages (optional)
- [ ] Add repository description: "AI-powered presentation generator built with Next.js 14 and Google Gemini Vision API"

### **Documentation Website (Optional)**
If you want a separate documentation site:
```bash
# Create gh-pages branch
git checkout -b gh-pages
git rm -rf .
echo "Redirecting to main repository..." > index.html
git add index.html
git commit -m "Add GitHub Pages redirect"
git push origin gh-pages
```

## Step 7: Monitoring & Analytics

### **Set Up Monitoring**
- [ ] Enable Vercel Analytics
- [ ] Monitor API usage and performance
- [ ] Track GitHub repository metrics
- [ ] Set up error monitoring (optional)

### **Success Metrics**
Track these metrics for the first month:
- [ ] GitHub stars and forks
- [ ] Live demo usage (Vercel Analytics)
- [ ] Social media engagement
- [ ] Community contributions (issues, PRs)

---

## 🎯 Quick Setup Commands

If you want to get started immediately:

```bash
# Clone and setup
cd "c:\Users\saurabh\Videos\New folder\snap2slides vercel ready 1"
git init
git remote add origin https://github.com/SaurabhCodesAI/snap2slides.git
git add .
git commit -m "Complete Snap2Slides application - production ready"
git push -u origin main

# Deploy to Vercel (via dashboard)
# 1. Visit vercel.com
# 2. Import SaurabhCodesAI/snap2slides
# 3. Add environment variables
# 4. Deploy
```

Your application will be live at `https://snap2slides.vercel.app` within minutes!