const characterSelect = document.getElementById('characterSelect');
const hairSelect = document.getElementById('hairSelect');
const topSelect = document.getElementById('topSelect');
const canvas = document.getElementById('previewCanvas');
const ctx = canvas.getContext('2d');
let partData = null;
let currentCharacterId = null;
async function drawAvatar() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
const base = await loadImage(partData.base[currentCharacterId]);
ctx.drawImage(base, 0, 0);
if (!hairSelect.disabled && hairSelect.value) {
const hair = await loadImage(hairSelect.value);
ctx.drawImage(hair, 0, 0);
}
if (!topSelect.disabled && topSelect.value) {
const top = await loadImage(topSelect.value);
ctx.drawImage(top, 0, 0);
}
}
async function loadImage(src) {
return new Promise(resolve => {
const img = new Image();
img.src = images/${src};
img.onload = () => resolve(img);
});
}
function updateOptions() {
const charId = characterSelect.value;
currentCharacterId = charId;
const selectedChar = partData.characters.find(c => c.id === charId);
// 髪型選択肢
hairSelect.innerHTML = '';
if (selectedChar.hasHairChoices) {
hairSelect.disabled = false;
partData.hair[charId].forEach(opt => {
const option = document.createElement('option');
option.value = opt.file;
option.textContent = opt.name;
hairSelect.appendChild(option);
});
} else {
hairSelect.disabled = true;
const opt = document.createElement('option');
opt.textContent = '髪色の選択はありません';
hairSelect.appendChild(opt);
}
// トップス選択肢
topSelect.innerHTML = '';
if (selectedChar.hasTopChoices) {
topSelect.disabled = false;
partData.tops
.filter(opt => opt.useFor.includes(charId))
.forEach(opt => {
const option = document.createElement('option');
option.value = opt.file;
option.textContent = opt.name;
topSelect.appendChild(option);
});
} else {
topSelect.disabled = true;
const opt = document.createElement('option');
opt.textContent = '服装の選択はありません';
topSelect.appendChild(opt);
}
drawAvatar();
}
function initAvatarSelector() {
partData.characters.forEach(char => {
const option = document.createElement('option');
option.value = char.id;
option.textContent = char.label;
characterSelect.appendChild(option);
});
characterSelect.addEventListener('change', updateOptions);
hairSelect.addEventListener('change', drawAvatar);
topSelect.addEventListener('change', drawAvatar);
characterSelect.value = partData.characters[0].id;
updateOptions();
}
fetch('data/parts.json')
.then(res => res.json())
.then(data => {
partData = data;
initAvatarSelector();
});
document.getElementById('downloadBtn').addEventListener('click', () => {
const link = document.createElement('a');
link.download = 'avatar.png';
link.href = canvas.toDataURL();
link.click();
});
