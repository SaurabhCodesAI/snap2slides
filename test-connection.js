const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testBasicConnection() {
  const apiKey = 'AIzaSyCfgtsSyTQMqO3dtlOJjdFqAWWZmuEvJTM';
  console.log('Testing basic Gemini connectivity...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test basic text generation first
    console.log('\n1. Testing basic text model...');
    const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const textResult = await textModel.generateContent('Say hello');
    const textResponse = await textResult.response;
    console.log(`✅ Basic text model works: ${textResponse.text()}`);
    
    // Test vision models
    console.log('\n2. Testing vision models...');
    const visionModels = [
      'gemini-pro-vision',
      'gemini-1.5-flash', 
      'gemini-1.5-pro',
      'gemini-1.0-pro-vision'
    ];
    
    for (const modelName of visionModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        console.log(`✅ Model available: ${modelName}`);
      } catch (e) {
        console.log(`❌ Model unavailable: ${modelName} - ${e.message.substring(0, 50)}...`);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    
    if (error.message.includes('403')) {
      console.log('\n💡 Possible solutions:');
      console.log('- Enable Generative AI API in Google Cloud Console');
      console.log('- Check if API key is from the correct project');
      console.log('- Verify billing is enabled');
    }
    
    if (error.message.includes('401')) {
      console.log('\n💡 API Key Issues:');
      console.log('- API key might be invalid or expired');
      console.log('- Check if API key has proper permissions');
    }
  }
}

testBasicConnection();