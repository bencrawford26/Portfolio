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

typedef struct {
    int id_number;
    int age;
    float salary;
} employee;

typedef struct {
    char *nodename;
    char *sysname;
    char *release;
    char *version;
    char *machine;
} utsname;

void send_and_get_employee(int socket, employee *e)  
{
    size_t payload_length = sizeof(employee);

    writen(socket, (unsigned char *) &payload_length, sizeof(size_t));	
    writen(socket, (unsigned char *) e, payload_length);	 		

    readn(socket, (unsigned char *) &payload_length, sizeof(size_t));	   
    readn(socket, (unsigned char *) e, payload_length);

    printf("Age is %d\n", e->age);
    printf("id is %d\n", e->id_number);
    printf("Salary is %6.2f\n", e->salary);    
}

void send_and_get_uname(int socket, utsname *uts) {
    size_t len = sizeof(utsname);
    struct utsname uts1;

    if (uname(&uts1) == -1) {
        perror("uname error");
        exit(EXIT_FAILURE);
    }

    writen(socket, (unsigned char *) &len, sizeof(size_t));  
    writen(socket, (unsigned char *) &uts1, len);

    readn(socket, (unsigned char *) &len, sizeof(size_t));      
    readn(socket, (unsigned char *) &uts1, len);

    printf("Node name:    %s\n", uts1.nodename);
    printf("System name:  %s\n", uts1.sysname);
    printf("Release:      %s\n", uts1.release);
    printf("Version:      %s\n", uts1.version);
    printf("Machine:      %s\n", uts1.machine);
}

void get_hello(int socket)
{
    char hello_string[32];
    size_t k;

    readn(socket, (unsigned char *) &k, sizeof(size_t));	
    readn(socket, (unsigned char *) hello_string, k);

    printf("Hello String: %s\n", hello_string);
    printf("Received: %zu bytes\n\n", k);
}

void get_id(int socket) {
    size_t k;

    readn(socket, (unsigned char *) &k, sizeof(size_t));

    char stu_id[k];

    readn(socket, (unsigned char *) stu_id, k);

    printf("%s\n", stu_id);
}

void get_time(int socket) {
    size_t k;

    readn(socket, (unsigned char *) &k, sizeof(size_t));

    char time[k];

    readn(socket, (unsigned char *) time, k);

    printf("Current servertime: %s", time);
}

char send_option(int socket) {
    char input[INPUTSIZ];
    char option;

    printf("option> ");
    fgets(input, INPUTSIZ, stdin);
    input[strcspn(input, "\n")] = 0;
    option = input[0];
    if (strlen(input) > 1) {
        option = 'x';
    }

    size_t k = sizeof(char);

    writen(socket, (unsigned char *) &k, sizeof(size_t));
    writen(socket, (unsigned char *) &option, k);

    return option;
}

void get_filenames(int socket) {
    size_t k;
    char *filelist;
    const char delim[1] = "*";
    int count = 0;

    readn(socket, (unsigned char *) &k, sizeof(size_t));
    char files[k];
    readn(socket, (unsigned char *) files, k);

    filelist = strtok(files, delim);

    while(filelist != NULL) {
        count++;
        printf("File %d: %s\n", count, filelist);

        filelist = strtok(NULL, delim);
    }
}

void displaymenu() {
    printf("0. Display menu.\n");
    printf("1. Obtain student ID and server IP.\n");
    printf("2. Obtain server time.\n");
    printf("3. Obtain server uname info.\n");
    printf("4. Obtain file names in server upload directory.\n");
    printf("5. Exit.\n");
}

int main(void)
{
    int sockfd = 0;
    struct sockaddr_in serv_addr;

    if ((sockfd = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
	perror("Error - could not create socket");
	exit(EXIT_FAILURE);
    }

    serv_addr.sin_family = AF_INET;

    serv_addr.sin_port = htons(50031);
    serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1");

    if (connect(sockfd, (struct sockaddr *) &serv_addr, sizeof(serv_addr)) == -1)  {
	perror("Error - connect failed");
	exit(1);
    } else
       printf("Connected to server...\n");
    char option;

    utsname *uts;
    uts = (utsname *) malloc(sizeof(utsname));

    get_hello(sockfd);

    displaymenu();
    do {
        option = send_option(sockfd);

        switch (option) {
        case '0':
            displaymenu();
            break;
        case '1':
            printf("Option one.\n");
            get_id(sockfd);
            break;
        case '2':
            printf("Option two.\n");
            get_time(sockfd);
            break;
        case '3':
            printf("Option three.\n");
            send_and_get_uname(sockfd, uts);
            break;
        case '4':
            printf("Option four.\n");
            get_filenames(sockfd);
            break;
        case '5':
            printf("Goodbye!\n");
            break;
        default:
            printf("Invalid choice - 0 displays options...!\n");
            break;
        }
    } while (option != '5');

    free(uts);

    employee *employee1;		
    employee1 = (employee *) malloc(sizeof(employee));

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

    close(sockfd);

    exit(EXIT_SUCCESS);
}
