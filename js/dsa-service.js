/**
 * ACADENCE - DSA Lab Manual Intelligence Service
 * Source: Lab Manual 1-10 Programs.pdf (44 pages)
 * 
 * Maps faculty announcements directly to the authentic C program in the uploaded lab manual.
 * Strict: Never guesses. If no confident match exists, returns unable to identify.
 * Zero internal technical jargon or confidence scores exposed to students.
 */

// 10 authentic programs extracted directly from Lab Manual 1-10 Programs.pdf
export const DSA_PROGRAMS = [
  {
    programNumber: 1,
    title: 'Program 1: Array Operations on Student Marks (Search, Sort, Insert, Delete)',
    startPage: 1,
    endPage: 2,
    pageCount: 2,
    problemStatement: `1. A university maintains the marks of students in an array. During result processing, the examination cell needs to:
a. Search for a specific mark
b. Sort marks in ascending order
c. Insert a new student mark at a specified position
d. Delete a mark from a specified position

Write a C program using functions to perform these operations on student marks.`,
    code: `#include <stdio.h>
#include <stdlib.h>

void displayMarks(int marks[], int n) {
    if (n == 0) {
        printf("\nNo marks available to display.\n");
        return;
    }
    printf("\nStudent Marks: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", marks[i]);
    }
    printf("\n");
}

int searchMark(int marks[], int n, int key) {
    for (int i = 0; i < n; i++) {
        if (marks[i] == key) return i;
    }
    return -1;
}

void sortMarks(int marks[], int n) {
    int temp;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (marks[j] > marks[j + 1]) {
                temp = marks[j];
                marks[j] = marks[j + 1];
                marks[j + 1] = temp;
            }
        }
    }
    printf("\nMarks sorted in ascending order successfully.\n");
}

int insertMark(int marks[], int *n, int mark, int pos) {
    if (pos < 0 || pos > *n) {
        printf("\nInvalid position! Position should be between 0 and %d.\n", *n);
        return 0;
    }
    for (int i = *n; i > pos; i--) {
        marks[i] = marks[i - 1];
    }
    marks[pos] = mark;
    (*n)++;
    printf("\nMark %d inserted at position %d successfully.\n", mark, pos);
    return 1;
}

int deleteMark(int marks[], int *n, int pos) {
    if (*n == 0) {
        printf("\nArray is empty. Deletion not possible.\n");
        return 0;
    }
    if (pos < 0 || pos >= *n) {
        printf("\nInvalid position! Position should be between 0 and %d.\n", *n - 1);
        return 0;
    }
    int deleted = marks[pos];
    for (int i = pos; i < *n - 1; i++) {
        marks[i] = marks[i + 1];
    }
    (*n)--;
    printf("\nMark %d at position %d deleted successfully.\n", deleted, pos);
    return 1;
}`,
    output: `Enter initial number of student marks: 5
Enter 5 marks: 85 72 90 64 78

1. Search Mark  2. Sort Marks  3. Insert Mark  4. Delete Mark  5. Display  6. Exit
Enter choice: 2
Marks sorted in ascending order successfully.
Student Marks: 64 72 78 85 90

Enter choice: 1
Enter mark to search: 85
Mark 85 found at position 3 (index 3).`,
    vivaTopics: [
      'Array contiguous memory allocation in C',
      'Time complexity of linear search O(n) vs binary search O(log n)',
      'Bubble sort mechanism and pass comparison count',
      'Element shifting requirements during insertion and deletion'
    ]
  },
  {
    programNumber: 2,
    title: 'Program 2: Pointers & Structures (Matrix Row Maximum & Time Addition)',
    startPage: 3,
    endPage: 5,
    pageCount: 3,
    problemStatement: `2. A) Write a program to find the maximum element in each row of a matrix using pointers.
2. B) Define a structure TIME with members hour, minute, second. Write a C program to add two time periods using functions and pointers.`,
    code: `/* Part A: Matrix Row Maximum using Pointers */
#include <stdio.h>

void maxRow(int *p, int m, int n) {
    int max;
    for (int i = 0; i < m; i++) {
        max = *(p + i * n + 0);
        for (int j = 1; j < n; j++) {
            if (*(p + i * n + j) > max) {
                max = *(p + i * n + j);
            }
        }
        printf("Row %d Maximum: %d\n", i + 1, max);
    }
}

/* Part B: Structure TIME Addition */
struct TIME {
    int h, m, s;
};

void addTime(struct TIME *t1, struct TIME *t2, struct TIME *res) {
    res->s = t1->s + t2->s;
    res->m = t1->m + t2->m + (res->s / 60);
    res->s %= 60;
    res->h = t1->h + t2->h + (res->m / 60);
    res->m %= 60;
}`,
    output: `Enter elements of 2x3 matrix:
1 5 3
4 2 6
Row 1 Maximum: 5
Row 2 Maximum: 6

Enter time 1 (h m s): 1 30 45
Enter time 2 (h m s): 2 45 30
Total Time: 4:16:15`,
    vivaTopics: [
      'Pointer arithmetic with 2D array offsets *(p + i*n + j)',
      'Passing structures by reference via pointers (-> operator)',
      'Carry-over propagation for seconds to minutes and minutes to hours',
      'Memory footprint of struct TIME in C'
    ]
  },
  {
    programNumber: 3,
    title: 'Program 3: Structures & Functions (Bank Account Management System)',
    startPage: 6,
    endPage: 10,
    pageCount: 5,
    problemStatement: `3. Write a C program using structures and functions to manage bank account holders. The program should provide the following:
a. Display Accounts
b. Deposit
c. Withdraw (enforcing minimum balance)
d. Search Account
e. Total Balance of all accounts`,
    code: `#include <stdio.h>
#include <string.h>

struct Bank {
    int acc_no;
    char name[50];
    float balance;
};

void display(struct Bank b[], int n) {
    printf("\n--- Account Details ---\n");
    for (int i = 0; i < n; i++) {
        printf("Acc: %d | Name: %s | Balance: %.2f\n", b[i].acc_no, b[i].name, b[i].balance);
    }
}

void deposit(struct Bank b[], int n, int acc, float amount) {
    for (int i = 0; i < n; i++) {
        if (b[i].acc_no == acc) {
            b[i].balance += amount;
            printf("Deposited %.2f. New Balance: %.2f\n", amount, b[i].balance);
            return;
        }
    }
    printf("Account not found!\n");
}

void withdraw(struct Bank b[], int n, int acc, float amount) {
    for (int i = 0; i < n; i++) {
        if (b[i].acc_no == acc) {
            if (b[i].balance - amount < 500) {
                printf("Insufficient balance! Minimum balance of 500 required.\n");
            } else {
                b[i].balance -= amount;
                printf("Withdrawn %.2f. Remaining Balance: %.2f\n", amount, b[i].balance);
            }
            return;
        }
    }
    printf("Account not found!\n");
}`,
    output: `1. Display  2. Deposit  3. Withdraw  4. Search  5. Total Balance  6. Exit
Choice: 2
Enter account number: 101
Enter amount: 1500
Deposited 1500.00. New Balance: 6500.00

Choice: 3
Enter account number: 101
Enter amount: 6200
Insufficient balance! Minimum balance of 500 required.`,
    vivaTopics: [
      'Array of structures vs structure of arrays',
      'Pass-by-value vs pass-by-reference in C functions',
      'Data encapsulation using structs',
      'Boundary checks on financial balances'
    ]
  },
  {
    programNumber: 4,
    title: 'Program 4: Singly Linked List (Insert, Delete, Search & Display)',
    startPage: 11,
    endPage: 19,
    pageCount: 9,
    problemStatement: `4. Write a C program to implement a Singly Linked List with the following operations:
a. Insert a node at the beginning of the list.
b. Insert a node at a specified position.
c. Delete a node by value (key).
d. Search for a node with a given key.
e. Display the elements of the linked list.`,
    code: `#include <stdio.h>
#include <stdlib.h>

struct node {
    int data;
    struct node *next;
};
typedef struct node NODE;

NODE* insertfront(NODE *start, int item) {
    NODE *new_node = (NODE*)malloc(sizeof(NODE));
    if (new_node == NULL) {
        printf("Memory allocation failed!\n");
        return start;
    }
    new_node->data = item;
    new_node->next = start;
    start = new_node;
    printf("Inserted %d at front.\n", item);
    return start;
}

NODE* i_pos(NODE *start, int item, int position) {
    NODE *new_node = (NODE*)malloc(sizeof(NODE));
    new_node->data = item;
    if (position == 1) {
        new_node->next = start;
        return new_node;
    }
    NODE *ptr = start;
    int count = 1;
    while (ptr != NULL && count < position - 1) {
        ptr = ptr->next;
        count++;
    }
    if (ptr == NULL) {
        printf("Position out of bounds!\n");
        free(new_node);
        return start;
    }
    new_node->next = ptr->next;
    ptr->next = new_node;
    printf("Inserted %d at position %d.\n", item, position);
    return start;
}

NODE* deletekey(NODE *start, int key) {
    if (start == NULL) {
        printf("List is empty!\n");
        return NULL;
    }
    NODE *temp = start, *prev = NULL;
    if (start->data == key) {
        start = start->next;
        free(temp);
        printf("Node with key %d deleted.\n", key);
        return start;
    }
    while (temp != NULL && temp->data != key) {
        prev = temp;
        temp = temp->next;
    }
    if (temp == NULL) {
        printf("Key %d not found in list.\n", key);
        return start;
    }
    prev->next = temp->next;
    free(temp);
    printf("Node with key %d deleted.\n", key);
    return start;
}

void searchkey(NODE *start, int key) {
    NODE *ptr = start;
    int pos = 1;
    while (ptr != NULL) {
        if (ptr->data == key) {
            printf("Key %d found at position %d.\n", key, pos);
            return;
        }
        ptr = ptr->next;
        pos++;
    }
    printf("Key %d not found in the list.\n", key);
}

void display(NODE *start) {
    if (start == NULL) {
        printf("List is empty.\n");
        return;
    }
    NODE *ptr = start;
    printf("Linked List: ");
    while (ptr != NULL) {
        printf("%d -> ", ptr->data);
        ptr = ptr->next;
    }
    printf("NULL\n");
}`,
    output: `Enter choice: 1 (Insert at front)
Enter data: 22
Inserted 22 at front.

Enter choice: 1
Enter data: 33
Inserted 33 at front.

Enter choice: 2 (Insert at position)
Enter data: 44, position: 2
Inserted 44 at position 2.

Enter choice: 5 (Display)
Linked List: 33 -> 44 -> 22 -> NULL

Enter choice: 4 (Search)
Enter key: 22
Key 22 found at position 3.`,
    vivaTopics: [
      'Dynamic memory allocation with malloc() and sizeof(NODE)',
      'Why linked lists avoid contiguous memory restrictions of arrays',
      'Time complexity of insertion at front O(1) vs position O(n)',
      'Freeing memory with free() to prevent memory leaks'
    ]
  },
  {
    programNumber: 5,
    title: 'Program 5: Circular Singly Linked List (City Transport Bus Stop Route)',
    startPage: 20,
    endPage: 24,
    pageCount: 5,
    problemStatement: `5. A city transport department maintains a circular list of bus stops (Stop numbers) on a circular route. Since the route is circular, the last stop connects back to the first stop.
Write a C program to implement a Circular Singly Linked List with operations:
a. Insert stop at beginning
b. Delete stop by stop number
c. Search stop
d. Display alternate stops along the circular route`,
    code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int stopNumber;
    struct Node *next;
};

struct Node* insertFront(struct Node *last, int stop) {
    struct Node *newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->stopNumber = stop;
    if (last == NULL) {
        newNode->next = newNode;
        return newNode;
    }
    newNode->next = last->next;
    last->next = newNode;
    return last;
}

void displayAlternate(struct Node *last) {
    if (last == NULL) {
        printf("Bus route is empty!\n");
        return;
    }
    struct Node *current = last->next;
    printf("Alternate Bus Stops: ");
    do {
        printf("[Stop %d] -> ", current->stopNumber);
        current = current->next;
        if (current != last->next) {
            current = current->next; // Skip one stop
        }
    } while (current != last->next && current != last->next->next);
    printf("(circular loop)\n");
}`,
    output: `Enter Stop number to insert: 10
Enter Stop number to insert: 20
Enter Stop number to insert: 30
Enter Stop number to insert: 40

Display alternate stops:
Alternate Bus Stops: [Stop 40] -> [Stop 20] -> (circular loop)`,
    vivaTopics: [
      'Circular linked list termination condition (ptr != last->next)',
      'Advantage of maintaining pointer to "last" node instead of "head"',
      'Applications of circular lists: round-robin scheduling, bus routes',
      'Detecting loops and handling single-node circular lists'
    ]
  },
  {
    programNumber: 6,
    title: 'Program 6: Doubly Linked List (Music Streaming Playlist)',
    startPage: 25,
    endPage: 28,
    pageCount: 4,
    problemStatement: `6. A music streaming application maintains a playlist where each song (song number) is connected to both its previous song and next song.
Write a C program to implement a Doubly Linked List for playlist management:
a. Insert a new song at the end
b. Insert a song after a specific song
c. Delete a song by song ID
d. Display songs in forward and reverse order`,
    code: `#include <stdio.h>
#include <stdlib.h>

struct SongNode {
    int songId;
    struct SongNode *prev;
    struct SongNode *next;
};

struct SongNode* insertEnd(struct SongNode *head, int id) {
    struct SongNode *newNode = (struct SongNode*)malloc(sizeof(struct SongNode));
    newNode->songId = id;
    newNode->next = NULL;
    if (head == NULL) {
        newNode->prev = NULL;
        return newNode;
    }
    struct SongNode *temp = head;
    while (temp->next != NULL) temp = temp->next;
    temp->next = newNode;
    newNode->prev = temp;
    return head;
}

void displayForward(struct SongNode *head) {
    struct SongNode *temp = head;
    printf("Playlist (Forward): ");
    while (temp != NULL) {
        printf("Song #%d <-> ", temp->songId);
        temp = temp->next;
    }
    printf("END\n");
}`,
    output: `1. Add Song  2. Add Song After  3. Delete Song  4. Display  5. Exit
Choice: 1
Enter Song ID: 101
Choice: 1
Enter Song ID: 102
Choice: 4
Playlist (Forward): Song #101 <-> Song #102 <-> END`,
    vivaTopics: [
      'Two pointers per node: prev and next memory overhead',
      'Bidirectional traversal advantage in playlists and browser tabs',
      'Updating 4 pointer links during node insertion/deletion in DLL',
      'Handling boundary deletions (head node vs tail node)'
    ]
  },
  {
    programNumber: 7,
    title: 'Program 7: Circular Doubly Linked List (Tour Itinerary Round-Trip Package)',
    startPage: 29,
    endPage: 33,
    pageCount: 5,
    problemStatement: `7. A travel agency maintains a list of tourist destinations for a round-trip package. Since the tour starts and ends at the base destination, the itinerary forms a circular doubly linked list.
Write a C program to implement:
a. Insert destination at end
b. Delete destination by destination ID
c. Display itinerary forward
d. Display itinerary reverse`,
    code: `#include <stdio.h>
#include <stdlib.h>

struct Destination {
    int destId;
    struct Destination *prev;
    struct Destination *next;
};

struct Destination* insertEnd(struct Destination *head, int id) {
    struct Destination *newNode = (struct Destination*)malloc(sizeof(struct Destination));
    newNode->destId = id;
    if (head == NULL) {
        newNode->next = newNode;
        newNode->prev = newNode;
        return newNode;
    }
    struct Destination *last = head->prev;
    newNode->next = head;
    head->prev = newNode;
    newNode->prev = last;
    last->next = newNode;
    return head;
}`,
    output: `Enter Destination ID: 101
Enter Destination ID: 102
Enter Destination ID: 103

Forward Itinerary: [101] -> [102] -> [103] -> [101]
Reverse Itinerary: [103] -> [102] -> [101] -> [103]`,
    vivaTopics: [
      'Circular Doubly Linked List symmetry: head->prev == last && last->next == head',
      'Zero NULL pointers in CDLL structure',
      'Round-trip travel modeling using bidirectional circular links',
      'Deleting the single remaining node in CDLL'
    ]
  },
  {
    programNumber: 8,
    title: 'Program 8: Stack Operations (Web Browser History Management)',
    startPage: 34,
    endPage: 37,
    pageCount: 4,
    problemStatement: `8. A web browser maintains the history of recently visited web pages. Whenever a user visits a new page, it is added to the top of the history stack. When the Back button is pressed, the most recent page is removed (LIFO order).
Write a C program to simulate web browser history using a stack implemented with an array:
a. Visit a new webpage (Push)
b. Press Back (Pop)
c. Display History`,
    code: `#include <stdio.h>
#include <stdlib.h>
#define MAX 5

int stack[MAX];
int top = -1;

void push(int pageId) {
    if (top == MAX - 1) {
        printf("History stack overflow! Max %d pages stored.\n", MAX);
        return;
    }
    stack[++top] = pageId;
    printf("Webpage %d added to history.\n", pageId);
}

void pop() {
    if (top == -1) {
        printf("History empty! Cannot go back.\n");
        return;
    }
    printf("Navigated back from Webpage %d.\n", stack[top--]);
}

void display() {
    if (top == -1) {
        printf("No browser history.\n");
        return;
    }
    printf("\n--- Browser History (Top to Bottom) ---\n");
    for (int i = top; i >= 0; i--) {
        printf("[Page %d]%s\n", stack[i], (i == top) ? " <- Current Page" : "");
    }
}`,
    output: `1. Visit page  2. Press Back  3. Display History  4. Exit
Choice: 1
Enter Webpage ID: 101
Webpage 101 added to history.

Choice: 1
Enter Webpage ID: 204
Webpage 204 added to history.

Choice: 3
--- Browser History (Top to Bottom) ---
[Page 204] <- Current Page
[Page 101]`,
    vivaTopics: [
      'Stack LIFO (Last In First Out) operational principle',
      'Stack overflow (top == MAX-1) and underflow (top == -1) conditions',
      'Applications of stacks: undo/redo, call stacks, syntax parsing',
      'Comparison between array and linked list stack implementations'
    ]
  },
  {
    programNumber: 9,
    title: 'Program 9: Stack Applications (Infix to Postfix Conversion & Evaluation)',
    startPage: 38,
    endPage: 41,
    pageCount: 4,
    problemStatement: `9. A) Write a C program to convert a given infix expression into its equivalent postfix expression using a stack.
9. B) Write a C program to evaluate a postfix expression using a stack.`,
    code: `#include <stdio.h>
#include <ctype.h>
#include <string.h>

char stack[50];
int top = -1;

void push(char c) { stack[++top] = c; }
char pop() { return stack[top--]; }

int precedence(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return -1;
}

void infixToPostfix(char infix[], char postfix[]) {
    int j = 0;
    for (int i = 0; infix[i] != '\\0'; i++) {
        char ch = infix[i];
        if (isalnum(ch)) {
            postfix[j++] = ch;
        } else if (ch == '(') {
            push(ch);
        } else if (ch == ')') {
            while (top != -1 && stack[top] != '(') postfix[j++] = pop();
            pop(); // discard '('
        } else {
            while (top != -1 && precedence(stack[top]) >= precedence(ch)) {
                postfix[j++] = pop();
            }
            push(ch);
        }
    }
    while (top != -1) postfix[j++] = pop();
    postfix[j] = '\\0';
}`,
    output: `Enter infix expression: (A+B)*(C-D)
The corresponding postfix expression is: AB+CD-*

Evaluation:
Enter postfix expression: 53+82-*
Evaluated result: 48`,
    vivaTopics: [
      'Operator precedence and associativity rules',
      'Parentheses handling in stack during expression conversion',
      'Why postfix notation eliminates parentheses ambiguity in compilers',
      'Stack operand popping sequence during binary operations'
    ]
  },
  {
    programNumber: 10,
    title: 'Program 10: Recursion & Searching (Tower of Hanoi & Binary Search)',
    startPage: 42,
    endPage: 44,
    pageCount: 3,
    problemStatement: `10. A) Write a C program to solve the Tower of Hanoi problem using recursion and display the sequence of disk movements.
10. B) A college maintains a sorted list of student roll numbers. Write a C program to search for a given roll number using Binary Search.`,
    code: `#include <stdio.h>

/* Part A: Tower of Hanoi */
void towerOfHanoi(int n, char from, char to, char aux) {
    if (n == 1) {
        printf("Move disk 1 from %c to %c\n", from, to);
        return;
    }
    towerOfHanoi(n - 1, from, aux, to);
    printf("Move disk %d from %c to %c\n", n, from, to);
    towerOfHanoi(n - 1, aux, to, from);
}

/* Part B: Binary Search */
int binarySearch(int arr[], int low, int high, int key) {
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == key) return mid;
        if (arr[mid] < key) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
    output: `Tower of Hanoi (3 Disks):
Move disk 1 from A to C
Move disk 2 from A to B
Move disk 1 from C to B
Move disk 3 from A to C
Move disk 1 from B to A
Move disk 2 from B to C
Move disk 1 from A to C

Binary Search:
Sorted Roll Numbers: 101 104 109 115 120 125
Search Roll Number: 115
Found at position 4 (index 3).`,
    vivaTopics: [
      'Recursive relation T(n) = 2T(n-1) + 1 => O(2^n) disk moves',
      'Base condition in recursive Tower of Hanoi',
      'Binary search prerequisite: elements must be sorted',
      'Time complexity of binary search O(log n) vs linear search O(n)'
    ]
  }
];

/**
 * Identifies the exact matching program from faculty announcement text.
 * Strict: Never guesses. If confidence is insufficient, returns matched: false.
 */
export function matchUpcomingLabProgram(announcementText, documents) {
  if (!announcementText) {
    return {
      matched: false,
      message: 'Unable to identify the upcoming program from the available lab material.'
    };
  }

  const text = announcementText.toLowerCase();

  // Explicit program number match
  const progMatches = text.match(/(?:program|experiment|prog|exp|lab)\s*#?\s*([0-9]+)/i);
  let targetNum = progMatches ? parseInt(progMatches[1], 10) : null;

  // Keyword-based topic match if number wasn't explicitly written
  if (!targetNum) {
    if (text.includes('singly linked') || text.includes('sll') || text.includes('linked list operations')) targetNum = 4;
    else if (text.includes('circular bus') || text.includes('circular singly') || text.includes('bus stop')) targetNum = 5;
    else if (text.includes('playlist') || text.includes('music') || text.includes('doubly linked list')) targetNum = 6;
    else if (text.includes('tourist') || text.includes('itinerary') || text.includes('circular doubly')) targetNum = 7;
    else if (text.includes('browser history') || (text.includes('stack') && text.includes('history'))) targetNum = 8;
    else if (text.includes('infix to postfix') || text.includes('postfix evaluation')) targetNum = 9;
    else if (text.includes('tower of hanoi') || (text.includes('binary search') && text.includes('roll'))) targetNum = 10;
    else if (text.includes('student marks') || (text.includes('array') && text.includes('marks'))) targetNum = 1;
    else if (text.includes('matrix row') || text.includes('time addition') || text.includes('pointers')) targetNum = 2;
    else if (text.includes('bank account') || text.includes('bank')) targetNum = 3;
  }

  if (targetNum && targetNum >= 1 && targetNum <= 10) {
    const prog = DSA_PROGRAMS.find(p => p.programNumber === targetNum);
    if (prog) {
      return {
        matched: true,
        program: prog,
        sourcePdfName: 'Lab Manual 1-10 Programs.pdf',
        sourcePdfPath: 'docs/Lab Manual 1-10 Programs.pdf',
        totalPages: 44,
        relevantPages: `Pages ${prog.startPage}–${prog.endPage} of 44`
      };
    }
  }

  // Not confidently matched — strict fallback, do not guess
  return {
    matched: false,
    message: 'Unable to identify the upcoming program from the available lab material.'
  };
}
