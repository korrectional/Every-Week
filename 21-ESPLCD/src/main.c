#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "esp_rom_sys.h"

#define VO 15
#define RS 2
#define RW 4
#define E  5 //db 0   1   2   3   4   5   6   7
const int DB[] = {13, 12, 14, 27, 26, 25, 33, 32};
#define A  23

static inline TickType_t pdNS_TO_TICKS(uint64_t ns){
    return (TickType_t)((ns * configTICK_RATE_HZ) / 1000000000ULL);
}
void loadDB(int data){
    for(int i = 0; i < 8; i++){
        gpio_set_level(DB[i], ((0b00000001 << i) & data) > 0); 
        ESP_LOGI("LCD", "Data port no.%d equals %d", i, ((((0b00000001 << i) & data) > 0)), NULL);
    }
}
void loadRSRWE(int rsrwe){
    gpio_set_level(RS, (rsrwe >> 2) & 0x1);
    gpio_set_level(RW, (rsrwe >> 1) & 0x1);
    gpio_set_level(E , (rsrwe >> 0) & 0x1);
}
/* pulse should only toggle E; RS/RW must be set before calling */
void pulse(void){
    /* small setup hold before E high */
    esp_rom_delay_us(1);
    gpio_set_level(E , 1);
    esp_rom_delay_us(1); /* E high width */
    gpio_set_level(E , 0);
    /* allow the LCD to process the instruction */
    esp_rom_delay_us(100);
}

void blinkTask(void *pvParameter){
    // setup
    gpio_reset_pin(RW);
    gpio_reset_pin(E);
    gpio_reset_pin(RS);              // ensure RS pin is reset too
    for(int i = 0; i < 8; i++){gpio_reset_pin(DB[i]);}
    gpio_reset_pin(A);

    gpio_set_direction(RW, GPIO_MODE_OUTPUT);
    gpio_set_direction(E, GPIO_MODE_OUTPUT);
    gpio_set_direction(RS, GPIO_MODE_OUTPUT); // set RS as output
    for(int i = 0; i < 8; i++){gpio_set_direction(DB[i], GPIO_MODE_OUTPUT);}
    gpio_set_direction(A, GPIO_MODE_OUTPUT);
    

    gpio_set_level(A, 1);
    gpio_set_level(RW, 0);
    gpio_set_level(RS, 0);
    gpio_set_level(E, 0);
    
    vTaskDelay(pdMS_TO_TICKS(5000)); // wait
    
    
    loadDB(0b00110000); // function set
    pulse();
    
    loadDB(0b000001000); // off
    pulse();

    loadDB(0b00001110); // set board as on
    pulse();

    loadDB(0b00000110); // entry mode
    pulse();
    
    gpio_set_level(RS, 1); // write
    for(int i = 0; i < 16; i++){
        loadDB(0b00110000 | i);
        pulse();
    }
    
    // skip line
    gpio_set_level(RS, 0);
    loadDB(0b11000000);
    pulse();
    
    gpio_set_level(RS, 1); // write
    for(int i = 0; i < 16; i++){
        loadDB(0b01000000 | i);
        pulse();
    }



    vTaskDelay(pdMS_TO_TICKS(15000));
    return;
}

void app_main() {
    xTaskCreate(blinkTask, "blinkTask", 2048, NULL, 5, NULL);
}