#include <ESP8266WiFi.h>
#include <easyMesh.h>
#include <WiFiUdp.h>
#include <string>
using namespace std;


// some gpio pin that is connected to an LED... 
#define   LED             2       // GPIO number of connected LED
#define   MESH_PREFIX     "IoT_Project"
#define   MESH_PASSWORD   ""
#define   MESH_PORT       5555
#define   UDP_PACKETSIZE  255
#define   SERVER_UDP_PORT 9090

easyMesh  mesh;
WiFiUDP udp;
uint32_t localUdpPort=1966;
uint32_t rootChipID=mesh.getChipId();
//IP4_ADDR( &server, 192,168,(mesh.getChipId() & 0xFF), 0);

IPAddress server(192,168,(rootChipID &0xFF),0);
char incomingPacket[255];    

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

  mesh.setReceiveCallback( &receivedCallback ); // set received routine 
  mesh.setNewConnectionCallback( &newConnectionCallback );// set the new connection routine
  // Udp configuration

  udp.begin(localUdpPort);
  Serial.printf("Now listening at IP %s, UDP port %d\n", WiFi.localIP().toString().c_str(), localUdpPort);
  

}

void loop() {
  mesh.update(); // internal updates of mesh
  // if needed call sendRootDataToServer();  
  // udp get message from server
  udpGetMessageFromServer();
  // if needed call sendRootDataToServer();  

 
}
void udpGetMessageFromServer(){
  
  int packetSize = udp.parsePacket();
  if (packetSize)
  {
    // receive incoming UDP packets
    Serial.printf("Received %d bytes from %s, port %d\n", packetSize, udp.remoteIP().toString().c_str(), udp.remotePort());
    int len = udp.read(incomingPacket,UDP_PACKETSIZE);
    if (len > 0)
    {
      incomingPacket[len] = 0;
    }
//    Serial.printf("UDP packet contents: %s\n", incomingPacket);
  
  char *msg=new char[UDP_PACKETSIZE];
  strcpy(msg,incomingPacket);
  String tmp="";
  tmp+=msg;
  meshSendMessage(tmp);
  }

}
void sendRootDataToServer(){

  String message="";
   message+=mesh.getChipId();//src
   message+="00000000";//dst
   message+=constructTheMessage();

   udp.beginPacket(server, SERVER_UDP_PORT);
   udp.write(message.c_str());
   udp.endPacket();
  
  }
void meshSendMessage(String &msg){ // it is diffrent for rootNode

  char *src=new char [4];
  strncpy(src,msg.c_str(),4);
  
  char *dst=new char [4];
  for(int i=0 ;i<4;i++)
    dst[i]=msg[i+4];

  char *data=new char[msg.length()-7];
  for(int i=0 ;i<msg.length()-7;i++)
    data[i]=msg[i+8];

  uint32_t srcChipID= atoi(src);
  uint32_t dstChipID= atoi(dst);
  
  if(dstChipID!=mesh.getChipId()){ // if the dst is not this root then send it to right node

     String message="";
     message+=mesh.getChipId();//src
     message+=dstChipID;//dst
     message+=data;
     mesh.sendSingle(dstChipID,message);
  }
  else if(dstChipID==mesh.getChipId())
  {
    receivedFromServer(data);
    }

}
void receivedCallback( uint32_t from, String &msg ) { // the From parameter is the ChipID of orginal sender 
  
  char *src=new char [4];
  strncpy(src,msg.c_str(),4);
  
  char *dst=new char [4];
  for(int i=0 ;i<4;i++)
    dst[i]=msg[i+4];

  char *data=new char[msg.length()-7];
  for(int i=0 ;i<msg.length()-7;i++)
    data[i]=msg[i+8];

  uint32_t srcChipID= atoi(src);
  uint32_t dstChipID= atoi(dst);


  String message="";
  message+=srcChipID;//src
  message+="00000000";//dst
  message+=data;
  udp.beginPacket(server, SERVER_UDP_PORT);
  udp.write(message.c_str());
  udp.endPacket();

}

void newConnectionCallback( bool adopt ) { // can I get chipID of root here?
  Serial.printf("New Connection, adopt=%d\n", adopt);
}

void receivedFromServer(char *data){} // called when the message is from server for this node the message is without the first 8 bytes
String constructTheMessage(){}// called when u need to send data from this node it will be wrapped in with the first 8 bytes
