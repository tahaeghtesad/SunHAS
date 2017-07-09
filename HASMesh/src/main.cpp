#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <easyMesh.h>
#include <WiFiUdp.h>
#include <string>
using namespace std;


// some gpio pin that is connected to an LED...
#define   LED             2       // GPIO number of connected LED
#define   MESH_PREFIX     "ArcMesh"
#define   MESH_PASSWORD   "tahamesh"
#define   MESH_PORT       5555

easyMesh  mesh;
WiFiUDP udp;
uint32_t rootChipID;

unsigned int localUdpPort = 8266;  // local port to listen on
char incomingPacket[255];  // buffer for incoming packets
char converted[4];

void parseMsg(char* msg, int len);

uint32_t read_be_int(char* index){
  uint32_t ret = 0;
  ret += (int)(*index + 0) << 24;
  ret += (int)(*index + 1) << 16;
  ret += (int)(*index + 2) << 8;
  ret += (int)(*index + 3) << 0;
  return ret;
}

void int_to_char_be(uint32_t input){
  converted[0] = input & 0xFF000000 >> 24;
  converted[1] = input & 0x00FF0000 >> 16;
  converted[2] = input & 0x0000FF00 >> 8;
  converted[3] = input & 0x000000FF >> 0;
}

void receivedCallback( uint32_t from, String &msg ) {
  Serial.printf("startHere: Received from %d msg=%s\n", from, msg.c_str());
  msg.toCharArray(incomingPacket, 255);
  uint32_t target = read_be_int(incomingPacket);

  if (incomingPacket[8] == 1)
    rootChipID = from;
  else if (target == mesh.getChipId())
    parseMsg(incomingPacket + 8, msg.length() - 8);
  else if (target == 0 && rootChipID == mesh.getChipId()){
    udp.beginPacket(udp.remoteIP(), udp.remotePort());
    udp.write(incomingPacket);
    udp.endPacket();
  }
}

void newConnectionCallback( bool adopt ) {
  Serial.printf("startHere: New Connection, adopt=%d\n", adopt);
}

void parseMsg(char* msg, int len){
  int code = msg[0];
  switch (code) {
    case 5:
      if (msg[2] < 10)
        digitalWrite(LED, HIGH);
      else
        digitalWrite(LED, LOW);
      break;
  }
}

void sendKeepAlive(){
  char msg[255];
  int_to_char_be(0);
  msg[0] = converted[0];
  msg[1] = converted[1];
  msg[2] = converted[2];
  msg[3] = converted[3];
  int_to_char_be(mesh.getChipId());
  msg[4] = converted[0];
  msg[5] = converted[1];
  msg[6] = converted[2];
  msg[7] = converted[3];

  msg[8] = 1;
  msg[9] = 1; // actuator: 1
  msg[10] = 5; // function_: 5 ~> lamp
}

void setup() {
  Serial.begin(115200);
    //GPIO 4,5,15,16 output
  pinMode( 4, OUTPUT );
  pinMode( 5, OUTPUT );
  pinMode( 15, OUTPUT );
  pinMode( 16, OUTPUT );
  //GPIO 12 ,13 input
  pinMode( 12, INPUT );
  pinMode( 13, INPUT );

//mesh.setDebugMsgTypes( ERROR | MESH_STATUS | CONNECTION | SYNC | COMMUNICATION | GENERAL | MSG_TYPES | REMOTE ); // all types on
  mesh.setDebugMsgTypes( ERROR | STARTUP );  // set before init() so that you can see startup messages
  Serial.print("started up\n");
  // init a mesh on this node with ssid =IoT_Project+chipID and no password and the tcp port for connection between nodes on 5555
  mesh.init( MESH_PREFIX, MESH_PASSWORD, MESH_PORT );


  mesh.setReceiveCallback( &receivedCallback );
  mesh.setNewConnectionCallback( &newConnectionCallback );

  // mesh.setReceiveCallback( &receivedCallback ); // set received routine
  // mesh.setNewConnectionCallback( &newConnectionCallback );// set the new connection routine
  // Udp configuration

  udp.begin(localUdpPort);
  Serial.printf("Now listening at IP %s, UDP port %d\n", WiFi.localIP().toString().c_str(), localUdpPort);

}

void loop(){
  mesh.update();

  int packet_length = udp.parsePacket();
  if (packet_length)
  {
    // receive incoming UDP packets
    Serial.printf("Received %d bytes from %s, port %d\n", packet_length, udp.remoteIP().toString().c_str(), udp.remotePort());
    int len = udp.read(incomingPacket, 255);
    String msg = String(incomingPacket).substring(0,len);

    uint32_t target = read_be_int(incomingPacket);

    if (incomingPacket[8] == 1){
      mesh.sendBroadcast( msg );
      rootChipID = mesh.getChipId();
    } else if (target == mesh.getChipId()){
      parseMsg(incomingPacket + 8, len - 8);
    } else {
      mesh.sendSingle(target, msg);
    }
  }

  sendKeepAlive();
}
