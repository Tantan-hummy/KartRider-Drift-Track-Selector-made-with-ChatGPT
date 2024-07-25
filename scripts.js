// 綁定事件監聽器
document.getElementById('randomize-button').addEventListener('click', randomizeTracks);
document.getElementById('difficulty').addEventListener('change', filterTracks);
document.getElementById('theme').addEventListener('change', filterTracks);
document.getElementById('search').addEventListener('input', filterTracks);
document.getElementById('select-all-button').addEventListener('click', selectAllTracks);
document.getElementById('clear-selection-button').addEventListener('click', clearSelectedTracks);

// 已選取賽道集合
let selectedTracks = new Set();

// 初始化過濾器和顯示賽道
populateFilters();
displayTracks(tracks);

// 填充過濾器選項
function populateFilters() {
    const difficultySet = new Set();
    const themeSet = new Set();

    tracks.forEach(track => {
        difficultySet.add(track.難度);
        themeSet.add(track.主題);
    });

    // 將難度轉換為數字並排序
    const sortedDifficulties = Array.from(difficultySet).map(difficulty => parseInt(difficulty)).sort((a, b) => a - b);

    const difficultySelect = document.getElementById('difficulty');
    const themeSelect = document.getElementById('theme');

    sortedDifficulties.forEach(difficulty => {
        const option = document.createElement('option');
        option.value = difficulty;
        option.textContent = difficulty;
        difficultySelect.appendChild(option);
    });

    themeSet.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme;
        themeSelect.appendChild(option);
    });
}

// 顯示賽道列表
function displayTracks(tracks) {
    const sortedTracks = tracks.slice().sort((a, b) => {
        if (a.主題 !== b.主題) {
            return a.主題.localeCompare(b.主題);
        } else {
            return a.難度 - b.難度;
        }
    });

    const trackContainer = document.getElementById('track-container');
    trackContainer.innerHTML = '';
    sortedTracks.forEach(track => {
        const trackElement = document.createElement('div');
        trackElement.className = 'track';
        trackElement.innerHTML = `
            <img src="images/${track.主題} ${track.名稱}.webp" alt="${track.名稱}" class="main-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <img src="images2/${track.主題} ${track.名稱}.png" alt="${track.名稱}" class="hover-image" onerror="this.style.display='none'; this.previousElementSibling.style.display='block';">
            <h2>${track.名稱}</h2>
            <p>難度: ${track.難度}</p>
            <p>主題: ${track.主題}</p>
            <input type="checkbox" class="track-checkbox">
        `;
        trackElement.addEventListener('click', (event) => {
            // 防止點擊事件冒泡
            if (event.target.tagName.toLowerCase() !== 'input') {
                toggleTrackSelection(track);
            }
        });
        trackContainer.appendChild(trackElement);
    });
    displaySelectedTracks();
}

// 切換賽道選擇狀態
function toggleTrackSelection(track) {
    if (selectedTracks.has(track)) {
        selectedTracks.delete(track);
    } else {
        selectedTracks.add(track);
    }
    displaySelectedTracks();
}

// 顯示已選取的賽道
function displaySelectedTracks() {
    const trackElements = document.querySelectorAll('.track');
    trackElements.forEach(element => {
        const trackName = element.querySelector('h2').textContent;
        const isSelected = Array.from(selectedTracks).some(track => track.名稱 === trackName);
        element.classList.toggle('selected', isSelected);
        const checkbox = element.querySelector('.track-checkbox');
        if (checkbox) {
            checkbox.checked = isSelected;
        }
    });
    const selectedTracksContainer = document.getElementById('selected-tracks-container');
    selectedTracksContainer.textContent = Array.from(selectedTracks).map(track => track.主題 + ' ' + track.名稱).join('、');
}

// 隨機選擇賽道
function randomizeTracks() {
    const numTracks = parseInt(document.getElementById('numTracks').value, 10);
    const numGroups = parseInt(document.getElementById('numGroups').value, 10);
    const trackArray = Array.from(selectedTracks);

    // 檢查每組抽取的賽道數是否超過選擇的賽道總數
    if (numTracks > trackArray.length) {
        alert('每組抽取的賽道數不能超過選擇的賽道總數');
        return;
    }

    // 檢查是否選取了賽道
    if (trackArray.length === 0) {
        alert('請先選取賽道');
        return;
    }

    // 確保組數和每組賽道數有效
    if (numGroups < 1 || numTracks < 1) {
        alert('請輸入有效的組數和每組賽道數');
        return;
    }

    const randomizedGroups = [];
    for (let i = 0; i < numGroups; i++) {
        const shuffledTracks = shuffleArray(trackArray);
        const selectedGroup = shuffledTracks.slice(0, numTracks);
        randomizedGroups.push(selectedGroup);
    }

    displayRandomizedGroups(randomizedGroups);
}

// 洗牌函數，用於隨機打亂賽道順序
function shuffleArray(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 顯示隨機組合
function displayRandomizedGroups(groups) {
    const randomizedGroupsContainer = document.getElementById('randomized-groups-container');
    randomizedGroupsContainer.innerHTML = '';
    groups.forEach((group, index) => {
        const groupElement = document.createElement('div');
        groupElement.className = 'group';
        const trackNames = group.map((track, trackIndex) => `${trackIndex + 1}. ${track.主題} ${track.名稱}`).join('\t');
        groupElement.innerHTML = `<h3>組合 ${index + 1}</h3><p>${trackNames}</p>`;
        randomizedGroupsContainer.appendChild(groupElement);
    });
}

// 過濾賽道
function filterTracks() {
    const selectedDifficulty = document.getElementById('difficulty').value;
    const selectedTheme = document.getElementById('theme').value;
    const searchQuery = document.getElementById('search').value.toLowerCase();

    const filteredTracks = tracks.filter(track => {
        return (selectedDifficulty === 'all' || track.難度 == selectedDifficulty) &&
            (selectedTheme === 'all' || track.主題 === selectedTheme) &&
            track.名稱.toLowerCase().includes(searchQuery);
    });

    displayTracks(filteredTracks);
}

// 全選賽道
function selectAllTracks() {
    const selectedDifficulty = document.getElementById('difficulty').value;
    const selectedTheme = document.getElementById('theme').value;
    const searchQuery = document.getElementById('search').value.toLowerCase();

    const filteredTracks = tracks.filter(track => {
        return (selectedDifficulty === 'all' || track.難度 == selectedDifficulty) &&
            (selectedTheme === 'all' || track.主題 === selectedTheme) &&
            track.名稱.toLowerCase().includes(searchQuery);
    });

    filteredTracks.forEach(track => selectedTracks.add(track));
    displaySelectedTracks();
}

// 清空已選取賽道
function clearSelectedTracks() {
    selectedTracks.clear();
    displaySelectedTracks();
}
