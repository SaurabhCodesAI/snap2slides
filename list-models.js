async function listAvailableModels() {
  const apiKey = 'AIzaSyCfgtsSyTQMqO3dtlOJjdFqAWWZmuEvJTM';
  
  console.log('Listing available models via REST API...');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    
    console.log('\n✅ Available models:');
    data.models.forEach(model => {
      console.log(`- ${model.name}`);
      if (model.supportedGenerationMethods?.includes('generateContent')) {
        console.log(`  ✅ Supports generateContent`);
      }
      if (model.inputTokenLimit) {
        console.log(`  📊 Input limit: ${model.inputTokenLimit} tokens`);
      }
    });
    
    // Find vision-capable models
    const visionModels = data.models.filter(m => 
      m.name.includes('vision') || 
      m.name.includes('flash') ||
      (m.supportedGenerationMethods?.includes('generateContent') && m.name.includes('pro'))
    );
    
    console.log('\n📸 Vision-capable models:');
    visionModels.forEach(model => {
      console.log(`- ${model.name} (${model.displayName})`);
    });
    
    return visionModels[0]?.name; // Return first working vision model
    
  } catch (error) {
    console.error('❌ Failed to list models:', error.message);
    
    if (error.message.includes('403')) {
      console.log('\n💡 API not enabled. Enable it at:');
      console.log('https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    }
  }
}

listAvailableModels().then(model => {
  if (model) {
    console.log(`\n🎉 Use this model in your code: ${model}`);
  }
});