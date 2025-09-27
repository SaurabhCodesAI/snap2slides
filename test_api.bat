@echo off
echo Testing Snap2Slides API functionality...
echo.

echo 1. Testing server connectivity...
curl -s -w "Server Status: %%{http_code}\n" http://localhost:3000 > nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Server is running
) else (
    echo ❌ Server not accessible
    goto :end
)

echo.
echo 2. Testing API endpoint with GET request...
curl -s -w "API GET Status: %%{http_code}\n" http://localhost:3000/api/gemini-vision > nul

echo.
echo 3. Creating test file for upload...
echo This is a test document with content for slide generation. > test_upload.txt
echo Key Features: >> test_upload.txt
echo - AI-powered analysis >> test_upload.txt
echo - Professional slide generation >> test_upload.txt
echo - Multiple file format support >> test_upload.txt

echo.
echo 4. Testing file upload...
curl -X POST -F "file=@test_upload.txt" -w "Upload Status: %%{http_code}\n" http://localhost:3000/api/gemini-vision

echo.
echo Test completed. Check the output above for any issues.

:end
pause