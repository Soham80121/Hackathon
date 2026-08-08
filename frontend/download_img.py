import urllib.request
import re

url = 'https://ibb.co/RGpV8WGz'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
        # imgbb usually has a direct link inside a meta tag or link rel='image_src'
        match = re.search(r'<link rel="image_src" href="(.*?)"', html)
        if match:
            direct_url = match.group(1)
            print('Found image URL:', direct_url)
            
            # Download the image
            req2 = urllib.request.Request(direct_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req2) as resp2, open('c:\\Users\\ksoha\\Hackathon\\frontend\\public\\logo.png', 'wb') as f:
                f.write(resp2.read())
            print('Successfully downloaded and saved logo.png')
        else:
            print('Could not find direct image URL')
except Exception as e:
    print('Error:', e)
