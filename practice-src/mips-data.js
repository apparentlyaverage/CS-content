const TOPICS = [
  { id: "intro", name: "1 · Intro, RISC & the machine" },
  { id: "logic", name: "2a · Logic & adders" },
  { id: "nums", name: "2b · Binary, hex, 2's complement" },
  { id: "float", name: "2c · IEEE floating point" },
  { id: "regs", name: "2d · Registers & SPIM basics" },
  { id: "formats", name: "3a · Instruction formats & immediates" },
  { id: "mem", name: "3b · Loads, stores & addressing" },
  { id: "alu", name: "3c · ALU ops, shifts, multiply" },
  { id: "control", name: "3d · Loops, ifs & templates" },
  { id: "fp", name: "3e · Floating point code & syscalls" },
  { id: "func", name: "4 · Functions & the stack" },
  { id: "data", name: "5 · Arrays, strings, switch, heap, objects" },
  { id: "perf", name: "6 · Performance" },
];
const M = (t, q, o, a, e, code) => ({ t, type: "mcq", q, o, a, e, code });
const I = (t, q, a, e, code) => ({ t, type: "input", q, a, e, code });
const C = (t, q, a, code) => ({ t, type: "card", q, a, code });

const QUESTIONS = [
// ---------------- Chapter 1 ----------------
M("intro", "The book's distinction between HLLs and low-level languages is that HLLs use ____ while LL languages use ____.", ["classes / functions", "statements / opcodes", "variables / constants", "compilers / interpreters"], 1),
M("intro", "A computer that is part of another machine (washing machine, car, router) is called…", ["A real-time system", "An embedded system", "A mainframe", "A coprocessor"], 1),
M("intro", "Anti-lock brakes missing their deadline means the system is broken. That makes it a…", ["Soft real-time task", "Hard real-time task", "Batch task", "Embedded-only task"], 1, "Soft real-time has an acceptable failure mode, e.g. digital TV pixellating."),
I("intro", "What is the ASCII code (decimal) of the '%' character used in the book's example?", ["37"], "Binary 0100101. As a 6-bit MIPS function code, the same pattern means a logical `or`."),
M("intro", "Original ASCII is a ___-bit code. How many symbols, and how many are non-printing?", ["8-bit; 256 symbols; first 16 non-printing", "7-bit; 128 symbols; codes 0–31 non-printing", "7-bit; 128 symbols; codes 0–9 non-printing", "16-bit; 65 536 symbols"], 1, "So 96 printing characters (32 upwards)."),
M("intro", "What does MIPS stand for?", ["Millions of Instructions Per Second", "Microprocessor without Interlocked Pipelined Stages", "Minimal Instruction Processing System", "Multiple Integer Pipeline Stages"], 1),
M("intro", "MIPS is a ____ architecture.", ["CISC", "RISC", "VLIW", "Stack"], 1),
M("intro", "Which is **not** a typical RISC feature listed in the book?", ["A relatively large number of general-purpose registers", "Simple instruction formats, all the same length", "Memory accessed only by loads and stores", "Instructions that operate directly on memory operands"], 3, "Operating directly on memory is a CISC trait (e.g. Intel)."),
M("intro", "Another name for a RISC design is…", ["Load-store architecture", "Accumulator machine", "Harvard architecture", "Stack machine"], 0, "Registers are the fastest level of the memory hierarchy, so only loads and stores touch RAM."),
M("intro", "Why did early Intel designers favour a complex (CISC) instruction set?", ["Memory was very expensive, so a small code footprint mattered", "RISC hadn't been invented", "To make compilers simpler", "For energy efficiency"], 0, "Typical RISC code uses about 25% more memory than CISC."),
M("intro", "Who invented the concept of an *architecture* (a family of machines running the same code), and with which family?", ["Intel, with the 8086", "IBM, with the 360 family in the 1960s", "MIPS, with the R2000", "ARM, in the 1990s"], 1),
M("intro", "Who founded MIPS (in Silicon Valley)?", ["James Larus", "John Hennessy (Stanford)", "David Patterson", "Dennis Ritchie"], 1, "James Larus wrote the SPIM simulator, which started as an undergraduate project in 1990."),
M("intro", "The number of instructions actually executed in a run is the ____ instruction count; the number you count by reading the code is the ____ count.", ["static / dynamic", "dynamic / static", "runtime / compile", "real / pseudo"], 1),
M("intro", "Why does putting the loop test at the **bottom** (with a `j test` before the loop) speed up a loop?", ["Fewer static instructions", "One fewer instruction is executed per iteration (no jump back to the top each time)", "Branches are faster than jumps", "It avoids the nop"], 1, "3 instructions per iteration instead of 4, roughly 25% faster."),
M("intro", "A *pseudoinstruction* is…", ["An instruction the assembler accepts but translates into one or more real machine instructions", "A comment", "An assembler directive", "A privileged OS instruction"], 0, "Examples: `li`, `move`, `la`, `blt`, `mulo`."),
M("intro", "How is Java usually implemented?", ["Interpreted from source", "Compiled straight to machine code", "Compiled to bytecode, which is interpreted, usually with a JIT compiler", "Assembled"], 2, "Mainly for portability."),
M("intro", "Cache is usually made of ____ (transistors); main memory of ____ (capacitors).", ["DRAM / SRAM", "SRAM / DRAM", "Flash / DRAM", "SRAM / Flash"], 1, "SRAM is faster but less dense, so you get fewer bits for your money."),
M("intro", "Who manages what is in the **cache**, and who manages paging to disk?", ["Software / hardware", "Hardware / software (usually the OS)", "The compiler / the user", "Both by hardware"], 1),
M("intro", "In a multicore design like figure 1.2, which cache level is shared by all cores?", ["L1", "L2", "L3", "None"], 2),
M("intro", "SPIM expects assembly files with which extensions?", [".s, .a or .asm", ".mips only", ".c or .h", ".spim"], 0),
I("intro", "How many bytes is 1 KiB (kibibyte)?", ["1024"], "Binary prefixes: Ki = 2¹⁰, Mi = 2²⁰, Gi = 2³⁰. Decimal k = 10³."),
M("intro", "What is the 'memory wall'?", ["The growing speed gap between RAM and processor, so chasing raw instruction speed is increasingly wasted", "The limit on address space", "A cache coherence protocol", "The boundary between kernel and user memory"], 0),
C("intro", "Compiling vs interpreting", "Compiling translates the program once to machine code (or something like it), which then runs directly. Interpreting has a program examine each construct as it runs and decide what to do, with no conversion to machine code. Hardware itself is a machine-code interpreter."),

// ---------------- Chapter 2: logic ----------------
M("logic", "Which gate is called *universal* (any other gate can be built from it)?", ["XOR", "NAND", "AND", "NOT"], 1, "NOR is universal too."),
M("logic", "How do you make NOT A from a NAND gate?", ["A NAND 0", "A NAND A", "A NAND 1 NAND 1", "It can't be done"], 1, "Feed A into both inputs."),
M("logic", "How do you get OR from NAND?", ["Invert both inputs, then NAND them", "NAND twice", "NAND with 1", "NAND then invert the output"], 0, "By De Morgan: ¬A NAND ¬B = ¬(¬A ∧ ¬B) = A ∨ B. (NAND then invert gives AND.)"),
M("logic", "De Morgan's Law: ¬A ∨ ¬B equals…", ["¬(A ∨ B)", "¬(A ∧ B)", "A ∧ B", "A ⊕ B"], 1, "Swap and/or, and move the negation between the whole expression and its parts."),
M("logic", "De Morgan's Law: ¬A ∧ ¬B equals…", ["¬(A ∨ B)", "¬(A ∧ B)", "A ∨ B", "¬A ⊕ ¬B"], 0),
M("logic", "A ∧ ¬A = ?", ["1", "0", "A", "¬A"], 1, "A ∨ ¬A = 1. A formula that's always false is a *contradiction*; always true is a *tautology*."),
M("logic", "A ∨ 1 = ?", ["A", "0", "1", "¬A"], 2, "Called the or-tautology. A ∨ 0 = A is the or-identity; A ∧ 1 = A is the and-identity."),
I("logic", "XOR truth table: what is 1 ⊕ 1?", ["0"], "XOR is effectively 'not equal'."),
M("logic", "The simplified XOR expression derived in the book from four NAND gates is…", ["(A ∧ ¬B) ∨ (B ∧ ¬A)", "(A ∨ B) ∧ (A ∧ B)", "¬A ∧ ¬B", "A ∧ B"], 0),
M("logic", "Half adder: S = ? and C = ?", ["S = A ∧ B, C = A ⊕ B", "S = A ⊕ B, C = A ∧ B", "S = A ∨ B, C = A ∧ B", "S = A ⊕ B, C = A ∨ B"], 1),
M("logic", "Why is it called a *half* adder?", ["It only adds half the bits", "It has no carry-in input", "It has no carry-out", "It uses half as many gates"], 1),
I("logic", "Full adder with Cin = 1, A = 1, B = 0: what is S? (0 or 1)", ["0"], "1 + 1 + 0 = 10₂, so S = 0 and Cout = 1."),
I("logic", "Full adder with Cin = 1, A = 1, B = 1: give `S Cout`.", ["1 1"], "1 + 1 + 1 = 11₂."),
M("logic", "In a 4-bit ripple adder (figure 2.8), why is the logic drawn flowing right to left?", ["Low-order bits are on the right, and carries feed left into the next higher bit", "Convention only", "Because of little-endian ordering", "To save gates"], 0, "It's slow because the carry has to propagate across the whole width; real adders do more in parallel."),
M("logic", "In C-like languages, bitwise AND and logical AND are written…", ["& and &&", "&& and &", "and and AND", "^ and &"], 0),

// ---------------- Chapter 2: numbers ----------------
I("nums", "Convert 342 (decimal) to binary.", ["101010110"], "Repeatedly divide by 2 and read the remainders bottom-up."),
I("nums", "Convert 42 to hex (use 0x notation).", ["0x2A", "2A", "0x2a"], "0010 1010 → 2 A"),
I("nums", "Convert 0x3F to decimal.", ["63"]),
I("nums", "Convert 1101 0110₂ to hex.", ["0xD6", "D6", "0xd6"]),
M("nums", "To get the binary digits of a **fraction**, you repeatedly…", ["Divide by 2 and keep remainders", "Multiply by 2 and take the whole-number part as the next digit", "Subtract powers of 10", "Shift right"], 1),
I("nums", "Biggest unsigned number in 8 bits?", ["255"], "rʲ − 1 = 2⁸ − 1"),
M("nums", "Range of 8-bit two's complement integers?", ["−127..127", "−128..127", "−127..128", "0..255"], 1, "One more negative than positive, because zero uses a pattern with the sign bit clear."),
M("nums", "To negate a number in two's complement you…", ["Flip the sign bit", "Invert all the bits then add 1", "Invert all the bits", "Subtract it from 2⁸"], 1, "Inverting only (no +1) is one's complement, which has two zeros. Signed magnitude flips just the sign bit."),
I("nums", "Write −42 as an 8-bit two's complement binary number.", ["11010110"], "42 = 00101010 → invert 11010101 → +1 = 11010110"),
I("nums", "Write −1 as an 8-bit two's complement binary number.", ["11111111"]),
I("nums", "Sign-extend the 4-bit value 1101 to 8 bits.", ["11111101"], "Copy the sign bit leftwards. 1101 is −3, and so is 11111101."),
M("nums", "Main drawback of one's complement?", ["Can't add", "Zero has two representations (all 0s and all 1s)", "Needs 9 bits", "No negative numbers"], 1),
M("nums", "Adding 27 + (−1) in 8 bits gives 00011010 with a carry out of the top bit. Is it an overflow?", ["Yes, because of the carry out", "No: there was a carry **into** the sign bit as well as out of it", "Yes, the sign changed", "Can't tell"], 1, "Rule: overflow when the carry into the sign bit differs from the carry out of it."),
M("nums", "Two's complement overflow happens when…", ["There is any carry out", "The carry into the sign bit ≠ the carry out of the sign bit", "Both operands are negative", "The result is zero"], 1),
M("nums", "How does two's complement make 'less than' easy to test?", ["Subtract and check whether the sign bit of the result is set", "Compare the low bits", "Use XOR", "It doesn't"], 0),

// ---------------- Chapter 2: float ----------------
M("float", "IEEE 754 single precision layout:", ["1 sign | 8 exponent | 23 significand", "1 sign | 11 exponent | 20 significand", "8 exponent | 1 sign | 23 significand", "2's complement 32-bit"], 0),
I("float", "What is the exponent bias for 32-bit IEEE floats?", ["127"], "Stored exponent = actual + 127. Called offset, excess or bias notation."),
M("float", "Why are 23 stored significand bits worth 24 bits of precision?", ["There's an implicit leading 1 that isn't stored (except when the exponent is 0)", "The sign bit counts", "Rounding adds a bit", "The exponent adds one"], 0),
M("float", "IEEE floats represent negatives using…", ["Two's complement", "Signed magnitude (a sign bit)", "One's complement", "Excess-127"], 1, "Never apply two's complement tricks to floats."),
M("float", "Formula for a normal IEEE single value:", ["v = (−1)^S × (1 + F) × 2^(E−127)", "v = S × F × 2^E", "v = (−1)^S × F × 2^(E+127)", "v = (1 + F) × 10^(E−127)"], 0),
I("float", "Stored exponent bits for 12.1 (actual exponent 3)? Give 8 bits.", ["10000010"], "3 + 127 = 130 = 10000010"),
I("float", "The book's IEEE single encoding of 12.1, in hex?", ["0x4141999A", "4141999A", "0x4141999a", "4141999a"], "0 | 10000010 | 10000011001100110011010 (rounded up because the next discarded bit was 1)."),
I("float", "Encode −14.2 as an IEEE single in hex (the book's exercise).", ["0xC1633333", "C1633333", "0xc1633333", "c1633333"], "14.2 = 1110.001100110011… = 1.110001100110011… × 2³ → sign 1, exponent 130, significand 11000110011001100110011 (next bit 0, so no round-up)."),
I("float", "Encode 1.0 as an IEEE single in hex.", ["0x3F800000", "3F800000", "0x3f800000"], "Sign 0, exponent 127 = 01111111, significand 0."),
M("float", "Why is 0.1 a problem in binary floating point?", ["It's negative", "It's a recurring fraction in binary (0.000110011…), so it can't be stored exactly", "It needs a special NaN code", "It underflows"], 1),
M("float", "a = 1E20, b = 1E−20, c = 1E20 − 1. Which order of evaluation gives a non-zero d?", ["d = (a + b) − c", "d = (a − c) + b", "Both give 0", "Both give 1"], 1, "a + b loses b entirely to roundoff. FORTRAN is liked because it respects the programmer's order of evaluation."),
M("float", "An exponent field of all 1s is used for…", ["The biggest normal numbers", "Special values: ±∞ and NaN", "Zero", "Denormals"], 1),
M("float", "About how many decimal digits of precision does single precision give?", ["3", "7", "15", "38"], 1, "Range goes up to about 10³⁸, so precision is much smaller than range."),
M("float", "In MIPS the floating point unit (FPU) is treated as…", ["Coprocessor 0", "Coprocessor 1", "Part of the ALU", "An external device"], 1, "So the instructions are `mfc1`, `mtc1`, etc."),

// ---------------- Chapter 2: registers ----------------
I("regs", "How many integer registers does MIPS have?", ["32"]),
M("regs", "Which two registers have a purpose defined by the **hardware** (not just convention)?", ["$sp and $fp", "$zero ($0) and $ra ($31)", "$gp and $at", "$v0 and $a0"], 1, "$zero always reads 0; jal writes the return address into $ra."),
I("regs", "Register number of `$sp`?", ["29", "$29"]),
I("regs", "Register number of `$ra`?", ["31", "$31"]),
I("regs", "Register number of `$gp`?", ["28", "$28"]),
I("regs", "Real register numbers for `$t0`–`$t7`? (e.g. 1-5)", ["8-15", "8–15", "8 to 15"]),
I("regs", "Real register numbers for `$s0`–`$s7`?", ["16-23", "16–23", "16 to 23"]),
I("regs", "Real register numbers for `$a0`–`$a3`?", ["4-7", "4–7", "4 to 7"]),
M("regs", "What is `$at` ($1) for?", ["Return address", "Assembler temporary, used when expanding pseudoinstructions. Never use it yourself", "Argument 0", "Kernel use"], 1),
M("regs", "`$k0`–`$k1` are…", ["Saved temporaries", "Reserved for the OS kernel", "Float registers", "Return values"], 1),
M("regs", "Which registers must a **callee** preserve (\"saved? = Y\")?", ["$t0–$t9", "$s0–$s7, $gp, $sp, $fp", "$a0–$a3", "$v0–$v1"], 1, "Anything marked N ($t, $a, $v, $ra) must be saved by the caller if it needs it after the call."),
M("regs", "Directive for the code segment, and the label SPIM needs as the entry point:", [".code and start:", ".text and main:", ".data and main:", ".program and entry:"], 1),
M("regs", "Minimal SPIM program to exit:", ["li $v0, 10 then syscall", "li $a0, 10 then syscall", "jr $ra", "exit"], 0, "Syscall 10 = exit."),
M("regs", "SPIM shows `li $v0, 10` as which real instruction?", ["addi $2, $0, 10", "ori $2, $0, 10", "lui $2, 10", "add $2, $0, 10"], 1, "A ∨ 0 = A, so OR-ing with $0 loads the immediate."),
M("regs", "Why do addresses in SPIM's text segment go up in steps of 4?", ["MIPS addresses refer to bytes and each instruction is 4 bytes (32 bits)", "Word alignment of data only", "Convention", "Pipelining"], 0),
M("regs", "`blt $t1, $t2, body` is assembled into which pair?", ["slt $at, $t1, $t2 then bne $at, $zero, body", "sub $at, $t1, $t2 then bltz", "slt $at, $t2, $t1 then beq", "beq then j"], 0),
M("regs", "A branch back 3 instructions shows offset −12 in SPIM. What number is actually stored in the instruction?", ["−12", "−3", "12", "3"], 1, "Instructions are word-aligned, so the low 2 bits aren't stored. This stretches the range ×4."),
M("regs", "Why use 'Reinitialize and Load File' rather than plain load in SPIM?", ["Plain load adds the file to what is already in memory", "It's faster", "It enables pseudoinstructions", "It resets the console only"], 0),
M("regs", "SPIM comments use ___ in source, but SPIM shows ___ when displaying programs.", ["# / ;", "; / #", "// / #", "-- / ;"], 0),

// ---------------- Chapter 3: formats ----------------
M("formats", "R-format fields (bits):", ["op 6 | rs 5 | rt 5 | rd 5 | shamt 5 | funct 6", "op 6 | rs 5 | rt 5 | imm 16", "op 6 | addr 26", "op 8 | rs 8 | rt 8 | rd 8"], 0),
M("formats", "I-format fields:", ["op 6 | rs 5 | rt 5 | immediate 16", "op 6 | rs 5 | rt 5 | rd 5 | shamt 5 | funct 6", "op 6 | addr 26", "op 6 | rd 5 | imm 21"], 0),
I("formats", "How many bits is the address field in a J-format instruction?", ["26"]),
M("formats", "The only two J-format opcodes are…", ["j and jr", "j and jal", "jal and jr", "beq and bne"], 1, "`jr` is R-format."),
M("formats", "Why do register fields use 5 bits?", ["2⁵ = 32 registers", "For speed", "To fit the shift amount", "Convention"], 0),
M("formats", "For R-format instructions, the opcode field is…", ["The operation code", "Always 0; the operation is in the funct field", "The shift amount", "The destination"], 1, "This gives room for many more operations than 64."),
M("formats", "Why is the shamt field 5 bits?", ["Shifts of 0–31 cover a whole 32-bit register", "To match funct", "For alignment", "It's unused"], 0),
M("formats", "Loads, stores, addi and conditional branches are all which format?", ["R", "I", "J", "FR"], 1),
M("formats", "According to the book, the only 'true' conditional branches in MIPS are…", ["blt and bgt", "beq and bne", "beqz and bnez", "All six comparisons"], 1, "The others (blt, bge, bgt, ble…) are pseudoinstructions."),
I("formats", "420000 = 0x668A0. Which immediate do you give `lui` to load its high half? (hex)", ["0x0006", "0x6", "6"], "Then `ori $t0, $t0, 0x68A0` fills in the low half."),
M("formats", "What does `lui $t0, 0x0006` do?", ["$t0 = 0x00000006", "$t0 = 0x00060000 (immediate shifted left 16, low half zeroed)", "$t0 = $t0 + 0x60000", "Loads from address 6"], 1),
M("formats", "Why didn't the MIPS designers add an instruction to load a full 32-bit constant?", ["Big constants are rare, and it would need longer instructions, adding complexity for little use", "It's impossible", "Patent reasons", "It would need more registers"], 0),
M("formats", "Requirement for an immediate operand:", ["It must be a value known when the instruction is created, and fit in the immediate field", "It can be any register", "It must be positive", "It must be a multiple of 4"], 0),

// ---------------- Chapter 3: memory ----------------
M("mem", "What does `la $t0, population` do?", ["Loads the value stored at population", "Loads the address of the label population (pseudoinstruction)", "Stores $t0 at population", "Jumps to population"], 1),
M("mem", "What does `lw $t1, 4($t0)` load?", ["The word at address $t0 + 4", "$t0 + 4", "The 4th word of $t1", "4 bytes starting at $t1"], 0),
M("mem", "Why could `la $t0, population` be a single `lui`?", ["The data segment starts at 0x10010000, a multiple of 2¹⁶, so the low 16 bits are 0", "population is 0", "la is always one instruction", "$gp points there"], 0),
I("mem", "Default start address of SPIM's user data segment (where .data goes)? (hex)", ["0x10010000", "10010000"]),
I("mem", "In SPIM, what value does $gp start with? (hex)", ["0x10008000", "10008000"]),
I("mem", "Default start address of the user text segment in SPIM? (hex)", ["0x00400000", "0x400000", "00400000"]),
M("mem", "Largest positive offset in a load/store's 16-bit signed offset field?", ["65535", "32767", "32768", "4095"], 1, "Range is −32768 … 32767."),
M("mem", "In which order are the operands of a store written?", ["sw address, register", "sw $reg, offset($base): the source register first, memory address last, matching lw", "sw $base, $reg", "sw offset, $reg"], 1),
M("mem", "The `j` instruction uses ____ addresses; branches use ____ addresses.", ["relative / absolute", "absolute / relative (PC-relative offsets)", "absolute / absolute", "relative / relative"], 1, "Relative addresses also make relocating code easier."),
M("mem", "What happens on a `lw` from an address that isn't a multiple of 4?", ["It rounds down", "An exception (the program crashes)", "It loads 2 halfwords", "Nothing special"], 1, "SPIM's assembler aligns data items for you."),
M("mem", "SPIM (as used in the book) stores bytes in a word in which order?", ["Big-endian", "Little-endian: bytes numbered from the low-order end", "Middle-endian", "It varies"], 1),
M("mem", "`lbu` vs `lb`:", ["lbu zero-fills the high 24 bits; lb sign-extends", "lbu is a load byte from the upper half", "Identical", "lb zero-fills"], 0, "Stores have no unsigned mode: only that many bits are written."),
M("mem", "Which directive reserves one initialised byte?", [".word", ".byte", ".half", ".space 4"], 1),
M("mem", "A register holding 0x10010000 might be…", ["Only an address", "Only an integer", "Anything: the processor doesn't know if bits are an address, an integer or characters", "Always a pointer"], 2),

// ---------------- Chapter 3: ALU ----------------
M("alu", "`addiu $t0, $t0, -32768`: what does 'unsigned' mean for addiu?", ["The immediate must be positive", "Overflow isn't trapped; the immediate is still sign-extended", "Result is unsigned", "Operands are zero-extended"], 1),
M("alu", "What does `slti $t3, $t4, 10000` do?", ["Branches if $t4 < 10000", "$t3 = 1 if $t4 < 10000, else 0", "$t3 = $t4 − 10000", "Shifts $t4 left 10000"], 1, "Comparisons are computed into registers, just like arithmetic."),
M("alu", "Where does the real `mult` instruction put its result?", ["In rd", "In the special HI and LO registers", "In $v0/$v1", "In $at"], 1, "Copy them out with `mfhi` / `mflo`."),
M("alu", "How does `mulo`'s expansion detect overflow?", ["Checks whether HI is zero", "Checks that HI equals LO's sign bit copied 32 times (sra LO by 31, compare with HI)", "Uses the overflow flag", "It can't"], 1, "If they differ it runs `break` and the program dies with an overflow error."),
M("alu", "`mul $t4, $t1, $t3` vs `mulo`:", ["Same", "mul is a single 3-register instruction with no overflow check; use it only when you know it can't overflow", "mul is a pseudoinstruction that checks overflow", "mul uses floats"], 1),
M("alu", "`sra` vs `srl`:", ["sra fills from the left with copies of the sign bit; srl fills with zeros", "Same thing", "sra rotates", "srl sign-extends"], 0, "All other shifts fill with zeros."),
M("alu", "How does the book check whether a 32-bit result still fits in a 16-bit halfword?", ["sll 16 then sra 16, and compare with the original: equal means no overflow", "Check bit 15 only", "AND with 0xFFFF", "Divide by 65536"], 0, `sll $t1, $t0, 16
sra $t1, $t1, 16
beq $t1, $t0, ok
break 0
ok: nop`),
I("alu", "With that check, does `li $t0, 32768` pass (fit in a signed halfword)? Answer yes or no.", ["no"], "32767 is the biggest signed 16-bit value; 32768 overflows."),
M("alu", "Why is an `or` preferred over `add` to put low bits into an address?", ["Faster to type", "No overflow-checking logic needed", "add can't take immediates", "or works on floats"], 1),
M("alu", "Why does MIPS split multiply over several instructions instead of one complex one?", ["To make it easier to build hardware with a faster clock", "Patents", "It's more accurate", "To use fewer registers"], 0, "The ISA was designed by a compiler expert (Hennessy), who knew when the cheap `mul` is safe."),

// ---------------- Chapter 3: control ----------------
M("control", "The book's for/while loop template is…", ["test at top: branch out when done, j back at the bottom", "initialise; `j test`; body: …; test: `b__ R1,R2,body` (branch back while the condition to continue is true)", "body; test; j body", "Use recursion"], 1),
M("control", "In the if template, the branch condition is…", ["The same as in the C code", "Inverted, to jump around the true branch", "Always beq", "Always unconditional"], 1, "e.g. `if (value < 0)` becomes `bge $s0, $0, done`."),
M("control", "In the if-else template, what instruction comes at the end of the true branch?", ["nop", "j done (skip over the else part)", "jr $ra", "b else"], 1),
I("control", "Trace: age = 42; while (age < 100) { age *= 2; doublings++; }. Final value of doublings?", ["2"], "42 → 84 → 168."),
I("control", "For the bottom-test for loop (`j test` / body: add, addi / test: blt), how many instructions execute per loop iteration?", ["3"]),
M("control", "What is `NAME = value` in a SPIM source file (e.g. `EXIT = 10`)?", ["A variable", "A macro/named constant: the assembler substitutes the value wherever the name appears", "A label", "A data directive"], 1),
M("control", "Register rule of thumb from the book:", ["Use only $s registers everywhere", "Use only $t registers in a leaf function, and $s registers if you call functions", "Always use $a registers", "Use $at for temporaries"], 1),
M("control", "Why do templates matter (beyond correctness)?", ["They're required by SPIM", "Unstructured assembly is hard to read and debug, and templates teach you to think like a compiler", "They run faster", "They avoid pseudoinstructions"], 1),
M("control", "Using the simple templates twice in one program can break because…", ["Labels like `test`, `body` and `done` would be duplicated, so they need systematic unique names", "SPIM limits loops", "Registers run out", "Branches can't go backwards"], 0),
I("control", "Syscall code to read an integer? (result arrives in $v0)", ["5"]),

// ---------------- Chapter 3: fp & syscalls ----------------
I("fp", "Syscall number for PRINT_INT?", ["1"], "Value goes in $a0."),
I("fp", "Syscall number for PRINT_STRING?", ["4"], "Address of a null-terminated string in $a0."),
I("fp", "Syscall number for PRINT_FLOAT?", ["2"], "Value in $f12."),
I("fp", "Syscall number for READ_FLOAT?", ["6"], "Result in $f0."),
I("fp", "Syscall number for PRINT_CHAR?", ["11"], "Low byte of $a0."),
I("fp", "Syscall number for SBRK (grow the data segment, used by malloc)?", ["9"], "Bytes in $a0, start address of the new region in $v0."),
I("fp", "Syscall number for READ_STRING?", ["8"], "Buffer address in $a0, max length in $a1."),
M("fp", "Where does a READ_FLOAT syscall return its value?", ["$v0", "$f0", "$f12", "$a0"], 1),
M("fp", "Why does the circle-area program keep π and 0.5 in a constant pool in .data?", ["There are no floating-point immediates", "For speed", "To share with C", "SPIM bug"], 0),
M("fp", "What does `cvt.w.s $f0, $f0` do?", ["Converts single-precision float to a 32-bit integer (word), still in an FP register", "Converts word to single", "Copies to $a0", "Rounds to nearest"], 0),
M("fp", "What does `mfc1 $a0, $f0` do?", ["Moves from coprocessor 1 (FPU) register $f0 to integer register $a0", "Moves $a0 into $f0", "Multiplies floats", "Loads from memory"], 0),
M("fp", "Double-precision values use…", ["Separate 64-bit registers", "Even-numbered FP registers paired with the next odd one (e.g. $f12–$f13)", "HI/LO", "Two integer registers"], 1),
M("fp", "FP register conventions: results in ____, parameters in ____.", ["$f0,$f2 / $f12,$f14", "$f12 / $f0", "$f20–$f30 / $f4–$f10", "$f1 / $f3"], 0, "$f20–$f30 are saved temporaries."),
M("fp", "In the circle program, why add 0.5 before `cvt.w.s`?", ["So that truncation rounds to the nearest integer", "To avoid NaN", "Required by IEEE", "To make it positive"], 0),
M("fp", "SPIM syscalls only modify which register (besides the returned value)?", ["$v0", "$ra", "$sp", "None of the $t registers, but all $s"], 0, "On a real machine you'd need to spill registers before a system call."),

// ---------------- Chapter 4 ----------------
M("func", "What does `jal label` do?", ["Jumps to label and saves the address of the next instruction in $ra", "Jumps and links the stack", "Branches if less", "Saves $sp"], 0),
M("func", "How does a function return?", ["j main", "jr $ra", "syscall 10", "b $ra"], 1),
M("func", "Parameters go in ____ and results come back in ____.", ["$a0–$a3 / $v0–$v1", "$t0–$t3 / $s0", "$s0–$s3 / $a0", "$v0 / $a0"], 0),
M("func", "Why must a function save $ra before calling another function?", ["jal always writes $ra, so a nested call would overwrite the return address", "$ra is a temporary", "SPIM requires it", "To pass parameters"], 0),
M("func", "A **leaf** function is one that…", ["Is called by main", "Calls no other functions (including no syscalls)", "Has no parameters", "Is recursive"], 1, "A leaf usually needs no stack frame and should use $t registers."),
M("func", "On MIPS the stack grows…", ["Up toward higher addresses", "Down from high memory: pushing decreases $sp", "In both directions", "It doesn't grow"], 1),
M("func", "Another name for a stack frame is…", ["Activation record", "Heap block", "Segment", "Page"], 0),
M("func", "In the book's convention, where does $sp point?", ["At the topmost item on the stack (like SPIM)", "At the next free word, just past the top of the stack", "At the frame pointer", "At $gp"], 1, "So main's glue code subtracts 4 from $sp on entry and adds 4 before returning."),
M("func", "The book's minimal function start is:", ["sw $ra,0($sp); sw $fp,-4($sp); move $fp,$sp; addi $sp,$sp,-8", "addi $sp,$sp,8; sw $ra,0($sp)", "move $sp,$fp; jr $ra", "jal; nop"], 0, `sw   $ra, 0($sp)    # save return address
sw   $fp, -4($sp)   # save frame pointer
move $fp, $sp       # fp = old sp
addi $sp, $sp, -8   # move SP past frame`),
M("func", "The book's minimal return sequence is:", ["move $sp,$fp; lw $fp,-4($sp); lw $ra,0($sp); jr $ra", "lw $ra,0($sp); jr $ra; move $sp,$fp", "addi $sp,$sp,8; j $ra", "jr $fp"], 0),
M("func", "Who is responsible for saving $s registers that a function changes?", ["The caller", "The callee: it must restore them before returning", "Nobody", "The OS"], 1),
M("func", "Who must save $t registers if their values are needed after a call?", ["The callee", "The caller", "The hardware", "Nobody can"], 1),
M("func", "Table 4.1: which function type needs to push $ra?", ["Only leaf functions", "Root and interior functions, but not leaf functions", "Only root", "All"], 1, "Root: the SPIM start-up code reached main with a jal, so main must save $ra before calling anything."),
M("func", "Offsets of locals relative to $fp are generally ____; offsets within a data structure are ____.", ["positive / negative", "negative / positive", "zero / positive", "positive / positive"], 1),
M("func", "$gp is used to…", ["Point to the stack top", "Act as a base address for global variables", "Hold the return address", "Count instructions"], 1),
M("func", "SPIM's own convention defaults the stack frame to…", ["8 bytes", "24 bytes (6 words)", "32 bytes", "Variable"], 1),
M("func", "Which compilers use a frame pointer (per Appendix D)?", ["MIPS C compiler yes, GNU no", "GNU C compiler for MIPS uses it; the MIPS C compiler doesn't", "Both", "Neither"], 1),
M("func", "More than 4 parameters, or bigger parameters, are passed…", ["In $t registers", "On the stack, set up by the caller and accessed like locals in the callee", "In $s registers", "Via syscall"], 1),
M("func", "Why does recursion 'come naturally' once calls are done properly?", ["Each call gets its own stack frame remembering how to get back, so calling yourself works like calling any other function", "MIPS has a recursion instruction", "The assembler unrolls it", "$ra is a stack"], 0),
M("func", "What register holds the address of the next instruction to execute?", ["$ra", "PC (program counter)", "$sp", "$at"], 1),

// ---------------- Chapter 5 ----------------
M("data", "'At machine code level, there are no ____.'", ["registers", "data structures (just bit patterns you interpret)", "instructions", "addresses"], 1),
M("data", "Sizes of C types on this MIPS: char, short, int, float, double (bytes)?", ["1, 2, 4, 4, 8", "1, 2, 2, 4, 8", "2, 2, 4, 8, 8", "1, 4, 4, 4, 8"], 0, "long is 8 and long double is 16 in the book's table."),
M("data", "Why can't an instruction offset be used to index an array?", ["Offsets are too small", "An index may only be known at run time, while an offset must be fixed when the instruction is created", "Arrays are on the heap", "Offsets must be positive"], 1),
M("data", "To index a word array, element i is at…", ["base + i", "base + 4·i (often computed with `sll $t, $i, 2`)", "base − i", "base + i/4"], 1, "Or keep a separate counter that steps by the element size."),
I("data", "An int array starts at 0x10010000. What is the address of element [5]? (hex)", ["0x10010014", "10010014"], "5 × 4 = 20 = 0x14"),
M("data", "C strings are…", ["Length-prefixed", "Arrays of chars terminated by a null (0) byte", "Linked lists", "Fixed 256 bytes"], 1, "So finding the length means visiting every element."),
M("data", "`.asciiz` vs `.ascii`:", [".asciiz adds a terminating null byte", "Same", ".ascii adds the null", ".asciiz is Unicode"], 0),
M("data", "In C, an array passed to a function is passed as…", ["A copy of all elements", "The address of (pointer to) its first element", "Its length", "A struct"], 1),
M("data", "An efficient switch with close-together case labels is implemented with…", ["Nested if-else only", "A jump table: an array of code addresses indexed by the value, then `jr`", "Recursion", "A hash table"], 1, "If the case labels are far apart, consider ifs."),
M("data", "What is a block **header** in the book's malloc?", ["Extra info stored just before an allocated block (e.g. size/next) so free can manage it", "The first user byte", "A cache line", "A syscall"], 0),
M("data", "When disposing of a complex pointer-based data structure, free…", ["The top level first", "Parts that contain no pointers first, working up to the top level", "In random order", "Only the root"], 1, "That way you never access data after it's been deallocated."),
M("data", "How are objects implemented at machine level (per the book)?", ["Structured types plus an implicit pointer to the current object, and a method table for dynamic dispatch", "Like arrays", "Separate segments", "Hardware support"], 0, "Calling a method follows the object's pointer to the method table, then jumps to the entry."),
M("data", "Calling `free` on a pointer that didn't come from malloc in C is…", ["Fine", "An error, though some malloc implementations check for it at run time", "Required", "Handled by the hardware"], 1),
M("data", "Extracting a byte from a word in a byte-order-independent way uses…", ["Shifting and masking (AND)", "lw only", "Division", "Floating point"], 0),

// ---------------- Chapter 6 ----------------
M("perf", "Speedup is defined as…", ["t_after / t_before", "t_before / t_after", "t_before − t_after", "1 − t_after"], 1, "A speedup < 1 means your 'improvement' made things worse."),
M("perf", "Maximum ideal speedup of an N-stage pipeline?", ["2", "N", "N²", "log N"], 1),
I("perf", "An instruction takes 5 time units, split into 4 equal stages with 0.2 units of overhead between stages. Speedup? (1 decimal place)", ["3.6"], "Per instruction: 1.25 × 4 + 0.2 × 3 = 5.6; ÷ 4 stages = 1.4 per instruction; 5 / 1.4 ≈ 3.6."),
M("perf", "The classic 5 pipeline stages:", ["IF, ID, EX, MEM, WB", "Fetch, Load, Add, Store, Jump", "IF, EX, WB, MEM, ID", "Decode, Fetch, Run, Halt, Save"], 0),
M("perf", "The instruction immediately after a branch that runs whether or not the branch is taken occupies the…", ["Branch delay slot", "Hazard slot", "Pipeline bubble", "Jump table"], 0, "SPIM only does delayed branches if you ask it to."),
M("perf", "Amdahl's Law (N× parallelism, sequential fraction S): speedup =", ["N / ((S × N) + (1 − S))", "N × S", "1 / S", "(1 − S) × N"], 0),
I("perf", "120 s program; a 100 s part is sped up 200×. Using Amdahl's Law, what is the overall speedup, to the nearest whole number?", ["6"], "S = 20/120 = 1/6. 200 / (200/6 + 5/6) = 1200/205 ≈ 5.85."),
M("perf", "With S = 1 in Amdahl's Law the speedup is…", ["N", "1 (no speedup)", "0", "Infinite"], 1),
M("perf", "Temporal locality means…", ["A location accessed now is likely to be accessed again soon", "Nearby locations will be accessed soon", "Accesses are random", "Data is accessed in time order"], 0),
M("perf", "Spatial locality means…", ["Same location again soon", "Locations near one just accessed are likely to be accessed soon, so caches fetch whole blocks (lines)", "Data on the stack", "Accessing disk"], 1),
I("perf", "Typical cache block (line) size given in the book, in bytes?", ["64"]),
I("perf", "L1 hit = 1 cycle, L2 = 10 cycles, DRAM = 200 cycles. 1% of instructions go to L2, 0.1% go to DRAM. Average cycles per instruction?", ["1.289"], "0.989 × 1 + 0.01 × 10 + 0.001 × 200 = 0.989 + 0.1 + 0.2"),
M("perf", "Rough access times from the book: DRAM, flash SSD, disk:", ["20 ns, 25 µs, 10 ms", "1 ns, 1 µs, 1 ms", "20 ms, 25 ns, 10 µs", "All about 1 µs"], 0, "Against a core doing an instruction every 0.2 ns, disk is about 5 million times slower."),
M("perf", "Which software layer hides most of the latency of slow IO devices?", ["The compiler", "The operating system", "The cache", "The assembler"], 1),
M("perf", "The book's view of energy is that it is…", ["A secondary concern", "A first-class design concern (battery life on mobiles, heat in big systems)", "Only for embedded", "Irrelevant to software"], 1),
M("perf", "Best practical advice from the locality section for programmers:", ["Access memory randomly", "Do as much as possible in one region of a big data structure before moving on", "Avoid loops", "Use more registers than exist"], 1),
];

const NOTES = `
<h2 style="margin-top:0">MIPS2C (MIPS part): one-page cheat sheet</h2>
<h3>Registers (Appendix B)</h3>
<table><tr><th>Name</th><th>#</th><th>Use</th><th>Callee saves?</th></tr>
<tr><td>$zero</td><td>0</td><td>always 0 (HW)</td><td>–</td></tr>
<tr><td>$at</td><td>1</td><td>assembler temporary. Don't use it</td><td>–</td></tr>
<tr><td>$v0–$v1</td><td>2–3</td><td>results / syscall code in $v0</td><td>N</td></tr>
<tr><td>$a0–$a3</td><td>4–7</td><td>parameters</td><td>N</td></tr>
<tr><td>$t0–$t7, $t8–$t9</td><td>8–15, 24–25</td><td>temporaries</td><td>N</td></tr>
<tr><td>$s0–$s7</td><td>16–23</td><td>saved temporaries</td><td>Y</td></tr>
<tr><td>$k0–$k1</td><td>26–27</td><td>OS kernel</td><td>–</td></tr>
<tr><td>$gp / $sp / $fp</td><td>28 / 29 / 30</td><td>global ptr / stack ptr / frame ptr</td><td>Y</td></tr>
<tr><td>$ra</td><td>31</td><td>return address (HW, written by jal)</td><td>N</td></tr></table>
<p class="meta">FP: results $f0,$f2 · params $f12,$f14 · temps $f4–$f10, $f16–$f18 · saved $f20–$f30. Doubles use even/odd pairs. HI/LO hold multiply results.</p>
<h3>SPIM syscalls (code in $v0, then <code>syscall</code>)</h3>
<ul><li>1 print_int ($a0) · 2 print_float ($f12) · 3 print_double · 4 print_string ($a0 = address) · 5 read_int → $v0 · 6 read_float → $f0 · 7 read_double · 8 read_string ($a0 buf, $a1 len) · 9 sbrk ($a0 bytes → $v0 address) · 10 exit · 11 print_char · 12 read_char · 13–16 open/read/write/close · 17 exit2</li></ul>
<h3>Instruction formats (32 bits)</h3>
<ul><li><b>R</b>: op6 (=0) | rs5 | rt5 | rd5 | shamt5 | funct6 → R[d] = R[s] op R[t]</li>
<li><b>I</b>: op6 | rs5 | rt5 | imm16 → addi, lw/sw (address R[s]+imm), beq/bne</li>
<li><b>J</b>: op6 | addr26 → only <code>j</code>, <code>jal</code></li>
<li>Big constant: <code>lui $t0, hi16</code> then <code>ori $t0, $t0, lo16</code>. Branch offsets are stored in words (−12 bytes → −3).</li>
<li>Pseudoinstructions: li→ori $x,$0,imm · move→addu $x,$0,$y · la→lui(+ori) · blt→slt $at + bne · mulo→mult, mfhi, mflo, sra 31, beq, break.</li></ul>
<h3>Numbers</h3>
<ul><li>Two's complement: invert + 1. 8 bits: −128..127. Overflow when carry into sign ≠ carry out. Sign-extend by copying the sign bit left.</li>
<li>IEEE single: sign 1 | exponent 8 (bias 127) | fraction 23, with an implicit leading 1. v = (−1)^S × 1.F × 2^(E−127). 12.1 = 0x4141999A; 1.0 = 0x3F800000.</li>
<li>Logic: NAND/NOR universal; De Morgan; half adder S=A⊕B, C=A∧B; full adder adds Cin; ripple carry.</li></ul>
<h3>Memory & SPIM</h3>
<ul><li>.text at 0x00400000 (main is reached by the start-up code's jal); .data at 0x10010000; $gp = 0x10008000; stack grows down.</li>
<li>lw/sw need word alignment; lb sign-extends, lbu zero-extends; SPIM is little-endian. Offset range −32768..32767.</li></ul>
<h3>Templates</h3>
<pre><code>loop:  (init)            if:      b!cond R1,R2,done      if-else: b!cond R1,R2,else
       j test                     (true part)                     (true part)
body:  ...               done:                                   j done
       (increment)                                       else:    (false part)
test:  bcond R1,R2,body                                  done:</code></pre>
<h3>Functions (book's convention: $sp points just past the top of the stack)</h3>
<pre><code>start:  sw $ra,0($sp) ; sw $fp,-4($sp) ; move $fp,$sp ; addi $sp,$sp,-8
return: move $sp,$fp  ; lw $fp,-4($sp) ; lw $ra,0($sp) ; jr $ra</code></pre>
<ul><li>Callee restores $s, $fp, $sp; caller saves the $t it needs. Root/interior functions push $ra; leaf functions don't. Locals are at negative offsets from $fp.</li></ul>
<h3>Data structures</h3>
<ul><li>Array element i = base + i × size (sll by 2 for words). C strings are null-terminated (.asciiz). Switch → jump table + jr. malloc keeps a block header; sbrk grows the heap. Objects = struct + this pointer + method table.</li></ul>
<h3>Performance</h3>
<ul><li>speedup = t_before / t_after. N-stage pipeline ≤ N× (IF ID EX MEM WB). Branch delay slot.</li>
<li>Amdahl: speedup = N / (S·N + (1−S)).</li>
<li>Locality: temporal and spatial; cache lines of about 64 B. t_avg = f_L1·t_L1 + f_L2·t_L2 + f_DRAM·t_DRAM.</li>
<li>DRAM about 20 ns, SSD about 25 µs, disk about 10 ms.</li></ul>
`;
