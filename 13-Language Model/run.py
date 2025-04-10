import random
import pickle
import sys
import atexit
import time

startTime = time.time()
tokens = 0

with open("model.pkl", "rb") as f:
    model = pickle.load(f)

def done():
    print("Used ", tokens, " tokens")
    elapsedTime = time.time() - startTime
    print("Ran for", elapsedTime)
    print("Average", tokens/elapsedTime, "tokens p/ second")

def generate(start):
    global tokens
    word1, word2 = start
    options = model.get((word1, word2))
    word3 = random.choices(list(options.keys()), weights=options.values())[0]
    tokens+=1
    print(word3, end=" ")
    return (word2, word3)


atexit.register(done)

def main():

    if len(sys.argv) < 1:
        arg1 = "located"
        arg2 = "in"
    else:
        arg1 = sys.argv[1]
        arg2 = sys.argv[2]

    length = 50
    if len(sys.argv) == 4:
        length = int(sys.argv[3])

    result = generate((arg1, arg2))
    for i in range(length):
        result = generate(result)

    print("\n")

main()