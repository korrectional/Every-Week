import requests
from bs4 import	BeautifulSoup
import atexit
import re

visited = []
def	main():
	# clear storage
	with open("scrap.txt", "w"):
		pass


	headers	= {
	"Accept": "*/*",
	"Accept-Charset": "utf-8",
	"Accept-Encoding": "gzip, deflate, br",
	"Accept-Language": "en-US,en;q=0.5",
	"Cache-Control": "no-cache",
	"Connection": "keep-alive",
	"Content-Type":	"application/json",
	"User-Agent": "Mozilla/5.0 (Windows	NT 10.0; Win64;	x64) AppleWebKit/537.36	(KHTML,	like Gecko)	Chrome/58.0.3029.110 Safari/537.3"
	}
	count = 0
	urlList = ["/wiki/Main_Page"]
	url	= "https://en.wikipedia.org/"
	while True:
		currentPath = "https://en.wikipedia.org/" + str(urlList[count])
		answer = requests.get(currentPath, headers=headers)
		visited.append(currentPath)


		if(answer.status_code != 200):
			print("response	not	recieved")
			count+=1
			continue
		
		page = str(BeautifulSoup(answer.content, "html.parser"))
		soup = BeautifulSoup(answer.content, "html.parser")

		text = soup.get_text()
		text = re.sub(r'\s+', ' ', text).strip()  # Remove extra spaces
		#remove everything in the references
		statx = text.find("Wikipedia, the free encyclopedia")
		if statx != -1:
			statx+=33
			text = text[statx:]
		endex = text.find("References")
		if endex != -1:
			text = text[:endex]
		text = re.sub(r'\[.*?^\]', '', text)
		text = re.sub(r'\s+', ' ', text).strip()
		text = re.sub(r'[^\x00-\x7F]+', '', text)
		text = re.sub(r'\[\d+\]', '', text)   # Remove references like [74]
		text = re.sub(r'\^', '', text)         # Remove caret characters


		
		#print(text)
		with open("scrap.txt","a") as f:
			f.write(text)
		
		
		# this will	get	all	the	urls in the	page
		while True:
			url, n = getURL(page)
			page = page[n:]
			if url:
				if(not url.startswith("mail") and not url.startswith("http") and url.startswith("/")):
					if(str(url) not in urlList):
						urlList.append(str(url))
			else:
				break
		
		count+=1
		print(count)
		if count == len(urlList):
			break
	
		#print("\n\nVisited\n")
		#for i in visited:
		#	print(i, "\n")
		#print("\n\n", len(urlList), "Todo\n")

def done():
	print("\n\nVisited\n")
	for i in visited:
		print(i, "\n")


def	getURL(page):
	startLink =	page.find("a href")
	if startLink == -1:
		return None, 0
	startQuote = page.find('"',startLink)
	endQuote = page.find('"', startQuote + 1)
	url	= page[startQuote +	1: endQuote]
	return url,	endQuote


atexit.register(done)
main()