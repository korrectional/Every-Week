int VIDEO_ADDRESS_OFFSET = 0;
char* VIDEO_POINTER = (char*)0xb8000;

int strlen(char str[]){
    int len = 0;
    while(str[len] != '\0'){
        len++;
    }
    return len;
}


void print(char str[]){
    int len = strlen(str);
    for(int i = 0; i < len; i++){
        VIDEO_POINTER[VIDEO_ADDRESS_OFFSET] = str[i];
        VIDEO_ADDRESS_OFFSET+=2;
    }
}


extern "C" void main(){
    char welcome[] = "The KERNEL has arrived";
    
    
    print(welcome);
    
    
    return;
}





/*  

    +---------------------------+---------+
    | welcome to unsatisfactory | dumbass |
    +---------------------------+---------+

*/