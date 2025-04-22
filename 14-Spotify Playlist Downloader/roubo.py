import requests
import subprocess
import sys
import time

modules = {}
def install(package):
    print("Installing missing dependency:", package)
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])

print("Checking for all dependencies")
required = ["requests", "subprocess", "sys", "spotdl", "pyfiglet"]
for pkg in required:
    try:
        modules[pkg] = __import__(pkg)
    except ImportError:
        install(pkg)
        print("Installed package", pkg)
        modules[pkg] = __import__(pkg)

token = 12345
# put your spotify token here. Ik its not really usable therefore, but
# I plan to later add a way to automatically get a token from a ghost
# account

ascii_art = modules["pyfiglet"].figlet_format("Senhor Roubador")
print(ascii_art)



print("Please paste the link of the playlist you want to download")
id = input()

id = id[(id.find("playlist/")+9):]
id = id[:id.find("?")]
print("Playlist id:",id)


headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

urls = []
offset = 0
for i in range(8):
    url = "https://api.spotify.com/v1/playlists/"+str(id)+"/tracks?fields=items%28track%29&offset="+str(offset)
    response = requests.get(url, headers=headers)
    print("Response status:" ,response.status_code)
    if(response.status_code != 200):
        print("Invalid url")
        exit()
    data = response.json()
    tempUrls = [item['track']['external_urls']['spotify'] for item in data['items']]
    urls += tempUrls
    offset += 100


urls = list(set(urls))
print(urls)
print(len(urls))

startTime = time.time()
print("Downloading songs. This might take a while")
for songUrl in urls:
    try:
        subprocess.check_call([sys.executable, "-m", "spotdl", "download", f"{songUrl}"])
    except KeyboardInterrupt:
        print("Bye!")
        exit()
    except:
        print("Error downloading this song")
print("Thank you for using roubador!")
print("Process took", (time.time() - startTime), "seconds")