// Code drills: MIPS (book conventions: $sp points just past the top of the stack; main glue -4/+4) and C (Section C).
DRILLS.push(
D("MIPS", "MIPS 2–3 · Basics", "Minimal program (exit)", "Smallest legal SPIM program: a main label and the exit system call. If you leave out the exit, SPIM runs off the end of your code into garbage (June 2023 Q9).", R`
        .text
main:   li   $v0, 10        # system call code for exit = 10
        syscall             # call OS`, { exam: "June 2023 Q9" }),
D("MIPS", "MIPS 2–3 · Basics", "for loop: sum = 0+1+…+(N-1)", "Bottom-test for loop template with N = 4 in $t2, sum in $t0, i in $t1.", R`
        .text
# $t0: sum   $t1: i   $t2: N
main:   li   $t2, 4             # N = 4;
        move $t0, $zero         # sum = 0;
        move $t1, $zero         # for (i = 0; i < N; i++)
        j    test               # test before 1st iteration
body:   add  $t0, $t0, $t1      #   sum += i;
        addi $t1, $t1, 1        #   increment loop counter
test:   blt  $t1, $t2, body     # not done? go again
        li   $v0, 10
        syscall`, { notes: "3 instructions per iteration. `blt` is a pseudoinstruction that becomes `slt $at,$t1,$t2` + `bne $at,$zero,body`." }),
D("MIPS", "MIPS 2–3 · Basics", "while loop: count doublings", "while (age < 100) { age = age * 2; doublings++; } with age = 42.", R`
# $t0: doublings   $t1: age   $t2: constant 100
main:   move $t0, $zero         # int doublings = 0;
        li   $t1, 42            # int age = 42;
        li   $t2, 100
        j    test               # while (age < 100) {
body:   add  $t1, $t1, $t1      #   age = age * 2;
        addi $t0, $t0, 1        #   doublings++;
test:   blt  $t1, $t2, body     # }
        li   $v0, 10
        syscall`, { notes: "Ends with doublings = 2 (42 → 84 → 168)." }),
D("MIPS", "MIPS 2–3 · Basics", "if: count a negative input", "Read an int with syscall 5; if (value < 0) negatives++. Note the inverted branch.", R`
READ_INT = 5
EXIT = 10
        .text
# $s0: value   $s1: negatives
main:   li   $s1, 0             # negatives = 0;
        li   $v0, READ_INT      # scanf("%d", &value);
        syscall
        move $s0, $v0
        bge  $s0, $zero, done   # if (value < 0)   -- inverted condition
        addi $s1, $s1, 1        #   negatives++;
done:   li   $v0, EXIT
        syscall`),
D("MIPS", "MIPS 2–3 · Basics", "if-else: negatives / positives", "if (value < 0) negatives++; else positives++;", R`
# $s0: value   $s1: negatives   $s2: positives
main:   li   $s1, 0
        li   $s2, 0
        li   $v0, 5             # read int
        syscall
        move $s0, $v0
        bge  $s0, $zero, else   # if (value < 0)
        addi $s1, $s1, 1        #   negatives++;
        j    done
else:   addi $s2, $s2, 1        # else positives++;
done:   li   $v0, 10
        syscall`),
D("MIPS", "MIPS 2–3 · Basics", "Load a 32-bit constant (420000)", "Immediates are only 16 bits. Build 0x000668A0 from its halves.", R`
# population = 420000;   (0x000668A0)
main:   lui  $t0, 0x0006        # high 16 bits, low 16 bits zeroed
        ori  $t0, $t0, 0x68A0   # OR in the low 16 bits
        li   $v0, 10
        syscall`, { notes: "Long-hand: `li $t0, 6` / `sll $t0, $t0, 16` / `ori $t0, $t0, 0x68A0`." }),
D("MIPS", "MIPS 2–3 · Basics", "Global variables: la / lw / sw with offsets", "Load two words from .data using one base address, and store a register to memory.", R`
        .data
population: .word 420000
max_age:    .word 120
saveSP:     .word 0
        .text
main:   la   $t0, population    # base address (just a lui here)
        lw   $t1, 0($t0)        # load population
        lw   $t2, 4($t0)        # load max_age (next word)
        sw   $sp, 8($t0)        # store stack pointer into saveSP
        li   $v0, 10
        syscall`),
D("MIPS", "MIPS 2–3 · Basics", "age × 365 < 10000 (bool in a byte)", "Words and a byte in .data, multiply with overflow checking, set-less-than, store a byte.", R`
        .data
age:         .word 21
daysperyear: .word 365
ageLT10k:    .byte 0
        .text
main:   la   $t0, age
        lw   $t1, 0($t0)        # age
        lw   $t2, 4($t0)        # daysperyear
        mulo $t4, $t1, $t2      # temp = age * daysperyear (checks overflow)
        slti $t3, $t4, 10000    # ageLT10k = temp < 10000
        sb   $t3, 8($t0)        # store the byte
        li   $v0, 10
        syscall`),
D("MIPS", "MIPS 2–3 · Basics", "Halfword overflow check", "Check that the 32-bit value in $t0 still fits in a signed 16-bit halfword.", R`
        sll  $t1, $t0, 16       # shift low halfword to the top
        sra  $t1, $t1, 16       # arithmetic shift back (copies sign)
        beq  $t1, $t0, ok       # unchanged? no overflow
        break 0                 # otherwise: overflow error
ok:     nop`),
D("MIPS", "MIPS 2–3 · Basics", "Uppercase a letter / test for a digit", "Ch 1 exercise: lowercase→uppercase is −32 (or clear bit 5); digit test is '0' ≤ c ≤ '9'.", R`
# $a0 holds a character
        addi $t0, $a0, -32      # 'a'(97) -> 'A'(65)
        andi $t1, $a0, 0xDF     # same effect: clear bit 5 (0x20)

        li   $t2, 48            # '0'
        li   $t3, 57            # '9'
        li   $v1, 0             # isDigit = false
        blt  $a0, $t2, notdig
        bgt  $a0, $t3, notdig
        li   $v1, 1             # isDigit = true
notdig: nop`),
D("MIPS", "MIPS 2–3 · Basics", "Extract a byte by shifting and masking", "Get byte 2 (counting from the low end) of the word in $t0, independent of endianness.", R`
        srl  $t1, $t0, 16       # move byte 2 down to the low end
        andi $t1, $t1, 0xFF     # mask off everything else`),
D("MIPS", "MIPS 3 · Floating point & I/O", "Circle area (floats)", "Read radius, print π·r² as a float and rounded to an int, with newlines.", R`
READ_FLOAT = 6
PRINT_FLOAT = 2
PRINT_INT = 1
PRINT_CHAR = 11
EXIT = 10
        .data
consts: .float 3.14159265 0.5   # no FP immediates: constant pool
        .text
main:   li    $v0, READ_FLOAT   # radius -> $f0
        syscall
        mul.s $f0, $f0, $f0     # radius squared
        la    $s0, consts
        l.s   $f10, 0($s0)      # pi
        mul.s $f12, $f10, $f0   # area in $f12 (print arg)
        li    $v0, PRINT_FLOAT
        syscall
        li    $a0, 10           # '\n'
        li    $v0, PRINT_CHAR
        syscall
        l.s   $f0, 4($s0)       # 0.5
        add.s $f0, $f12, $f0    # round to nearest
        cvt.w.s $f0, $f0        # float -> int (still in FPU)
        mfc1  $a0, $f0          # move from coprocessor 1
        li    $v0, PRINT_INT
        syscall
        li    $v0, EXIT
        syscall`),
D("MIPS", "MIPS 3 · Floating point & I/O", "Print a string & read a string", "June 2023 Q12: printing a labelled string needs its **address** in $a0, so use `la` (not li, lw or move).", R`
        .data
str_pr: .asciiz "Enter your name: "
buf:    .space 40
        .text
main:   la   $a0, str_pr        # address of the string
        li   $v0, 4             # PRINT_STRING
        syscall
        la   $a0, buf           # buffer address
        li   $a1, 40            # max length
        li   $v0, 8             # READ_STRING
        syscall
        li   $v0, 10
        syscall`, { exam: "June 2023 Q12" }),
D("MIPS", "MIPS 4 · Functions & stack", "Function frame template (book convention)", "Minimal function start and return. $sp points just past the top of the stack.", R`
func:   sw   $ra, 0($sp)        # save return address
        sw   $fp, -4($sp)       # save frame pointer
        move $fp, $sp           # fp = old sp
        addi $sp, $sp, -8       # move SP past frame (add -4 per extra word)

        # ... body: locals/spills at -8($fp), -12($fp), ...

        move $sp, $fp           # restore SP
        lw   $fp, -4($sp)       # restore FP
        lw   $ra, 0($sp)        # restore return address
        jr   $ra                # return to caller`),
D("MIPS", "MIPS 4 · Functions & stack", "Leaf function: max(a, b)", "A leaf needs no frame: params in $a0/$a1, result in $v0, return with jr $ra. Call it from main.", R`
        .text
main:   addi $sp, $sp, -4       # glue: SPIM sp -> book convention
        sw   $ra, 0($sp)        # root function: save $ra (start-up did a jal)
        addi $sp, $sp, -4
        li   $a0, 17
        li   $a1, 42
        jal  max                # $v0 = max(17, 42)
        move $a0, $v0
        li   $v0, 1             # print it
        syscall
        addi $sp, $sp, 4
        lw   $ra, 0($sp)
        addi $sp, $sp, 4        # undo glue
        jr   $ra

max:    move $v0, $a0           # assume a is bigger
        bge  $a0, $a1, maxret
        move $v0, $a1
maxret: jr   $ra`),
D("MIPS", "MIPS 4 · Functions & stack", "Exam-style one-liners", "June 2022 Q11a / June 2023 Q16a: (i) N = Z with N in $t0 and Z at frame offset 8; (ii) return 42 from a leaf; (iii) Z = N + 27; return Z with Z in $t0 and N in $t1.", R`
# (i) N = Z;   Z is a local at offset 8 (stack offsets are negative)
        lw   $t0, -8($fp)

# (ii) return 42;   leaf function, no stack frame
        li   $v0, 42
        jr   $ra

# (iii) Z = N + 27; return Z;   (leaf)
        addi $t0, $t1, 27
        move $v0, $t0
        jr   $ra`, { exam: "June 2022 Q11a, June 2023 Q16a" }),
D("MIPS", "MIPS 4 · Functions & stack", "Globals via $gp", "Keep two counters as globals at offsets from $gp and increment one.", R`
NEGATIVES = 0                   # offsets in the global area
POSITIVES = 4
        lw   $t0, NEGATIVES($gp)
        addi $t0, $t0, 1
        sw   $t0, NEGATIVES($gp) # negatives++;`),
D("MIPS", "MIPS 4 · Functions & stack", "readint/printint loop program", "June 2022 Q11b: read until a non-positive value, add values < 10, print the sum, calling separately-loaded readint/printint functions.", R`
EXIT = 10
        .text
# $s0: next   $s1: sum   $s2: constant 10
main:   addi $sp, $sp, -4       # glue to book stack convention
        sw   $ra, 0($sp)        # root: save return address
        sw   $fp, -4($sp)
        move $fp, $sp
        addi $sp, $sp, -8
        jal  readint            # int next = readint();
        move $s0, $v0
        li   $s1, 0             # int sum = 0;
        li   $s2, 10
        j    wtest              # while (next > 0) {
wbody:  bge  $s0, $s2, ifdone   #   if (next < 10)   (inverted)
        add  $s1, $s1, $s0      #     sum += next;
ifdone: jal  readint            #   next = readint();
        move $s0, $v0
wtest:  bgt  $s0, $zero, wbody  # }
        move $a0, $s1           # printint(sum);
        jal  printint
        move $sp, $fp
        lw   $fp, -4($sp)
        lw   $ra, 0($sp)
        addi $sp, $sp, 4
        li   $v0, EXIT
        syscall`, { exam: "June 2022 Q11b", notes: "Use $s registers because you call functions: callees must preserve them. Marks were given for comments linking each line to the C code." }),
D("MIPS", "MIPS 4 · Functions & stack", "Recursive Fibonacci", "int fib(int n) { if (n <= 2) return 1; return fib(n-1) + fib(n-2); }, with a stack frame saving n and fib(n-1).", R`
# frame: 0($fp) ra | -4($fp) old fp | -8($fp) n | -12($fp) fib(n-1)
fib:    sw   $ra, 0($sp)
        sw   $fp, -4($sp)
        move $fp, $sp
        addi $sp, $sp, -16      # 4 words: ra, fp, n, partial result
        sw   $a0, -8($fp)       # save n
        li   $t0, 2
        bgt  $a0, $t0, recur    # if (n <= 2)
        li   $v0, 1             #   return 1;
        j    fibret
recur:  addi $a0, $a0, -1
        jal  fib                # fib(n-1)
        sw   $v0, -12($fp)      # save it (calls clobber $t/$v)
        lw   $a0, -8($fp)
        addi $a0, $a0, -2
        jal  fib                # fib(n-2)
        lw   $t0, -12($fp)
        add  $v0, $v0, $t0      # fib(n-1) + fib(n-2)
fibret: move $sp, $fp
        lw   $fp, -4($sp)
        lw   $ra, 0($sp)
        jr   $ra`),
D("MIPS", "MIPS 4 · Functions & stack", "Recursive Ackermann", "June 2022 Q11c style: A(0,n)=n+1; A(m,0)=A(m-1,1); A(m,n)=A(m-1, A(m,n-1)). Save m because the inner call clobbers $a0.", R`
ackermann:
        sw   $ra, 0($sp)        # save return address
        sw   $fp, -4($sp)       # save frame pointer
        move $fp, $sp
        addi $sp, $sp, -12      # 3 words: ra, fp, saved m
        sw   $a0, -8($fp)       # save m
        bne  $a0, $zero, notm0  # if (m == 0)
        addi $v0, $a1, 1        #   return n + 1;
        j    ackret
notm0:  bne  $a1, $zero, notn0  # if (n == 0)
        addi $a0, $a0, -1       #   return ackermann(m-1, 1);
        li   $a1, 1
        jal  ackermann
        j    ackret             # share the one unwind sequence
notn0:  addi $a1, $a1, -1       # inner: ackermann(m, n-1)
        jal  ackermann
        lw   $a0, -8($fp)       # m was clobbered: reload it
        addi $a0, $a0, -1
        move $a1, $v0           # outer: ackermann(m-1, result)
        jal  ackermann          # a real call: must come back here to unwind
ackret: move $sp, $fp
        lw   $fp, -4($sp)
        lw   $ra, 0($sp)
        jr   $ra`, { exam: "June 2022 Q11c", notes: "−12 = three words of frame (return address, old frame pointer, saved m). The stack grows down, so the frame is reserved by subtracting. The `j ackret` jumps to a single shared unwind point instead of duplicating it. The last call is `jal` because control must return here so this frame can be unwound before returning to our own caller." }),
D("MIPS", "MIPS 5 · Data structures", "strlen (null-terminated string)", "Leaf function: $a0 = address of string, return its length in $v0.", R`
strlen: move $v0, $zero         # i = 0
        move $t0, $a0           # pointer to current char
sloop:  lbu  $t1, 0($t0)        # load byte (unsigned)
        beq  $t1, $zero, sdone  # if (string[i] == 0) return i
        addi $v0, $v0, 1        # i++
        addi $t0, $t0, 1        # next byte (chars are 1 byte)
        j    sloop
sdone:  jr   $ra`),
D("MIPS", "MIPS 5 · Data structures", "Array maximum → variable", "June 2023 Q16b: find the max of the 20-int array my_arr and store it in max_val.", R`
        .data
my_arr:  .word 5, 13, 14, 18, 22, 26, 29, 34, 39, 41, 3, 7, 1, 0, 9, 8, 2, 6, 4, 11
max_val: .word 0
        .text
# $t0: array base   $t1: max   $t2: i   $t3: 20   $t4: address   $t5: element
main:   la   $t0, my_arr
        lw   $t1, 0($t0)        # max = arr[0];
        li   $t2, 1             # for (i = 1; i < 20; i++)
        li   $t3, 20
        j    test
body:   sll  $t4, $t2, 2        #   offset = i * 4
        add  $t4, $t4, $t0      #   address of arr[i]
        lw   $t5, 0($t4)
        ble  $t5, $t1, skip     #   if (arr[i] > max)   (inverted)
        move $t1, $t5           #     max = arr[i];
skip:   addi $t2, $t2, 1
test:   blt  $t2, $t3, body
        la   $t6, max_val
        sw   $t1, 0($t6)        # max_val = max;
        li   $v0, 10
        syscall`, { exam: "June 2023 Q16b", notes: "Array indexes are only known at run time, so scale the index (×4 with sll 2) instead of using a fixed offset. Or step a pointer by 4 each time." }),
D("MIPS", "MIPS 5 · Data structures", "Array sum with a pointer that steps by 4", "Same idea using a separate counter that increments by the element size.", R`
# $a0 = array address, $a1 = number of elements; result in $v0
sumarr: move $v0, $zero
        sll  $t1, $a1, 2        # byte length = n * 4
        add  $t1, $t1, $a0      # address just past the end
        j    stest
sbody:  lw   $t2, 0($a0)
        add  $v0, $v0, $t2
        addi $a0, $a0, 4        # step by element size
stest:  blt  $a0, $t1, sbody
        jr   $ra`),
D("MIPS", "MIPS 5 · Data structures", "switch with a jump table", "switch (value) { case 0: zeroes++; break; case 1: case 2: onesAndTwos++; break; default: others++; }", R`
        .data
jtable: .word case0, case12, case12   # one code address per case value
        .text
# $s0: value  $s1: zeroes  $s2: onesAndTwos  $s3: others
        bltz $s0, default       # out of range?  -> default
        li   $t0, 2
        bgt  $s0, $t0, default
        la   $t1, jtable
        sll  $t2, $s0, 2        # value * 4
        add  $t1, $t1, $t2
        lw   $t3, 0($t1)        # fetch target address
        jr   $t3                # jump to it
case0:  addi $s1, $s1, 1        # zeroes++;
        j    swdone             # break;
case12: addi $s2, $s2, 1        # onesAndTwos++;
        j    swdone             # break;
default:addi $s3, $s3, 1        # others++;
swdone: nop`),
D("MIPS", "MIPS 5 · Data structures", "Minimal malloc using sbrk", "Allocate n bytes with a 1-word size header before the block (syscall 9 grows the heap).", R`
# $a0 = bytes wanted; returns pointer to usable block in $v0
malloc: addi $t0, $a0, 4        # room for a header word
        move $t1, $a0           # remember requested size
        move $a0, $t0
        li   $v0, 9             # SBRK: $a0 bytes -> start address in $v0
        syscall
        sw   $t1, 0($v0)        # header: block size
        addi $v0, $v0, 4        # hand back the address after the header
        jr   $ra`, { notes: "free() can find the size in the word just before the pointer. In C, freeing a pointer that didn't come from malloc is an error." }),
D("MIPS", "MIPS 5 · Data structures", "Linked list: build and walk", "Node = {int data; node* next} (8 bytes). Prepend a node, then sum the list.", R`
# prepend: $a0 = old head, $a1 = value  ->  $v0 = new head
prepend:sw   $ra, 0($sp)
        sw   $fp, -4($sp)
        move $fp, $sp
        addi $sp, $sp, -16
        sw   $a0, -8($fp)       # save args across the malloc call
        sw   $a1, -12($fp)
        li   $a0, 8             # sizeof(node)
        jal  malloc
        lw   $t0, -12($fp)
        sw   $t0, 0($v0)        # node->data = value  (offset 0)
        lw   $t0, -8($fp)
        sw   $t0, 4($v0)        # node->next = old head (offset 4)
        move $sp, $fp
        lw   $fp, -4($sp)
        lw   $ra, 0($sp)
        jr   $ra

# sumlist: $a0 = head -> $v0 = sum   (leaf)
sumlist:move $v0, $zero
lloop:  beq  $a0, $zero, ldone  # while (p != NULL)
        lw   $t0, 0($a0)        #   sum += p->data;
        add  $v0, $v0, $t0
        lw   $a0, 4($a0)        #   p = p->next;
        j    lloop
ldone:  jr   $ra`),
D("MIPS", "MIPS 5 · Data structures", "Object method call via a method table", "Each object's first word points to its class's method table; calling area() loads the method address and jalr's to it with the object as an implicit parameter.", R`
        .data
circleMT: .word circleArea      # method table for Circle
squareMT: .word squareArea      # method table for Square
        .text
# $a0 = pointer to object; object word 0 = method table pointer
callArea:
        sw   $ra, 0($sp)
        sw   $fp, -4($sp)
        move $fp, $sp
        addi $sp, $sp, -8
        lw   $t0, 0($a0)        # method table of this object
        lw   $t1, 0($t0)        # entry 0: area method
        jalr $t1                # dynamic dispatch, $a0 = "this"
        move $sp, $fp
        lw   $fp, -4($sp)
        lw   $ra, 0($sp)
        jr   $ra`),

// ===== C (Section C of the exam) =====
D("C", "C · Systems-level (exam Section C)", "swap / minimise with pointers", "June 2022 Q16 and June 2023 Q22: pass-by-value can't change the caller's variables, so pass pointers.", R`
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}
/* call:  swap(&small, &big); */

void minimise(int *a, int *b) {
    if (*a < *b)
        *b = *a;
    else
        *a = *b;
}
/* also fix: else if (small == big)   -- '=' was assignment! */`, { exam: "June 2022 Q16, June 2023 Q22" }),
D("C", "C · Systems-level (exam Section C)", "Modifying a string literal (and the fix)", "June 2022 Q13: `char *data = \"hello\"; data[2] = 'p';` is undefined behaviour. Fix it.", R`
#include <stdio.h>

int main() {
    char data[] = "hello";   /* array copy on the stack: writable */
    data[2] = 'p';
    printf("%s\n", data);     /* heplo */
    return 0;
}`, { exam: "June 2022 Q13", notes: "A string literal lives in read-only static storage. Writing to it is **undefined behaviour**: the standard places no requirements, so it may crash, appear to work, or do anything else." }),
D("C", "C · Systems-level (exam Section C)", "Heap strings with malloc / calloc / free", "Allocate, null-terminate and free correctly. Shows where each pointer points.", R`
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

int main() {
    char w[] = "twip";                 /* w: array on the STACK          */
    char *lit = "zoot";                /* points to DATA segment (literal) */
    char *h = malloc(3);               /* points to the HEAP              */
    char *z = calloc(1, 20);           /* heap, zero-filled               */
    char **arr = malloc(3 * sizeof(char*));   /* heap array of pointers   */
    h[0] = 'y';                        /* same as **(&h) / *h             */
    h[1] = 'c';                        /* same as *(h + 1)                */
    h[2] = '\0';                       /* MUST terminate before printing  */
    arr[0] = w;                        /* same as *arr = w                */
    arr[1] = lit;                      /* same as *(arr + 1) = lit        */
    printf("%s - %s - %s\n", h, w, lit);   /* yc - twip - zoot */
    free(h);                           /* every malloc/calloc needs a free */
    free(z);
    free(arr);
    return 0;
}`, { exam: "June 2022 Q17, June 2023 Q23" }),
D("C", "C · Systems-level (exam Section C)", "struct vs union", "June 2023 Q20: sizes with 32-bit int and 64-bit pointers, and when to use a union.", R`
#include <stdio.h>

typedef struct { int a; char *b; } one;   /* 4 + 4 padding + 8 = 16 bytes */
typedef union  { int a; char *b; } two;   /* largest member  =  8 bytes   */

int main() {
    printf("%zu %zu\n", sizeof(one), sizeof(two));   /* 16 8 */
    return 0;
}
/* Use a union when only ONE of the members is meaningful at a time:
   all members share the same memory, saving space. */`, { exam: "June 2023 Q20" }),
D("C", "C · Systems-level (exam Section C)", "Function pointers: declare & use", "Declare a function that takes a comparison function pointer, as in the exam's maxBy / d / k declarations.", R`
#include <stdio.h>

int byValue(void *p) { return *(int *)p; }

/* maxBy: pointer to function (void*, int, int(*)(void*)) returning void* */
void *maxByImpl(void *arr, int n, int (*key)(void *)) {
    int *a = arr, *best = a;
    for (int i = 1; i < n; i++)
        if (key(&a[i]) > key(best))
            best = &a[i];
    return best;
}

int main() {
    void *(*maxBy)(void *, int, int (*)(void *)) = maxByImpl;
    int nums[] = {3, 9, 4};
    printf("%d\n", *(int *)maxBy(nums, 3, byValue));   /* 9 */
    return 0;
}`, { exam: "June 2023 Q21b" }),
D("C", "C · Systems-level (exam Section C)", "Array decay & pointer arithmetic", "Show that an array name becomes a pointer to its first element, and that a[i] == *(a + i).", R`
#include <stdio.h>

void show(int *p, int n) {          /* receives a pointer, size is lost */
    for (int i = 0; i < n; i++)
        printf("%d ", *(p + i));     /* identical to p[i] */
}

int main() {
    int a[4] = {10, 20, 30, 40};
    printf("%zu\n", sizeof(a));      /* 16: no decay inside sizeof */
    show(a, 4);                      /* a decays to &a[0]           */
    int *q = &a[1];                  /* & gives the address          */
    printf("\n%d %d\n", *q, q[1]);   /* 20 30 */
    return 0;
}`),
D("C", "C · Systems-level (exam Section C)", "Compile pipeline with gcc", "The four stages and the gcc flags to stop after each.", R`
gcc -E prog.c -o prog.i     # 1. preprocess: .c   -> .i  (expand #include/#define, strip comments)
gcc -S prog.i -o prog.s     # 2. compile:    .i   -> .s  (C -> assembly)
gcc -c prog.s -o prog.o     # 3. assemble:   .s   -> .o  (assembly -> machine-code object file)
gcc prog.o -o prog          # 4. link:       .o + libraries -> executable (resolve symbols)`, { exam: "June 2022 Q15, June 2023 Q19" }),
);
