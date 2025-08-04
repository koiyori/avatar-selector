<!--  script.js（基本ロジック） -->
const hairOptions = {
  "攻": [
    { name: "赤髪", file: "hair_attack_red.png" }
  ],
  "受": [
    { name: "青髪", file: "hair_receive_blue.png" }
  ]
};

const topOptions = [
  { name: "制服（夏）", file: "uniform_summer.png", useFor: ["攻", "受"] }
];

const characterSelect = document.getElementById('characterSelect');
const hairSelect = document.getElementById('hairSelect');
const topSelect = document.getElementById('topSelect');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');

function updateOptions() {
  const char = characterSelect.value;

  // 髪型更新
  hairSelect.innerHTML = '';
  hairOptions[char].forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.file;
    option.textContent = opt.name;
    hairSelect.appendChild(option);
  });

  // トップス更新
  topSelect.innerHTML = '';
  topOptions
    .filter(opt => opt.useFor.includes(char))
    .forEach(opt => {
      const option = document.createElement('option');
      option.value = opt.file;
      option.textContent = opt.name;
      topSelect.appendChild(option);
    });

  drawAvatar();
}

async function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.src = `images/${src}`;
    img.onload = () => resolve(img);
  });
}

async function drawAvatar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const base = await loadImage('base.png');
  const hair = await loadImage(hairSelect.value);
  const top = await loadImage(topSelect.value);

  ctx.drawImage(base, 0, 0);
  ctx.drawImage(hair, 0, 0);
  ctx.drawImage(top, 0, 0);
}

characterSelect.addEventListener('change', updateOptions);
hairSelect.addEventListener('change', drawAvatar);
topSelect.addEventListener('change', drawAvatar);

updateOptions();

document.getElementById('downloadBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'avatar.png';
  link.href = canvas.toDataURL();
  link.click();
});
