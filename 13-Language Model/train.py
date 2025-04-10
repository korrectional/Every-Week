from collections import defaultdict
import pickle
import time

startTime = time.time()
with open("scrap.txt", "r") as f:
    words = f.read().split()

model = defaultdict(lambda: defaultdict(lambda: 0))


    



for word in range(len(words)-3):
    model[(words[word], words[word+1])][words[word+2]] += 1

for dup in model:
    total = float(sum(model[dup].values()))
    for word3 in model[dup]:
        model[dup][word3] /= total


#print(dict(model[]))
regular_model = {k: dict(v) for k, v in model.items()}

with open("model.pkl", "wb") as f:
    pickle.dump(regular_model, f)

print("done training\n duration:", (time.time()-startTime))