const ctx = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();

const HERO_RADIUS = 25;
const START_X_HERO1 = HERO_RADIUS * 2;
const START_X_HERO2 = canvas.width - START_X_HERO1;
const START_Y_HERO = 50;

const mouse = {
  x: 0,
  y: 0,
};

const spells = [];
const spellSize = 8;
const spellSpeed = 4;

// Ползунки управления
const speed1Slider = document.getElementById('speed1');
const fireRate1Slider = document.getElementById('fireRate1');
const speed2Slider = document.getElementById('speed2');
const fireRate2Slider = document.getElementById('fireRate2');
const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');

class Hero {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.dy = 2;
    this.scores = 0;
    this.color = color;
    this.colorSpell = color;
    this.fireRate =
      START_X_HERO1 == x ? fireRate1Slider.value : fireRate2Slider.value;
    this.tablo =
      START_X_HERO1 == x
        ? document.querySelector('.tablo1')
        : document.querySelector('.tablo2');
  }
  update() {
    this.y += this.dy;

    if (
      Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2) <=
      Math.pow(HERO_RADIUS, 2)
    ) {
      this.dy *= -1;
    } else if (this.y <= HERO_RADIUS || this.y + HERO_RADIUS >= canvas.height) {
      this.dy *= -1;
    }
  }
  score() {
    this.scores++;
    if (this.scores < 10) this.tablo.textContent = `0${this.scores}`;
    else this.tablo.textContent = this.scores;
  }
  setDy(value) {
    // Для учета направления
    const sign = this.dy / Math.abs(this.dy);
    this.dy = parseFloat(value) * sign;
  }
}

const hero1 = new Hero(START_X_HERO1, START_Y_HERO, 'red');
const hero2 = new Hero(START_X_HERO2, START_Y_HERO, 'blue');

speed1Slider.addEventListener('input', () => {
  hero1.setDy(speed1Slider.value);
});

fireRate1Slider.addEventListener('input', () => {
  hero1.fireRate = parseFloat(fireRate1Slider.value);
});

speed2Slider.addEventListener('input', () => {
  hero2.setDy(speed2Slider.value);
});

fireRate2Slider.addEventListener('input', () => {
  hero2.fireRate = parseFloat(fireRate2Slider.value);
});

function shootSpell(hero) {
  const direction = hero === hero1 ? 1 : -1;
  spells.push({
    x: hero.x,
    y: hero.y,
    dx: spellSpeed * direction,
    color: hero.colorSpell,
  });
}

function updateSpells() {
  for (let i = spells.length - 1; i >= 0; i--) {
    const spell = spells[i];
    spell.x += spell.dx;

    // Ушел за пределы карты
    if (spell.x < 0 || spell.x > canvas.width) {
      spells.splice(i, 1);
      continue;
    }

    if (
      spell.dx > 0 &&
      spell.x + spellSize > hero2.x - HERO_RADIUS &&
      spell.x + spellSize < hero2.x + HERO_RADIUS &&
      spell.y + spellSize < hero2.y + HERO_RADIUS &&
      spell.y - spellSize > hero2.y - HERO_RADIUS
    ) {
      hero1.score();
      spells.splice(i, 1);
    } else if (
      spell.dx < 0 &&
      spell.x + spellSize > hero1.x - HERO_RADIUS &&
      spell.x - spellSize < hero1.x + HERO_RADIUS &&
      spell.y - spellSize > hero1.y - HERO_RADIUS &&
      spell.y + spellSize < hero1.y + HERO_RADIUS
    ) {
      hero2.score();
      spells.splice(i, 1);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  spells.forEach((spell) => {
    ctx.fillStyle = spell.color;
    ctx.beginPath();
    ctx.arc(spell.x, spell.y, spellSize, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = hero1.color;
  ctx.beginPath();
  ctx.arc(hero1.x, hero1.y, HERO_RADIUS, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hero2.color;
  ctx.beginPath();
  ctx.arc(hero2.x, hero2.y, HERO_RADIUS, 0, Math.PI * 2);
  ctx.fill();
}

canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('mouseleave', (e) => {
  mouse.x = 0;
  mouse.y = 0;
});

color1.addEventListener('input', (e) => {
  hero1.colorSpell = e.target.value;
});

color2.addEventListener('input', (e) => {
  hero2.colorSpell = e.target.value;
});

function gameLoop() {
  hero1.update();
  hero2.update();
  updateSpells();
  draw();

  if (Math.random() < hero1.fireRate) {
    shootSpell(hero1);
  }
  if (Math.random() < hero2.fireRate) {
    shootSpell(hero2);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
