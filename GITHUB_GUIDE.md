# 🚀 GitHub 업로드 및 GitHub Pages 배포 가이드

## 📋 준비 사항

- Git 설치 ([git-scm.com](https://git-scm.com))
- GitHub 계정 ([github.com](https://github.com))

## 단계별 가이드

### 1단계: GitHub 저장소 생성

#### 방법 A: 새 저장소 생성
```
1. GitHub 접속 (https://github.com)
2. 우측 상단 + 아이콘 → "New repository" 클릭
3. Repository name: "todo-list" (또는 원하는 이름)
4. Description: "Google Sheets 연동 투두 리스트"
5. Public 선택 (GitHub Pages 사용 시 필수)
6. ☑️ Add a README file (선택사항)
7. Create repository
```

#### 방법 B: 기존 저장소 사용
```
저장소가 이미 있다면 다음 단계로 진행
```

### 2단계: Git 초기화 및 업로드

#### Windows PowerShell 또는 Git Bash에서:

```bash
# 1. front 폴더로 이동
cd "c:\Users\skyym\OneDrive\Desktop\test\front"

# 2. Git 초기화 (처음 한 번만)
git init

# 3. 기본 브랜치를 main으로 설정
git branch -M main

# 4. GitHub 저장소 추가
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
# 예: git remote add origin https://github.com/john123/todo-list.git

# 5. 모든 파일 추가
git add .

# 6. 커밋
git commit -m "Initial commit: Add Google Sheets todo list app"

# 7. GitHub로 업로드
git push -u origin main
```

### 3단계: GitHub Pages 설정

#### GitHub 웹사이트에서:

```
1. 저장소 페이지 접속
   https://github.com/YOUR_USERNAME/REPOSITORY_NAME

2. Settings 메뉴 클릭

3. 좌측 메뉴에서 "Pages" 클릭

4. Source 설정
   - Branch: "main" 선택
   - Folder: "/ (root)" 선택
   - Save 버튼 클릭

5. 잠시 기다린 후 (1-5분)
   배포 URL이 표시됩니다
   예: https://YOUR_USERNAME.github.io/REPOSITORY_NAME
```

### 4단계: 배포된 사이트 확인

```
브라우저에서 다음 URL 접속:
https://YOUR_USERNAME.github.io/REPOSITORY_NAME

✅ 투두 리스트 앱이 로드되면 성공!
```

## 💻 이후 업데이트 방법

### 파일 수정 후 GitHub에 업로드:

```bash
# 1. 변경 파일 확인
git status

# 2. 변경사항 추가
git add .

# 3. 커밋
git commit -m "Update: 변경사항 설명"

# 4. 업로드
git push origin main

# 5. 사이트 새로고침 (Ctrl+Shift+R)하면 반영됨
```

## 🔐 API Key 보안

### ⚠️ 주의: API Key 노출 방지

API Key를 저장소에 커밋하면 **보안 위험**이 발생합니다.

#### 방법 1: 환경 변수 사용 (권장)

1. `.env.example` 파일 생성:
```
GOOGLE_SHEET_ID=YOUR_SHEET_ID_HERE
GOOGLE_API_KEY=YOUR_API_KEY_HERE
```

2. `.gitignore`에 추가:
```
.env
.env.local
.env.*.local
```

3. 사용자가 직접 설정하도록 안내

#### 방법 2: Google Cloud Console에서 API Key 제한

1. Google Cloud Console 접속
2. API Key 선택
3. "Application restrictions" 설정
   - HTTP referrer 제한
   - 도메인 입력: `YOUR_USERNAME.github.io`

## 🌐 커스텀 도메인 사용 (선택사항)

### GitHub Pages에 커스텀 도메인 연결:

```
1. 도메인 구입 (Godaddy, Namecheap 등)

2. 도메인 DNS 설정
   - CNAME: YOUR_USERNAME.github.io

3. GitHub 저장소 Settings → Pages
   - Custom domain 입력
   - HTTPS 활성화

4. CNAME 파일 생성 (front 폴더에)
   내용: your-custom-domain.com

5. 푸시
   git add .
   git commit -m "Add custom domain"
   git push origin main
```

## 🐛 배포 문제 해결

### 사이트가 로드되지 않음
```
1. GitHub Pages 설정 확인
   - Settings → Pages
   - Source가 "main" 브랜치로 설정되었는지 확인

2. 파일 확인
   - index.html이 루트(front 폴더)에 있는지 확인
   - CSS, JS 경로가 상대경로인지 확인

3. 캐시 초기화
   - Ctrl+Shift+R로 강제 새로고침
   - 브라우저 캐시 삭제
```

### API 오류 발생
```
1. API Key 확인
2. Google Sheets API 활성화 확인
3. 브라우저 콘솔 확인 (F12)
```

### Git 오류
```
# 저장소 이미 존재
git remote rm origin
git remote add origin https://...

# 인증 오류
git config --global user.email "your@email.com"
git config --global user.name "Your Name"

# 푸시 오류
git pull origin main --rebase
git push origin main
```

## 📊 GitHub Pages 상태 확인

### 배포 로그 보기:

```
1. 저장소 → Deployments 탭
2. github-pages 선택
3. 배포 상태 확인
4. 실패 시 상세 로그 확인
```

## 🎓 유용한 팁

### 1. README.md 추가
저장소 홈페이지에 프로젝트 정보 표시

### 2. GitHub 프로필 개선
- 저장소 설명 추가
- 주제(Topics) 추가: todo, google-sheets, github-pages
- 라이선스 추가

### 3. 협업하기
```bash
# 다른 사람이 코드 수정 시
git pull origin main
```

### 4. 버전 관리
```bash
# 태그 생성 (버전 표시)
git tag v1.0.0
git push origin v1.0.0
```

## 📚 추가 리소스

- [GitHub Docs - GitHub Pages](https://docs.github.com/en/pages)
- [Git 공식 문서](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com)
- [Google Sheets API](https://developers.google.com/sheets/api)

## ✅ 체크리스트

배포 전 확인사항:

- [ ] GitHub 계정 생성
- [ ] Git 설치 및 설정
- [ ] Google Sheets 준비
- [ ] API Key 생성
- [ ] index.html, style.css, script.js 확인
- [ ] 로컬에서 정상 작동 확인
- [ ] GitHub 저장소 생성
- [ ] 파일 푸시
- [ ] GitHub Pages 설정
- [ ] 배포된 사이트 확인

---

**문제 발생 시**: 브라우저 콘솔(F12) → Console 탭에서 오류 메시지 확인
