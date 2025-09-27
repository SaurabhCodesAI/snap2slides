// Test script to verify the API Manager functionality
import { apiManager } from '../lib/api-manager.js';

async function testAPIManager() {
  console.log('🧪 Testing API Manager...\n');
  
  // Test 1: Get API Status
  console.log('1️⃣ Testing API Status:');
  const status = apiManager.getAPIStatus();
  console.log(`   Total APIs: ${status.length}`);
  console.log(`   Active APIs: ${status.filter(api => api.isActive).length}`);
  console.log(`   Inactive APIs: ${status.filter(api => !api.isActive).length}\n`);
  
  // Test 2: Test Gemini Image Analysis (will fail without API keys but shows structure)
  console.log('2️⃣ Testing Gemini Image Analysis Structure:');
  try {
    const imageBuffer = Buffer.from('test');
    const result = await apiManager.analyzeImageWithGemini(
      imageBuffer,
      'image/jpeg',
      'Test prompt'
    );
    console.log(`   Result: ${result.success ? 'Success' : 'Failed'}`);
    if (!result.success) {
      console.log(`   Error: ${result.error}`);
    }
  } catch (error) {
    console.log(`   Expected error (no API keys): ${error.message}`);
  }
  console.log();
  
  // Test 3: Test Perplexity Insights Structure
  console.log('3️⃣ Testing Perplexity Insights Structure:');
  try {
    const result = await apiManager.getInsightsWithPerplexity('Test query');
    console.log(`   Result: ${result.success ? 'Success' : 'Failed'}`);
    if (!result.success) {
      console.log(`   Error: ${result.error}`);
    }
  } catch (error) {
    console.log(`   Expected error (no API keys): ${error.message}`);
  }
  console.log();
  
  // Test 4: Show final status
  console.log('4️⃣ Final API Status:');
  const finalStatus = apiManager.getAPIStatus();
  finalStatus.forEach(api => {
    console.log(`   ${api.id}: ${api.isActive ? '✅ Active' : '❌ Inactive'} (Errors: ${api.errorCount})`);
  });
  
  console.log('\n✅ API Manager test completed!');
}

testAPIManager().catch(console.error);