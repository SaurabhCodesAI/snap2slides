const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY_1 || 'AIzaSyCfgtsSyTQMqO3dtlOJjdFqAWWZmuEvJTM';
  const genAI = new GoogleGenerativeAI(apiKey);

  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-pro-vision',
    'gemini-1.0-pro-vision-latest',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro',
    'models/gemini-pro'
  ];

  console.log('Testing Gemini models...');
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`\nTesting: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Try a simple text generation to test if model works
      const result = await model.generateContent('Say "hello"');
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} - WORKS! Response: ${text.substring(0, 50)}...`);
      return modelName; // Return first working model
      
    } catch (error) {
      console.log(`❌ ${modelName} - ERROR: ${error.message}`);
    }
  }
  
  console.log('\n❌ No working models found!');
  return null;
}

testModels().then(workingModel => {
  if (workingModel) {
    console.log(`\n🎉 Use this model: ${workingModel}`);
  } else {
    console.log('\n💡 Try checking your API key or project permissions');
  }
}).catch(err => {
  console.error('Test failed:', err);
});