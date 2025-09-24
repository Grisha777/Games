
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const expText = document.querySelector("#expText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

let exp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["палка"];

const weapons = [
  { name: 'палка', power: 5 },
  { name: 'кинжал', power: 30 },
  { name: 'кувалда', power: 50 },
  { name: 'меч', power: 100 }
];

const monsters = [
  {
    name: "Слизь",
    level: 1,
    health: 15
  },
  {
    name: "Зверь",
    level: 2,
    health: 60
  },
  {
    name: "Дракон",
    level: 3,
    health: 300
  }
]

const locations = [
  {
    name: "Площадь",
    "button text": ["Перейти в магазин", "Идти в пещеру", "Сразиться с драконом"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Ты находишься на городской площади."
  },
  {
    name: "Магазин",
    "button text": ["Купить 10 здоровья (10 золота)", "Купить оружие (30 золота)", "Идти на городскую площадь"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Ты входишь в магазин."
  },
  {
    name: "Пещера",
    "button text": ["Сражение со слизью", "Сражение со зверем", "Идти на городскую площадь"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Ты входишь в пещеру. Ты видишь каких-то монстров."
  },
  {
    name: "Сражение",
    "button text": ["Атака", "Защита", "Бежать"],
    "button functions": [attack, dodge, goTown],
    text: "Ты сражаешься с монстром."
  },
  {
    name: "Убийство монстра",
    "button text": ["Идти на городскую площадь"],
    "button functions": [goTown],
    text: 'Монстр побеждён. Ты получаешь очки опыта и находишь золото.'
  },
  {
    name: "Проигрыш",
    "button text": ["Заново?"],
    "button functions": [restart],
    text: "Ты умер."
  },
  { 
    name: "Победа", 
    "button text": ["Заново?"], 
    "button functions": [restart], 
    text: "Ты победил дракона! Ты прошёл игру!" 
  }
];

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  if(location === locations[4] || location === locations[5] || location === locations[6]) {
  button2.style.display = "none";
  button3.style.display = "none";
  } else {
  button1.style.display = "inline-block";
  button2.style.display = "inline-block";
  button3.style.display = "inline-block";
  }
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "У тебя недостаточно золота, чтобы купить здоровье.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Теперь у тебя есть " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " В твоём инвентаре есть: " + inventory;
    } else {
      text.innerText = "У тебя недостаточно золота, чтобы купить оружие.";
    }
  } else {
    text.innerText = "У тебя уже есть самое мощное оружие!";
    button2.innerText = "Продать оружие за 15 золотых";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Ты продал " + currentWeapon + ".";
    text.innerText += " В твоём инвентаре есть: " + inventory;
  } else {
    text.innerText = "Не продавай свое единственное оружие!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "" + monsters[fighting].name + " атакует.";
  text.innerText += " Ты атакуешь его своим " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * exp) + 1;    
  } else {
    text.innerText += " Ты промахнулся";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += "" + inventory.pop() + " сломался.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * exp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Ты уклоняешься от атаки " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  exp += monsters[fighting].level;
  goldText.innerText = gold;
  expText.innerText = exp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  exp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["палка"];
  goldText.innerText = gold;
  healthText.innerText = health;
  expText.innerText = exp;
  goTown();
}