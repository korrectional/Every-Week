import pygame as pg
import random
import math
import copy


class Pillar:

    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.crossed = False
    
    def step(self, spd):
        self.x -= spd
        if(self.x<-100):
            return -1

rounds = 0

class Neuron:
    def __init__(self, id, bias):
        self.id = id
        self.bias = bias
        self.value = 0
    def set(self, value):
        self.value = value
    def add(self, value):
        self.value += value
    def activation(self):
        self.value = math.tanh(self.value+self.bias)

class Link:
    def __init__(self, inId, outId, weight):
        self.inId = inId
        self.outId = outId
        self.weight = weight

class Genome:
    def __init__(self, id=0, numIn=0, numOut=0, neurons=[], links=[]):
        self.id = id
        self.numIn = numIn
        self.numOut = numOut
        self.neurons = neurons
        self.links = links
    
    def calculate(self, inputs): # 3 inputs
        # calculate output based on input
        for neuron in self.neurons: # reset neurons
            neuron.value = 0
        for i in range(self.numIn):
            self.neurons[i].set(inputs[i]/500)#dont forget to normalize!
        for i in range(self.numIn*2): # calculate value of next neuron (layer 1)
            self.neurons[self.links[i].outId].add(self.neurons[self.links[i].inId].value*self.links[i].weight)
        for i in range(self.numIn, len(self.neurons)-self.numOut): # activate value of next neuron (layer 1)
            self.neurons[i].activation()
        for i in range(self.numIn*2, self.numIn*2+self.numOut*2): #gives list of inner neurons   calculate value of next neuron (layer 2)
            self.neurons[self.links[i].outId].add(self.neurons[self.links[i].inId].value*self.links[i].weight)
        #print("NUMSS", self.numIn, len(self.neurons)-self.numOut)
        self.neurons[5].activation()
        return self.neurons[5].value

    def mutate(self, strength):
        if rounds > 20:
            strength /= 2
        neuron = random.choice(self.neurons)
        #print("NOTATTE NEURON", neuron.value)
        neuron.bias += random.uniform(-strength, strength)
        #print("MUTATED NEURON", neuron.value)

        link = random.choice(self.links)
        #print("NOTATTE LINK", link.weight)
        link.weight += random.uniform(-strength, strength)
        #print("MUTATED LINK", link.weight)

        link = random.choice(self.links)
        #print("NOTATTE LINK", link.weight)
        link.weight += random.uniform(-strength, strength)
        #print("MUTATED LINK", link.weight)
    
    def mix(self, parent):
        nid = random.randint(0, len(self.neurons)-1)
        self.neurons[nid].bias = parent.neurons[nid].bias
        lid = random.randint(0, len(self.links)-1)
        self.links[lid].weight = parent.links[lid].weight






def initNetwork():

    neurons = [] # 3 in, 2 mid, 1 out
    links = []
    for i in range(6): # create neurons
        neurons.append(Neuron(i, 0))
    for i in range(3): # create random links
        for y in range(2):
            links.append(Link(i, y+3, random.random()*2-1))
    for y in range(3, 5):
        links.append(Link(y, 5, random.random()*2-1))
    
    for link in links:
        print(link.inId, link.outId, link.weight, "\n")
    for neuron in neurons:
        print(neuron.id, neuron.bias, "\n")
        

    return Genome(0, 3, 1, neurons, links)



class Bird:
    def __init__(self, createNetwork):
        if createNetwork:
            self.network = initNetwork()
        else:
            self.network = Genome()
    def setScreen(self, screen):
        self.screen = screen
        self.velocity = 0
        self.birdPos = pg.Vector2(screen.get_width()/2-70, screen.get_height()/2)
        self.living = True
        self.score = 0
    def decide(self, inputs):
        self.ydist = inputs[1]
        return self.network.calculate(inputs)
    def kill(self, ticks, score, distance):
        if self.living:
            self.living = False
            self.score = ticks + score*10
            #if self.ydist < 50 and self.ydist > -50:
            #    self.score += 20
    def mutate(self):
        self.network.mutate(0.5)
        self.network.mutate(0.5)
        self.network.mutate(0.5)
        self.network.mutate(0.5)
        self.network.mutate(0.5)
        self.network.mutate(0.5)
    def reproduce(self, bird): # recieve from input bird
        self.network.mix(bird.network)
        self.network.mix(bird.network)
        self.network.mix(bird.network)
        self.network.mix(bird.network)
        self.network.mix(bird.network)


def sigmoid(x):
    return 1 / (1 + math.exp(-x))

initt = 0

birds = []
for i in range(10):
    birds.append(Bird(True))

def main():
    pg.init()
    screen = pg.display.set_mode((400, 600))
    gameSpeed = 3

    clock = pg.time.Clock()
    running = True
    ticks = 0
    score = 0
    target = 0 # index of closest approaching post


    font = pg.font.Font(None, 50)
    text = font.render(str(score), False, "white")
    

    # setup objects
    for bird in birds:
        bird.setScreen(screen)

    pillars = []
    pillars.append(Pillar(screen.get_width(), screen.get_height()/2 + random.randint(-160, 160)))
    pillars.append(Pillar(screen.get_width()+300, screen.get_height()/2 + random.randint(-160, 160)))
    pillars.append(Pillar(screen.get_width()+600, screen.get_height()/2 + random.randint(-160, 160)))
    
    screen.fill("light blue")
    pg.display.flip()
    #pg.time.wait(500)
    
    while running:
        for event in pg.event.get():
            match event.type:
                case pg.QUIT:
                    return 1
                case pg.KEYDOWN:
                    if event.key == pg.K_SPACE:
                        #velocity=7+velocity*0.3
                        # we also speed up the game if survive for too long
                        t = pg.time.get_ticks() - initt
                        if(t > 20000): # to many print statements X_X
                            gameSpeed=4
                            if(t > 40000):
                                gameSpeed = 5
                                if(t > 60000):
                                    gameSpeed = 6

                    elif event.key == pg.K_ESCAPE:
                        return 1
        
        # use "input" from NN 
        #for neuron in network.neurons:
        #print(network.neurons[0].id, network.neurons[0].value, end='\r', flush=True)
        #print(network.neurons[1].id, network.neurons[1].value, end='\r', flush=True)
        #print(network.neurons[2].id, network.neurons[2].value, end='\r', flush=True)
        #print(network.neurons[3].id, network.neurons[3].value, end='\r', flush=True)
        #print(network.neurons[4].id, network.neurons[4].value, end='\r', flush=True)
        #print(network.neurons[5].id, network.neurons[5].value, end='\r', flush=True)




        screen.fill("light blue")
        # render game here
        for bird in birds:
            if not bird.living:
                continue
            pg.draw.circle(screen, "black", bird.birdPos, 15)
            pg.draw.circle(screen, "yellow", bird.birdPos, 12.5)
        
        # show score
        text = font.render(str(score), False, "white")
        screen.blit(text, (180, 100))


        tokill = []
        for p in range(len(pillars)):
            if pillars[p].x<=400:
                pg.draw.rect(screen, "black", pg.Rect(pillars[p].x-2.5, pillars[p].y-2.5, 55, 505))
                pg.draw.rect(screen, "green", pg.Rect(pillars[p].x, pillars[p].y, 50, 500))

                pg.draw.rect(screen, "black", pg.Rect(pillars[p].x-2.5, pillars[p].y-2.5-620, 55, 505))
                pg.draw.rect(screen, "green", pg.Rect(pillars[p].x, pillars[p].y-620, 50, 500))

            if pillars[p].step(gameSpeed) == -1:
                pillars.append(Pillar(pillars[len(pillars)-1].x+300, screen.get_height()/2 + random.randint(-160, 160)))
                tokill.append(p)
            
            # pillar crossed bird
            if pillars[p].x >= 130 and pillars[p].x <= 130+gameSpeed and not pillars[p].crossed:
                score+=1
                pillars[p].crossed = True
                target = p + 1
        
        for p in tokill:
            pillars.pop(p)
            target-=1

# + x -->
# y
# |
# V

        
        # physics
        for bird in birds:
            bird.velocity-=0.4
            
            if (bird.birdPos.y>=600-15 or bird.birdPos.y<=0-15):
                bird.kill(ticks, score, pillars[target].y-bird.birdPos.y-160)
                if bird.velocity<0:
                    bird.velocity = 0

            bird.birdPos.y-=bird.velocity
        
        #check if hit tower
        for pillar in pillars:
            for bird in birds:
                if pillar.x < bird.birdPos.x+15 and pillar.x+50 > bird.birdPos.x-15: # get x coord
                    if pillar.y < bird.birdPos.y+15 or pillar.y-120+15 > bird.birdPos.y: #check if not within gap
                        bird.kill(ticks, score, pillars[target].y-bird.birdPos.y-160)

        #data from NN
        dead = 0
        for bird in birds:
            if not bird.living:
                dead+=1
                continue
            nninputs = []
            nninputs.append(pillars[target].x-130)
            nninputs.append(pillars[target].y-bird.birdPos.y)
            nninputs.append(pillars[target].y-120-bird.birdPos.y)
            decision = bird.decide(nninputs)
            if decision > 0:
                bird.velocity=7+bird.velocity*0.3

        if dead >= 10:
            running = False

        pg.display.flip()
        ticks+=1
        #if ticks > 60*30: # seconds
        #    running = False
        clock.tick(60)




print("Initializing game")
while True:
    if main():
        break
    rounds += 1
    initt = pg.time.get_ticks()
    # mutate
    avg = 0
    for i in range(10): #take average and remove those who performed below
        avg += birds[i].score
    avg /= 10
    print("AVG", avg)
    killed = 0
    birds = sorted(birds, key=lambda b:b.score, reverse=True)
    birds = birds[:5]
    while len(birds) < 10:
        newBird = Bird(False)
        newBird.network = copy.deepcopy(birds[random.randint(0, 5 if len(birds)>5 else len(birds)-1)].network)
        birds.append(newBird)
    for bird in birds[1:]:
        bird.mutate()
    # now we will "reproduce"
    for bird in birds[1:]:
        bird.reproduce(birds[random.randint(0, 2)])
pg.quit()