// 관리자 기능
document.addEventListener('DOMContentLoaded', function() {
    // 관리자 페이지에서만 실행
    if (window.location.pathname.includes('/admin/')) {
        initAdminPage();
    }
});

function initAdminPage() {
    // 로그인 페이지인지 확인
    if (window.location.pathname.includes('login.html')) {
        setupLoginForm();
    } else {
        // 로그인 상태 확인
        checkLoginStatus();
        
        // 현재 페이지에 따른 기능 초기화
        if (window.location.pathname.includes('dashboard.html')) {
            setupDashboard();
        } else if (window.location.pathname.includes('edit-about.html')) {
            setupAboutEditor();
        } else if (window.location.pathname.includes('edit-profile.html')) {
            setupProfileEditor();
        }
    }
}

// 로그인 폼 설정
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // 간단한 인증 (실제로는 더 안전한 방법 사용해야 함)
            if (username === 'admin' && password === 'password') {
                // 로그인 성공
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loginTimestamp', Date.now());
                
                // 관리자 대시보드로 이동
                window.location.href = 'dashboard.html';
            } else {
                // 로그인 실패
                alert('아이디 또는 비밀번호가 올바르지 않습니다.');
            }
        });
    }
}

// 로그인 상태 확인
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginTimestamp = parseInt(localStorage.getItem('loginTimestamp') || '0');
    const currentTime = Date.now();
    
    // 로그인 세션 만료 (24시간)
    const sessionExpired = currentTime - loginTimestamp > 24 * 60 * 60 * 1000;
    
    if (!isLoggedIn || sessionExpired) {
        // 로그인되지 않았거나 세션 만료 시 로그인 페이지로 리디렉션
        window.location.href = 'login.html';
    }
}

// 로그아웃 기능
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTimestamp');
    window.location.href = 'login.html';
}

// 대시보드 설정
function setupDashboard() {
    // 로그아웃 버튼 이벤트 리스너
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // 기타 대시보드 기능 설정...
}

// 소개 페이지 편집기 설정
function setupAboutEditor() {
    // 현재 프로필 데이터 로드
    const profileData = JSON.parse(localStorage.getItem('profileData')) || getDefaultProfileData();
    
    // 폼 필드에 데이터 채우기
    populateAboutForm(profileData);
    
    // 폼 제출 이벤트 리스너
    const aboutForm = document.getElementById('about-form');
    if (aboutForm) {
        aboutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const updatedProfileData = collectAboutFormData(profileData);
            
            // 데이터 저장
            localStorage.setItem('profileData', JSON.stringify(updatedProfileData));
            
            // 성공 메시지
            alert('소개 정보가 성공적으로 저장되었습니다!');
        });
    }
    
    // 로그아웃 버튼 이벤트 리스너
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// 소개 폼 데이터 채우기
function populateAboutForm(data) {
    // 자기소개 문단
    const aboutTextarea = document.getElementById('about-text');
    if (aboutTextarea && data.about && data.about.paragraphs) {
        aboutTextarea.value = data.about.paragraphs.join('\n\n');
    }
    
    // 경력 데이터
    const experienceContainer = document.getElementById('experience-container');
    if (experienceContainer && data.experience && data.experience.length > 0) {
        experienceContainer.innerHTML = '';
        
        data.experience.forEach((exp, index) => {
            addExperienceField(experienceContainer, exp, index);
        });
    }
    
    // 프로젝트 데이터
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer && data.projects && data.projects.length > 0) {
        projectsContainer.innerHTML = '';
        
        data.projects.forEach((project, index) => {
            addProjectField(projectsContainer, project, index);
        });
    }
    
    // 학력 데이터
    const educationContainer = document.getElementById('education-container');
    if (educationContainer && data.education && data.education.length > 0) {
        educationContainer.innerHTML = '';
        
        data.education.forEach((edu, index) => {
            addEducationField(educationContainer, edu, index);
        });
    }
    
    // 자격증 데이터
    const certificationsContainer = document.getElementById('certifications-container');
    if (certificationsContainer && data.certifications && data.certifications.length > 0) {
        certificationsContainer.innerHTML = '';
        
        data.certifications.forEach((cert, index) => {
            addCertificationField(certificationsContainer, cert, index);
        });
    }
}

// 경력 필드 추가
function addExperienceField(container, data = null, index = null) {
    const fieldId = index !== null ? index : Date.now();
    const expDiv = document.createElement('div');
    expDiv.className = 'form-group experience-item';
    expDiv.dataset.id = fieldId;
    
    expDiv.innerHTML = `
        <h4>경력 ${index !== null ? index + 1 : '항목'}</h4>
        <div class="form-row">
            <div class="form-group">
                <label>회사명</label>
                <input type="text" name="exp-company-${fieldId}" value="${data ? data.company : ''}" required>
            </div>
            <div class="form-group">
                <label>직책</label>
                <input type="text" name="exp-title-${fieldId}" value="${data ? data.title : ''}" required>
            </div>
        </div>
        <div class="form-group">
            <label>기간</label>
            <input type="text" name="exp-period-${fieldId}" value="${data ? data.period : ''}" required>
        </div>
        <div class="form-group">
            <label>주요 업무 (각 항목을 새 줄로 구분)</label>
            <textarea name="exp-responsibilities-${fieldId}" rows="4" required>${data ? data.responsibilities.join('\n') : ''}</textarea>
        </div>
        <button type="button" class="btn remove-btn" data-action="remove-experience" data-id="${fieldId}">항목 삭제</button>
    `;
    
    container.appendChild(expDiv);
    
    // 삭제 버튼에 이벤트 리스너 추가
    const removeBtn = expDiv.querySelector(`button[data-id="${fieldId}"]`);
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            expDiv.remove();
        });
    }
}

// 프로젝트 필드 추가
function addProjectField(container, data = null, index = null) {
    const fieldId = index !== null ? index : Date.now();
    const projectDiv = document.createElement('div');
    projectDiv.className = 'form-group project-item';
    projectDiv.dataset.id = fieldId;
    
    projectDiv.innerHTML = `
        <h4>프로젝트 ${index !== null ? index + 1 : '항목'}</h4>
        <div class="form-row">
            <div class="form-group">
                <label>프로젝트명</label>
                <input type="text" name="project-title-${fieldId}" value="${data ? data.title : ''}" required>
            </div>
            <div class="form-group">
                <label>기간</label>
                <input type="text" name="project-period-${fieldId}" value="${data ? data.period : ''}" required>
            </div>
        </div>
        <div class="form-group">
            <label>설명</label>
            <textarea name="project-description-${fieldId}" rows="3" required>${data ? data.description : ''}</textarea>
        </div>
        <div class="form-group">
            <label>사용 기술 (쉼표로 구분)</label>
            <input type="text" name="project-technologies-${fieldId}" value="${data ? data.technologies.join(', ') : ''}" required>
        </div>
        <button type="button" class="btn remove-btn" data-action="remove-project" data-id="${fieldId}">항목 삭제</button>
    `;
    
    container.appendChild(projectDiv);
    
    // 삭제 버튼에 이벤트 리스너 추가
    const removeBtn = projectDiv.querySelector(`button[data-id="${fieldId}"]`);
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            projectDiv.remove();
        });
    }
}

// 학력 필드 추가
function addEducationField(container, data = null, index = null) {
    const fieldId = index !== null ? index : Date.now();
    const eduDiv = document.createElement('div');
    eduDiv.className = 'form-group education-item';
    eduDiv.dataset.id = fieldId;
    
    eduDiv.innerHTML = `
        <h4>학력 ${index !== null ? index + 1 : '항목'}</h4>
        <div class="form-group">
            <label>교육 기관</label>
            <input type="text" name="edu-institution-${fieldId}" value="${data ? data.institution : ''}" required>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>전공</label>
                <input type="text" name="edu-major-${fieldId}" value="${data ? data.major : ''}" required>
            </div>
            <div class="form-group">
                <label>학위</label>
                <input type="text" name="edu-degree-${fieldId}" value="${data ? data.degree : ''}" required>
            </div>
        </div>
        <div class="form-group">
            <label>기간</label>
            <input type="text" name="edu-period-${fieldId}" value="${data ? data.period : ''}" required>
        </div>
        <button type="button" class="btn remove-btn" data-action="remove-education" data-id="${fieldId}">항목 삭제</button>
    `;
    
    container.appendChild(eduDiv);
    
    // 삭제 버튼에 이벤트 리스너 추가
    const removeBtn = eduDiv.querySelector(`button[data-id="${fieldId}"]`);
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            eduDiv.remove();
        });
    }
}

// 자격증 필드 추가
function addCertificationField(container, data = null, index = null) {
    const fieldId = index !== null ? index : Date.now();
    const certDiv = document.createElement('div');
    certDiv.className = 'form-group certification-item';
    certDiv.dataset.id = fieldId;
    
    certDiv.innerHTML = `
        <h4>자격증/수상 ${index !== null ? index + 1 : '항목'}</h4>
        <div class="form-group">
            <label>자격증/수상명</label>
            <input type="text" name="cert-title-${fieldId}" value="${data ? data.title : ''}" required>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>발급/수여 기관</label>
                <input type="text" name="cert-issuer-${fieldId}" value="${data ? data.issuer : ''}" required>
            </div>
            <div class="form-group">
                <label>취득/수상 연도</label>
                <input type="text" name="cert-date-${fieldId}" value="${data ? data.date : ''}" required>
            </div>
        </div>
        <button type="button" class="btn remove-btn" data-action="remove-certification" data-id="${fieldId}">항목 삭제</button>
    `;
    
    container.appendChild(certDiv);
    
    // 삭제 버튼에 이벤트 리스너 추가
    const removeBtn = certDiv.querySelector(`button[data-id="${fieldId}"]`);
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            certDiv.remove();
        });
    }
}

// 소개 폼 데이터 수집
function collectAboutFormData(originalData) {
    // 복사본 생성
    const updatedData = JSON.parse(JSON.stringify(originalData));
    
    // 자기소개 문단
    const aboutTextarea = document.getElementById('about-text');
    if (aboutTextarea) {
        const paragraphs = aboutTextarea.value
            .split('\n\n')
            .filter(para => para.trim() !== '');
        
        updatedData.about.paragraphs = paragraphs;
    }
    
    // 경력 데이터
    updatedData.experience = [];
    const experienceItems = document.querySelectorAll('.experience-item');
    experienceItems.forEach(item => {
        const id = item.dataset.id;
        
        const company = document.querySelector(`[name="exp-company-${id}"]`).value;
        const title = document.querySelector(`[name="exp-title-${id}"]`).value;
        const period = document.querySelector(`[name="exp-period-${id}"]`).value;
        const respText = document.querySelector(`[name="exp-responsibilities-${id}"]`).value;
        
        const responsibilities = respText
            .split('\n')
            .filter(resp => resp.trim() !== '');
        
        updatedData.experience.push({
            company,
            title,
            period,
            responsibilities
        });
    });
    
    // 프로젝트 데이터
    updatedData.projects = [];
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        const id = item.dataset.id;
        
        const title = document.querySelector(`[name="project-title-${id}"]`).value;
        const period = document.querySelector(`[name="project-period-${id}"]`).value;
        const description = document.querySelector(`[name="project-description-${id}"]`).value;
        const techText = document.querySelector(`[name="project-technologies-${id}"]`).value;
        
        const technologies = techText
            .split(',')
            .map(tech => tech.trim())
            .filter(tech => tech !== '');
        
        updatedData.projects.push({
            title,
            period,
            description,
            technologies
        });
    });
    
    // 학력 데이터
    updatedData.education = [];
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach(item => {
        const id = item.dataset.id;
        
        const institution = document.querySelector(`[name="edu-institution-${id}"]`).value;
        const major = document.querySelector(`[name="edu-major-${id}"]`).value;
        const degree = document.querySelector(`[name="edu-degree-${id}"]`).value;
        const period = document.querySelector(`[name="edu-period-${id}"]`).value;
        
        updatedData.education.push({
            institution,
            major,
            degree,
            period
        });
    });
    
    // 자격증 데이터
    updatedData.certifications = [];
    const certificationItems = document.querySelectorAll('.certification-item');
    certificationItems.forEach(item => {
        const id = item.dataset.id;
        
        const title = document.querySelector(`[name="cert-title-${id}"]`).value;
        const issuer = document.querySelector(`[name="cert-issuer-${id}"]`).value;
        const date = document.querySelector(`[name="cert-date-${id}"]`).value;
        
        updatedData.certifications.push({
            title,
            issuer,
            date
        });
    });
    
    return updatedData;
}

// 프로필 편집기 설정
function setupProfileEditor() {
    // 현재 프로필 데이터 로드
    const profileData = JSON.parse(localStorage.getItem('profileData')) || getDefaultProfileData();
    
    // 폼 필드에 데이터 채우기
    populateProfileForm(profileData);
    
    // 폼 제출 이벤트 리스너
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 폼 데이터 수집
            const updatedProfileData = collectProfileFormData(profileData);
            
            // 데이터 저장
            localStorage.setItem('profileData', JSON.stringify(updatedProfileData));
            
            // 성공 메시지
            alert('프로필 정보가 성공적으로 저장되었습니다!');
        });
    }
    
    // 로그아웃 버튼 이벤트 리스너
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // 스킬 추가 버튼 이벤트 리스너
    const addSkillBtn = document.getElementById('add-skill-category-btn');
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', function() {
            const skillsContainer = document.getElementById('skills-container');
            if (skillsContainer) {
                addSkillCategoryField(skillsContainer);
            }
        });
    }
}

// 프로필 폼 데이터 채우기
function populateProfileForm(data) {
    // 기본 정보
    document.getElementById('name').value = data.name || '';
    document.getElementById('title').value = data.title || '';
    document.getElementById('email').value = data.email || '';
    
    // 소셜 링크
    document.getElementById('github').value = data.social?.github || '';
    document.getElementById('linkedin').value = data.social?.linkedin || '';
    
    // 스킬 데이터
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer && data.skills && data.skills.length > 0) {
        skillsContainer.innerHTML = '';
        
        data.skills.forEach((skill, index) => {
            addSkillCategoryField(skillsContainer, skill, index);
        });
    }
}

// 스킬 카테고리 필드 추가
function addSkillCategoryField(container, data = null, index = null) {
    const fieldId = index !== null ? index : Date.now();
    const skillDiv = document.createElement('div');
    skillDiv.className = 'form-group skill-category-item';
    skillDiv.dataset.id = fieldId;
    
    skillDiv.innerHTML = `
        <h4>스킬 카테고리 ${index !== null ? index + 1 : '항목'}</h4>
        <div class="form-group">
            <label>카테고리 이름</label>
            <input type="text" name="skill-category-${fieldId}" value="${data ? data.category : ''}" required>
        </div>
        <div class="form-group">
            <label>기술 항목 (쉼표로 구분)</label>
            <input type="text" name="skill-items-${fieldId}" value="${data ? data.items.join(', ') : ''}" required>
        </div>
        <button type="button" class="btn remove-btn" data-action="remove-skill" data-id="${fieldId}">항목 삭제</button>
    `;
    
    container.appendChild(skillDiv);
    
    // 삭제 버튼에 이벤트 리스너 추가
    const removeBtn = skillDiv.querySelector(`button[data-id="${fieldId}"]`);
    if (removeBtn) {
        removeBtn.addEventListener('click', function() {
            skillDiv.remove();
        });
    }
}

// 프로필 폼 데이터 수집
function collectProfileFormData(originalData) {
    // 복사본 생성
    const updatedData = JSON.parse(JSON.stringify(originalData));
    
    // 기본 정보
    updatedData.name = document.getElementById('name').value;
    updatedData.title = document.getElementById('title').value;
    updatedData.email = document.getElementById('email').value;
    
    // 소셜 링크
    updatedData.social = {
        github: document.getElementById('github').value,
        linkedin: document.getElementById('linkedin').value
    };
    
    // 스킬 데이터
    updatedData.skills = [];
    const skillItems = document.querySelectorAll('.skill-category-item');
    skillItems.forEach(item => {
        const id = item.dataset.id;
        
        const category = document.querySelector(`[name="skill-category-${id}"]`).value;
        const itemsText = document.querySelector(`[name="skill-items-${id}"]`).value;
        
        const items = itemsText
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '');
        
        updatedData.skills.push({
            category,
            items
        });
    });
    
    return updatedData;
} 