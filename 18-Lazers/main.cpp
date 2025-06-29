#include "SDL3/SDL.h"
#include "SDL3/SDL_main.h"
#include <iostream>
#include <cmath>
using namespace std;

int *gFrameBuffer;
SDL_Window *gSDLWindow;
SDL_Renderer *gSDLRenderer;
SDL_Texture *gSDLTexture;
static int gDone;
const int WINDOW_WIDTH = 1920 / 2;
const int WINDOW_HEIGHT = 1080 / 2;
float mX, mY;

bool update()
{
    SDL_Event e;
    if (SDL_PollEvent(&e))
    {
        if (e.type == SDL_EVENT_QUIT)
        {
            return false;
        }
        if (e.type == SDL_EVENT_KEY_UP && e.key.key == SDLK_ESCAPE)
        {
            return false;
        }
        if(e.type == SDL_EVENT_MOUSE_BUTTON_DOWN && e.button.button == SDL_BUTTON_LEFT){
            cout<<mX<<","<<mY<<"\n";
        }
    }
    SDL_GetMouseState(&mX, &mY);
    char *pix;
    int pitch;

    SDL_LockTexture(gSDLTexture, NULL, (void **)&pix, &pitch);
    for (int i = 0, sp = 0, dp = 0; i < WINDOW_HEIGHT; i++, dp += WINDOW_WIDTH, sp += pitch)
        memcpy(pix + sp, gFrameBuffer + dp, WINDOW_WIDTH * 4);

    SDL_UnlockTexture(gSDLTexture);
    SDL_RenderTexture(gSDLRenderer, gSDLTexture, NULL, NULL);
    SDL_RenderPresent(gSDLRenderer);
    SDL_RenderClear(gSDLRenderer);
    SDL_Delay(1);
    return true;
}

void putpixel(int x, int y, int color)
{
    if (x < 0 ||
        y < 0 ||
        x >= WINDOW_WIDTH ||
        y >= WINDOW_HEIGHT)
    {
        return;
    }
    gFrameBuffer[y * WINDOW_WIDTH + x] = color;
}

void putBlock(int x, int y, int color)
{
    putpixel(x, y, color);
    putpixel(x+1, y, color);
    putpixel(x-1, y, color);
    putpixel(x, y+1, color);
    putpixel(x, y-1, color);
}

void normal(float vx, float vy, float& outX, float& outY) {
    float x = -vy;
    float y = vx;

    float length = sqrt(x*x + y*y);
    outX = x / length;
    outY = y / length;
}

void reflect(float inx, float iny, float norx, float nory, float& outX, float& outY){
    float dot = inx*norx+iny*nory;
    outX = inx - 2 * dot * norx;
    outY = iny - 2 * dot * nory;      
    
    float length = sqrt(outX*outX + outY*outY);
    outX = outX / length;
    outY = outY / length;
}

bool raycast(float x1, float y1, float x2, float y2, float x3, float y3, float x4, float y4, float& pX, float& pY, int result[]){

    float den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) return false;
    float t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4))/den;
    float u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3))/den;
    
    if(t>0&&t<1&&u>0){
        pX = x1 + t * (x2 - x1), pY = y1 + t * (y2 - y1);
        putBlock(pX, pY, 0xffffffff);
        float norX, norY;
        normal((x2-x1),(y2-y1), norX, norY);
        //int normal[] = {pX, pY, norX*100+pX, norY*100+pY};
        //drawLine(normal);
        float rx, ry;
        
        float inX = x3-x4, inY = y3-y4;
        reflect(inX, inY, norX, norY, rx, ry);
        
        rx = -rx; ry = -ry;
        
        int reflection[] = {pX, pY, rx*1000+pX, ry*1000+pY};
        for (int i = 0; i < 4; ++i) result[i] = reflection[i];
    }
    else return false;
    return true;
}

void drawLineH(int x0, int y0, int x1, int y1, int color);
void drawLineV(int x0, int y0, int x1, int y1, int color);
void drawLine(int linePoints[4], int color = 0xff0088ff);

int tpix[] = {200, 200, 230, 300};
int line2[] = {300, 200, 330, 300};
int line3[] = {137, 329, 179, 411};
double passtime = 0;
void render(Uint64 aTicks)
{
    memset(gFrameBuffer, 0, WINDOW_WIDTH * WINDOW_HEIGHT * sizeof(int));

    tpix[2] = mX;
    tpix[3] = mY;//200 + (int)(100.0 * sin(passtime));
    passtime += 0.002;

    
    float x1 = line2[0], y1 = line2[1], x2 = line2[2], y2 = line2[3];
    float x3 = tpix[0], y3 = tpix[1], x4 = tpix[2], y4 = tpix[3];
    
    
    float px, py;
    int reflection[4];
    if(raycast(x1, y1, x2, y2, x3, y3, x4, y4, px, py, reflection)){
        //cout<<"a\nfd\n";
        tpix[2] = px;
        tpix[3] = py;
        int reflection2[4];
        float px1, py1;
        if(raycast(line3[0], line3[1], line3[2], line3[3], reflection[0], reflection[1], reflection[2], reflection[3], px1, py1, reflection2)){
            drawLine(reflection2);
            reflection[2] = px1;
            reflection[3] = py1;
        }
        drawLine(reflection);
    }
    else if(raycast(line3[0], line3[1], line3[2], line3[3], x3, y3, x4, y4, px, py, reflection)){
        tpix[2] = px;
        tpix[3] = py;
        int reflection2[4];
        float px1, py1;
        if(raycast(line2[0], line2[1], line2[2], line2[3], reflection[0], reflection[1], reflection[2], reflection[3], px1, py1, reflection2)){
            drawLine(reflection2);
            reflection[2] = px1;
            reflection[3] = py1;
        }
        drawLine(reflection);
    }
    
    drawLine(tpix);
    drawLine(line2, 0xffc4723b);
    drawLine(line3, 0xffc4723b);
}

void drawLine(int *linePoints, int color)
{
    putpixel(linePoints[0], linePoints[1], color);
    putpixel(linePoints[2], linePoints[3], color);

    int x0 = linePoints[0], y0 = linePoints[1], x1 = linePoints[2], y1 = linePoints[3];

    abs(x1 - x0) > abs(y1 - y0) ? drawLineH(x0, y0, x1, y1, color) : drawLineV(x0, y0, x1, y1, color);
}

void drawLineH(int x0, int y0, int x1, int y1, int color)
{
    if (x1 < x0)
    {
        swap(x0, x1);
        swap(y0, y1);
    }

    int dX = x1 - x0;
    int dY = y1 - y0;
    if (dX == 0)
        return;
    float slope = (float)dY / dX;

    int dir = (dY < 0 ? -1 : 1);
    dY *= dir;

    int x = x0;
    int y = y0;
    int p = 2 * dY - dX;
    for (int i = 0; i < dX; i++)
    {
        putpixel(x + i, y, color);
        if (p >= 0)
        {
            y += dir;
            p -= 2 * dX;
        }
        p += 2 * dY;
    }
}

void drawLineV(int x0, int y0, int x1, int y1, int color)
{
    if (y1 < y0)
    {
        swap(x0, x1);
        swap(y0, y1);
    }

    int dX = x1 - x0;
    int dY = y1 - y0;
    if (dY == 0)
        return;
    float slope = (float)dY / dX;

    int dir = (dX < 0 ? -1 : 1);
    dX *= dir;

    int x = x0;
    int y = y0;
    int p = 2 * dX - dY;
    for (int i = 0; i < dY; i++)
    {
        putpixel(x, y + i, color);
        if (p >= 0)
        {
            x += dir;
            p -= 2 * dY;
        }
        p += 2 * dX;
    }
}
void loop()
{
    if (!update())
    {
        gDone = 1;
    }
    else
    {
        render(SDL_GetTicks());
    }
}

int main(int argc, char **argv)
{
    if (!SDL_Init(SDL_INIT_VIDEO | SDL_INIT_EVENTS))
    {
        return -1;
    }

    gFrameBuffer = new int[WINDOW_WIDTH * WINDOW_HEIGHT];
    gSDLWindow = SDL_CreateWindow("SDL3", WINDOW_WIDTH, WINDOW_HEIGHT, 0);
    gSDLRenderer = SDL_CreateRenderer(gSDLWindow, NULL);
    gSDLTexture = SDL_CreateTexture(gSDLRenderer, SDL_PIXELFORMAT_ABGR8888, SDL_TEXTUREACCESS_STREAMING,
                                    WINDOW_WIDTH, WINDOW_HEIGHT);

    if (!gFrameBuffer || !gSDLWindow || !gSDLRenderer || !gSDLTexture)
        return -1;

    gDone = 0;
    while (!gDone)
    {
        loop();
    }

    SDL_DestroyTexture(gSDLTexture);
    SDL_DestroyRenderer(gSDLRenderer);
    SDL_DestroyWindow(gSDLWindow);
    SDL_Quit();

    return 0;
}
