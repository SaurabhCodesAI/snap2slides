# Security Policy

## Reporting Security Vulnerabilities

The security of Snap2Slides is important to us. If you discover a security vulnerability, please follow these steps:

### 🔒 Private Disclosure

**Please do NOT create a public GitHub issue for security vulnerabilities.**

Instead, please email: **security@saurabhcodesai.com** (or create the email you prefer)

### 📋 What to Include

When reporting a security issue, please provide:

1. **Description**: Clear description of the vulnerability
2. **Steps to Reproduce**: Detailed steps to reproduce the issue  
3. **Impact Assessment**: Your assessment of the potential impact
4. **Proof of Concept**: If applicable, include a minimal proof of concept
5. **Suggested Fix**: If you have ideas for fixing the issue

### ⏰ Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Based on severity (1-30 days)

### 🛡️ Security Measures in Place

This project implements several security measures:

#### Input Validation
- File type restrictions (images, PDFs, documents only)
- File size limits (50MB maximum)
- Content-type validation
- Malicious file detection

#### API Security
- Environment variable protection for API keys
- Request timeout limits
- Rate limiting considerations
- CORS policy configuration

#### Data Handling
- No persistent storage of user files
- Temporary processing with cleanup
- No user authentication data stored
- API keys properly secured

### 🔍 Known Security Considerations

#### File Upload Risks
- **Mitigation**: Strict file type validation and size limits
- **Status**: Actively monitored

#### API Key Exposure
- **Mitigation**: Environment variables, no client-side exposure
- **Status**: Secure implementation

#### Cross-Site Scripting (XSS)
- **Mitigation**: React's built-in XSS protection, input sanitization
- **Status**: Framework-level protection in place

### 📊 Scope

This security policy covers:
- The main application at `https://snap2slides.vercel.app`
- The source code in this repository
- API endpoints and data processing
- File upload and handling mechanisms

### 🚫 Out of Scope

The following are considered out of scope:
- Third-party services (Google Gemini API, Vercel infrastructure)
- Social engineering attacks
- Physical security of development machines
- Denial of service attacks on free-tier hosting

### 🏆 Recognition

Security researchers who report valid vulnerabilities will be:
- Credited in our security acknowledgments (if desired)
- Mentioned in release notes for fixes
- Given priority support for any questions

### 📝 Security Updates

Security updates will be:
- Released as soon as possible after confirmation
- Documented in GitHub releases
- Communicated through appropriate channels
- Applied to both the live application and source code

### 🤝 Responsible Disclosure

We are committed to:
- Responding promptly to security reports
- Keeping reporters informed of our progress
- Crediting researchers appropriately
- Maintaining transparency about security issues (after resolution)

### 📞 Contact Information

- **Security Email**: security@saurabhcodesai.com
- **General Issues**: GitHub Issues (for non-security matters)
- **Project Maintainer**: @SaurabhCodesAI

---

**Note**: This is an open-source project built as a learning exercise. While we take security seriously, please use appropriate judgment when processing sensitive documents through any online service.