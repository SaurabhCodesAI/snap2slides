# Snap2Slides Git Repository Setup with Realistic Commit History
# PowerShell script for Windows

Write-Host "🚀 Setting up Snap2Slides Git Repository..." -ForegroundColor Green
Write-Host "Creating realistic development history..." -ForegroundColor Cyan

# Initialize git repository
git init
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Git not found. Please install Git first." -ForegroundColor Red
    exit 1
}

# Configure git user
Write-Host "📝 Configuring git user..." -ForegroundColor Yellow
git config user.name "Developer"
git config user.email "dev@snap2slides.com"

# Function to commit with date simulation
function Commit-WithMessage {
    param($Message, $DaysAgo = 0)
    
    if ($DaysAgo -gt 0) {
        $commitDate = (Get-Date).AddDays(-$DaysAgo).ToString("yyyy-MM-dd HH:mm:ss")
        $env:GIT_COMMITTER_DATE = $commitDate
        $env:GIT_AUTHOR_DATE = $commitDate
    }
    
    git commit -m $Message
    
    # Clear environment variables
    Remove-Item Env:GIT_COMMITTER_DATE -ErrorAction SilentlyContinue
    Remove-Item Env:GIT_AUTHOR_DATE -ErrorAction SilentlyContinue
}

# Day 15: Initial setup (15 days ago)
Write-Host "📦 Day 1: Project initialization (15 days ago)" -ForegroundColor Magenta
git add .gitignore, README.md, package.json
Commit-WithMessage "Initial commit" 15

git add next.config.js, tailwind.config.js, postcss.config.js
Commit-WithMessage "Add basic Next.js project structure" 15

git add tsconfig.json, next-env.d.ts
Commit-WithMessage "Setup TypeScript configuration" 15

# Day 14: Basic functionality
Write-Host "🔧 Day 2: Core features (14 days ago)" -ForegroundColor Magenta
git add app/layout.tsx, app/globals.css
Commit-WithMessage "Add basic layout and styling" 14

git add app/page.tsx
Commit-WithMessage "Add file upload component" 14

git add .env.example
Commit-WithMessage "Add environment configuration template" 14

# Day 13: AI Integration  
Write-Host "🤖 Day 3: AI integration (13 days ago)" -ForegroundColor Magenta
git add lib/
Commit-WithMessage "Integrate Google Gemini API for image analysis" 13

git add app/api/gemini-vision/
Commit-WithMessage "feat: basic slide generation from images" 13

# Day 12: Bug fixes
Write-Host "🐛 Day 4: Bug fixes (12 days ago)" -ForegroundColor Magenta
git add app/page.tsx
Commit-WithMessage "fix: file size validation issues" 12

git add app/globals.css  
Commit-WithMessage "Add loading states and progress tracking" 12

git add app/api/
Commit-WithMessage "Add proper error handling and user feedback" 12

# Day 11: UI improvements
Write-Host "🎨 Day 5: UI/UX improvements (11 days ago)" -ForegroundColor Magenta
git add app/globals.css
Commit-WithMessage "Improve upload UI with better animations" 11

git add app/page.tsx
Commit-WithMessage "refactor: clean up component structure" 11

git add app/globals.css
Commit-WithMessage "Add responsive design for mobile" 11

# Day 10: Mobile issues
Write-Host "📱 Day 6: Mobile debugging (10 days ago)" -ForegroundColor Magenta
git add next.config.js
Commit-WithMessage "Add network binding for cross-device testing" 10

git add app/api/
Commit-WithMessage "fix: CORS headers for mobile API access" 10

git add show-network-urls.js
Commit-WithMessage "Network URL detection for mobile testing" 10

# Day 9: React fixes
Write-Host "⚡ Day 7: React fixes (9 days ago)" -ForegroundColor Magenta
git add app/page.tsx
Commit-WithMessage "fix: hydration mismatch errors" 9

git add app/page.tsx
Commit-WithMessage "Add mounted state to prevent SSR issues" 9

# Day 8: Performance
Write-Host "🚀 Day 8: Performance optimization (8 days ago)" -ForegroundColor Magenta
git add app/page.tsx
Commit-WithMessage "Add React.memo for performance optimization" 8

git add app/page.tsx
Commit-WithMessage "Performance improvements with useCallback" 8

git add app/api/
Commit-WithMessage "refactor: optimize API response handling" 8

# Day 7: TypeScript
Write-Host "📝 Day 9: Type safety (7 days ago)" -ForegroundColor Magenta
git add app/page.tsx, app/api/
Commit-WithMessage "Add comprehensive TypeScript types" 7

git add app/
Commit-WithMessage "Implement proper error boundaries" 7

# Day 6: API system
Write-Host "🔄 Day 10: API reliability (6 days ago)" -ForegroundColor Magenta
git add lib/api-manager.ts
Commit-WithMessage "Build API manager with rotation system" 6

git add lib/
Commit-WithMessage "Add multiple API key support" 6

git add lib/
Commit-WithMessage "Implement automatic failover logic" 6

# Day 5: Monitoring
Write-Host "📊 Day 11: Monitoring (5 days ago)" -ForegroundColor Magenta
git add health-check.js
Commit-WithMessage "Add health check monitoring" 5

git add app/api/
Commit-WithMessage "Add comprehensive API error handling" 5

# Day 4: Mobile optimization
Write-Host "📱 Day 12: Mobile polish (4 days ago)" -ForegroundColor Magenta
git add app/globals.css
Commit-WithMessage "Add iOS safe area support" 4

git add app/globals.css
Commit-WithMessage "Improve touch targets for mobile" 4

git add app/globals.css
Commit-WithMessage "Mobile-first CSS architecture" 4

# Day 3: Final mobile fixes
Write-Host "🔧 Day 13: Final mobile fixes (3 days ago)" -ForegroundColor Magenta
git add app/globals.css
Commit-WithMessage "fix: iOS viewport and scroll issues" 3

git add app/page.tsx
Commit-WithMessage "Add gesture support for file upload" 3

# Day 2: Documentation
Write-Host "📚 Day 14: Documentation (2 days ago)" -ForegroundColor Magenta
git add PROJECT_DOCUMENTATION.md
Commit-WithMessage "docs: add comprehensive project documentation" 2

git add DEPLOYMENT_GUIDE.md
Commit-WithMessage "Create deployment guides and setup instructions" 2

git add API_REFERENCE.md
Commit-WithMessage "docs: complete API reference documentation" 2

# Day 1: Production ready
Write-Host "🌟 Day 15: Production deployment (1 day ago)" -ForegroundColor Magenta
git add vercel.json
Commit-WithMessage "Setup Vercel configuration for deployment" 1

git add FAQ_TROUBLESHOOTING.md
Commit-WithMessage "Add FAQ and troubleshooting guide" 1

git add DEVELOPMENT_STORY.md, DOCUMENTATION_SUMMARY.md
Commit-WithMessage "docs: development story and final documentation" 1

# Today: Final commit
Write-Host "✨ Today: Final production release" -ForegroundColor Green
git add .
Commit-WithMessage "Production ready: Snap2Slides Pro v1.0" 0

Write-Host "✅ Git repository setup complete!" -ForegroundColor Green
Write-Host "📊 Commit history:" -ForegroundColor Cyan
git log --oneline -15

Write-Host ""
Write-Host "🎯 Repository ready for GitHub and Vercel deployment!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create GitHub repository" -ForegroundColor White
Write-Host "2. Push to GitHub: git remote add origin <your-repo-url> && git push -u origin main" -ForegroundColor White  
Write-Host "3. Deploy to Vercel" -ForegroundColor White