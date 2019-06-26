// Cwk2: server.c - multi-threaded server using readn() and writen()
//Includes
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
#include "rdwrn.h"

// thread function
void *client_handler(void *);

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

//Function prototypes
void get_and_send_employee(int, employee *);
void get_and_send_uname(int, utsname *);
void send_hello(int);

//Global variable to hold server launch time
struct timeval start;

//Get option number from client
char get_option(int socket) {
    //Declare variables to store option and size
    char option;
    size_t n;

    //Read size of option from client
    readn(socket, (unsigned char *) &n, sizeof(size_t));
    //Read option from client
    readn(socket, (unsigned char *) &option, n);

    //Return option to client handler menu
    return option;
}

//Print time server has been active in seconds
void printruntime(struct timeval tv) {
    //Declare int to store time elapsed
    int runtime;

    //Deduce runtime by subtracting server launch time from function call time
    runtime = tv.tv_sec - start.tv_sec;

    //Print runtime
    printf("Elapsed server time: %d seconds.\n", runtime);
}

//Signal handler to exit gracefully
static void handler(int sig, siginfo_t *siginfo, void *context) {
    //Alert user SIGINT was recieved
    printf("SIGINT Recieved...\n");
    //Struct to host current time
    struct timeval tv;

    //Check time of day can be found
    if(gettimeofday(&tv, NULL) == -1) {
        //Print error and exit with failure
        printf("Get time error\n");
        exit(EXIT_FAILURE);
    }

    //Print time server has been active
    printruntime(tv);
    //Close server gracefully
    exit(EXIT_SUCCESS);
}

//Listener for SIGINT
void signals() {
    //Declare and allocate space for sigaction struct
    struct sigaction act;
    memset(&act, '\0', sizeof(act));

    //Set pointer to handler function
    act.sa_sigaction = &handler;

    act.sa_flags = SA_SIGINFO;

    //Check exit status of sigaction
    if (sigaction(SIGINT, &act, NULL) == -1) {
        //Print errors and exit program on failure
        perror("sigaction");
        exit(EXIT_FAILURE);
    }
}

//Send ip address and student ID to client
void send_id(int connfd) {
    //Char array holding student ID
    char stu_id[] = " Student ID: S1712082";
    //Char pointer to store server ip
    char *ip;
    //Char array holding ethernet port
    char iface[] = "eth0";

    //struct to pull ip from
    struct ifreq ifr;

    //Set sa_family field of ifr to address family inet
    ifr.ifr_addr.sa_family = AF_INET;

    //Set ifr_name field to eth0 through iface variable
    strncpy(ifr.ifr_name, iface, IFNAMSIZ-1);

    //invoke ioctl to retrieve ip
    ioctl(connfd, SIOCGIFADDR, &ifr);

    //Concatenate ip from sin_addr field and student id then store in ip pointer
    ip = strcat(inet_ntoa(((struct sockaddr_in *)&ifr.ifr_addr)->sin_addr), stu_id);    

    //Set size of string to be sent
    size_t n = strlen(ip) + 1;
    //Send size of string to client
    writen(connfd, (unsigned char *) &n, sizeof(size_t));
    //Send string to client
    writen(connfd, (unsigned char *) ip, n);
}

//Send current server time to client
void send_time(int connfd) {
    //Declare variable to check time
    time_t t;
    //Char pointer to return to client
    char *str;

    //Check time is retrievable
    if ((t = time(NULL)) == -1) {
        //If not, print errors and exit program
        perror("time error");
        exit(EXIT_FAILURE);
    }

    //Generate time structure
    struct tm *tm;
    //Check localtime assignment is successful
    if ((tm = localtime(&t)) == NULL) {
        //If not, print errors and exit program
        perror("localtime error");
        exit(EXIT_FAILURE);
    }    

    //Assign time stamp to char pointer str
    str = asctime(tm);

    //Set size of string
    size_t n = strlen(str) + 1;
    //Send size of string to client
    writen(connfd, (unsigned char *) &n, sizeof(size_t));
    //Send string to client
    writen(connfd, (unsigned char *) str, n);
}

//Send filenames in upload directory to client
void send_filenames(int connfd) {
    //Structure for file names
    struct dirent **namelist;
    //Char to store list of filenames
    char files[256];
    //int used in for loop
    int i;
    //int used to store exit status of scandir
    int n;

    //Initialise files as empty string
    strcpy(files, "");

    //Invoke scandir and store exit status in n
    n = scandir("upload", &namelist, NULL, alphasort);
    if (n < 0) {
        //Print error on failure
        perror("scandir");
    } else {
        //Otherwise, iterate through list of files
        for(i = 0; i < n; i++) {
            //Concatenate current file name to files char array
            strcat(files, namelist[i]->d_name);

            //Concatenate seperator to files char array
            strcat(files, "*");

            //Deallocate memory for current file
            free(namelist[i]);
        }
        //Deallocate memory for namelist struct
        free(namelist);
    }

    //Remove empty space from files char array
    files[strcspn(files, "\n")] = 0;

    //Set size of files
    size_t k = strlen(files);
    //Send size of files to client
    writen(connfd, (unsigned char *) &k, sizeof(size_t));
    //Send files char array to client
    writen(connfd, (unsigned char *) files, k);
}

// you shouldn't need to change main() in the server except the port number
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
    // end socket setup

    //Check exit status for time of server launch
    if(gettimeofday(&start, NULL) == -1) {
        //Print errors and exit on failure
        printf("Get time error\n");
        exit(EXIT_FAILURE);
    }
    //Signal handling
    signals();

    //Accept and incoming connection
    puts("Waiting for incoming connections...");
    while (1) {
	printf("Waiting for a client to connect...\n");
	connfd =
	    accept(listenfd, (struct sockaddr *) &client_addr, &socksize);
	printf("Connection accepted...\n");

	pthread_t sniffer_thread;
        // third parameter is a pointer to the thread function, fourth is its actual parameter
	if (pthread_create
	    (&sniffer_thread, NULL, client_handler,
	     (void *) &connfd) < 0) {
	    perror("could not create thread");
	    exit(EXIT_FAILURE);
	}
	//Now join the thread , so that we dont terminate before the thread
	//pthread_join( sniffer_thread , NULL);
	printf("Handler assigned\n");
    }

    // never reached...
    // ** should include a signal handler to clean up
    exit(EXIT_SUCCESS);
} // end main()

// thread function - one instance of each for each connected client
// this is where the do-while loop will go
void *client_handler(void *socket_desc) {
    //Get the socket descriptor
    int connfd = *(int *) socket_desc;
    //Declare char for option to be recieved from client
    char option;

    //Declare utsname struct uts
    utsname *uts;
    //Set memory for uts
    uts = (utsname *) malloc(sizeof(utsname));

    //Welcome client to server
    send_hello(connfd);

    //Do while loop to recieve options from client
    do {
        //Set option to be called
        option = get_option(connfd);
        //Series of outcomes from options
        switch (option) {

        case '0':
            //Ignore option as it only re-prints menu on client side
            break;
        case '1':
            //Send ip and student id to client
            send_id(connfd);
            printf("Option one.\n");
            break;
        case '2':
            //Send current server time to client
            send_time(connfd);
            printf("Option two.\n");
            break;
        case '3':
            //Get uname structure, fill with server uname data
            //And return to client
            get_and_send_uname(connfd, uts);
            printf("Option three.\n");
            break;
        case '4':
            //Send files in upload directory to client
            send_filenames(connfd);
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

    //Deallocate uts from memory
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

    // always clean up sockets gracefully
    shutdown(connfd, SHUT_RDWR);
    close(connfd);

    return 0;
}  // end client_handler()

// how to send a string
void send_hello(int socket)
{
    //Declare and initialise welcome message as char array
    char hello_string[] = "hello SP student";

    //Set size of welcome message
    size_t n = strlen(hello_string) + 1;
    //Send size of welcome message to client
    writen(socket, (unsigned char *) &n, sizeof(size_t));	
    //Send welcome message to client
    writen(socket, (unsigned char *) hello_string, n);	  
} // end send_hello()

//Recieve uname struct from client, fill with server uname data
//And return to client
void get_and_send_uname(int socket, utsname *uts) {
    //Declare utsname struct named uts1
    struct utsname uts1;
    //Declare size variable named len
    size_t len;

    //Declare size variable named n and initialise with result of size reading
    //from client in bytes
    size_t n = readn(socket, (unsigned char *) &len, sizeof(size_t));
    //Print size of recieved struct in bits and bytes
    printf("Payload length: %zu (%zu bytes)\n", len, n);
    //REassign n as size of recieved uts struct
    n = readn(socket, (unsigned char *) uts, len);

    //Check uname success
    if (uname(&uts1) == -1) {
        //Print errors and exit program on failure
        perror("uname error");
        exit(EXIT_FAILURE);
    }

    //Send size of altered uts struct to client
    writen(socket, (unsigned char *) &len, sizeof(size_t));
    //Send uts struct to client
    writen(socket, (unsigned char *) &uts1, len);
}

// as before...
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

    // make arbitrary changes to the struct & then send it back
    e->age++;
    e->salary += 1.0;

    writen(socket, (unsigned char *) &payload_length, sizeof(size_t));
    writen(socket, (unsigned char *) e, payload_length);
}  // end get_and_send_employee()
