// Code drills: Advanced Programming. Code written fresh in the course's style (same class/method names as the notes).
const D = (book, group, title, task, code, extra) => Object.assign({ book, group, title, task, code }, extra || {});
const R = String.raw;
const DRILLS = [
// ===== Ch 1-2 =====
D("AdvProg", "1–2 · Basics & recursion", "Precondition check + Javadoc", "Write `squareRoot(double x)` with a Javadoc comment (@param, @return, @throws), PRE/POST comments, and a precondition check that throws an exception for public callers.", R`
/** Approximates the square root using Newton-Raphson.
  * @param x The value whose square root is required.
  * @return An approximation to the square root of x.
  * @throws IllegalArgumentException if x < 0.
  */
public static double squareRoot (double x)
// PRE:  x >= 0
// POST: returns an approximation to the square root of x
  { if (x < 0)
      throw new IllegalArgumentException("x < 0");
    if (x == 0)
      return 0;
    double guess = x;
    for (int k = 0; k < 30; k++)
      guess = (guess + x / guess) / 2;
    return guess;
  } // squareRoot`, { notes: "Public methods should throw exceptions for precondition violations (Oracle guideline). `assert x >= 0;` is fine for private or internal checks, but assertions are off unless enabled at runtime." }),
D("AdvProg", "1–2 · Basics & recursion", "Factorial: recursive", "Recursive factorial with PRE/POST and a stop case.", R`
public int factorial (int n)
// PRE:  n >= 0
// POST: returns n! (nonsense if it overflows)
  { if (n == 0)
      return 1;                     // stop case
    else
      return n * factorial(n - 1);  // recursive call
  } // factorial`),
D("AdvProg", "1–2 · Basics & recursion", "Factorial: iterative", "Exercise 2.1: iterative factorial. This is the version you'd actually use.", R`
public int factorial (int n)
  { int result = 1;
    for (int k = 2; k <= n; k++)
      result *= k;
    return result;
  } // factorial`),
D("AdvProg", "1–2 · Basics & recursion", "Read and write backwards (recursive)", "Read characters until '\\n' and print them in reverse using recursion. Explain why the local variable matters.", R`
public void readAndWriteBackwards () throws IOException
  { char ch = (char)System.in.read();
    if (ch != '\n')
      readAndWriteBackwards();   // write the rest backwards first
    System.out.print(ch);        // then this character
  } // readAndWriteBackwards`, { notes: "Each call has its **own** `ch`. If `ch` were an instance or class variable, every call would share it and the program would break." }),
D("AdvProg", "1–2 · Basics & recursion", "Fibonacci: recursive and iterative", "Exercise 2.3: f1 = f2 = 1, fn = fn-1 + fn-2. Write both versions.", R`
public static long fibRec (int n)
  { if (n <= 2)
      return 1;
    return fibRec(n - 1) + fibRec(n - 2);
  } // fibRec

public static long fibIter (int n)
  { long a = 1, b = 1;
    for (int k = 3; k <= n; k++)
      { long c = a + b;
        a = b;
        b = c;
      }
    return b;
  } // fibIter`, { notes: "The recursive version is exponential (it recomputes the same values); the iterative one is O(n)." }),
D("AdvProg", "1–2 · Basics & recursion", "Towers of Hanoi", "Exercise 2.5 / **June 2023 Q2**. Complete `hanoi(numDisks, fromTower, toTower, spareTower)` using `moveDisk(from, to)`.", R`
private static void hanoi (int numDisks, Tower fromTower,
                           Tower toTower, Tower spareTower)
  { if (numDisks == 1)
      moveDisk(fromTower, toTower);
    else
      { hanoi(numDisks - 1, fromTower, spareTower, toTower); // n-1 to spare
        moveDisk(fromTower, toTower);                       // biggest disk
        hanoi(numDisks - 1, spareTower, toTower, fromTower); // n-1 on top
      }
  } // hanoi

private static void moveDisk (Tower fromTower, Tower toTower)
  { toTower.add(fromTower.remove());
  } // moveDisk`, { exam: "June 2023 Q2", notes: "2ⁿ − 1 moves, so O(2ⁿ). Both recursive calls swap the roles of the towers." }),
D("AdvProg", "1–2 · Basics & recursion", "Gene sequences: replace every X", "Exercise 2.6: print every sequence you get by replacing each X with A, C, T or G.", R`
public static void expand (String seq)
  { int pos = seq.indexOf('X');
    if (pos < 0)
      System.out.println(seq);          // no X's left
    else
      for (char base : new char[] {'A', 'C', 'T', 'G'})
        expand(seq.substring(0, pos) + base + seq.substring(pos + 1));
  } // expand`),
D("AdvProg", "1–2 · Basics & recursion", "Interfaces: PersonalAssistant", "Model PAs as Secretaries with managerial responsibilities, using an interface (Java only has single inheritance).", R`
public interface ManagerialResponsibilities
  { public void manage();
  } // interface ManagerialResponsibilities

public class Manager extends Employee implements ManagerialResponsibilities
  { public void manage () { /* ... */ }
  } // class Manager

public class PersonalAssistant extends Secretary implements ManagerialResponsibilities
  { public void manage () { /* ... */ }
  } // class PersonalAssistant

public void runOffice (ManagerialResponsibilities mgr)
  { mgr.manage();                         // only interface methods visible
    if (mgr instanceof PersonalAssistant pa)
      { /* use pa's PA-specific methods */ }
  } // runOffice`),

// ===== Ch 4 =====
D("AdvProg", "4 · Vectors & lists", "IntegerVector: fields + constructors", "Data members, a sized constructor with a precondition check, and a default constructor (size 100).", R`
public class IntegerVector
  { private int[] data;      // the array of data
    private int numElements; // number of elements in use

    public IntegerVector (int initSize)
      { if (initSize <= 0)
          throw new IllegalArgumentException("initSize <= 0");
        numElements = 0;
        data = new int[initSize];
      } // constructor

    public IntegerVector ()
      { this(100);
      } // constructor`),
D("AdvProg", "4 · Vectors & lists", "IntegerVector: add (end and at position)", "Both `add(item)` and `add(item, position)`. Positions past the end just append.", R`
public void add (int item)
  { if (numElements + 1 > data.length)
      throw new NoSpaceAvailableException("no space available");
    data[numElements++] = item;
  } // add

public void add (int item, int position)
  { if (numElements + 1 > data.length)
      throw new NoSpaceAvailableException("no space available");
    if (position < 0)
      throw new IllegalArgumentException("position is negative");
    if (position >= numElements)
      data[numElements++] = item;          // add at end
    else
      { for (int k = numElements - 1; k >= position; k--)
          data[k + 1] = data[k];          // move elements up
        data[position] = item;
        numElements++;
      }
  } // add`),
D("AdvProg", "4 · Vectors & lists", "IntegerVector: get, set, position, remove, length", "The accessors and the remaining list operations.", R`
public int get (int index)
  { if (index < 0 || index >= numElements)
      throw new IndexOutOfBoundsException("index is out of range");
    return data[index];
  } // get

public void set (int index, int item)
  { if (index < 0 || index >= numElements)
      throw new IndexOutOfBoundsException("index is out of range");
    data[index] = item;
  } // set

public int position (int item)
  { for (int k = 0; k < numElements; k++)
      if (data[k] == item)
        return k;
    return -1;                             // not found
  } // position

public void remove (int position)
  { if (position < 0 || position >= numElements)
      throw new IndexOutOfBoundsException("position out of range");
    for (int k = position + 1; k < numElements; k++)
      data[k - 1] = data[k];               // move elements down
    numElements--;
  } // remove

public int length ()
  { return numElements;
  } // length`),
D("AdvProg", "4 · Vectors & lists", "IntegerVector: toString", "Build \"[a, b, c]\" with a StringBuffer.", R`
public String toString ()
  { StringBuffer s = new StringBuffer("[");
    for (int k = 0; k < numElements; k++)
      { s.append(data[k]);
        if (k < numElements - 1)
          s.append(", ");
      }
    s.append("]");
    return s.toString();
  } // toString`, { notes: "StringBuffer is mutable; String isn't, so concatenating Strings in a loop creates many objects." }),
D("AdvProg", "4 · Vectors & lists", "IntegerVector: grow when full (Ex 4.9)", "Instead of throwing when full, allocate a bigger array and copy across.", R`
private void grow ()
  { int[] bigger = new int[data.length * 2];
    for (int k = 0; k < numElements; k++)
      bigger[k] = data[k];
    data = bigger;
  } // grow

public void add (int item)
  { if (numElements == data.length)
      grow();
    data[numElements++] = item;
  } // add`),
D("AdvProg", "4 · Vectors & lists", "IntegerVector: reverse & deleteAll (Ex 4.2/4.4)", "Reverse the vector in place; delete all elements.", R`
public void reverse ()
  { for (int lo = 0, hi = numElements - 1; lo < hi; lo++, hi--)
      { int tmp = data[lo];
        data[lo] = data[hi];
        data[hi] = tmp;
      }
  } // reverse

public void deleteAll ()
  { numElements = 0;
  } // deleteAll`),
D("AdvProg", "4 · Vectors & lists", "IntegerList: class, ListNode, constructor", "The linked-list version: private inner ListNode with public fields, `first`, `numElements`.", R`
public class IntegerList
  { private class ListNode
      { public int data;
        public ListNode next;
      } // inner class ListNode

    private ListNode first;   // first node in the list
    private int numElements;  // number of elements

    public IntegerList ()
      { first = null;
        numElements = 0;
      } // constructor`),
D("AdvProg", "4 · Vectors & lists", "IntegerList: add at front", "The simplest add: new node goes at the front.", R`
public void add (int item)
  { ListNode node = new ListNode();
    node.data = item;
    node.next = first;   // link to old first node
    first = node;        // node is now first
    numElements++;
  } // add`, { notes: "The order matters: if you set `first = node` first, you lose the rest of the list." }),
D("AdvProg", "4 · Vectors & lists", "IntegerList: add at position", "Insert at a 0-based position; past the end means append. Handle the front-of-list special case.", R`
public void add (int item, int position)
  { if (position < 0)
      throw new IllegalArgumentException("position is negative");
    ListNode node = new ListNode();
    node.data = item;
    ListNode curr = first, prev = null;
    for (int k = 0; k < position && curr != null; k++)
      { prev = curr;
        curr = curr.next;
      }
    node.next = curr;
    if (prev != null)
      prev.next = node;
    else
      first = node;        // adding at the front
    numElements++;
  } // add`),
D("AdvProg", "4 · Vectors & lists", "IntegerList: get & set", "Walk the list to an index.", R`
public int get (int index)
  { if (index < 0 || index >= numElements)
      throw new IndexOutOfBoundsException("index is out of range");
    ListNode curr = first;
    for (int k = 0; k < index; k++)
      curr = curr.next;
    return curr.data;
  } // get

public void set (int index, int item)
  { if (index < 0 || index >= numElements)
      throw new IndexOutOfBoundsException("index is out of range");
    ListNode curr = first;
    for (int k = 0; k < index; k++)
      curr = curr.next;
    curr.data = item;
  } // set`, { notes: "O(n) for a linked list, O(1) for an array. A favourite fill-in-the-blank (June 2022 Q1d)." }),
D("AdvProg", "4 · Vectors & lists", "IntegerList: position (empty-body for loop)", "Search using the classic empty-body loop with short-circuit evaluation.", R`
public int position (int item)
  { ListNode curr = first;
    int k;
    for (k = 0; curr != null && curr.data != item; k++, curr = curr.next)
      ; // empty body: all the work is in the loop header
    if (curr == null)
      return -1;           // not found
    else
      return k;
  } // position`),
D("AdvProg", "4 · Vectors & lists", "IntegerList: position(item, start) + find all 42s", "**June 2022 Q4.** Overloaded position that starts searching at `pos`, then use it to print every position of 42.", R`
public int position (int item, int pos)
  { ListNode curr = first;
    int k = 0;
    while (k < pos && curr != null)    // skip to the start position
      { curr = curr.next;
        k++;
      }
    while (curr != null && curr.data != item)
      { curr = curr.next;
        k++;
      }
    if (curr == null)
      return -1;
    else
      return k;
  } // position

// client: find all the 42s
int p = myList.position(42, 0);
while (p != -1)
  { System.out.println(p);
    p = myList.position(42, p + 1);
  }`, { exam: "June 2022 Q4" }),
D("AdvProg", "4 · Vectors & lists", "IntegerList: remove", "Remove the node at a position, with the first-node special case.", R`
public void remove (int position)
  { if (position < 0 || position >= numElements)
      throw new IndexOutOfBoundsException("position out of range");
    ListNode curr = first, prev = null;
    for (int k = 0; k < position; k++)
      { prev = curr;
        curr = curr.next;
      }
    if (prev != null)
      prev.next = curr.next;
    else
      first = curr.next;   // removing the first node
    numElements--;
  } // remove`),
D("AdvProg", "4 · Vectors & lists", "IntegerList: toString", "Display a linked list using the standard traversal idiom.", R`
public String toString ()
  { StringBuffer s = new StringBuffer("[");
    for (ListNode curr = first; curr != null; curr = curr.next)
      { s.append(curr.data);
        if (curr.next != null)
          s.append(", ");
      }
    s.append("]");
    return s.toString();
  } // toString`),
D("AdvProg", "4 · Vectors & lists", "IntegerList: reverse (Ex 4.16)", "Reverse the links in place.", R`
public void reverse ()
  { ListNode prev = null, curr = first;
    while (curr != null)
      { ListNode nxt = curr.next;
        curr.next = prev;      // flip the link
        prev = curr;
        curr = nxt;
      }
    first = prev;
  } // reverse`),
D("AdvProg", "4 · Vectors & lists", "ObjectList vs GenericList<T>", "Show the key differences: the polymorphic ObjectList (Object + casts + .equals) vs the generic GenericList<T>.", R`
// Polymorphism version
public class ObjectList
  { private class ListNode
      { public Object data;
        public ListNode next;
      }
    // position must use .equals, not ==
    // client:  Student s = (Student)list.get(0);   // cast needed
  }

// Generic version
public class GenericList<T>
  { private class ListNode
      { public T data;
        public ListNode next;
      }
    private ListNode first;
    private int numElements;

    public T get (int index)
      { ListNode curr = first;
        for (int k = 0; k < index; k++)
          curr = curr.next;
        return curr.data;           // no cast needed by client
      } // get
  }

// client
GenericList<Student> classList = new GenericList<>();   // diamond (Java 7+)
if (obj instanceof Student s)                            // pattern matching
  System.out.println(s);`),

// ===== Ch 5 =====
D("AdvProg", "5 · Stacks, queues, deques", "Stack<T> interface", "The interface both stack classes implement.", R`
public interface Stack<T>
  { public void push (T item);
    public T pop ();
    public T top ();
    public boolean isEmpty ();
  } // interface Stack`),
D("AdvProg", "5 · Stacks, queues, deques", "ArrayStack<T>", "Full array implementation: generic array creation, push/pop/top/isEmpty with precondition checks.", R`
public class ArrayStack<T> implements Stack<T>
  { private T[] data;
    private int topIndex;   // index of the top item, -1 if empty

    @SuppressWarnings("unchecked")
    public ArrayStack (int initSize)
      { data = (T[])new Object[initSize];
        topIndex = -1;
      } // constructor

    public ArrayStack ()
      { this(100);
      } // constructor

    public void push (T item)
      { if (topIndex + 1 >= data.length)
          throw new NoSpaceAvailableException("stack is full");
        data[++topIndex] = item;      // prefix ++: move up, then store
      } // push

    public T pop ()
      { if (topIndex < 0)
          throw new EmptyException("stack is empty");
        return data[topIndex--];      // postfix --: read, then move down
      } // pop

    public T top ()
      { if (topIndex < 0)
          throw new EmptyException("stack is empty");
        return data[topIndex];
      } // top

    public boolean isEmpty ()
      { return topIndex < 0;
      } // isEmpty
  } // class ArrayStack`),
D("AdvProg", "5 · Stacks, queues, deques", "ListStack<T>", "Linked-list stack with an inner StackNode and a `topNode` pointer.", R`
public class ListStack<T> implements Stack<T>
  { private class StackNode
      { public T data;
        public StackNode next;
      } // inner class StackNode

    private StackNode topNode;

    public ListStack ()
      { topNode = null;
      } // constructor

    public void push (T item)
      { StackNode node = new StackNode();
        node.data = item;
        node.next = topNode;   // these two lines must be in this order
        topNode = node;
      } // push

    public T pop ()
      { if (topNode == null)
          throw new EmptyException("stack is empty");
        T tmpData = topNode.data;
        topNode = topNode.next;
        return tmpData;
      } // pop

    public T top ()
      { if (topNode == null)
          throw new EmptyException("stack is empty");
        return topNode.data;
      } // top

    public boolean isEmpty ()
      { return topNode == null;
      } // isEmpty
  } // class ListStack`),
D("AdvProg", "5 · Stacks, queues, deques", "Reverse a string with a stack", "Client program: push each character until newline, then pop and print.", R`
public static void main (String[] args) throws IOException
  { Stack<Character> st = new ListStack<>();   // or new ArrayStack<>()
    char ch = (char)System.in.read();
    while (ch != '\n')
      { st.push(ch);
        ch = (char)System.in.read();
      }
    while (!st.isEmpty())
      System.out.print(st.pop());
    System.out.println();
  } // main`),
D("AdvProg", "5 · Stacks, queues, deques", "Bracket matching (Ex 5.5)", "Return true if (), [] and {} are correctly nested.", R`
public static boolean balanced (String text)
  { Stack<Character> st = new ListStack<>();
    for (char ch : text.toCharArray())
      { if (ch == '(' || ch == '[' || ch == '{')
          st.push(ch);
        else if (ch == ')' || ch == ']' || ch == '}')
          { if (st.isEmpty())
              return false;              // right bracket, nothing open
            char open = st.pop();
            if ((ch == ')' && open != '(') ||
                (ch == ']' && open != '[') ||
                (ch == '}' && open != '{'))
              return false;              // wrong kind
          }
      }
    return st.isEmpty();                 // leftovers = unmatched
  } // balanced`),
D("AdvProg", "5 · Stacks, queues, deques", "RPN calculator (Ex 5.6)", "Evaluate a space-separated postfix expression like \"2 5 + 10 3 - *\".", R`
public static double evalRPN (String expr)
  { Stack<Double> st = new ArrayStack<>();
    for (String word : expr.trim().split("\\s+"))
      { if (word.equals("+") || word.equals("-") ||
            word.equals("*") || word.equals("/"))
          { double right = st.pop();     // note: right operand popped first
            double left = st.pop();
            switch (word)
              { case "+": st.push(left + right); break;
                case "-": st.push(left - right); break;
                case "*": st.push(left * right); break;
                case "/": st.push(left / right); break;
              }
          }
        else
          st.push(Double.parseDouble(word));
      }
    return st.pop();
  } // evalRPN`),
D("AdvProg", "5 · Stacks, queues, deques", "Queue<T> interface", "The interface both queue classes implement.", R`
public interface Queue<T>
  { public void add (T item);
    public T remove ();
    public T head ();
    public boolean isEmpty ();
  } // interface Queue`),
D("AdvProg", "5 · Stacks, queues, deques", "ArrayQueue<T> (circular)", "**June 2022 Q3.** add, remove, head, isEmpty for a circular array queue with hd = tl = -1 when empty.", R`
public void add (T item)
  { tl++;
    if (tl >= data.length)          // wrap around
      tl = 0;
    if (tl == hd)                   // tail caught up with head
      throw new NoSpaceAvailableException("queue is full");
    data[tl] = item;
    if (hd == -1)                   // first item in the queue
      hd = tl;
  } // add

public T remove ()
  { if (hd == -1)
      throw new EmptyException("queue is empty");
    T tmpData = data[hd];
    if (hd == tl)                   // removed the last item
      hd = tl = -1;
    else
      { hd++;
        if (hd >= data.length)      // wrap around
          hd = 0;
      }
    return tmpData;
  } // remove

public T head ()
  { if (hd == -1)
      throw new EmptyException("queue is empty");
    return data[hd];
  } // head

public boolean isEmpty ()
  { return hd == -1;
  } // isEmpty`, { exam: "June 2022 Q3", given: R`public class ArrayQueue<T> implements Queue<T>
  { private T[] data; private int hd, tl;
    public ArrayQueue (int initSize)
      { data = (T[])new Object[initSize]; hd = tl = -1; }`, notes: "`tl = (tl + 1) % data.length;` is the equivalent one-line wrap. Note the full check happens **after** incrementing tl. (If the queue is full the add fails, but tl has already moved. Mention it, or undo it, in an exam.)" }),
D("AdvProg", "5 · Stacks, queues, deques", "ListQueue<T>", "**June 2023 Q3.** add, remove, head, isEmpty with head and tail pointers.", R`
public void add (T item)
  { QueueNode node = new QueueNode();
    node.data = item;
    node.next = null;
    if (tl != null)
      tl.next = node;      // link after the current tail
    tl = node;
    if (hd == null)        // first item in the queue
      hd = node;
  } // add

public T remove ()
  { if (hd == null)
      throw new EmptyException("queue is empty");
    T tmpData = hd.data;
    hd = hd.next;
    if (hd == null)        // was the last element
      tl = null;
    return tmpData;
  } // remove

public T head ()
  { if (hd == null)
      throw new EmptyException("queue is empty");
    return hd.data;
  } // head

public boolean isEmpty ()
  { return hd == null;
  } // isEmpty`, { exam: "June 2023 Q3", given: R`public class ListQueue<T> implements Queue<T>
  { private class QueueNode { public T data; public QueueNode next; }
    private QueueNode hd, tl;
    public ListQueue () { hd = tl = null; }` }),
D("AdvProg", "5 · Stacks, queues, deques", "Priority queue add (Ex 5.12)", "Modify ListQueue so add(item, priority) inserts in ascending priority order (head = highest priority = smallest number).", R`
public void add (T item, int priority)
  { PQNode node = new PQNode();
    node.data = item;
    node.priority = priority;
    PQNode curr = hd, prev = null;
    while (curr != null && curr.priority <= priority)
      { prev = curr;
        curr = curr.next;
      }
    node.next = curr;
    if (prev == null)
      hd = node;
    else
      prev.next = node;
    if (curr == null)
      tl = node;
  } // add`),
D("AdvProg", "5 · Stacks, queues, deques", "Maze: breadth-first search (QSearch)", "Solve the maze with a queue of Position records and a beenThere matrix. Entrance is in column 0, exit in the last column.", R`
record Position (int r, int c) { }

private Queue<Position> posQueue = new ListQueue<>();
private boolean[][] maze, beenThere;

public void solveMaze ()
  { for (int r = 0; r < MAX_COORD; r++)          // find the entrance
      if (maze[r][0])
        { addPosition(r, 0);
          break;
        }
    boolean found = false;
    while (!posQueue.isEmpty())
      { Position p = posQueue.remove();
        int r = p.r(), c = p.c();
        beenThere[r][c] = true;
        if (c == MAX_COORD - 1)
          { found = true;                          // reached the exit
            break;
          }
        if (maze[r-1][c] && !beenThere[r-1][c]) addPosition(r-1, c); // up
        if (maze[r][c+1] && !beenThere[r][c+1]) addPosition(r, c+1); // right
        if (maze[r+1][c] && !beenThere[r+1][c]) addPosition(r+1, c); // down
        if (c > 0 && maze[r][c-1] && !beenThere[r][c-1])
          addPosition(r, c-1);                    // left (not out the entrance)
      }
    System.out.println(found ? "Found a path" : "No path");
  } // solveMaze

private void addPosition (int row, int col)
  { posQueue.add(new Position(row, col));
  } // addPosition`, { notes: "Queue → breadth-first → shortest path guaranteed. Swap in a Stack → depth-first (may be quicker, not necessarily shortest)." }),
D("AdvProg", "5 · Stacks, queues, deques", "Deque: fields + constructor with header node", "Doubly-, circularly-linked deque with a header node that points to itself when empty.", R`
public class Deque<T>
  { private class DequeNode
      { public T data;
        public DequeNode lt,   // left neighbour
                         rt;   // right neighbour
      } // inner class DequeNode

    private DequeNode header;

    public Deque ()
      { header = new DequeNode();
        header.lt = header;    // empty: header linked to itself
        header.rt = header;
      } // constructor`),
D("AdvProg", "5 · Stacks, queues, deques", "Deque: addLeft & addRight", "Insert next to the header. No special cases, because the list is never empty.", R`
public void addLeft (T item)
  { DequeNode newNode = new DequeNode();
    newNode.data = item;
    newNode.lt = header;          // left of new node is the header
    newNode.rt = header.rt;       // right is the old left-most node
    header.rt.lt = newNode;       // old left-most points back to new
    header.rt = newNode;          // header points to new left-most
  } // addLeft

public void addRight (T item)
  { DequeNode newNode = new DequeNode();
    newNode.data = item;
    newNode.rt = header;
    newNode.lt = header.lt;       // old right-most node
    header.lt.rt = newNode;
    header.lt = newNode;
  } // addRight`, { notes: "The header's pointers look 'backwards': header.rt is the LEFT end and header.lt is the RIGHT end." }),
D("AdvProg", "5 · Stacks, queues, deques", "Deque: removeLeft, removeRight, heads, isEmpty", "Removal and inspection using the header node.", R`
public T removeLeft ()
  { if (header.rt == header)
      throw new EmptyException("deque is empty");
    DequeNode node = header.rt;   // left-most node
    header.rt = node.rt;
    node.rt.lt = header;
    return node.data;
  } // removeLeft

public T removeRight ()
  { if (header.lt == header)
      throw new EmptyException("deque is empty");
    DequeNode node = header.lt;   // right-most node
    header.lt = node.lt;
    node.lt.rt = header;
    return node.data;
  } // removeRight

public T leftHead ()
  { if (header.rt == header)
      throw new EmptyException("deque is empty");
    return header.rt.data;
  } // leftHead

public T rightHead ()
  { if (header.lt == header)
      throw new EmptyException("deque is empty");
    return header.lt.data;
  } // rightHead

public boolean isEmpty ()
  { return header.rt == header;
  } // isEmpty`, { notes: "**June 2023 Q4** asked you to *draw* a doubly-, circularly-linked list with a header node and three items: header ⇄ a ⇄ b ⇄ c ⇄ back to the header, with the header's rt pointing to a and its lt pointing to c." }),
D("AdvProg", "5 · Stacks, queues, deques", "Circular list traversal (no nulls)", "Print all data in a circular list without looping forever.", R`
public void printAll ()
  { if (left != null)
      { DequeNode curr = left;
        do
          { System.out.println(curr.data);
            curr = curr.rt;
          } while (curr != left);   // stop when back at the start
      }
  } // printAll`),

// ===== Ch 6 =====
D("AdvProg", "6 · Trees & graphs", "Tree<T> class", "General binary tree: data/lt/rt, two constructors, left/right/getData, addLeft/addRight (refusing to overwrite).", R`
public class Tree<T>
  { private T data;
    private Tree<T> lt, rt;

    public Tree (T value, Tree<T> left, Tree<T> right)
      { data = value;
        lt = left;
        rt = right;
      } // constructor

    public Tree (T value)
      { this(value, null, null);
      } // constructor

    public Tree<T> left ()  { return lt; }
    public Tree<T> right () { return rt; }
    public T getData ()     { return data; }

    public void addLeft (Tree<T> left)
      { if (lt != null)
          throw new UnsupportedOperationException("left subtree exists");
        lt = left;
      } // addLeft

    public void addRight (Tree<T> right)
      { if (rt != null)
          throw new UnsupportedOperationException("right subtree exists");
        rt = right;
      } // addRight
  } // class Tree`),
D("AdvProg", "6 · Trees & graphs", "Pre-order print (NLR)", "**June 2022 Q2.** Client method: recursive pre-order traversal of a Tree<Character>.", R`
public void preOrderPrint (Tree<Character> root)
  { if (root != null)
      { System.out.println(root.getData());  // N
        preOrderPrint(root.left());          // L
        preOrderPrint(root.right());         // R
      }
  } // preOrderPrint`, { exam: "June 2022 Q2" }),
D("AdvProg", "6 · Trees & graphs", "In-order & post-order print (LNR / LRN)", "The other two depth-first traversals.", R`
public void LNRPrint (Tree<Character> root)
  { if (root != null)
      { LNRPrint(root.left());
        System.out.println(root.getData());
        LNRPrint(root.right());
      }
  } // LNRPrint

public void LRNPrint (Tree<Character> root)
  { if (root != null)
      { LRNPrint(root.left());
        LRNPrint(root.right());
        System.out.println(root.getData());
      }
  } // LRNPrint`),
D("AdvProg", "6 · Trees & graphs", "Breadth-order traversal with a queue (Ex 6.8)", "Level-by-level, top to bottom.", R`
public void breadthPrint (Tree<Character> root)
  { if (root == null)
      return;
    Queue<Tree<Character>> q = new ListQueue<>();
    q.add(root);
    while (!q.isEmpty())
      { Tree<Character> t = q.remove();
        System.out.println(t.getData());
        if (t.left() != null)
          q.add(t.left());
        if (t.right() != null)
          q.add(t.right());
      }
  } // breadthPrint`),
D("AdvProg", "6 · Trees & graphs", "Guess-the-animal game loop", "Walk the knowledge-base tree: yes → left, no → right; leaves are animals.", R`
public void play ()
  { initTree();
    Tree<String> pos = root;
    while (pos != null)
      { if (pos.left() != null)            // question node
          { System.out.println(pos.getData());
            if (answer())
              pos = pos.left();            // yes
            else
              pos = pos.right();           // no
          }
        else                               // must be an animal
          { System.out.println("It's a " + pos.getData() + ".");
            break;
          }
      }
  } // play`),
D("AdvProg", "6 · Trees & graphs", "Count nodes, leaves & height", "Typical extra recursion questions on the Tree class.", R`
public static <T> int countNodes (Tree<T> t)
  { if (t == null) return 0;
    return 1 + countNodes(t.left()) + countNodes(t.right());
  } // countNodes

public static <T> int countLeaves (Tree<T> t)
  { if (t == null) return 0;
    if (t.left() == null && t.right() == null) return 1;
    return countLeaves(t.left()) + countLeaves(t.right());
  } // countLeaves

public static <T> int height (Tree<T> t)
  { if (t == null) return 0;
    return 1 + Math.max(height(t.left()), height(t.right()));
  } // height`),
D("AdvProg", "6 · Trees & graphs", "BST: node class + public insert", "BinarySearchTree<T extends Comparable> with a BSTreeNode (data, lt, rt, parent) and the public insert.", R`
public class BinarySearchTree<T extends Comparable>
  { private class BSTreeNode
      { public T data;
        public BSTreeNode lt, rt, parent;

        public BSTreeNode (T value, BSTreeNode parent)
          { data = value;
            this.parent = parent;
          } // constructor
      } // inner class BSTreeNode

    private BSTreeNode root;

    public void insert (T newValue)
      { if (root == null)
          root = new BSTreeNode(newValue, null);
        else
          insert(newValue, root);
      } // insert`),
D("AdvProg", "6 · Trees & graphs", "BST: private insert (recursive)", "Smaller goes left; greater-or-equal goes right; always add as a leaf.", R`
private void insert (T value, BSTreeNode root)
  { if (value.compareTo(root.data) < 0)       // add to left subtree
      { if (root.lt != null)
          insert(value, root.lt);
        else
          root.lt = new BSTreeNode(value, root);
      }
    else                                       // add to right subtree
      { if (root.rt != null)
          insert(value, root.rt);
        else
          root.rt = new BSTreeNode(value, root);
      }
  } // insert`),
D("AdvProg", "6 · Trees & graphs", "BST: contains", "Recursive search using equals and compareTo.", R`
private boolean contains (T value, BSTreeNode root)
  { if (root == null)
      return false;
    if (value.equals(root.data))
      return true;
    if (value.compareTo(root.data) < 0)
      return contains(value, root.lt);     // look in left subtree
    else
      return contains(value, root.rt);     // look in right subtree
  } // contains`),
D("AdvProg", "6 · Trees & graphs", "BST: replaceInParent & deleteMin", "Helpers for deletion: relink a parent; remove and return the smallest value in a subtree.", R`
private void replaceInParent (BSTreeNode parent, BSTreeNode child,
                              BSTreeNode newChild)
  { if (parent == null)
      root = newChild;                 // child was the root
    else if (parent.lt == child)
      parent.lt = newChild;
    else
      parent.rt = newChild;
    if (newChild != null)
      newChild.parent = parent;
  } // replaceInParent

private T deleteMin (BSTreeNode root)
  { if (root.lt != null)
      return deleteMin(root.lt);       // smallest is further left
    else
      { T value = root.data;           // this node is the minimum
        replaceInParent(root.parent, root, root.rt);
        return value;
      }
  } // deleteMin`),
D("AdvProg", "6 · Trees & graphs", "BST: remove (4 cases)", "No subtrees / only left / only right / both (replace with min of right subtree).", R`
private void remove (T value, BSTreeNode root)
  { if (root == null)
      throw new NoSuchElementException("value not in tree");
    if (value.compareTo(root.data) < 0)
      remove(value, root.lt);                   // delete from left subtree
    else if (value.compareTo(root.data) > 0)
      remove(value, root.rt);                   // delete from right subtree
    else                                        // this is the node
      { if (root.lt != null && root.rt != null) // CASE 4: both subtrees
          root.data = deleteMin(root.rt);
        else if (root.lt == null && root.rt == null)
          replaceInParent(root.parent, root, null);     // CASE 1: leaf
        else if (root.lt == null)
          replaceInParent(root.parent, root, root.rt);  // CASE 3: right only
        else
          replaceInParent(root.parent, root, root.lt);  // CASE 2: left only
      }
  } // remove`, { notes: "Exam 2023 Q5b deleted the root N from a BST: replace N with the smallest value in its right subtree." }),
D("AdvProg", "6 · Trees & graphs", "BST: iterator (TreeIterator + build)", "The cs2 Iterator (get/next/atEnd) built by an in-order traversal into a Vector.", R`
public interface Iterator<T>
  { public T get ();
    public void next ();
    public boolean atEnd ();
  } // interface Iterator

private class TreeIterator implements Iterator<T>
  { private Vector<T> list = new Vector<>();
    private int index = 0;
    public T get ()          { return list.get(index); }
    public void next ()      { index++; }
    public boolean atEnd ()  { return index >= list.size(); }
    void add (T value)       { list.add(value); }
  } // inner class TreeIterator

private void buildLNRIterator (BSTreeNode root, TreeIterator t)
  { if (root != null)
      { buildLNRIterator(root.lt, t);
        t.add(root.data);
        buildLNRIterator(root.rt, t);
      }
  } // buildLNRIterator

public Iterator<T> getLNRIterator ()
  { TreeIterator t = new TreeIterator();
    buildLNRIterator(root, t);
    return t;
  } // getLNRIterator

// client
Iterator<Character> it = tree.getLNRIterator();
while (!it.atEnd())
  { System.out.println(it.get());
    it.next();
  }`),
D("AdvProg", "6 · Trees & graphs", "Graph: adjacency matrix & edge lists", "Represent a directed graph both ways and test for an edge.", R`
// adjacency matrix: adj[v][w] true if there's an arc v -> w
boolean[][] adj = new boolean[N][N];
for (int v = 0; v < N; v++)
  adj[v][v] = true;               // convention: vertex joined to itself
adj[A][B] = true;                 // add arc A -> B (undirected: also adj[B][A])

// edge lists: each vertex has a list of its neighbours
public class CityNode
  { public String name;
    public GenericList<CityNode> edges = new GenericList<>();
  } // class CityNode

boolean connected (CityNode v, CityNode w)
  { return v.edges.position(w) != -1;
  } // connected`, { notes: "**June 2022 Q5** gave a 6-vertex directed graph and asked for both. Matrix rows are FROM and columns are TO. Edge lists only list outgoing arcs." }),

// ===== Ch 7 =====
D("AdvProg", "7 · Dictionaries & hashing", "Dictionary<K,V> and Pair<K,V> interfaces", "The interfaces used by all three dictionary ADTs.", R`
public interface Pair<K, V>
  { public K getKey ();
    public V getValue ();
    public void setValue (V value);
  } // interface Pair

public interface Dictionary<K, V>
  { public void insert (K aKey, V aValue);
    public void insert (K aKey);
    public void insert (Pair<K, V> p);
    public void remove (K aKey);
    public V get (K aKey);
    public boolean contains (K aKey);
    public boolean isEmpty ();
    public void makeEmpty ();
    public Iterator<Pair<K, V>> getIterator ();
  } // interface Dictionary`),
D("AdvProg", "7 · Dictionaries & hashing", "ListDictionary: findNode", "Find the node for a key in a sorted linked list, inserting a new (value-less) node in order if it isn't there.", R`
private ListNode findNode (K aKey)
  { ListNode curr = first, prev = null;
    while (curr != null && aKey.compareTo(curr.getKey()) > 0)
      { prev = curr;
        curr = curr.next;
      }
    if (curr == null || aKey.compareTo(curr.getKey()) != 0)
      { ListNode node = new ListNode(aKey);    // not there: insert it
        node.next = curr;
        if (prev == null)
          first = node;
        else
          prev.next = node;
        curr = node;
      }
    return curr;
  } // findNode

public void insert (K aKey, V aValue)
  { findNode(aKey).setValue(aValue);          // replaces any old value
  } // insert

public V get (K aKey)
  { return findNode(aKey).getValue();         // creates entry if missing
  } // get`),
D("AdvProg", "7 · Dictionaries & hashing", "ListDictionary: remove & contains", "Use the sorted order to stop early.", R`
public void remove (K aKey)
  { ListNode curr = first, prev = null;
    while (curr != null && aKey.compareTo(curr.getKey()) > 0)
      { prev = curr;
        curr = curr.next;
      }
    if (curr != null && aKey.compareTo(curr.getKey()) == 0)
      { if (prev == null)
          first = curr.next;
        else
          prev.next = curr.next;
      }
    else
      throw new NoSuchElementException("key not found");
  } // remove

public boolean contains (K aKey)
  { ListNode curr = first;
    while (curr != null && aKey.compareTo(curr.getKey()) > 0)
      curr = curr.next;
    return curr != null && aKey.compareTo(curr.getKey()) == 0;
  } // contains`),
D("AdvProg", "7 · Dictionaries & hashing", "Concordance (client)", "Map each word to an IntegerList of the line numbers where it appears, then print them in order.", R`
Dictionary<String, IntegerList> dict = new ListDictionary<>();
BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
String line;
int lineNum = 0;
while ((line = in.readLine()) != null)
  { lineNum++;
    StringTokenizer st = new StringTokenizer(line);
    while (st.hasMoreTokens())
      { String word = st.nextToken();
        IntegerList lst = dict.get(word);      // creates entry if new
        if (lst == null)                      // first time we see word
          { lst = new IntegerList();
            lst.add(lineNum);
            dict.insert(word, lst);
          }
        else
          lst.add(lineNum);
      }
  }
Iterator<Pair<String, IntegerList>> it = dict.getIterator();
while (!it.atEnd())
  { Pair<String, IntegerList> p = it.get();
    System.out.println(p.getKey() + ": " + p.getValue());
    it.next();
  }`),
D("AdvProg", "7 · Dictionaries & hashing", "String hash function", "Simple string hash: h = h·26 + char, made non-negative, then mod SIZE.", R`
public int hash (String key)
  { int h = 0;
    for (int k = 0; k < key.length(); k++)
      h = h * 26 + (int)key.charAt(k);
    return (h & 0x7FFFFFFF) % SIZE;      // clear sign bit, then scale
  } // hash

// generic version used by the hash tables
private int hash (K aKey)
  { return (aKey.hashCode() & 0x7FFFFFFF) % table.length;
  } // hash`),
D("AdvProg", "7 · Dictionaries & hashing", "InternalHashTable: insert (linear probing)", "Probe until null or the same key; keep at least one empty slot; undelete if needed.", R`
public void insert (K aKey, V aValue)
  { int index = hash(aKey);
    while (table[index] != null && !table[index].getKey().equals(aKey))
      { index++;
        if (index >= table.length)     // wrap around
          index = 0;
      }
    if (table[index] == null)          // insert a new entry
      { if (numEntries >= table.length - 1)
          throw new NoSpaceAvailableException("table full");
        table[index] = new TableEntry<>(aKey, aValue);
        numEntries++;
      }
    else                               // update existing or deleted entry
      { table[index].setValue(aValue);
        if (!table[index].occupied)    // undelete it
          table[index].occupied = true;
      }
  } // insert`, { notes: "Entry states: **empty** (null), **occupied** (not null, occupied = true), **deleted** (not null, occupied = false). Searches only stop at a genuinely empty slot." }),
D("AdvProg", "7 · Dictionaries & hashing", "InternalHashTable: remove, contains, get", "Probe the same way; remove marks the entry as deleted.", R`
public void remove (K aKey)
  { int index = hash(aKey);
    while (table[index] != null && !table[index].getKey().equals(aKey))
      { index++;
        if (index >= table.length) index = 0;
      }
    if (table[index] != null && table[index].occupied)
      { table[index].occupied = false;   // mark deleted, don't null it
        table[index].setValue(null);
      }
    else
      throw new NoSuchElementException("key not found");
  } // remove

public boolean contains (K aKey)
  { int index = hash(aKey);
    while (table[index] != null && !table[index].getKey().equals(aKey))
      { index++;
        if (index >= table.length) index = 0;
      }
    return table[index] != null && table[index].occupied;
  } // contains

public V get (K aKey)
  { int index = hash(aKey);
    while (table[index] != null && !table[index].getKey().equals(aKey))
      { index++;
        if (index >= table.length) index = 0;
      }
    if (table[index] == null || !table[index].occupied)
      { insert(aKey);                    // create entry if missing
        return null;
      }
    return table[index].getValue();
  } // get`),
D("AdvProg", "7 · Dictionaries & hashing", "ExternalHashTable: insert, get, contains", "An array of linked-list buckets; new nodes go at the front of their bucket.", R`
public void insert (K aKey, V aValue)
  { int index = hash(aKey);
    EntryNode<K, V> c;
    for (c = bucket[index]; c != null && !c.getKey().equals(aKey); c = c.next)
      ; // look for aKey in the bucket
    if (c == null)                       // new: insert at front of bucket
      { EntryNode<K, V> node = new EntryNode<>(aKey, aValue);
        node.next = bucket[index];
        bucket[index] = node;
      }
    else
      c.setValue(aValue);                // update existing entry
  } // insert

public boolean contains (K aKey)
  { EntryNode<K, V> c = bucket[hash(aKey)];
    while (c != null && !c.getKey().equals(aKey))
      c = c.next;
    return c != null;
  } // contains`),
D("AdvProg", "7 · Dictionaries & hashing", "ExternalHashTable: remove & isEmpty", "Unlink from the bucket's list; isEmpty has to scan every bucket.", R`
public void remove (K aKey)
  { int index = hash(aKey);
    EntryNode<K, V> c = bucket[index], prev = null;
    while (c != null && !c.getKey().equals(aKey))
      { prev = c;
        c = c.next;
      }
    if (c != null)                       // unlink the node
      { if (prev == null)
          bucket[index] = c.next;
        else
          prev.next = c.next;
      }
  } // remove

public boolean isEmpty ()
  { for (int k = 0; k < bucket.length; k++)
      if (bucket[k] != null)
        return false;
    return true;
  } // isEmpty`),

// ===== Ch 8-9 =====
D("AdvProg", "8–9 · Big-O & searching", "Sequential search", "Unordered array search; then the sorted-list version that stops early.", R`
public static <T extends Comparable<T>> int seqSearch (T[] list, T item)
  { for (int k = 0; k < list.length; k++)
      if (list[k].compareTo(item) == 0)
        return k;
    return -1;                                  // O(n)
  } // seqSearch

public static <T extends Comparable<T>> int sortedSeqSearch (T[] list, T item)
  { int k = 0;
    while (k < list.length && list[k].compareTo(item) < 0)
      k++;                                      // stop once we pass it
    if (k < list.length && list[k].compareTo(item) == 0)
      return k;
    return -1;
  } // sortedSeqSearch`),
D("AdvProg", "8–9 · Big-O & searching", "Binary search (int[])", "**June 2023 Q7b.** Return the index of item, or -1.", R`
public static int binarySearch (int[] list, int item)
  { int left = 0,
        right = list.length - 1,
        look;
    while (left <= right)
      { look = left + (right - left) / 2;   // safe midpoint
        if (list[look] == item)
          return look;
        else if (list[look] > item)
          right = look - 1;                 // must be to the left
        else
          left = look + 1;                  // must be to the right
      }
    return -1;                              // indices crossed: not found
  } // binarySearch`, { exam: "June 2023 Q7", notes: "O(log n). `(left + right) / 2` can overflow for huge arrays (Bloch's bug), so `left + (right - left) / 2` is safer. The notes' version uses a do-while that stops when the item is found or left > right." }),
D("AdvProg", "8–9 · Big-O & searching", "Binary search (generic, notes style)", "Generic do-while version bounded by Comparable.", R`
public static <T extends Comparable<T>> int binarySearch (T[] list, T item)
// PRE:  list is sorted in ascending order
// POST: returns the index of item, or -1 if not found
  { int left = 0,
        right = list.length - 1,
        look;
    do
      { look = (left + right) / 2;
        if (list[look].compareTo(item) > 0)
          right = look - 1;
        else
          left = look + 1;
      } while (list[look].compareTo(item) != 0 && left <= right);
    if (list[look].compareTo(item) == 0)
      return look;
    else
      return -1;
  } // binarySearch`),
D("AdvProg", "8–9 · Big-O & searching", "Interpolated binary search", "Guess `look` in proportion to the value; guard against division by zero and keep look in range.", R`
public static int intBinarySearch (double[] list, double item)
  { int left = 0,
        right = list.length - 1,
        look;
    while (left <= right && item >= list[left] && item <= list[right])
      { if (list[right] == list[left])          // avoid divide by zero
          look = left;
        else
          look = left + (int)((item - list[left]) /
                              (list[right] - list[left]) * (right - left));
        if (list[look] == item)
          return look;
        if (list[look] > item)
          right = look - 1;
        else
          left = look + 1;
      }
    return -1;
  } // intBinarySearch`, { notes: "O(log log n) for evenly distributed keys." }),

// ===== Ch 10 =====
D("AdvProg", "10 · Sorting", "Bubble Sort (int[])", "**June 2023 Q8.** With the early-exit flag and the shrinking inner loop.", R`
public static void bubbleSort (int[] list)
  { boolean madeSwap = true;
    for (int pass = 0; pass < list.length - 1 && madeSwap; pass++)
      { madeSwap = false;
        for (int k = 0; k < list.length - pass - 1; k++)
          if (list[k] > list[k + 1])
            { int tmp = list[k];
              list[k] = list[k + 1];
              list[k + 1] = tmp;
              madeSwap = true;
            }
      }
  } // bubbleSort`, { exam: "June 2023 Q8", notes: "Comparisons: best O(n), average and worst O(n²). Swaps: best 0 (O(1)), average and worst O(n²)." }),
D("AdvProg", "10 · Sorting", "Insertion Sort (int[]), notes' right-to-left version", "**June 2022 Q8.** Insert each item into the sorted part on its right.", R`
public static void insertionSort (int[] list)
  { for (int k = list.length - 2; k >= 0; k--)
      { int tmp = list[k];
        int j = k + 1;
        while (j < list.length && tmp > list[j])
          { list[j - 1] = list[j];          // move data down
            j++;
          }
        list[j - 1] = tmp;
      }
  } // insertionSort`, { exam: "June 2022 Q8", notes: "Comparisons and moves: best O(n), average and worst O(n²). The usual left-to-right version is just as acceptable in an exam." }),
D("AdvProg", "10 · Sorting", "Insertion Sort, standard left-to-right", "The textbook-elsewhere version, in case you prefer it.", R`
public static void insertionSort (int[] list)
  { for (int k = 1; k < list.length; k++)
      { int tmp = list[k];
        int j = k - 1;
        while (j >= 0 && list[j] > tmp)
          { list[j + 1] = list[j];
            j--;
          }
        list[j + 1] = tmp;
      }
  } // insertionSort`),
D("AdvProg", "10 · Sorting", "Selection Sort", "Find the smallest remaining item and swap it into place. Exactly n−1 swaps.", R`
public static <T extends Comparable<T>> void selectionSort (T[] list)
  { for (int k = 0; k < list.length - 1; k++)
      { int minPos = k;
        for (int j = k + 1; j < list.length; j++)
          if (list[j].compareTo(list[minPos]) < 0)
            minPos = j;
        T tmp = list[k];                  // swap k'th and smallest
        list[k] = list[minPos];
        list[minPos] = tmp;
      }
  } // selectionSort`),
D("AdvProg", "10 · Sorting", "Indirect Insertion Sort", "Sort an index array by the keys it refers to, without moving the (large) records.", R`
public static <T extends Comparable<T>> void insertionSort (T[] list, int[] index)
  { for (int k = 0; k < index.length; k++)
      index[k] = k;                       // start in subscript order
    for (int k = index.length - 2; k >= 0; k--)
      { int tmp = index[k];
        int j = k + 1;
        while (j < index.length && list[tmp].compareTo(list[index[j]]) > 0)
          { index[j - 1] = index[j];
            j++;
          }
        index[j - 1] = tmp;
      }
  } // insertionSort
// access in order:  list[index[0]], list[index[1]], ...`),
D("AdvProg", "10 · Sorting", "Quick Sort: partition", "Use list[start] as the partition element. Return its final position.", R`
private static <T extends Comparable<T>> int partition (T[] list, int start, int end)
  { int left = start,
        right = end;
    T tmp;
    while (left < right)
      { while (list[right].compareTo(list[start]) > 0)   // work down from right
          right--;
        while (left < right && list[left].compareTo(list[start]) <= 0)
          left++;                                       // work up from left
        if (left < right)
          { tmp = list[left];
            list[left] = list[right];
            list[right] = tmp;
          }
      }
    tmp = list[start];                    // put partition element in place
    list[start] = list[right];
    list[right] = tmp;
    return right;
  } // partition`),
D("AdvProg", "10 · Sorting", "Quick Sort: recursive", "recursiveQS plus the public wrapper.", R`
private static <T extends Comparable<T>> void recursiveQS (T[] list, int start, int end)
  { if (start < end)
      { int partitionPoint = partition(list, start, end);
        recursiveQS(list, start, partitionPoint - 1);
        recursiveQS(list, partitionPoint + 1, end);
      }
  } // recursiveQS

public static <T extends Comparable<T>> void quickSort (T[] list)
  { recursiveQS(list, 0, list.length - 1);
  } // quickSort`, { notes: "Best and average O(n log n) (about 1.38 n log n); worst O(n²) on already-sorted input when the first element is the pivot." }),
D("AdvProg", "10 · Sorting", "Quick Sort: iterative with a stack", "Remember the sublists still to be sorted on a stack of (start, end) records.", R`
record Sublist (int start, int end) { }

public static <T extends Comparable<T>> void iterativeQuickSort (T[] list)
  { java.util.Stack<Sublist> s = new java.util.Stack<>();
    s.push(new Sublist(0, list.length - 1));
    while (!s.empty())
      { Sublist sub = s.pop();
        int start = sub.start(), end = sub.end();
        while (start < end)
          { int p = partition(list, start, end);
            s.push(new Sublist(start, p - 1));   // remember the left part
            start = p + 1;                       // carry on with the right
          }
      }
  } // iterativeQuickSort`),
D("AdvProg", "10 · Sorting", "Quick Sort: median-of-three pivot (Ex 10.7)", "Move the median of first/middle/last to `start` before partitioning.", R`
private static <T extends Comparable<T>> void medianToStart (T[] list, int start, int end)
  { int mid = (start + end) / 2;
    int m;
    T a = list[start], b = list[mid], c = list[end];
    if ((a.compareTo(b) <= 0 && b.compareTo(c) <= 0) ||
        (c.compareTo(b) <= 0 && b.compareTo(a) <= 0))
      m = mid;
    else if ((b.compareTo(a) <= 0 && a.compareTo(c) <= 0) ||
             (c.compareTo(a) <= 0 && a.compareTo(b) <= 0))
      m = start;
    else
      m = end;
    T tmp = list[start];
    list[start] = list[m];
    list[m] = tmp;
  } // medianToStart`),
D("AdvProg", "10 · Sorting", "Merge Sort: recursive", "Split in half, sort each half, merge.", R`
private static <T extends Comparable<T>> void recursiveMS (T[] list, int start, int end)
  { if (start < end)
      { int mid = (start + end) / 2;
        recursiveMS(list, start, mid);
        recursiveMS(list, mid + 1, end);
        merge(list, start, mid, end);
      }
  } // recursiveMS

public static <T extends Comparable<T>> void mergeSort (T[] list)
  { recursiveMS(list, 0, list.length - 1);
  } // mergeSort`),
D("AdvProg", "10 · Sorting", "Merge Sort: merge", "Merge list[first..mid] and list[mid+1..last] through a temporary array.", R`
@SuppressWarnings("unchecked")
public static <T extends Comparable<T>> void merge (T[] list, int first, int mid, int last)
  { T[] tmp = (T[])new Comparable[last - first + 1];
    int i = first,          // subscript for first sublist
        j = mid + 1,        // subscript for second sublist
        k = 0;              // subscript for tmp
    while (i <= mid && j <= last)
      if (list[i].compareTo(list[j]) < 0)
        tmp[k++] = list[i++];
      else
        tmp[k++] = list[j++];
    while (i <= mid)                    // copy remnant of first list
      tmp[k++] = list[i++];
    while (j <= last)                   // or of second list
      tmp[k++] = list[j++];
    for (k = 0; k < tmp.length; k++)    // copy back
      list[first + k] = tmp[k];
  } // merge`, { notes: "Always O(n log n) but needs about twice the memory, which is why Quick Sort is used more." }),
D("AdvProg", "10 · Sorting", "Shell Sort (Ex 10.17)", "Bubble-style compare/swap with a gap that halves after a pass with no swaps.", R`
public static void shellSort (int[] list)
  { int gap = list.length / 2;
    while (gap > 0)
      { boolean swapped = false;
        for (int k = 0; k + gap < list.length; k++)
          if (list[k] > list[k + gap])
            { int tmp = list[k];
              list[k] = list[k + gap];
              list[k + gap] = tmp;
              swapped = true;
            }
        if (!swapped)
          gap /= 2;
      }
  } // shellSort`),
];
