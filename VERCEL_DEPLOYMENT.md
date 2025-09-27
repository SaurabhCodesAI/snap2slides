# 🚀 Vercel Deployment Guide

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SaurabhCodesAI/snap2slides&env=GOOGLE_API_KEY&envDescription=Google%20Gemini%20API%20Key&envLink=https://aistudio.google.com/app/apikey)

## Manual Deployment Steps

### 1. Import Project to Vercel

1. Visit [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import from GitHub: `https://github.com/SaurabhCodesAI/snap2slides`
4. Vercel will auto-detect this as a Next.js project

### 2. Configure Environment Variables

In your Vercel project settings, add:

```bash
GOOGLE_API_KEY=your_gemini_api_key_here
```

**Get your API key:**
- Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new API key
- Copy and paste into Vercel environment variables

### 3. Deploy

Click **"Deploy"** - Vercel will:
- Install dependencies
- Run build process
- Deploy to global CDN
- Provide you with a live URL

### 4. Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## 🔧 Build Configuration

The project includes `vercel.json` with optimized settings:
- Extended timeouts for AI processing
- CORS headers for API routes
- Build and output configurations

## 📊 Performance Optimizations

- **Function Timeout**: 300 seconds for AI processing
- **Edge Optimization**: Static assets served from CDN
- **Automatic Compression**: Built-in Gzip compression
- **Tree Shaking**: Unused code elimination

## 🔍 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GOOGLE_API_KEY` | Google Gemini AI API Key | ✅ | `AIza...` |
| `NODE_ENV` | Environment mode | ❌ | `production` |

## 🚨 Important Notes

1. **API Costs**: Monitor your Google AI usage in the Google Cloud Console
2. **Rate Limits**: Gemini API has usage quotas - consider implementing rate limiting
3. **File Sizes**: Current limit is 10MB per image - adjust in API routes if needed
4. **Security**: Never commit API keys to version control

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Google AI Studio](https://aistudio.google.com/)
- [Project Repository](https://github.com/SaurabhCodesAI/snap2slides)

## 📈 Post-Deployment

After successful deployment:

1. **Test the application** with sample images
2. **Monitor performance** in Vercel Analytics
3. **Check API usage** in Google Cloud Console
4. **Set up monitoring** for error tracking

---

**Your Snap2Slides Pro app will be live at:** `https://your-project-name.vercel.app`