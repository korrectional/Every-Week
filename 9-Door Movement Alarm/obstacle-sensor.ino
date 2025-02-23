int sensorState = 0;


void setup() {
  pinMode(13, OUTPUT);
  pinMode(7, OUTPUT);
  pinMode(3, INPUT);

  digitalWrite(7, LOW);

}

void loop() {
  sensorState = digitalRead(3);

  if(sensorState == LOW){
    digitalWrite(13, HIGH);
    tone(7,440,200);
    delay(200);
    tone(7,460,200);
    delay(200);
    tone(7,420,200);
    delay(200);
    tone(7,510,300);
    delay(400);
    tone(7,520,200);
    delay(200);



  }
  else{
    digitalWrite(7, LOW);
    digitalWrite(13, LOW);
  }

}