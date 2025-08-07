// Завантажуємо YouTube API асинхронно
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Визначення всіх елементів DOM ---
    const langSelectionOverlay = document.getElementById('lang-selection-overlay');
    const selectUkBtn = document.getElementById('select-uk');
    const selectEnBtn = document.getElementById('select-en');
    const consoleOverlay = document.getElementById('console-overlay');
    const consoleText = document.getElementById('console-text');
    const langSwitcher = document.querySelector('.lang-switcher');
    const langUk = document.querySelector('.lang-uk');
    const langEn = document.querySelector('.lang-en');

    // --- 2. Визначення всіх функцій ---

    // Функція запуску сайту: встановлює мову і запускає анімацію
    function runSite(lang) {
        setLanguage(lang);
        langSelectionOverlay.style.opacity = '0';
        setTimeout(() => {
            langSelectionOverlay.style.display = 'none';
            typeLine();
        }, 500);
    }

    // Обробник вибору мови
    function handleLanguageSelection(lang) {
        setLanguage(lang);
        langSelectionOverlay.style.opacity = '0';
        setTimeout(() => {
            langSelectionOverlay.style.display = 'none';
            showMusicTooltip();
        }, 500);
    }

    // Функція, що викликається ПІСЛЯ анімації консолі
    function afterConsoleAnimation() {
        // ЗАВЖДИ показуємо вікно вибору мови
        langSelectionOverlay.style.display = 'flex';
        langSelectionOverlay.style.opacity = '1';
    }

    // Анімація консолі
    const lines = [
        'Initializing system...', 
        'Loading modules...', 
        'Connecting to server... [OK]',
        'Compiling assets... [DONE]',
        'Booting up portfolio sequence...', 
        'Welcome, Dima!'
    ];
    let currentLine = 0;
    let currentChar = 0;

    function typeLine() {
        if (currentLine < lines.length) {
            if (currentChar < lines[currentLine].length) {
                consoleText.innerHTML += lines[currentLine].charAt(currentChar);
                currentChar++;
                setTimeout(typeLine, 50);
            } else {
                consoleText.innerHTML += '\n';
                currentLine++;
                currentChar = 0;
                setTimeout(typeLine, 500);
            }
        } else {
            // Коли анімація завершена
            setTimeout(() => {
                consoleOverlay.style.opacity = '0';
                setTimeout(() => {
                    consoleOverlay.style.display = 'none';
                    afterConsoleAnimation(); // <--- Викликаємо логіку вибору мови
                }, 1000);
            }, 1000);
        }
    }

    // --- 4. Головна точка входу ---
    function initializeApp() {
        afterConsoleAnimation();
    }

    initializeApp();

    // Анімований фон
    const canvas = document.getElementById('interactive-bg');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    const mouse = {
        x: null,
        y: null,
        radius: (canvas.height / 80) * (canvas.width / 80)
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = '#333';
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 10;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 10;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 10;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 10;
                }
            }
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 5) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 5) - 2.5;
            let directionY = (Math.random() * 5) - 2.5;
            let color = '#333';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(100, 100, 100,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
        init();
    });

    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    init();
    animate();

    // Плавна поява секцій
    const scrollSections = document.querySelectorAll('.scroll-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    scrollSections.forEach(section => {
        observer.observe(section);
    });

    // Плавний скрол
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Перемикання мов
    const translations = {
        uk: {
            nav_about: 'Про мене',
            nav_skills: 'Навички',
            nav_contact: 'Контакти',
            hero_greeting: 'Привіт, я Dima',
            hero_subtitle: 'Python та Desktop розробник',
            hero_description: 'Створюю розумні рішення для автоматизації та унікальні пристрої.',
            about_title: 'Про мене',
            about_text: 'Я — розробник, який з ентузіазмом занурюється у світ Python для створення десктопних додатків та програмування розумних пристроїв (IoT). Мене надихає можливість перетворювати складні технічні задачі на елегантні та ефективні рішення. Моя філософія — постійне навчання та самовдосконалення. Я активно вивчаю нові фреймворки, експериментую з апаратним забезпеченням та шукаю нестандартні підходи до вирішення проблем. Готовий долучитися до проєктів, де зможу застосувати свої знання та здобути новий досвід.',
            skills_title: 'Ключові навички',
            skills_desktop_title: 'Desktop Розробка',
            skill_python: 'Python (PyQt, Tkinter, Kivy)',
            skill_crossplatform: 'Створення кросплатформенних додатків (Windows, macOS, Linux)',
            skill_architecture: 'Архітектура ПЗ та патерни проєктування',
            skill_db: 'Робота з базами даних (SQLite, PostgreSQL)',
            skills_iot_title: 'Розробка для IoT',
            skill_iot_devices: 'Raspberry Pi, Arduino, ESP32',
            skill_micropython: 'MicroPython / C++',
            skill_sensors: 'Робота з сенсорами (температура, вологість, рух) та актуаторами',
            skill_protocols: 'Протоколи (MQTT, HTTP, Bluetooth)',
            skills_tools_title: 'Інструменти та Технології',
            skill_git: 'Git / GitHub',
            skill_docker: 'Docker',
            skill_cicd: 'CI/CD (Jenkins, GitHub Actions)',
            skill_testing: 'Тестування та відладка',
            contact_title: 'Зв\'яжіться зі мною',
            contact_intro: 'Готовий до співпраці та нових викликів. Зв\'яжіться зі мною будь-яким зручним для вас способом:',
            contact_email: 'Email:',
            contact_linkedin: 'LinkedIn:',
            contact_telegram: 'Telegram:',
            contact_github: 'GitHub:',
            footer_text: ' 2024 Dima. Всі права захищено.',
            music_tooltip: 'Тут можна ввімкнути/вимкнути музику'
        },
        en: {
            nav_about: 'About Me',
            nav_skills: 'Skills',
            nav_contact: 'Contact',
            hero_greeting: 'Hi, I\'m Dima',
            hero_subtitle: 'Python & Desktop Developer',
            hero_description: 'Creating smart solutions for automation and unique devices.',
            about_title: 'About Me',
            about_text: 'I am a developer who is enthusiastically diving into the world of Python to create desktop applications and program smart devices (IoT). I am inspired by the ability to turn complex technical problems into elegant and effective solutions. My philosophy is continuous learning and self-improvement. I actively study new frameworks, experiment with hardware, and look for unconventional approaches to problem-solving. Ready to join projects where I can apply my knowledge and gain new experience.',
            skills_title: 'Key Skills',
            skills_desktop_title: 'Desktop Development',
            skill_python: 'Python (PyQt, Tkinter, Kivy)',
            skill_crossplatform: 'Cross-platform application development (Windows, macOS, Linux)',
            skill_architecture: 'Software architecture and design patterns',
            skill_db: 'Working with databases (SQLite, PostgreSQL)',
            skills_iot_title: 'IoT Development',
            skill_iot_devices: 'Raspberry Pi, Arduino, ESP32',
            skill_micropython: 'MicroPython / C++',
            skill_sensors: 'Working with sensors (temperature, humidity, motion) and actuators',
            skill_protocols: 'Protocols (MQTT, HTTP, Bluetooth)',
            skills_tools_title: 'Tools & Technologies',
            skill_git: 'Git / GitHub',
            skill_docker: 'Docker',
            skill_cicd: 'CI/CD (Jenkins, GitHub Actions)',
            skill_testing: 'Testing and debugging',
            contact_title: 'Contact Me',
            contact_intro: 'Ready for collaboration and new challenges. Contact me in any way convenient for you:',
            contact_email: 'Email:',
            contact_linkedin: 'LinkedIn:',
            contact_telegram: 'Telegram:',
            contact_github: 'GitHub:',
            footer_text: ' 2024 Dima. All rights reserved.',
            music_tooltip: 'You can turn music on/off here'
        }
    };

    function setLanguage(lang) {
        const elementsToTranslate = document.querySelectorAll('[data-lang-key]');
        
        elementsToTranslate.forEach(element => {
            element.classList.add('glitch-effect');
        });

        setTimeout(() => {
            elementsToTranslate.forEach(element => {
                const key = element.getAttribute('data-lang-key');
                if (translations[lang][key]) {
                    element.innerText = translations[lang][key];
                }
            });

            if (lang === 'uk') {
                langUk.classList.add('active');
                langEn.classList.remove('active');
            } else {
                langEn.classList.add('active');
                langUk.classList.remove('active');
            }

            setTimeout(() => {
                elementsToTranslate.forEach(element => {
                    element.classList.remove('glitch-effect');
                });
            }, 500); // Corresponds to the animation duration
        }, 250); // Delay before switching the text
    }

    // --- 3. Призначення обробників подій ---
    selectUkBtn.addEventListener('click', () => handleLanguageSelection('uk'));
    selectEnBtn.addEventListener('click', () => handleLanguageSelection('en'));

    // Перемикач у хедері працює як і раніше, без збереження
    langSwitcher.addEventListener('click', (e) => {
        if (e.target.classList.contains('lang-uk')) {
            setLanguage('uk');
        } else if (e.target.classList.contains('lang-en')) {
            setLanguage('en');
        }
    });


    typeLine(); // <--- ЗАПУСКАЄМО АНІМАЦІЮ ВІДРАЗУ

    // Керування музикою
    let player;
    const musicControl = document.getElementById('music-control');
    const muteIcon = document.getElementById('mute-icon');
    const musicTooltip = document.getElementById('music-tooltip');
    const closeTooltip = document.getElementById('close-tooltip');
    const playIconSrc = 'https://img.icons8.com/ios-glyphs/30/ffffff/play--v1.png';
    const muteIconSrc = 'https://img.icons8.com/ios-glyphs/30/ffffff/mute.png';



    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
            height: '0',
            width: '0',
            videoId: 'jfKfPfyJRdk', // Lofi Girl stream
            playerVars: {
                'autoplay': 1,
                'loop': 1,
                'controls': 0
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    }

    function onPlayerReady(event) {
        event.target.setVolume(30); // Встановлюємо гучність на 30%
        event.target.playVideo();
        event.target.mute(); // Запускаємо без звуку
        muteIcon.src = muteIconSrc;
    }

    let isMuted = true; // Музика спочатку без звуку

    function toggleMute() {
        if (!player) return;
        if (isMuted) {
            player.unMute();
            muteIcon.src = playIconSrc;
        } else {
            player.mute();
            muteIcon.src = muteIconSrc;
        }
        isMuted = !isMuted;
    }

    musicControl.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMute();
    });

    let tooltipTimeout;
    function showMusicTooltip() {
        musicTooltip.classList.remove('hidden');
        musicTooltip.classList.add('visible');
        tooltipTimeout = setTimeout(hideMusicTooltip, 5000);
    }

    function hideMusicTooltip() {
        musicTooltip.classList.remove('visible');
        setTimeout(() => musicTooltip.classList.add('hidden'), 500);
        clearTimeout(tooltipTimeout);
    }

    closeTooltip.addEventListener('click', (e) => {
        e.stopPropagation();
        hideMusicTooltip();
    });

    // 3D ефект для карток
    const skillCards = document.querySelectorAll('.skill-card');

    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;

            const centerX = card.offsetWidth / 2;
            const centerY = card.offsetHeight / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10; // max rotation 10deg

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0) rotateY(0)';
        });
    });
});
