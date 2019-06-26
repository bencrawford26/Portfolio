#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <pthread.h>
#include <net/if.h>
#include <sys/ioctl.h>
#include <time.h>
#include <sys/utsname.h>
#include <dirent.h>
#include <sys/stat.h>
#include <signal.h>
#include <sys/time.h>
#include "rdwrn.h"

void *client_handler(void *);

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

void get_and_send_employee(int, employee *);
void get_and_send_uname(int, utsname *);
void send_hello(int);

struct timeval start;

char get_option(int socket) {
    char option;
    size_t n;

    readn(socket, (unsigned char *) &n, sizeof(size_t));
    readn(socket, (unsigned char *) &option, n);

    return option;
}

void printruntime(struct timeval tv) {
    int runtime;

    runtime = tv.tv_sec - start.tv_sec;

    printf("Elapsed server time: %d seconds.\n", runtime);
}

static void handler(int sig, siginfo_t *siginfo, void *context) {
    printf("SIGINT Recieved...\n");
    struct timeval tv;

    if(gettimeofday(&tv, NULL) == -1) {
        printf("Get time error\n");
        exit(EXIT_FAILURE);
    }

    printruntime(tv);
    exit(EXIT_SUCCESS);
}

void signals() {
    struct sigaction act;
    memset(&act, '\0', sizeof(act));

    act.sa_sigaction = &handler;

    act.sa_flags = SA_SIGINFO;

    if (sigaction(SIGINT, &act, NULL) == -1) {
        perror("sigaction");
        exit(EXIT_FAILURE);
    }
}

void send_id(int connfd) {
    char stu_id[] = " Student ID: S1712082";
    char *ip;
    char iface[] = "eth0";

    struct ifreq ifr;

    ifr.ifr_addr.sa_family = AF_INET;

    strncpy(ifr.ifr_name, iface, IFNAMSIZ-1);

    ioctl(connfd, SIOCGIFADDR, &ifr);

    ip = strcat(inet_ntoa(((struct sockaddr_in *)&ifr.ifr_addr)->sin_addr), stu_id);

    size_t n = strlen(ip) + 1;
    writen(connfd, (unsigned char *) &n, sizeof(size_t));
    writen(connfd, (unsigned char *) ip, n);
}

void send_time(int connfd) {
    time_t t;
    char *str;

    if ((t = time(NULL)) == -1) {
        perror("time error");
        exit(EXIT_FAILURE);
    }

    struct tm *tm;
    if ((tm = localtime(&t)) == NULL) {
        perror("localtime error");
        exit(EXIT_FAILURE);
    }    

    str = asctime(tm);

    size_t n = strlen(str) + 1;
    writen(connfd, (unsigned char *) &n, sizeof(size_t));
    writen(connfd, (unsigned char *) str, n);
}

void send_filenames(int connfd) {
    struct dirent **namelist;
    char files[256];
    int i;
    int n;

    strcpy(files, "");

    n = scandir("upload", &namelist, NULL, alphasort);
    if (n < 0) {
        perror("scandir");
    } else {
        for(i = 0; i < n; i++) {
            strcat(files, namelist[i]->d_name);

            strcat(files, "*");

            free(namelist[i]);
        }
        free(namelist);
    }

    files[strcspn(files, "\n")] = 0;

    size_t k = strlen(files);
    writen(connfd, (unsigned char *) &k, sizeof(size_t));
    writen(connfd, (unsigned char *) files, k);
}

int main(void) {
    int listenfd = 0, connfd = 0;

    struct sockaddr_in serv_addr;
    struct sockaddr_in client_addr;
    socklen_t socksize = sizeof(struct sockaddr_in);
    listenfd = socket(AF_INET, SOCK_STREAM, 0);
    memset(&serv_addr, '0', sizeof(serv_addr));

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = htonl(INADDR_ANY);
    serv_addr.sin_port = htons(50031);

    bind(listenfd, (struct sockaddr *) &serv_addr, sizeof(serv_addr));

    if (listen(listenfd, 10) == -1) {
    	perror("Failed to listen");
    	exit(EXIT_FAILURE);
    }


    if(gettimeofday(&start, NULL) == -1) {
        printf("Get time error\n");
        exit(EXIT_FAILURE);
    }
    signals();


    puts("Waiting for incoming connections...");
    while (1) {
	printf("Waiting for a client to connect...\n");
	connfd =
	    accept(listenfd, (struct sockaddr *) &client_addr, &socksize);
	printf("Connection accepted...\n");

	pthread_t sniffer_thread;
	if (pthread_create
	    (&sniffer_thread, NULL, client_handler,
	     (void *) &connfd) < 0) {
	    perror("could not create thread");
	    exit(EXIT_FAILURE);
	}
	printf("Handler assigned\n");
    }

    exit(EXIT_SUCCESS);
}

void *client_handler(void *socket_desc) {
    int connfd = *(int *) socket_desc;
    char option;

    utsname *uts;
    uts = (utsname *) malloc(sizeof(utsname));

    send_hello(connfd);

    do {
        option = get_option(connfd);
        switch (option) {
        case '0':
            break;
        case '1':
            send_id(connfd);
            printf("Option one.\n");
            break;
        case '2':
            send_time(connfd);
            printf("Option two.\n");
            break;
        case '3':
            get_and_send_uname(connfd, uts);
            printf("Option three.\n");
            break;
        case '4':
            send_filenames(connfd);
            printf("Option four.\n");
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

    int i;
    for (i = 0; i < 5; i++) {
	printf("(Counter: %d)\n", i);
	get_and_send_employee(connfd, employee1);
	printf("\n");
    }

    free(employee1);

    shutdown(connfd, SHUT_RDWR);
    close(connfd);

    printf("Thread %lu exiting\n", (unsigned long) pthread_self());

    shutdown(connfd, SHUT_RDWR);
    close(connfd);

    return 0;
}

void send_hello(int socket)
{
    char hello_string[] = "hello SP student";

    size_t n = strlen(hello_string) + 1;
    writen(socket, (unsigned char *) &n, sizeof(size_t));	
    writen(socket, (unsigned char *) hello_string, n);	  
}

void get_and_send_uname(int socket, utsname *uts) {
    struct utsname uts1;
    size_t len;

    size_t n = readn(socket, (unsigned char *) &len, sizeof(size_t));
    printf("Payload length: %zu (%zu bytes)\n", len, n);
    n = readn(socket, (unsigned char *) uts, len);

    if (uname(&uts1) == -1) {
        perror("uname error");
        exit(EXIT_FAILURE);
    }

    writen(socket, (unsigned char *) &len, sizeof(size_t));
    writen(socket, (unsigned char *) &uts1, len);
}

void get_and_send_employee(int socket, employee * e)
{
    size_t payload_length;

    size_t n =
	readn(socket, (unsigned char *) &payload_length, sizeof(size_t));
    printf("payload_length is: %zu (%zu bytes)\n", payload_length, n);
    n = readn(socket, (unsigned char *) e, payload_length);

    printf("Age is %d\n", e->age);
    printf("id is %d\n", e->id_number);
    printf("Salary is %6.2f\n", e->salary);
    printf("(%zu bytes)\n", n);

    e->age++;
    e->salary += 1.0;

    writen(socket, (unsigned char *) &payload_length, sizeof(size_t));
    writen(socket, (unsigned char *) e, payload_length);
}
