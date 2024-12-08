import torch
from lib import NeuralNetwork, test_data, device
import matplotlib.pyplot as plt
import math



classes = [
    "T-shirt/top",
    "Trouser",
    "Pullover",
    "Dress",
    "Coat",
    "Sandal",
    "Shirt",
    "Sneaker",
    "Bag",
    "Ankle boot",
]



model = NeuralNetwork()
model.load_state_dict(torch.load("model.pth", weights_only=True))
model.eval()

images = len(classes)
rows = int(math.sqrt(images))
cols = math.ceil(images / rows)
plt.figure(figsize=(15, 15))

for i in range(images):
    x, y = test_data[i][0], test_data[i][1]
    with torch.no_grad():
        x = x.to(device)
        pred = model(x)
        predicted, actual = classes[pred[0].argmax(0)], classes[y]
        print(f'Predicted: "{predicted}", Actual: "{actual}"')


    plt.subplot(rows, cols, i + 1)
    plt.imshow(x.cpu().squeeze(), cmap='gray')
    plt.title(f'Pred: {predicted}\nTrue: {actual}', fontweight='bold', color='green')
    plt.axis('off')
plt.tight_layout()
plt.show()