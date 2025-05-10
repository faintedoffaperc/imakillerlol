document.addEventListener("DOMContentLoaded", () => {
    console.log("app.js loaded - Initializing terminal and particles");

    // Particle System
    const particleCanvas = document.getElementById('particles');
    const particleCtx = particleCanvas.getContext('2d');
    let particles = [];

    function resizeParticles() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
        console.log("Canvas resized:", particleCanvas.width, particleCanvas.height);
    }
    resizeParticles();
    window.addEventListener('resize', resizeParticles);

    function createParticle() {
        return {
            x: Math.random() * particleCanvas.width,
            y: 0,
            speed: Math.random() * 2 + 1,
            size: Math.random() * 3 + 1,
            life: Math.random() * 100 + 50,
            targetX: null,
            velocityX: 0,
            offsetX: (Math.random() - 0.5) * 100 // Random offset to distribute particles
        };
    }

    function animateParticles() {
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        
        if (particles.length < 100) {
            particles.push(createParticle());
        }

        particles.forEach((particle, index) => {
            particle.y += particle.speed;
            particle.life -= 1;

            // Smooth mouse following with offset
            if (particle.targetX === null) particle.targetX = particle.x;
            const mouseX = particle.targetX + particle.offsetX; // Add offset to spread particles
            const dx = mouseX - particle.x;
            particle.velocityX += dx * 0.005; // Reduced acceleration for less clustering
            particle.velocityX *= 0.50; // Adjusted damping for smoother movement
            particle.x += particle.velocityX;

            particleCtx.beginPath();
            particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            particleCtx.fillStyle = `rgba(0, 255, 0, ${particle.life / 100})`;
            particleCtx.fill();

            if (particle.y > particleCanvas.height || particle.life <= 0) {
                particles.splice(index, 1);
                particles.push(createParticle());
            }
        });

        requestAnimationFrame(animateParticles);
    }
    console.log("Starting particle animation");
    animateParticles();

    // Sound Effects with Volume Control
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.05, audioCtx.currentTime); // 30% volume
    masterGain.connect(audioCtx.destination);

    function playTypeSound() {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.connect(masterGain);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    }
    function playBeepSound() {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
        oscillator.connect(masterGain);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }
    function playClickSound() {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.connect(masterGain);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.08);
    }
    function playErrorSound() {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.connect(masterGain);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    }

    // Mouse Movement for Particles Only
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        particles.forEach(particle => {
            particle.targetX = mouseX;
        });
    });
    
    // Boot Sequence and Typewriter Effect with Transition
    const title = document.getElementById('title');
    const bootMessage = document.getElementById('boot-message');
    const bootSteps = [
        'CHECKING RAM: 16KB OK',
        'INITIALIZING SYSTEM - v1.0.0',
        'SYSTEM ONLINE'
    ];
    const titleText = 'imakiller.lol';
    let bootStepIndex = 0;
    let bootIndex = 0;
    let titleIndex = 0;
    
    function typeBootStep() {
        console.log("Typing boot step:", bootStepIndex, bootIndex);
        if (bootStepIndex < bootSteps.length) {
            const currentStep = bootSteps[bootStepIndex];
            if (bootIndex < currentStep.length) {
                bootMessage.textContent = currentStep.slice(0, bootIndex + 1) + '_';
                playTypeSound();
                bootIndex++;
                setTimeout(typeBootStep, 60);
            } else {
                bootMessage.innerHTML = currentStep + '<span class="blink">_</span>';
                bootStepIndex++;
                bootIndex = 0;
                setTimeout(typeBootStep, 500);
            }
        } else {
            gsap.to('#boot-message', { opacity: 0, duration: 1, onComplete: typeTitle });
        }
    }
    
    function typeTitle() {
        console.log("Typing title:", titleIndex);
        if (titleIndex < titleText.length) {
            title.textContent = titleText.slice(0, titleIndex + 1) + '_';
            playTypeSound();
            titleIndex++;
            setTimeout(typeTitle, 100);
        } else {
            title.innerHTML = titleText + '<span class="blink">_</span>';
            title.style.opacity = '1';
        }
    }
    setTimeout(() => {
        console.log("Starting terminal animation and boot sequence");
        gsap.fromTo('.terminal', { opacity: 0 }, { opacity: 1, duration: 1, ease: 'linear', onStart: typeBootStep });
    }, 500);
    
    // ASCII Art for Outputs
    const asciiArt = {
        '/faint': `
        _____
       /     \\
      /_______\\
      |  ***  | 
      |  ***  | 
      |_______|
    `,
        '/dan': `
       _____
      |  ***  |
      |  ***  |
      |_______|
      |  ***  |
      |  ***  |
      |_______|
    `,
        '/sworn': `
       _______
      |  ***  |
      |  ***  |
      |_______|
      |  ***  |
      |_______|
    `,
        '/pnd': `
       _____
      | *** |
      | *** |
      |_____|
      | *** |
      | *** |
      |_____|
    `,
        '/kazt': `
       _____
      | * * |
      | * * |
      |_____|
      |  *  |
      |  *  |
      |_____|
    `
    };

    // Random Error Messages
    const errorMessages = [
        'SYSTEM FAULT DETECTED',
        'MEMORY CORRUPTION WARNING',
        'I/O ERROR DETECTED',
        'PROCESSOR OVERLOAD'
    ];
    function showRandomError() {
        if (Math.random() < 0.1) { // 10% chance per input
            const output = document.createElement('div');
            output.className = 'output text-sm ml-4 active';
            output.textContent = errorMessages[Math.floor(Math.random() * errorMessages.length)];
            document.getElementById('commands').appendChild(output);
            gsap.fromTo(
                output,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
            playErrorSound();
        }
    }

    // Function to Trigger Navigation
    function triggerNavigation(cmd, output) {
        playClickSound();
        output.classList.add('active');
        output.classList.add('status');
        output.textContent = 'CONNECTING TO ' + cmd.textContent.slice(2) + '...';
        gsap.fromTo(
            output,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );

        setTimeout(() => {
            output.textContent = '[          ] 0%';
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                output.textContent = '[' + '='.repeat(progress / 10) + ' '.repeat(10 - progress / 10) + '] ' + progress + '%';
                if (progress >= 100) {
                    clearInterval(interval);
                    output.classList.remove('status');
                    output.classList.add('active');
                    output.textContent = asciiArt[cmd.dataset.link] + '\nRedirecting to ' + cmd.dataset.link + '... [OK]';
                    gsap.to(output, {
                        color: '#ff0000',
                        duration: 0.3,
                        onComplete: () => {
                            window.location.href = cmd.dataset.link;
                        },
                    });
                }
            }, 100);
        }, 500);
    }
    
    // Command Interactions
    const commands = document.querySelectorAll('.command');
    commands.forEach((cmd) => {
        const output = cmd.nextElementSibling;
    
        // Hover Effect
        cmd.addEventListener('mouseenter', () => {
            if (!cmd.classList.contains('glitch')) {
                cmd.classList.add('glitch');
            }
        });
        cmd.addEventListener('mouseleave', () => {
            cmd.classList.remove('glitch');
        });
    });
    
    // Terminal Input Handling
    const input = document.getElementById('terminal-input');
    const statusBar = document.getElementById('status-bar');
    const validCommands = ['/faint', '/dan', '/sworn', '/pnd', '/kazt', '/help', '/clear'];
    let commandHistory = [];
    let historyIndex = -1;
    
    function updateStatusBar() {
        const now = new Date();
        const time = now.toLocaleTimeString();
        const load = Math.floor(Math.random() * 100) + '%';
        statusBar.textContent = `Time: ${time} | Load: ${load}`;
    }
    setInterval(updateStatusBar, 5000); // Update every 5 seconds
    updateStatusBar(); // Initial update

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const value = input.value.trim().toLowerCase();
            playClickSound();
            commandHistory.push(value);
            historyIndex = commandHistory.length;
            showRandomError();

            if (validCommands.includes(value)) {
                const cmd = Array.from(commands).find(c => c.dataset.link === value);
                const output = cmd ? cmd.nextElementSibling : document.createElement('div');
                if (cmd) {
                    triggerNavigation(cmd, output);
                } else if (value === '/help') {
                    output.className = 'output text-sm ml-4 active';
                    output.textContent = 'Available commands:\n' +
                        '/faint - Display faint page\n' +
                        '/dan - Display dan page\n' +
                        '/sworn - Display sworn page\n' +
                        '/pnd - Display pnd page\n' +
                        '/kazt - Display kazt page\n' +
                        '/help - Show this help message\n' +
                        '/clear - Clear the screen';
                    document.getElementById('commands').appendChild(output);
                    gsap.fromTo(
                        output,
                        { opacity: 0, y: 10 },
                        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                    );
                } else if (value === '/clear') {
                    document.getElementById('commands').innerHTML = '';
                }
                input.value = '';
            } else {
                const output = document.createElement('div');
                output.className = 'output text-sm ml-4 active';
                output.textContent = `ERROR: Unknown command "${value}". Valid commands: ${validCommands.join(', ')}`;
                document.getElementById('commands').appendChild(output);
                gsap.fromTo(
                    output,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                );
                playErrorSound();
                input.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex] || '';
                playBeepSound();
            }
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex] || '';
                playBeepSound();
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        }
    });
    
    // Autocomplete Suggestion
    input.addEventListener('input', () => {
        const value = input.value.toLowerCase();
        const match = validCommands.find(cmd => cmd.startsWith(value));
        if (match && value) {
            input.value = match;
            input.setSelectionRange(value.length, match.length);
        }
        playTypeSound();
    });
    
    // Shutdown Animation on Unload
    window.addEventListener('beforeunload', () => {
        gsap.to('.terminal', {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            ease: 'power3.in',
        });
    });
    
    // Initial Animations
    gsap.from('.terminal', {
        opacity: 0,
        duration: 1,
        ease: 'linear'
    });
    gsap.from(commands, {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        delay: 2,
        duration: 0.5,
        ease: 'power2.out',
    });
    gsap.from('#terminal-input', {
        opacity: 0,
        y: 20,
        delay: 2.5,
        duration: 0.5,
        ease: 'power2.out',
    });

    // Auto-focus the input field on page load
    window.addEventListener('load', () => {
        input.focus();
    });

    // Ensure input field remains focusable
    input.addEventListener('click', () => {
        input.focus();
    });
});
