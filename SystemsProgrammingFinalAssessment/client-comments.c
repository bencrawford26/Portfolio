// Cwk2: client.c - message length headers with variable sized payloads
//  also use of readn() and writen() implemented in separate code module
//Includes
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <netdb.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <arpa/inet.h>
#include <sys/utsname.h>
#include "rdwrn.h"

#define INPUTSIZ 10

//structure for employee list to be printed on client exit
typedef struct {
    //variable declarations
    int id_number;
    int age;
    float salary;
} employee;

//structure for uname to be sent to client
typedef struct {
    //variable declarations
    char *nodename;
    char *sysname;
    char *release;
    char *version;
    char *machine;
} utsname;

// how to send and receive structs
void send_and_get_employee(int socket, employee *e)  
{
    size_t payload_length = sizeof(employee);

    // send the original struct
    writen(socket, (unsigned char *) &payload_length, sizeof(size_t));	
    writen(socket, (unsigned char *) e, payload_length);	 		

    // get back the altered struct
    readn(socket, (unsigned char *) &payload_length, sizeof(size_t));	   
    readn(socket, (unsigned char *) e, payload_length);

    // print out details of received & altered struct
    printf("Age is %d\n", e->age);
    printf("id is %d\n", e->id_number);
    printf("Salary is %6.2f\n", e->salary);    
} // end send_and_get_employee()

//Send empty uts struct, get server uname info and print all fields
void send_and_get_uname(int socket, utsname *uts) {
    //Declare size variable named len and initialise as size of
    // utsname struct
    size_t len = sizeof(utsname);
    //Declare utsname struct uts1
    struct utsname uts1;

    //Check uname success
    if (uname(&uts1) == -1) {
        //On failure, print error message and exit program
        perror("uname error");
        exit(EXIT_FAILURE);
    }

    //Send original size of utsname
    writen(socket, (unsigned char *) &len, sizeof(size_t));  
    //Send original utsname uts1
    writen(socket, (unsigned char *) &uts1, len);

    //Get altered utsname size
    readn(socket, (unsigned char *) &len, sizeof(size_t));      
    //Get altered utsname and store in uts1
    readn(socket, (unsigned char *) &uts1, len);

    //Print each field of utsname struct
    printf("Node name:    %s\n", uts1.nodename);
    printf("System name:  %s\n", uts1.sysname);
    printf("Release:      %s\n", uts1.release);
    printf("Version:      %s\n", uts1.version);
    printf("Machine:      %s\n", uts1.machine);
}

// how to receive a string
void get_hello(int socket)
{
    char hello_string[32];
    size_t k;

    readn(socket, (unsigned char *) &k, sizeof(size_t));	
    readn(socket, (unsigned char *) hello_string, k);

    printf("Hello String: %s\n", hello_string);
    printf("Received: %zu bytes\n\n", k);
} // end get_hello()


//Recieve server ip and Student id
void get_id(int socket) {
    //Declare size variable named k to hold size of char array recieved from server
    size_t k;

    //Recieve size of char array from server
    readn(socket, (unsigned char *) &k, sizeof(size_t));
    //Fixed size char array to hold server ip and student id with length of
    // recieved string
    char stu_id[k];

    //Recieve string from server and store in fixed char array stu_id
    readn(socket, (unsigned char *) stu_id, k);

    //Print stu_id to terminal window
    printf("%s\n", stu_id);
}

//Recieve current server time and print to terminal window
void get_time(int socket) {
    //Declare size variable named k to hold size of char array recieved from server
    size_t k;

    //Recieve size of char array from server
    readn(socket, (unsigned char *) &k, sizeof(size_t));
    
    //Fixed size char array to hold server timestamp with length of
    // recieved string
    char time[k];

    //Recieve string from server and store in fixed char array time
    readn(socket, (unsigned char *) time, k);

    //Print timestamp to terminal window
    printf("Current servertime: %s", time);
}

//Send option to server
char send_option(int socket) {
    //Declare fixed size char array of size INPUTSIZ(1)
    char input[INPUTSIZ];
    //Declare char to hold option to be sent
    char option;

    //Prompt user to enter option at terminal window
    printf("option> ");
    // get the value from input
    fgets(input, INPUTSIZ, stdin);   
    //Trim empty space after new line
    input[strcspn(input, "\n")] = 0;
    //Set char option to first char in input array
    option = input[0];
    if (strlen(input) > 1) {
        // set invalid if input more 1 char
        option = 'x';    
    }

    //Declare abd initialise size vvariable named k with size of a single char
    size_t k = sizeof(char);

    //Send size of char to server
    writen(socket, (unsigned char *) &k, sizeof(size_t));
    //Send option to server
    writen(socket, (unsigned char *) &option, k);

    //Return option to menu
    return option;
}

//Get list of filenames in server upload directory
void get_filenames(int socket) {
    //Declare size variable named k
    size_t k;
    //Declare char array pointer named filelist
    char *filelist;
    //Declare delimiter for use in strtok
    const char delim[1] = "*";
    //Int to store number of files processed via while loop
    int count = 0;

    //Get size of filelist string
    readn(socket, (unsigned char *) &k, sizeof(size_t));

    //Declare fixed size char array of to store list of files
    // recieved from server
    char files[k];

    //Get char array holding list of files from server 
    readn(socket, (unsigned char *) files, k);

    //Seperate filenames in string using strtok
    filelist = strtok(files, delim);

    //Loop through filelist
    while(filelist != NULL) {
        //Add 1 to count to track file number
        count++;
        //Print filename seperated by delimiter and newline to terminal window
        printf("File %d: %s\n", count, filelist);

        //Seperate next filename
        filelist = strtok(NULL, delim);
    }
}

//Display list of user options
void displaymenu() {
    //Print each option's intended purpose to terminal window
    printf("0. Display menu.\n");
    printf("1. Obtain student ID and server IP.\n");
    printf("2. Obtain server time.\n");
    printf("3. Obtain server uname info.\n");
    printf("4. Obtain file names in server cwd.\n");
    printf("5. Exit.\n");
}

int main(void)
{
    // *** this code down to the next "// ***" does not need to be changed except the port number
    int sockfd = 0;
    struct sockaddr_in serv_addr;

    if ((sockfd = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
	perror("Error - could not create socket");
	exit(EXIT_FAILURE);
    }

    serv_addr.sin_family = AF_INET;

    // IP address and port of server we want to connect to
    serv_addr.sin_port = htons(50031);
    serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1");

    // try to connect...
    if (connect(sockfd, (struct sockaddr *) &serv_addr, sizeof(serv_addr)) == -1)  {
	perror("Error - connect failed");
	exit(1);
    } else
       printf("Connected to server...\n");
    // ***
    // your own application code will go here and replace what is below... 
    char option;

    //Declare utsname struct named uts
    utsname *uts;
    //Allocate memory for uts
    uts = (utsname *) malloc(sizeof(utsname));

    //Get welcome message from server
    get_hello(sockfd);

    //Display list of options to user via terminal window
    displaymenu();
    do {
        //Recieve option from user
        option = send_option(sockfd);
        //Series of outcomes from options
        switch (option) {
        case '0':
            //Display list of options to user via terminal window
            displaymenu();
            break;
        case '1':
            printf("Option one.\n");
            //Recieve ip and student id from server
            get_id(sockfd);
            break;
        case '2':
            printf("Option two.\n");
            //Get current time from server
            get_time(sockfd);
            break;
        case '3':
            printf("Option three.\n");
            //Send empty uts struct and get server uname values
            send_and_get_uname(sockfd, uts);
            break;
        case '4':
            //Get list of filenames in server uploa directory
            get_filenames(sockfd);
            printf("Option four.\n");
            break;
        case '5':
            printf("Goodbye!\n");
            break;
        default:
            //Print invalid choice error for anything other than
            //Previous cases
            printf("Invalid choice - 0 displays options...!\n");
            break;
        }
    } while (option != '5');

    //Deallocate uts struct
    free(uts);

    // send and receive a changed struct to/from the server
    employee *employee1;		
    employee1 = (employee *) malloc(sizeof(employee));

    // arbitrary values
    employee1->age = 23;
    employee1->id_number = 3;
    employee1->salary = 13000.21;

    int i;
    for (i = 0; i < 5; i++) {
        printf("(Counter: %d)\n", i);
        send_and_get_employee(sockfd, employee1);
        printf("\n");
    }

    free(employee1);

    // *** make sure sockets are cleaned up

    close(sockfd);

    exit(EXIT_SUCCESS);
} // end main()
