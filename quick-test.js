const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

async function testFileUpload() {
    console.log('🧪 Testing large file upload functionality...\n');
    
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    try {
        const response = await fetch('http://localhost:3000');
        console.log(`✅ Server is running (Status: ${response.status})`);
    } catch (error) {
        console.log(`❌ Server not accessible: ${error.message}`);
        return;
    }
    
    // Test 2: Test API with small text file
    console.log('\n2. Testing API with text content...');
    try {
        const form = new FormData();
        form.append('file', Buffer.from('This is a test document with some content to analyze.'), {
            filename: 'test.txt',
            contentType: 'text/plain'
        });
        
            const response = await fetch('http://localhost:3003/api/gemini-vision', {
                method: 'POST',
                body: form,
                headers: form.getHeaders()
            });        const result = await response.text();
        console.log(`Response Status: ${response.status}`);
        console.log(`Response Body: ${result.substring(0, 500)}...`);
        
        if (response.ok) {
            console.log('✅ Text file processing works');
        } else {
            console.log('❌ Text file processing failed');
        }
    } catch (error) {
        console.log(`❌ API test failed: ${error.message}`);
    }
    
    // Test 3: Check environment variables
    console.log('\n3. Checking environment configuration...');
    const envFile = path.join(__dirname, '.env.local');
    if (fs.existsSync(envFile)) {
        const envContent = fs.readFileSync(envFile, 'utf8');
        const geminiKeys = envContent.match(/GEMINI_API_KEY/g);
        console.log(`✅ Environment file exists with ${geminiKeys ? geminiKeys.length : 0} Gemini keys`);
    } else {
        console.log('❌ .env.local file not found');
    }
    
    // Test 4: Test with actual PowerPoint file if available
    console.log('\n4. Testing with PowerPoint file...');
    const pptxFile = path.join(__dirname, 'temp.pptx');
    if (fs.existsSync(pptxFile)) {
        try {
            const stats = fs.statSync(pptxFile);
            console.log(`Found PowerPoint file: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
            
            const form = new FormData();
            form.append('file', fs.createReadStream(pptxFile));
            
            console.log('Uploading PowerPoint file...');
            const response = await fetch('http://localhost:3003/api/gemini-vision', {
                method: 'POST',
                body: form,
                headers: form.getHeaders()
            });
            
            const result = await response.text();
            console.log(`Response Status: ${response.status}`);
            
            if (response.ok) {
                console.log('✅ PowerPoint file processed successfully');
                console.log('Sample response:', result.substring(0, 300));
            } else {
                console.log('❌ PowerPoint processing failed');
                console.log('Error details:', result);
            }
        } catch (error) {
            console.log(`❌ PowerPoint test failed: ${error.message}`);
        }
    } else {
        console.log('No PowerPoint file found to test');
    }
    
    console.log('\n🔍 Test Summary Complete');
}

testFileUpload().catch(console.error);