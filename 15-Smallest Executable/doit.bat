@echo off
fasm .\msg.asm
strip msg.exe
upx msg.exe