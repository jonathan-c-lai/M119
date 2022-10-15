const int ledPin =  LED_BUILTIN;
const int DURATION = 400; //duration unit that the led is off/on

//start with LED off
void dot() {
  digitalWrite(ledPin, 1);
  delay(DURATION);
  digitalWrite(ledPin, 0);
}

//start with LED off
void dash() {
  digitalWrite(ledPin, 1);
  delay(DURATION*3);
  digitalWrite(ledPin, 0);
}

void gapElement() {
  delay(DURATION); //gap between dot/dash within same letter
}

void gapLetters() {
  delay(DURATION*3); //gap between letters
}

void gapWords() {
  delay(DURATION*7); //gap between words
}

void setup() {
  // put your setup code here, to run once:
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, 0);
}

void loop() {
  // put your main code here, to run repeatedly:
  delay(2000);
  //H
  dot();
  gapElement();
  dot();
  gapElement();
  dot();
  gapElement();
  dot();
  gapLetters();

  //E
  dot();
  gapLetters();

  //L
  dot();
  gapElement();
  dash();
  gapElement();
  dot();
  gapElement();
  dot();
  gapLetters();

  //L
  dot();
  gapElement();
  dash();
  gapElement();
  dot();
  gapElement();
  dot();
  gapLetters();

  //O
  dash();
  gapElement();
  dash();
  gapElement();
  dash();
  gapWords();
  // space between words

  //I
  dot();
  gapElement();
  dot();
  gapLetters();

  //M
  dash();
  gapElement();
  dash();
  gapLetters();

  //U
  dot();
  gapElement();
  dot();
  gapElement();
  dash();
  gapWords();
}