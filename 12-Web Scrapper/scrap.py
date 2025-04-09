import requests
from bs4 import	BeautifulSoup
import re



def	main():
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
	urlList = [""]
	url	= "https://www.example.com" # sorry for this weird repeating of the url I couldnt get it to work for some reason
	visited = []
	while True:
		currentPath = "https://www.example.com" + str(urlList[count])
		answer = requests.get(currentPath, headers=headers)
		visited.append(currentPath)


		if(answer.status_code != 200):
			print("response	not	recieved")
			return

		page = str(BeautifulSoup(answer.content, "html.parser"))
		soup = BeautifulSoup(answer.content, "html.parser")
		text = soup.get_text()

		for i in range(len(text)-1):
			text = text.replace("  ", "")
			text = text.replace("\n", "")
		print(text)
		
		
		# this will	get	all	the	urls in the	page
		while True:
			url, n = getURL(page)
			page = page[n:]
			if url:
				if(not url.startswith("mail") and not url.startswith("http")):
					#print(url)
					if(str(url) not in urlList):
						urlList.append(str(url))
			else:
				break
		
		count+=1
		if count == len(urlList):
			break
	
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



main()
