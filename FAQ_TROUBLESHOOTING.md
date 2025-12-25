# Snap2Slides Pro - FAQ & Troubleshooting

## 🤔 Frequently Asked Questions

### General Questions

**Q: What is Snap2Slides Pro?**
A: Snap2Slides Pro is an AI-powered presentation generator that transforms images, PDFs, and documents into professional presentation slides using Google's Gemini Vision API. It features a mobile-responsive design, real-time processing, and cross-device compatibility.

**Q: What file types are supported?**
A: The application supports:
- Images: JPG, PNG, WebP, GIF
- Documents: PDF, Word (.docx), PowerPoint (.pptx)
- Text files: TXT, RTF
- Maximum file size: 50MB

**Q: Is it mobile-friendly?**
A: Yes! The application is built with a mobile-first approach and has been extensively tested on various devices. It includes touch-optimized interfaces, responsive design, and network access for cross-device testing.

### Technical Questions

**Q: What technologies power Snap2Slides Pro?**
A: 
- **Frontend**: Next.js 14.2.33 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **AI**: Google Gemini Vision API
- **Performance**: React optimizations, SWC compiler, code splitting
- **Network**: CORS-enabled APIs for cross-device access

**Q: How does the AI analysis work?**
A: The system uses Google's Gemini Vision API to analyze uploaded content, extract key information, and generate structured presentation content. It includes intelligent content categorization, key point extraction, and slide layout suggestions.

**Q: Is the application secure?**
A: Yes, security measures include:
- Input validation and file type restrictions
- File size limits and content verification
- API timeout protection
- Environment variable security
- CORS policy configuration

### Development Questions

**Q: How do I set up the development environment?**
A:
```bash
git clone [repository]
cd snap2slides
npm install
npm run dev:network  # For network access testing
```

**Q: What are the system requirements?**
A:
- Node.js 18 or higher
- npm (latest version)
- Google Gemini API key
- Modern web browser
- Network connectivity

**Q: How do I enable mobile testing during development?**
A: Use `npm run dev:network` to start the server with network binding. This allows access via IP addresses like `http://192.168.1.100:3000` from mobile devices on the same WiFi network.

---

## 🚨 Common Issues & Solutions

### Development Issues

**Issue: Server won't start**
```
Error: Port 3000 already in use
```
**Solution:**
```bash
# Kill existing processes
taskkill /F /IM node.exe
# Or use different port
npm run dev -- --port 3001
```

**Issue: CORS errors on mobile**
```
Failed to fetch: Access-Control-Allow-Origin
```
**Solution:**
- Ensure CORS headers are configured in API routes
- Verify server is started with `--hostname 0.0.0.0`
- Check that mobile device is on same WiFi network

**Issue: TypeScript compilation errors**
```
Type 'File | null' is not assignable to type 'File'
```
**Solution:**
```typescript
// Add proper null checking
if (file) {
  // Process file
}
```

### Build & Deployment Issues

**Issue: Build fails with memory error**
```
FATAL ERROR: Ineffective mark-compacts near heap limit
```
**Solution:**
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**Issue: Environment variables not working**
**Solution:**
- Verify `.env.local` file exists in development
- For Vercel, set variables in dashboard
- Ensure variable names match exactly
- Redeploy after variable changes

**Issue: API routes return 404 in production**
**Solution:**
- Verify file structure: `app/api/[route]/route.ts`
- Check export names: `export async function POST`
- Ensure proper Next.js API route structure

### Runtime Issues

**Issue: File upload fails**
```
File size must be less than 50MB
```
**Solution:**
- Check file size before upload
- Verify file type is supported
- Ensure stable network connection
- Try smaller files for testing

**Issue: Slow performance on mobile**
**Solution:**
- Enable compression in `next.config.js`
- Optimize images using Next.js Image component
- Implement lazy loading for non-critical components
- Use React.memo for expensive components

**Issue: Hydration mismatch errors**
```
Unhandled Runtime Error: Hydration failed
```
**Solution:**
- Add `mounted` state check:
```typescript
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return <div>Loading...</div>;
```

### API Issues

**Issue: Google Gemini API quota exceeded**
```
Error: Quota exceeded
```
**Solution:**
- The app includes graceful degradation with demo content
- Upgrade to paid Google Cloud account
- Wait for quota reset (daily limits)
- Implement caching for repeated requests

**Issue: Network timeout errors**
```
Request timeout after 5 minutes
```
**Solution:**
- Reduce file size
- Check network stability
- Verify API key is valid
- Implement retry logic for failed requests

---

## 🛠️ Debugging Tools

### Browser Developer Tools
- **Network Tab**: Monitor API requests and responses
- **Console**: View JavaScript errors and logs
- **Application Tab**: Check localStorage and service workers
- **Performance Tab**: Analyze rendering performance

### Next.js Debugging
- **Built-in Error Overlay**: Shows detailed error information
- **Source Maps**: Enable debugging of TypeScript code
- **Performance Profiler**: React DevTools integration
- **Network Inspector**: API route debugging

### Performance Monitoring
```javascript
// Add to components for performance tracking
const startTime = performance.now();
// Component logic here
const endTime = performance.now();
console.log(`Render time: ${endTime - startTime}ms`);
```

### API Testing
```bash
# Test API endpoints directly
curl -X POST http://localhost:3000/api/slides \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

---

## 📊 Performance Optimization

### Bundle Size Optimization
```javascript
// Use dynamic imports for code splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
});
```

### Image Optimization
```javascript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true}
/>
```

### API Optimization
```typescript
// Implement caching for API responses
const cache = new Map();

export async function GET(request: NextRequest) {
  const cacheKey = generateCacheKey(request);
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const response = await processRequest(request);
  cache.set(cacheKey, response);
  
  return response;
}
```

---

## 🔧 Configuration Examples

### Vercel Configuration
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 300
    }
  }
}
```

### Environment Variables
```bash
# .env.local (development)
GOOGLE_API_KEY=your_development_api_key
NODE_ENV=development

# .env.example (template)
GOOGLE_API_KEY=your_google_gemini_api_key_here
NODE_ENV=production
```

### Next.js Configuration
```javascript
// next.config.js optimization example
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    scrollRestoration: true
  },
  compress: true,
  poweredByHeader: false,
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif']
  }
};
```

---

## 📞 Getting Help

### Documentation Resources
- **Project Documentation**: `/PROJECT_DOCUMENTATION.md`
- **Deployment Guide**: `/DEPLOYMENT_GUIDE.md`
- **API Documentation**: Inline code comments
- **Component Documentation**: JSDoc annotations

### Community Support
- **GitHub Issues**: Report bugs and request features
- **Stack Overflow**: Technical implementation questions
- **Next.js Documentation**: Framework-specific help
- **Vercel Documentation**: Deployment assistance

### Professional Support
- **Code Review**: Available for deployment assistance
- **Performance Optimization**: Custom optimization services
- **Feature Development**: Custom feature implementation
- **Training**: Team training on codebase

---

This comprehensive FAQ and troubleshooting guide should help address any questions during development, deployment, and ongoing maintenance.