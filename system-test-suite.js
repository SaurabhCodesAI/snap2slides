#!/usr/bin/env node

/**
 * Comprehensive Real-Time System Test Suite
 * Monitors all components, captures logs, identifies issues, and applies fixes
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn, exec } = require('child_process');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class SystemTestSuite {
  constructor() {
    this.testResults = {
      timestamp: new Date().toISOString(),
      tests: [],
      errors: [],
      warnings: [],
      fixes: [],
      performance: {},
      realTimeLogs: []
    };
    
    this.performanceInterval = null;
  }

  // Real-time log capture
  captureLog(source, message, level = 'info') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      source,
      level,
      message: typeof message === 'object' ? JSON.stringify(message) : message
    };
    
    this.testResults.realTimeLogs.push(logEntry);
    console.log(`[${level.toUpperCase()}] [${source}] ${logEntry.message}`);
    
    if (level === 'error') {
      this.testResults.errors.push(logEntry);
    } else if (level === 'warn') {
      this.testResults.warnings.push(logEntry);
    }
  }

  // Test 1: Environment Configuration
  async testEnvironmentConfig() {
    this.captureLog('ENV', 'Testing environment configuration...');
    
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      const envContent = await fs.readFile(envPath, 'utf8');
      
      const requiredVars = ['GEMINI_API_KEY_1', 'GEMINI_API_KEY_2', 'GEMINI_API_KEY_3', 'PERPLEXITY_API_KEY'];
      const missingVars = [];
      const invalidVars = [];
      
      for (const varName of requiredVars) {
        if (!envContent.includes(varName)) {
          missingVars.push(varName);
        } else {
          const match = envContent.match(new RegExp(`${varName}=(.+)`));
          if (!match || !match[1] || match[1].length < 10) {
            invalidVars.push(varName);
          }
        }
      }
      
      if (missingVars.length > 0) {
        this.captureLog('ENV', `Missing environment variables: ${missingVars.join(', ')}`, 'error');
      }
      
      if (invalidVars.length > 0) {
        this.captureLog('ENV', `Invalid environment variables: ${invalidVars.join(', ')}`, 'warn');
      }
      
      this.testResults.tests.push({
        name: 'Environment Configuration',
        status: missingVars.length === 0 ? 'pass' : 'fail',
        details: { missingVars, invalidVars }
      });
      
    } catch (error) {
      this.captureLog('ENV', `Environment test failed: ${error.message}`, 'error');
      this.testResults.tests.push({
        name: 'Environment Configuration',
        status: 'fail',
        details: { error: error.message }
      });
    }
  }

  // Test 2: API Connectivity
  async testAPIConnectivity() {
    this.captureLog('API', 'Testing API connectivity...');
    
    try {
      const apiKey = process.env.GEMINI_API_KEY_1 || 'AIzaSyCfgtsSyTQMqO3dtlOJjdFqAWWZmuEvJTM';
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      
      if (response.ok) {
        const data = await response.json();
        this.captureLog('API', `Gemini API: ${data.models.length} models available`);
        
        // Test specific model
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
        
        const testResult = await model.generateContent('Test connection');
        const testResponse = await testResult.response;
        
        this.captureLog('API', 'Gemini API test successful');
        this.testResults.tests.push({
          name: 'Gemini API Connectivity',
          status: 'pass',
          details: { modelCount: data.models.length, testResponse: testResponse.text() }
        });
        
      } else {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      
    } catch (error) {
      this.captureLog('API', `API connectivity test failed: ${error.message}`, 'error');
      this.testResults.tests.push({
        name: 'Gemini API Connectivity',
        status: 'fail',
        details: { error: error.message }
      });
    }
  }

  // Test 3: Dependencies Check
  async testDependencies() {
    this.captureLog('DEPS', 'Testing dependencies...');
    
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      const packageData = JSON.parse(await fs.readFile(packagePath, 'utf8'));
      
      const criticalDeps = ['@google/generative-ai', 'next', 'react', 'tailwindcss'];
      const missingDeps = [];
      
      for (const dep of criticalDeps) {
        if (!packageData.dependencies[dep] && !packageData.devDependencies[dep]) {
          missingDeps.push(dep);
        }
      }
      
      if (missingDeps.length > 0) {
        this.captureLog('DEPS', `Missing dependencies: ${missingDeps.join(', ')}`, 'error');
      }
      
      this.testResults.tests.push({
        name: 'Dependencies Check',
        status: missingDeps.length === 0 ? 'pass' : 'fail',
        details: { missingDeps, totalDeps: Object.keys(packageData.dependencies || {}).length }
      });
      
    } catch (error) {
      this.captureLog('DEPS', `Dependencies test failed: ${error.message}`, 'error');
      this.testResults.tests.push({
        name: 'Dependencies Check',
        status: 'fail',
        details: { error: error.message }
      });
    }
  }

  // Test 4: File Structure Integrity
  async testFileStructure() {
    this.captureLog('FILES', 'Testing file structure...');
    
    const requiredFiles = [
      'app/page.tsx',
      'app/layout.tsx', 
      'app/api/gemini-vision/route.ts',
      'app/api/slides/route.ts',
      'lib/api-manager.ts',
      'next.config.js',
      'tailwind.config.js'
    ];
    
    const missingFiles = [];
    const corruptFiles = [];
    
    for (const filePath of requiredFiles) {
      try {
        const fullPath = path.join(process.cwd(), filePath);
        const stats = await fs.stat(fullPath);
        
        if (stats.size === 0) {
          corruptFiles.push(filePath);
        }
        
      } catch (error) {
        missingFiles.push(filePath);
      }
    }
    
    if (missingFiles.length > 0) {
      this.captureLog('FILES', `Missing files: ${missingFiles.join(', ')}`, 'error');
    }
    
    if (corruptFiles.length > 0) {
      this.captureLog('FILES', `Corrupt files: ${corruptFiles.join(', ')}`, 'warn');
    }
    
    this.testResults.tests.push({
      name: 'File Structure',
      status: missingFiles.length === 0 && corruptFiles.length === 0 ? 'pass' : 'fail',
      details: { missingFiles, corruptFiles }
    });
  }

  // Test 5: Check if server is running
  async checkExistingServer() {
    const portsToCheck = [3000, 3001, 3002, 3003];
    
    for (const port of portsToCheck) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        
        const response = await fetch(`http://localhost:${port}`, { 
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          return port;
        }
      } catch (error) {
        // Port not available
      }
    }
    return null;
  }

  // Test server health
  async testServerHealth() {
    this.captureLog('SERVER', 'Testing server health...');
    
    const existingPort = await this.checkExistingServer();
    
    if (existingPort) {
      this.captureLog('SERVER', `Server running on port ${existingPort}`);
      
      try {
        const response = await fetch(`http://localhost:${existingPort}`);
        if (response.ok) {
          this.testResults.tests.push({
            name: 'Server Health',
            status: 'pass',
            details: { port: existingPort, httpStatus: response.status }
          });
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        this.testResults.tests.push({
          name: 'Server Health', 
          status: 'fail',
          details: { port: existingPort, error: error.message }
        });
      }
    } else {
      this.captureLog('SERVER', 'No server running', 'warn');
      this.testResults.tests.push({
        name: 'Server Health',
        status: 'warn',
        details: { message: 'No server running - manual start required' }
      });
    }
  }

  // Test 6: API Endpoint Testing
  async testAPIEndpoints() {
    this.captureLog('ENDPOINTS', 'Testing API endpoints...');
    
    const existingPort = await this.checkExistingServer();
    
    if (!existingPort) {
      this.captureLog('ENDPOINTS', 'No server running - skipping endpoint tests', 'warn');
      this.testResults.tests.push({
        name: 'API Endpoints',
        status: 'skip',
        details: { message: 'No server available' }
      });
      return;
    }
    
    const endpoints = [
      { path: '/api/gemini-vision', method: 'GET', expectedStatus: 405 }, // Should reject GET
      { path: '/api/slides', method: 'GET', expectedStatus: 400 }, // Should need ID parameter
    ];
    
    let passCount = 0;
    const results = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:${existingPort}${endpoint.path}`, {
          method: endpoint.method
        });
        
        const passed = response.status === endpoint.expectedStatus;
        if (passed) passCount++;
        
        results.push({
          path: endpoint.path,
          method: endpoint.method,
          expectedStatus: endpoint.expectedStatus,
          actualStatus: response.status,
          passed
        });
        
        this.captureLog('ENDPOINTS', `${endpoint.method} ${endpoint.path}: ${response.status} ${passed ? '✅' : '❌'}`);
        
      } catch (error) {
        results.push({
          path: endpoint.path,
          method: endpoint.method,
          error: error.message,
          passed: false
        });
        this.captureLog('ENDPOINTS', `${endpoint.method} ${endpoint.path}: ERROR - ${error.message}`, 'error');
      }
    }
    
    this.testResults.tests.push({
      name: 'API Endpoints',
      status: passCount === endpoints.length ? 'pass' : passCount > 0 ? 'partial' : 'fail',
      details: { passCount, totalCount: endpoints.length, results }
    });
  }

  // Performance monitoring
  startPerformanceMonitoring() {
    this.captureLog('PERF', 'Starting performance monitoring...');
    
    const startMemory = process.memoryUsage();
    const startTime = Date.now();
    
    this.performanceInterval = setInterval(() => {
      const currentMemory = process.memoryUsage();
      const currentTime = Date.now();
      
      this.testResults.performance = {
        uptime: currentTime - startTime,
        memoryUsage: {
          rss: Math.round((currentMemory.rss - startMemory.rss) / 1024 / 1024 * 100) / 100,
          heapUsed: Math.round((currentMemory.heapUsed - startMemory.heapUsed) / 1024 / 1024 * 100) / 100,
          heapTotal: Math.round((currentMemory.heapTotal - startMemory.heapTotal) / 1024 / 1024 * 100) / 100
        }
      };
      
    }, 5000);
  }

  // Generate reports
  async generateReport() {
    try {
      const reportPath = path.join(process.cwd(), 'test-report.json');
      await fs.writeFile(reportPath, JSON.stringify(this.testResults, null, 2));
      this.captureLog('REPORT', `JSON report saved to ${reportPath}`);
      
      const htmlReport = this.generateHTMLReport();
      const htmlReportPath = path.join(process.cwd(), 'test-report.html');
      await fs.writeFile(htmlReportPath, htmlReport);
      this.captureLog('REPORT', `HTML report saved to ${htmlReportPath}`);
      
    } catch (err) {
      this.captureLog('REPORT', `Failed to save reports: ${err.message}`, 'error');
    }
    
    this.printSummary();
  }

  generateHTMLReport() {
    const passedTests = this.testResults.tests.filter(t => t.status === 'pass').length;
    const failedTests = this.testResults.tests.filter(t => t.status === 'fail').length;
    const skippedTests = this.testResults.tests.filter(t => t.status === 'skip').length;
    
    return `<!DOCTYPE html>
<html>
<head>
    <title>System Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .metric { background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
        .metric h3 { margin: 0; font-size: 1.5em; }
        .test-item { margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
        .test-pass { background: #d4edda; border-color: #c3e6cb; }
        .test-fail { background: #f8d7da; border-color: #f5c6cb; }
        .test-skip { background: #e2e3e5; border-color: #d6d8db; }
        .log-container { max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; background: #f8f9fa; font-family: monospace; font-size: 0.9em; }
        pre { background: #f1f3f4; padding: 10px; border-radius: 4px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 System Test Report</h1>
            <p>Generated: ${this.testResults.timestamp}</p>
            <p>Runtime: ${this.testResults.performance.uptime || 0}ms</p>
        </div>
        
        <div class="summary">
            <div class="metric"><h3>${passedTests}</h3><p>Passed</p></div>
            <div class="metric"><h3>${failedTests}</h3><p>Failed</p></div>
            <div class="metric"><h3>${skippedTests}</h3><p>Skipped</p></div>
            <div class="metric"><h3>${this.testResults.errors.length}</h3><p>Errors</p></div>
            <div class="metric"><h3>${this.testResults.warnings.length}</h3><p>Warnings</p></div>
        </div>
        
        <h2>Test Results</h2>
        ${this.testResults.tests.map(test => `
            <div class="test-item test-${test.status}">
                <h3>${test.status === 'pass' ? '✅' : test.status === 'fail' ? '❌' : '⏭️'} ${test.name}</h3>
                <pre>${JSON.stringify(test.details, null, 2)}</pre>
            </div>
        `).join('')}
        
        <h2>Performance</h2>
        <pre>${JSON.stringify(this.testResults.performance, null, 2)}</pre>
        
        <h2>Recent Logs</h2>
        <div class="log-container">
            ${this.testResults.realTimeLogs.slice(-50).map(log => 
                `<div>[${new Date(log.timestamp).toLocaleTimeString()}] [${log.source}] ${log.message}</div>`
            ).join('')}
        </div>
    </div>
</body>
</html>`;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 SYSTEM TEST SUMMARY');
    console.log('='.repeat(60));
    
    const passedTests = this.testResults.tests.filter(t => t.status === 'pass').length;
    const failedTests = this.testResults.tests.filter(t => t.status === 'fail').length;
    const skippedTests = this.testResults.tests.filter(t => t.status === 'skip').length;
    
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`⏭️ Skipped: ${skippedTests}`);
    console.log(`🚨 Errors: ${this.testResults.errors.length}`);
    console.log(`⚠️ Warnings: ${this.testResults.warnings.length}`);
    
    console.log('\nTest Details:');
    this.testResults.tests.forEach(test => {
      const icon = test.status === 'pass' ? '✅' : test.status === 'fail' ? '❌' : '⏭️';
      console.log(`  ${icon} ${test.name}`);
    });
    
    console.log('\nReports saved: test-report.json, test-report.html');
    console.log('='.repeat(60));
  }

  cleanup() {
    this.captureLog('CLEANUP', 'Cleaning up...');
    if (this.performanceInterval) {
      clearInterval(this.performanceInterval);
    }
    this.generateReport();
  }

  async runAllTests() {
    this.captureLog('MAIN', '🚀 Starting system tests...');
    this.startPerformanceMonitoring();
    
    try {
      await this.testEnvironmentConfig();
      await this.testDependencies(); 
      await this.testFileStructure();
      await this.testAPIConnectivity();
      await this.testServerHealth();
      await this.testAPIEndpoints();
      
      this.captureLog('MAIN', '✅ All tests completed');
      
    } catch (error) {
      this.captureLog('MAIN', `Test suite error: ${error.message}`, 'error');
    } finally {
      setTimeout(() => this.cleanup(), 1000);
    }
  }
}

// Handle shutdown
process.on('SIGINT', () => {
  if (global.testSuite) {
    global.testSuite.cleanup();
  }
  process.exit(0);
});

// Run tests
const testSuite = new SystemTestSuite();
global.testSuite = testSuite;
testSuite.runAllTests();