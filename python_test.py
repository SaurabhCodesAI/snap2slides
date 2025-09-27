#!/usr/bin/env python3
import requests
import json
import os
import time

def test_api():
    print("🧪 Testing Snap2Slides API functionality...")
    print("=" * 50)
    
    # Test 1: Server connectivity
    print("\n1. Testing server connectivity...")
    try:
        response = requests.get("http://localhost:3000", timeout=10)
        print(f"✅ Server responded with status {response.status_code}")
        if response.status_code == 200:
            print("✅ Server is running properly")
        else:
            print(f"⚠️  Server responded but with status {response.status_code}")
    except Exception as e:
        print(f"❌ Server not accessible: {e}")
        return False
    
    # Test 2: API endpoint test
    print("\n2. Testing API endpoint...")
    try:
        response = requests.get("http://localhost:3000/api/gemini-vision", timeout=10)
        print(f"API endpoint response: {response.status_code}")
        if response.status_code == 405:
            print("✅ API endpoint exists (returns 405 for GET, expects POST)")
        else:
            print(f"⚠️  Unexpected response: {response.status_code}")
    except Exception as e:
        print(f"❌ API endpoint test failed: {e}")
    
    # Test 3: File upload test
    print("\n3. Testing file upload...")
    try:
        # Create test content
        test_content = """
        Sample Document Content for Slide Generation
        
        Introduction
        This is a test document to verify that our AI slide generation system works properly.
        
        Key Points:
        - Feature 1: AI-powered content analysis
        - Feature 2: Professional slide generation
        - Feature 3: Multiple format support
        
        Technical Details:
        - Uses Google Gemini AI
        - Supports large files up to 50MB
        - Generates JSON-structured slide data
        
        Conclusion
        This system should generate professional slides from this content.
        """
        
        files = {'file': ('test.txt', test_content, 'text/plain')}
        
        print("📤 Uploading test file...")
        response = requests.post(
            "http://localhost:3000/api/gemini-vision", 
            files=files, 
            timeout=30
        )
        
        print(f"Upload response status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ File upload successful")
            try:
                result = response.json()
                print("✅ Valid JSON response received")
                
                if 'slides' in result:
                    slide_count = len(result['slides'])
                    print(f"✅ Generated {slide_count} slides")
                    
                    if slide_count > 0:
                        print("\n📋 Sample slides:")
                        for i, slide in enumerate(result['slides'][:3]):
                            title = slide.get('title', 'Untitled')
                            print(f"  {i+1}. {title}")
                        
                        if slide_count == 0:
                            print("❌ CRITICAL ISSUE: 0 slides generated!")
                            print("This explains why you're seeing '0 professional slides generated'")
                    else:
                        print("❌ CRITICAL ISSUE: No slides in response!")
                else:
                    print("❌ CRITICAL ISSUE: No 'slides' field in response!")
                    print("Response structure:", list(result.keys()) if isinstance(result, dict) else "Not a dict")
                
            except json.JSONDecodeError:
                print("❌ Response is not valid JSON")
                print("Raw response (first 500 chars):", response.text[:500])
        else:
            print(f"❌ File upload failed with status {response.status_code}")
            print("Response:", response.text[:500])
            
    except Exception as e:
        print(f"❌ File upload test failed: {e}")
    
    # Test 4: PowerPoint file test (if available)
    print("\n4. Testing PowerPoint file (if available)...")
    pptx_path = "temp.pptx"
    if os.path.exists(pptx_path):
        try:
            file_size = os.path.getsize(pptx_path)
            print(f"Found PowerPoint file: {file_size / (1024*1024):.2f} MB")
            
            if file_size > 50 * 1024 * 1024:
                print("⚠️  File too large (>50MB), skipping")
            else:
                print("📤 Uploading PowerPoint file...")
                with open(pptx_path, 'rb') as f:
                    files = {'file': ('temp.pptx', f, 'application/vnd.openxmlformats-officedocument.presentationml.presentation')}
                    response = requests.post(
                        "http://localhost:3000/api/gemini-vision", 
                        files=files, 
                        timeout=60
                    )
                
                print(f"PowerPoint upload status: {response.status_code}")
                if response.status_code == 200:
                    try:
                        result = response.json()
                        slide_count = len(result.get('slides', []))
                        print(f"✅ PowerPoint processed: {slide_count} slides generated")
                        if slide_count == 0:
                            print("❌ MAIN ISSUE IDENTIFIED: PowerPoint processing generates 0 slides!")
                    except:
                        print("❌ PowerPoint response parsing failed")
                        print("Response:", response.text[:300])
                else:
                    print(f"❌ PowerPoint upload failed: {response.status_code}")
                    print("Error:", response.text[:300])
        except Exception as e:
            print(f"❌ PowerPoint test failed: {e}")
    else:
        print("No PowerPoint file found for testing")
    
    print("\n" + "=" * 50)
    print("🔍 DIAGNOSTIC SUMMARY")
    print("=" * 50)
    print("If you're seeing '0 professional slides generated', the issue is likely:")
    print("1. API not returning proper slide structure")
    print("2. Gemini AI not generating the expected JSON format")
    print("3. File processing pipeline has a bug")
    print("\nNext steps: Check the API logs and Gemini response format")

if __name__ == "__main__":
    test_api()