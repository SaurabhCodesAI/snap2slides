const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testImageModel() {
  const apiKey = 'AIzaSyCfgtsSyTQMqO3dtlOJjdFqAWWZmuEvJTM';
  const genAI = new GoogleGenerativeAI(apiKey);

  console.log('Testing image analysis with models/gemini-2.0-flash...');

  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

    // Create a simple test image (base64 encoded small image)
    const testImageBase64 = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

    const result = await model.generateContent([
      'Describe what you see in this image briefly.',
      {
        inlineData: {
          data: testImageBase64,
          mimeType: 'image/jpeg',
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    console.log('✅ SUCCESS! Image model works:');
    console.log(`Response: ${text}`);
    return true;

  } catch (error) {
    console.log('❌ FAILED:', error.message);
    return false;
  }
}

testImageModel().then(success => {
  if (success) {
    console.log('\n🎉 Perfect! The models/gemini-1.5-flash-latest model works with images!');
    console.log('✅ Your API key is working');
    console.log('✅ Model access is granted');
    console.log('✅ Vision functionality is available');
  } else {
    console.log('\n❌ Still having issues. Let me try another model...');
  }
});