const bg = document.getElementById('bg');
const propsContainer = document.getElementById('props');
const textEl = document.getElementById('text');
const btn = document.getElementById('btn');

let scene = 0;      
let progress = 0;  

const items = [
    { min: 10, max: 40, emoji: '🍃', x: 20, y: 40, type: 'leaf' },
    { min: 20, max: 50, emoji: '🌸', x: 70, y: 30, type: 'flower' },
    { min: 50, max: 80, emoji: '🐟', x: 30, y: 60, type: 'fish' },
    { min: 60, max: 90, emoji: '🌼', x: 60, y: 70, type: 'flower' },
];

btn.addEventListener('click', () => {
    if (scene === 0) {
        scene = 1;
        bg.style.background = '#e8f4ff'; // 
        textEl.innerText = 'Huh? There are two pine nuts at the door, and a trail of footprints in the snow....';
        btn.innerText = 'Follow the footprints';
        
        createEmoji('🌰', 45, 55);
        createEmoji('🌰', 55, 55);
        for(let i=0; i<5; i++) {
            createEmoji('👣', 50, 65 + i * 5);
        }
    } else if (scene === 1) {
        scene = 2;
        textEl.innerText = 'Follow the mouse wheel, through the snow...';
        btn.classList.add('hide'); 
    }
});

window.addEventListener('wheel', e => {
    if (scene !== 2) return;
    
    progress += e.deltaY * 0.05;
    progress = Math.max(0, Math.min(100, progress));
    
    updateFollow();
});

function updateFollow() {
    if (progress < 30) {
        bg.style.background = '#e8f4ff'; // 
        textEl.innerText = 'Deep in the snow...';
    } else if (progress < 60) {
        bg.style.background = '#c8e6c9'; // 
        textEl.innerText = 'Walked into a small grove';
    } else {
        bg.style.background = '#bbdefb'; // 
        textEl.innerText = 'Arrived at the clear lake';
    }

    propsContainer.innerHTML = ''; 
    items.forEach(item => {
        if (progress >= item.min && progress <= item.max) {
            createEmoji(item.emoji, item.x, item.y, item.type);
        }
    });
}

function createEmoji(emojiChar, x, y, type = '') {
    const el = document.createElement('div');
    el.classList.add('emoji-item');
    el.textContent = emojiChar;
    el.style.left = x + '%';
    el.style.top = y + '%';
    el.dataset.type = type;
    
    el.addEventListener('click', (e) => {
        const target = e.target;
        if (target.dataset.type === 'fish') {
            target.style.transform = 'scale(0) rotate(180deg)'; 
            setTimeout(() => target.remove(), 300); 
        } else {
            target.style.color = `hsl(${Math.random() * 360}, 80%, 50%)`;
        }
    });

    propsContainer.appendChild(el);
}