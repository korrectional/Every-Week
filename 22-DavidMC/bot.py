import socket
import struct
import json
import discord
from dotenv import load_dotenv
import os


load_dotenv()
print("setting intents")
intents = discord.Intents.default()
intents.message_content = True
client = discord.Client(intents=intents)
print("intents set")



def unpack_varint(s):
    d = 0
    for i in range(5):
        b = ord(s.recv(1))
        d |= (b & 0x7F) << 7*i
        if not b & 0x80:
            break
    return d

def pack_varint(d):
    o = b""
    while True:
        b = d & 0x7F
        d >>= 7
        o += struct.pack("B", b | (0x80 if d > 0 else 0))
        if d == 0:
            break
    return o

def pack_data(d):
    h = pack_varint(len(d))
    if type(d) == str:
        d = bytes(d, "utf-8")
    return h + d

def pack_port(i):
    return struct.pack('>H', i)

def getInfo(host='voluntors.org', port=25565):
    print("Connecting...")

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((host, port))

    s.send(pack_data(b"\x00\x00" + pack_data(host.encode('utf8')) + pack_port(port) + b"\x01"))
    s.send(pack_data("\x00"))


    data = s.recv(1024)
    s.close()
    print(data)
    print(data[data.find(b'{'):])
    return (f"Players online: {json.loads((data[data.find(b'{'):]).decode())["players"]["online"]}")



@client.event
async def on_ready():
    print(f'I logged in as {client.user}')

@client.event
async def on_message(msg):
    if(msg.author) == client.user:
        return
    if msg.content.startswith('David'):
        await msg.channel.send(getInfo())

client.run(os.getenv("DISCORD_TOKEN"))