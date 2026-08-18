export const computerTypes = {
  analog: {
    id: 'analog',
    name: 'Analog Computer',
    tagline: 'Continuous Data',
    color: 'cyan',
    definition:
      'An analog computer processes continuously varying data, such as temperature, speed, or pressure, by measuring physical quantities rather than counting discrete numbers.',
    workingPrinciple:
      'Analog computers represent data as a continuously changing physical quantity (like voltage or the angle of a needle) and produce output that changes smoothly, without jumps.',
    examples: ['Speedometer', 'Thermometer', 'Fuel Gauge', 'Analog Clock', 'Pressure Gauge'],
    advantages: [
      'Gives real-time, continuous readings',
      'Simple mechanical design for many uses',
      'No conversion delay for physical measurements',
    ],
    disadvantages: [
      'Less accurate than digital systems',
      'Difficult to store or reproduce exact readings',
      'Affected by wear, friction, and temperature drift',
    ],
    applications: ['Vehicle dashboards', 'Weather instruments', 'Industrial gauges', 'Medical thermometers'],
    funFact: 'The abacus and slide rule are early analog-style calculating tools used centuries before electronic computers.',
  },
  digital: {
    id: 'digital',
    name: 'Digital Computer',
    tagline: 'Discrete Data',
    color: 'blue',
    definition:
      'A digital computer processes data in discrete form using binary digits (0s and 1s), performing calculations through precise, countable steps.',
    workingPrinciple:
      'Input is converted into binary code, processed by the CPU using logic circuits, and converted back into readable output such as text, images, or sound.',
    examples: ['Desktop Computer', 'Laptop', 'Smartphone', 'Calculator'],
    advantages: [
      'Very high accuracy and precision',
      'Can store and reproduce data exactly',
      'Capable of complex logical operations',
    ],
    disadvantages: [
      'Requires conversion of real-world signals into binary',
      'More complex circuitry than analog systems',
      'Fully dependent on electronic components',
    ],
    applications: ['Personal computing', 'Communication', 'Data storage', 'Software applications'],
    funFact: 'A single letter you type is instantly converted into an 8-bit binary code called ASCII before the computer processes it.',
  },
  hybrid: {
    id: 'hybrid',
    name: 'Hybrid Computer',
    tagline: 'Analog + Digital Combined',
    color: 'purple',
    definition:
      'A hybrid computer combines the continuous measurement ability of analog computers with the precision and processing power of digital computers.',
    workingPrinciple:
      'Analog sensors capture continuously changing physical signals, which are then converted into digital form for precise processing, calculation, and display.',
    examples: ['ECG Machine', 'Petrol Pump Meter', 'Aircraft Dashboard', 'Weather Station'],
    advantages: [
      'Combines real-time sensing with digital accuracy',
      'Ideal for monitoring critical, continuously changing data',
      'More versatile than pure analog or pure digital systems alone',
    ],
    disadvantages: [
      'More complex and expensive to build',
      'Requires careful calibration of both analog and digital parts',
      'Harder to maintain than single-type systems',
    ],
    applications: ['Hospitals (patient monitoring)', 'Fuel stations', 'Aviation', 'Meteorology'],
    funFact: 'An ECG machine reads the continuous electrical signal of your heartbeat, then digitally calculates your exact beats per minute.',
  },
  micro: {
    id: 'micro',
    name: 'Microcomputer',
    tagline: 'Single-User Computer',
    color: 'cyan',
    definition:
      'A microcomputer is a small, affordable computer built around a single microprocessor, designed for use by one person at a time.',
    workingPrinciple:
      'A single CPU handles all input, processing, and output for one user, running everyday applications like word processing, browsing, or gaming.',
    examples: ['Laptop', 'Desktop', 'Tablet', 'Smartphone'],
    advantages: [
      'Affordable and widely available',
      'Portable and easy to use',
      'Great for personal, everyday tasks',
    ],
    disadvantages: [
      'Limited processing power compared to larger systems',
      'Can only efficiently serve one user at a time',
      'Not suited for massive data processing',
    ],
    applications: ['Home computing', 'Education', 'Personal entertainment', 'Small business tasks'],
    funFact: 'The smartphone in your pocket is technically thousands of times more powerful than the room-sized computers of the 1960s.',
  },
  mini: {
    id: 'mini',
    name: 'Minicomputer',
    tagline: 'Multi-User Computer',
    color: 'blue',
    definition:
      'A minicomputer is a mid-sized computer more powerful than a microcomputer, capable of supporting multiple users working at the same time.',
    workingPrinciple:
      'A shared central processor allocates its resources across several connected terminals, letting many users run tasks simultaneously without needing their own full computer.',
    examples: ['School lab server', 'Hospital records system', 'Small office network server'],
    advantages: [
      'Supports many users at once',
      'More powerful than a single microcomputer',
      'Cost-effective for organizations vs. mainframes',
    ],
    disadvantages: [
      'Performance can drop as more users connect',
      'More expensive and complex than a microcomputer',
      'Requires some technical maintenance',
    ],
    applications: ['Schools', 'Small hospitals', 'Offices', 'Libraries'],
    funFact: 'Minicomputers were the "middle class" of computing in the 1970s-80s — smaller than mainframes but far more capable than early PCs.',
  },
  mainframe: {
    id: 'mainframe',
    name: 'Mainframe Computer',
    tagline: 'Thousands of Simultaneous Users',
    color: 'purple',
    definition:
      'A mainframe is a large, extremely powerful computer designed to process massive volumes of data and transactions for thousands of users at once.',
    workingPrinciple:
      'Powerful multi-core processors and huge memory handle enormous numbers of simultaneous requests, queuing and processing transactions with very high reliability.',
    examples: ['Bank transaction systems', 'Railway reservation systems', 'Airline booking systems', 'Government databases'],
    advantages: [
      'Extremely high reliability and uptime',
      'Handles massive numbers of users and transactions',
      'Strong security for sensitive data',
    ],
    disadvantages: [
      'Very expensive to purchase and maintain',
      'Requires specialized expertise to operate',
      'Physically large, needs dedicated infrastructure',
    ],
    applications: ['Banking', 'Airline reservations', 'Government records', 'Large-scale insurance systems'],
    funFact: "Mainframes process the vast majority of the world's ATM transactions, often handling thousands of transactions every second.",
  },
  super: {
    id: 'super',
    name: 'Supercomputer',
    tagline: 'Fastest Computer for Scientific Research',
    color: 'cyan',
    definition:
      'A supercomputer is the fastest and most powerful type of computer, capable of performing quadrillions of calculations per second for complex scientific problems.',
    workingPrinciple:
      'Thousands of processors work together in parallel, splitting massive computational problems into smaller pieces solved simultaneously to model complex systems.',
    examples: ['Weather forecasting systems', 'Earthquake simulators', 'DNA sequencing computers', 'Rocket design simulators'],
    advantages: [
      'Extraordinarily fast at complex calculations',
      'Enables simulations impossible on regular computers',
      'Drives major scientific breakthroughs',
    ],
    disadvantages: [
      'Enormously expensive to build and run',
      'Consumes huge amounts of electricity and cooling',
      'Requires highly specialized programming and staff',
    ],
    applications: ['Weather prediction', 'Space research', 'Medical research', 'Climate modeling'],
    funFact: 'Modern supercomputers can perform more calculations in one second than every person on Earth could complete in several lifetimes.',
  },
  memory: {
    id: 'memory',
    name: 'Memory & Storage',
    tagline: 'Bits, RAM, ROM & Memory Hierarchy',
    color: 'purple',
    definition:
      'Computer memory consists of electronic storage blocks (cells/shells) with unique addresses that hold binary data (0s and 1s) for processing and long-term storage.',
    workingPrinciple:
      'Data is stored in binary bit cells across a hierarchy: Registers & Cache for ultra-fast CPU access, Primary RAM/ROM for active program execution, and Secondary Storage (SSD/HDD) for permanent files.',
    examples: ['Bits & Bytes', 'CPU Cache', 'RAM (Volatile)', 'ROM (Non-Volatile)', 'NVMe SSD', 'Hard Drive (HDD)'],
    advantages: [
      'Allows instant random access to data via memory addresses',
      'Multi-level hierarchy balances extreme speed with huge capacity',
      'Enables multitasking and persistent data storage',
    ],
    disadvantages: [
      'Volatile primary memory (RAM) loses data when power is turned off',
      'Ultra-fast memory (Registers/Cache) is expensive and limited in size',
      'Secondary storage is significantly slower than CPU cache',
    ],
    applications: ['Program execution', 'Operating system loading', 'File storage', 'Data caching'],
    funFact: '1 Gigabyte of RAM contains over 8,500,000,000 individual microscopic transistor cells, each holding a single 1 or 0 bit!',
  },
  os: {
    id: 'os',
    name: 'Operating System (OS)',
    tagline: 'Kernel, CPU Scheduling & Terminal Shell',
    color: 'cyan',
    definition:
      'An Operating System (OS) is the master system software that acts as a bridge between user applications and computer hardware, managing CPU scheduling, memory, files, and device drivers.',
    workingPrinciple:
      'The OS Kernel controls system resources, schedules CPU time across running processes, manages RAM allocation, translates user commands (GUI/CLI) into system calls, and handles file I/O operations.',
    examples: ['Windows 11', 'macOS', 'Linux (Ubuntu)', 'Android', 'iOS'],
    advantages: [
      'Provides a user-friendly GUI or command terminal shell (CLI)',
      'Manages multitasking so many programs run simultaneously on the CPU',
      'Protects system security and allocates memory safely',
    ],
    disadvantages: [
      'Consumes system CPU and RAM to run background kernel services',
      'Complex software can have bugs or require system updates',
      'Requires hardware resources to operate',
    ],
    applications: ['Multitasking', 'File system hierarchy', 'Process scheduling', 'Hardware abstraction'],
    funFact: 'Linux and Unix kernel code powers the vast majority of web servers, cloud supercomputers, and smartphones (via Android)!',
  },
  quantum: {
    id: 'quantum',
    name: 'Quantum Computer',
    tagline: 'Superposition, Qubits & Parallel Speed',
    color: 'cyan',
    definition:
      'A Quantum Computer uses quantum mechanics (Qubits, Superposition, and Entanglement) to solve complex mathematical problems millions of times faster than classical computers.',
    workingPrinciple:
      'Instead of fixed 0s and 1s, Qubits exist in Superposition (both 0 AND 1 simultaneously) and use Entanglement to evaluate millions of potential paths at the exact same time.',
    examples: ['IBM Quantum System One', 'Google Sycamore', 'D-Wave Advantage'],
    advantages: [
      'Solves complex optimization & encryption problems in seconds',
      'Quantum parallelism evaluates all paths simultaneously',
      'Models molecular chemistry & medicine at the atomic level',
    ],
    disadvantages: [
      'Requires near absolute zero cooling (-273°C / 15 Kelvin)',
      'Highly sensitive to environmental noise (Quantum Decoherence)',
      'Extremely expensive and delicate to operate',
    ],
    applications: ['Drug discovery & medicine', 'Financial modeling', 'Cybersecurity & cryptography', 'Climate simulation'],
    funFact: 'A Qubit in superposition is like a coin spinning in mid-air — it is both Heads (1) and Tails (0) at the same time until you catch (measure) it!',
  },
  'software-class': {
    id: 'software-class',
    name: 'Software Classification Hub',
    tagline: 'System vs. Application Software & Sub-Categories',
    color: 'blue',
    definition:
      'Computer software is classified into System Software (which operates hardware & system operations) and Application Software (which helps users perform specific tasks).',
    workingPrinciple:
      'System software runs behind the scenes to manage hardware (OS, Drivers, Utilities, Language Processors), while Application software runs on top to serve user goals (Packaged spreadsheets/browsers & Tailored custom software).',
    examples: ['Windows 11', 'MS Excel', 'Device Drivers', 'Antivirus Utility', 'Python Interpreter', 'Custom Billing App'],
    advantages: [
      'Clear separation of system control from user applications',
      'System software keeps hardware stable and secure',
      'Application software provides tailored productivity tools for users',
    ],
    disadvantages: [
      'Application software cannot run without underlying System Software',
      'Tailored custom software can be expensive to develop',
      'Utility software can consume CPU background resources',
    ],
    applications: ['Operating system management', 'Business spreadsheets', 'Device connectivity', 'System maintenance'],
    funFact: 'Without an Operating System (System Software), your smartphone or PC hardware would just be a useless pile of metal and silicon silicon chips!',
  },
  'lang-processor': {
    id: 'lang-processor',
    name: 'Language Processors',
    tagline: 'Compiler vs. Interpreter Live Execution',
    color: 'purple',
    definition:
      'Language Processors (Compilers & Interpreters) translate high-level programming languages (like Python or C++) into machine binary code (0s and 1s) that the CPU can execute.',
    workingPrinciple:
      'Interpreters translate and execute code line-by-line (stopping instantly on errors), whereas Compilers scan all lines at once, report batch errors, and produce an executable machine code file.',
    examples: ['Python Interpreter', 'C++ GCC Compiler', 'Java Bytecode Compiler', 'JavaScript V8 Engine'],
    advantages: [
      'Interpreters allow fast debugging by catching errors immediately line-by-line',
      'Compilers produce faster-running binary machine code for high performance',
      'Allows humans to write readable pseudocode instead of raw binary 0s and 1s',
    ],
    disadvantages: [
      'Interpreted code generally runs slower than compiled code',
      'Compiled code requires a total re-compile every time a single line changes',
      'Language translation takes extra CPU processing time',
    ],
    applications: ['Software development', 'Web browser JavaScript engines', 'Mobile app compilation', 'Game engines'],
    funFact: 'The first compiler was invented in 1952 by pioneer Grace Hopper, who famously popularized the term "debugging" after finding a real moth inside a computer!',
  },
  'translation-pipeline': {
    id: 'translation-pipeline',
    name: 'Translation Pipeline',
    tagline: 'High-Level -> Assembly -> Machine Code & Lightboard',
    color: 'cyan',
    definition:
      'The Translation Pipeline illustrates how human-readable code passes through Assembly mnemonics down to raw binary pulses that light up electrical circuits inside the CPU.',
    workingPrinciple:
      'High-Level commands (e.g. Print "Hello") convert to Assembly registers (e.g. MOV AX, 01), which translate to 8-bit/16-bit binary bytes (01001000...) that flip physical CPU transistors ON or OFF.',
    examples: ['High-Level (Python/C)', 'Assembly (x86/ARM Assembly)', 'Machine Code (Binary Bytes)', 'Hardware Electrical Pulses'],
    advantages: [
      'Provides a complete visual model of computer execution levels',
      'Connects high-level programming directly to hardware electronic logic',
      'Demonstrates how binary bits control physical microchip transistors',
    ],
    disadvantages: [
      'Assembly programming is tedious and specific to chip architectures',
      'Direct machine code binary programming is prone to human error',
      'Hardware clock cycles limit maximum electrical signal speeds',
    ],
    applications: ['Microprocessor design', 'Low-level hardware firmware', 'Embedded systems', 'Computer science education'],
    funFact: 'Every single letter or color on your screen right now is stored as a series of 0s (OFF LEDs) and 1s (ON LEDs) in your computer memory!',
  },
  'device-driver': {
    id: 'device-driver',
    name: 'Device Driver Bridge',
    tagline: 'Hardware Communication & Connectivity Bridge',
    color: 'emerald',
    definition:
      'A Device Driver is specialized system software that acts as a translator bridge between the Operating System and physical hardware components (Printers, GPUs, Sound Cards).',
    workingPrinciple:
      'When an app initiates a hardware task (e.g., Print Document), the OS passes system calls to the Device Driver, which converts the generic request into precise electronic hardware instructions.',
    examples: ['Printer Driver', 'NVIDIA Graphics Driver', 'Realtek Audio Driver', 'USB Controller Driver'],
    advantages: [
      'Allows the OS to control thousands of different hardware brands with standard APIs',
      'Enables plug-and-play hardware compatibility',
      'Protects system stability by isolating hardware communication code',
    ],
    disadvantages: [
      'Outdated or missing drivers cause "Device Not Recognized" errors',
      'Faulty drivers are a leading cause of OS crashes (Blue Screen of Death)',
      'Requires frequent manufacturer software updates',
    ],
    applications: ['Printing paper', 'Rendering 3D graphics', 'Playing audio sound', 'Scanning documents'],
    funFact: 'Without a printer driver installed, your computer speaks "English" while your printer speaks "Japanese" — they cannot understand each other without the driver bridge!',
  },
}

export const hardwareComputerOrder = ['analog', 'digital', 'hybrid', 'micro', 'mini', 'mainframe', 'super']
export const systemLabsOrder = [
  'software-class',
  'os',
  'lang-processor',
  'translation-pipeline',
  'device-driver',
  'memory',
  'quantum',
]
export const computerOrder = hardwareComputerOrder
