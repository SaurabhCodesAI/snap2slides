# Contributing to Snap2Slides

Thank you for your interest in contributing to Snap2Slides! This project was built as a learning journey, and I welcome contributions that help improve the application.

## 🚀 Quick Start for Contributors

1. Fork the repository: `https://github.com/SaurabhCodesAI/snap2slides`
2. Clone your fork: `git clone https://github.com/your-username/snap2slides.git`
3. Install dependencies: `npm install`
4. Set up environment variables (see `.env.example`)
5. Run development server: `npm run dev`

## 📋 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing code formatting (Prettier/ESLint configured)
- Add meaningful comments for complex logic
- Use semantic commit messages

### Testing
- Test your changes with various file types (PDF, images, documents)
- Verify mobile compatibility
- Check that the admin dashboard still works
- Test error handling scenarios

### Documentation
- Update README if adding new features
- Add inline documentation for new functions
- Update API documentation if modifying endpoints

## 🎯 Areas for Contribution

### High Priority
- [ ] Additional file format support (Excel, CSV)
- [ ] Slide template customization options
- [ ] Batch file processing
- [ ] Performance optimizations

### Medium Priority  
- [ ] Dark/light theme toggle
- [ ] User authentication system
- [ ] File history and management
- [ ] Advanced AI prompt customization

### Low Priority
- [ ] Internationalization (i18n)
- [ ] Analytics and usage tracking
- [ ] Social sharing features
- [ ] API rate limiting dashboard

## 🐛 Reporting Issues

When reporting issues, please include:
- Steps to reproduce the problem
- Expected vs actual behavior
- Screenshots or videos if applicable
- Browser and device information
- File type and size if relevant

## 💡 Feature Requests

Before submitting feature requests:
- Check existing issues to avoid duplicates
- Explain the use case and expected benefit
- Consider backward compatibility
- Think about mobile/accessibility implications

## 📝 Pull Request Process

1. **Create an Issue First**: Discuss significant changes before coding
2. **Branch Naming**: Use descriptive names (`feature/batch-processing`, `fix/mobile-upload`)
3. **Commit Messages**: Follow conventional commits format
4. **Testing**: Ensure all functionality works as expected
5. **Documentation**: Update relevant docs and comments

### Example Commit Messages
```
feat: add batch file processing capability
fix: resolve mobile upload CORS issue
docs: update API documentation for new endpoints
refactor: optimize React components with memo
```

## 🔧 Development Environment

### Required Environment Variables
```bash
GEMINI_API_KEY_1=your_primary_gemini_key
GEMINI_API_KEY_2=your_backup_gemini_key  
GEMINI_API_KEY_3=your_third_gemini_key
PERPLEXITY_API_KEY=your_perplexity_key (optional)
```

### Available Scripts
- `npm run dev` - Development server
- `npm run dev:network` - Network-accessible development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## 🤝 Code of Conduct

This project follows a simple code of conduct:
- Be respectful and constructive in discussions
- Help create a welcoming environment for all skill levels
- Focus on what's best for the community and project
- Show empathy towards other community members

## 📞 Getting Help

- **GitHub Issues**: For bugs, features, and technical questions
- **GitHub Discussions**: For general questions and ideas
- **Email**: saurabhcodesai@example.com (replace with actual email)

## 🏆 Recognition

Contributors will be:
- Added to the README contributors section
- Mentioned in release notes for significant contributions
- Given credit in commit messages and documentation

## 🎓 Learning Opportunities

This project is great for learning:
- **Next.js 14** with App Router and TypeScript
- **AI Integration** with Google Gemini API
- **Mobile-First Development** and responsive design
- **Production Deployment** with Vercel
- **Error Handling** and resilient system design

Feel free to use this project as a learning resource, and don't hesitate to ask questions!

---

**Note**: This project was built as a genuine learning journey over 3 weeks. The commit history reflects real development challenges and solutions, making it a great reference for understanding real-world development processes.