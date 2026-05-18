// Google Apps Script를 사용한 투두 리스트 백엔드
// Google Sheets의 "확장" → "Apps Script"에서 아래 코드를 사용하세요

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    
    let result = {};
    
    switch(action) {
      case 'getTodos':
        result = getTodos();
        break;
      case 'addTodo':
        result = addTodo(params.text);
        break;
      case 'updateTodo':
        result = updateTodo(params.id, params.completed);
        break;
      case 'deleteTodo':
        result = deleteTodo(params.id);
        break;
      case 'clearCompleted':
        result = clearCompleted();
        break;
      case 'updateSheet':
        result = updateSheet(params.todos);
        break;
      default:
        result = { error: 'Unknown action: ' + action };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(JSON.stringify({ error: e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getTodos() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = sheet.getDataRange().getValues();
  const todos = [];
  
  // 헤더 스킵 (첫 번째 행)
  for (let i = 1; i < values.length; i++) {
    if (values[i][0]) {
      todos.push({
        id: values[i][0],
        text: values[i][1], // Task
        completed: values[i][2] === true || values[i][2] === 'true',
        createdAt: values[i][3], // Created
        updatedAt: values[i][4]  // Update
      });
    }
  }
  
  return { success: true, todos: todos };
}

function updateSheet(todos) {
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear(); // 기존 데이터 삭제
  
  // 헤더 추가 (ID, Task, Completed, Created, Update)
  const header = ['ID', 'Task', 'Completed', 'Created', 'Update'];
  sheet.appendRow(header);
  
  // 데이터 추가
  todos.forEach(function(todo) {
    sheet.appendRow([
      todo.id,
      todo.text,
      todo.completed,
      todo.createdAt,
      todo.updatedAt
    ]);
  });
  
  return { success: true };
}

function addTodo(text) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const id = 'todo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const now = new Date().toISOString();
  
  // ID, Task, Completed, Created, Update 순서
  sheet.appendRow([id, text, false, now, now]);
  
  return { success: true, id: id };
}

function updateTodo(id, completed) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      const now = new Date().toISOString();
      sheet.getRange(i + 1, 3).setValue(completed); // C열: Completed
      sheet.getRange(i + 1, 5).setValue(now); // E열: Update
      return { success: true };
    }
  }
  
  return { success: false, error: 'Todo not found' };
}

function deleteTodo(id) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = sheet.getDataRange().getValues();
  
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  
  return { success: false, error: 'Todo not found' };
}

function clearCompleted() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const values = sheet.getDataRange().getValues();
  
  // 역순으로 삭제 (인덱스 변경 방지)
  for (let i = values.length - 1; i >= 1; i--) {
    if (values[i][2] === true || values[i][2] === 'true') {
      sheet.deleteRow(i + 1);
    }
  }
  
  return { success: true };
}

// Apps Script 배포 함수
function doGet(e) {
  return HtmlService.createHtmlOutput('Google Sheets 투두 리스트 API');
}
