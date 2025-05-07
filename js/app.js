document.addEventListener("DOMContentLoaded", () => {
    // CRT Static Background
    const canvas = document.getElementById('static');
    const ctx = canvas.getContext('2d');
    let w, h;
    
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    function drawStatic() {
        ctx.fillStyle = `rgba(0, 10, 0, ${Math.random() * 0.1})`;
        for (let i = 0; i < w * h * 0.01; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            ctx.fillRect(x, y, 2, 2);
        }
        requestAnimationFrame(drawStatic);
    }
    drawStatic();
    
    // Mouse Parallax
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / w - 0.5) * 20;
        const y = (e.clientY / h - 0.5) * 20;
        gsap.to(canvas, { x, y, duration: 0.5, ease: 'power2.out' });
    });
    
    // Sound Effects
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playTypeSound() {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
    }
    function playBeepSound() {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }
    function playClickSound() {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.08);
    }
    function playErrorSound() {
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    }
    
    // Boot Sequence and Typewriter Effect
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
            setTimeout(typeTitle, 500);
        }
    }
    
    function typeTitle() {
        if (titleIndex < titleText.length) {
            title.textContent = titleText.slice(0, titleIndex + 1) + '_';
            playTypeSound();
            titleIndex++;
            setTimeout(typeTitle, 100);
        } else {
            title.innerHTML = titleText + '<span class="blink">_</span>';
        }
    }
    setTimeout(typeBootStep, 500);
    
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
    `
    };
    
    // Command Interactions
    const commands = document.querySelectorAll('.command');
    commands.forEach((cmd, i) => {
        const output = cmd.nextElementSibling;
    
        // Hover Effect
        cmd.addEventListener('mouseenter', () => {
            if (!cmd.classList.contains('glitch')) {
                cmd.classList.add('glitch');
                playBeepSound();
            }
        });
        cmd.addEventListener('mouseleave', () => {
            cmd.classList.remove('glitch');
        });
    
        // Focus Effect
        cmd.addEventListener('focus', () => {
            cmd.classList.add('glitch');
            playBeepSound();
        });
    
        // Click Effect
        cmd.addEventListener('click', () => {
            playClickSound();
            output.classList.add('active');
            output.classList.add('status');
            output.textContent = 'CONNECTING TO ' + cmd.textContent.slice(2) + '...';
            gsap.fromTo(
                output,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
    
            // Connection Animation
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
        });
    });
    
    // Terminal Input Handling
    const input = document.getElementById('terminal-input');
    const validCommands = ['/faint', '/dan', '/sworn', '/pnd'];
    let commandHistory = [];
    let historyIndex = -1;
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const value = input.value.trim();
            playClickSound();
            commandHistory.push(value);
            historyIndex = commandHistory.length;
    
            if (validCommands.includes(value)) {
                const cmd = Array.from(commands).find(c => c.dataset.link === value);
                cmd.click();
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
    
    // Keyboard Navigation
    let selectedIndex = -1;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            selectedIndex = Math.min(selectedIndex + 1, commands.length - 1);
            commands[selectedIndex].focus();
            playBeepSound();
        } else if (e.key === 'ArrowUp') {
            selectedIndex = Math.max(selectedIndex - 1, -1);
            if (selectedIndex >= 0) {
                commands[selectedIndex].focus();
                playBeepSound();
            } else {
                input.focus();
            }
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            commands[selectedIndex].click();
        }
    });
    
    // Screen Flicker Effect
    setInterval(() => {
        gsap.to('.terminal', {
            opacity: 0.6,
            duration: 0.1,
            repeat: 1,
            yoyo: true,
            ease: 'power1.inOut',
            onComplete: () => {
                gsap.set('.terminal', { opacity: 1 });
            },
        });
    }, 4000);
    
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
        scale: 0.8,
        duration: 1.5,
        ease: 'power3.out',
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
    });