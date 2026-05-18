// Google Sheets 연동 설정 (config.js에서 자동 로드)
let googleSheetId = CONFIG.googleSheetId;
let googleApiKey = CONFIG.googleApiKey;
let appsScriptUrl = CONFIG.appsScriptUrl;

// Todo 데이터 저장소
let todos = [];
let currentFilter = 'all';

// DOM 요소
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const syncBtn = document.getElementById('syncBtn');
const notification = document.getElementById('notification');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const remainingCount = document.getElementById('remainingCount');

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    attachEventListeners();
    loadTodosFromSheet();
    
    // 설정 로드 확인
    console.log('📋 설정 정보:');
    console.log('Google Sheet ID:', googleSheetId);
    console.log('API Key 로드됨:', !!googleApiKey);
    console.log('Apps Script URL 설정됨:', !!appsScriptUrl);
    
    // 자동 동기화 설정
    if (CONFIG.syncInterval > 0) {
        setInterval(loadTodosFromSheet, CONFIG.syncInterval);
    }
});

// 이벤트 리스너 설정
function attachEventListeners() {
    addBtn.addEventListener('click', handleAddTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTodo();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTodos();
        });
    });

    clearCompletedBtn.addEventListener('click', handleClearCompleted);
    syncBtn.addEventListener('click', loadTodosFromSheet);
}

// Google Sheets에서 데이터 로드
async function loadTodosFromSheet() {
    if (!googleSheetId || !googleApiKey) {
        console.error('❌ Sheet ID와 API Key가 필요합니다. config.js를 확인하세요.');
        return;
    }

    syncBtn.classList.add('syncing');

    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/Sheet1?key=${googleApiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        todos = parseSheetData(data.values);
        renderTodos();
        updateStats();
        showNotification('✓ Google Sheets에서 동기화되었습니다', 'success');
    } catch (error) {
        console.error('Error loading from Google Sheets:', error);
        showNotification('Google Sheets 로드 실패: ' + error.message, 'error');
        // 로컬 저장소에서 로드 시도
        loadTodosFromLocalStorage();
    } finally {
        syncBtn.classList.remove('syncing');
    }
}

// Sheet 데이터 파싱
function parseSheetData(values) {
    if (!values || values.length < 2) return [];

    const headers = values[0];
    const todoArray = [];

    for (let i = 1; i < values.length; i++) {
        const row = values[i];
        if (row.length > 0 && row[0]) {
            todoArray.push({
                id: row[0],
                text: row[1] || '',
                completed: row[2] === 'true' || row[2] === true,
                createdAt: row[3] || new Date().toISOString(),
                updatedAt: row[4] || new Date().toISOString()
            });
        }
    }

    return todoArray;
}

// 로컬 저장소에서 로드
function loadTodosFromLocalStorage() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        todos = JSON.parse(stored);
        renderTodos();
        updateStats();
    }
}

// Todo 추가
async function handleAddTodo() {
    const text = todoInput.value.trim();
    if (!text) {
        showNotification('할일을 입력해주세요', 'warning');
        return;
    }

    const todo = {
        id: generateId(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    todos.push(todo);
    todoInput.value = '';

    // Google Sheets에 저장
    if (googleSheetId && googleApiKey) {
        await saveToGoogleSheet();
    } else {
        saveTodosToLocalStorage();
        renderTodos();
        updateStats();
    }

    showNotification('✓ 할일이 추가되었습니다', 'success');
}

// Google Sheets에 저장
async function saveToGoogleSheet() {
    try {
        const sheetData = [
            ['ID', 'Task', 'Completed', 'Created', 'Updated']
        ];

        todos.forEach(todo => {
            sheetData.push([
                todo.id,
                todo.text,
                todo.completed.toString(),
                todo.createdAt,
                todo.updatedAt
            ]);
        });

        // Google Apps Script에 데이터 전송
        const response = await fetch(appsScriptUrl, {
            method: 'POST',
            body: JSON.stringify({
                action: 'updateSheet',
                todos: todos
            })
        });

        const result = await response.json();
        if (result.success) {
            saveTodosToLocalStorage();
            renderTodos();
            updateStats();
        } else {
            console.error('Apps Script error:', result.error);
            saveTodosToLocalStorage();
        }
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        // 로컬 저장소에 백업 저장
        saveTodosToLocalStorage();
        renderTodos();
        updateStats();
    }
}

// 로컬 저장소에 저장
function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Todo 삭제
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodosToLocalStorage();
    if (googleSheetId && googleApiKey) {
        saveToGoogleSheet();
    }
    renderTodos();
    updateStats();
    showNotification('✓ 할일이 삭제되었습니다', 'success');
}

// Todo 완료 토글
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        todo.updatedAt = new Date().toISOString();
        saveTodosToLocalStorage();
        if (googleSheetId && googleApiKey) {
            saveToGoogleSheet();
        }
        renderTodos();
        updateStats();
    }
}

// 완료된 항목 삭제
function handleClearCompleted() {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) {
        showNotification('완료된 항목이 없습니다', 'warning');
        return;
    }

    if (confirm(`${completedCount}개의 완료된 항목을 삭제하시겠습니까?`)) {
        todos = todos.filter(t => !t.completed);
        saveTodosToLocalStorage();
        if (googleSheetId && googleApiKey) {
            saveToGoogleSheet();
        }
        renderTodos();
        updateStats();
        showNotification(`✓ ${completedCount}개의 항목이 삭제되었습니다`, 'success');
    }
}

// Todo 렌더링
function renderTodos() {
    todoList.innerHTML = '';

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li style="padding: 20px; text-align: center; color: #999;">할일이 없습니다</li>';
        return;
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        const content = document.createElement('div');
        content.className = 'todo-content';

        const text = document.createElement('div');
        text.className = 'todo-text';
        text.textContent = todo.text;

        const meta = document.createElement('div');
        meta.className = 'todo-meta';
        const created = new Date(todo.createdAt).toLocaleDateString('ko-KR');
        meta.textContent = `생성: ${created}`;

        content.appendChild(text);
        content.appendChild(meta);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        li.appendChild(checkbox);
        li.appendChild(content);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });
}

// 통계 업데이트
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const remaining = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    remainingCount.textContent = remaining;
}

// ID 생성
function generateId() {
    return `todo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 알림 표시
function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification show ${type}`;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
