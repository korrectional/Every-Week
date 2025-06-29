@echo off
:: copy third_party\SDL3\bin\SDL3.dll build\
g++ .\main.cpp -Ithird_party\SDL3\include -Lthird_party\SDL3\lib -lSDL3 -o build\executable
build\executable.exe