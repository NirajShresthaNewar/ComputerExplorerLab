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
}

export const computerOrder = ['analog', 'digital', 'hybrid', 'micro', 'mini', 'mainframe', 'super']
