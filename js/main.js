// 웹사이트 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 저장된 프로필 데이터 로드
    loadProfileData();
});

// 프로필 데이터 로드
function loadProfileData() {
    // localStorage에서 데이터 가져오기
    const profileData = JSON.parse(localStorage.getItem('profileData')) || getDefaultProfileData();
    
    // 기본 정보 업데이트
    updateBasicInfo(profileData);
    
    // 현재 페이지 확인 및 페이지별 콘텐츠 업데이트
    const currentPage = getCurrentPage();
    
    if (currentPage === 'index') {
        updateIndexPage(profileData);
    } else if (currentPage === 'about') {
        updateAboutPage(profileData);
    }
}

// 현재 페이지 확인
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.endsWith('about.html')) return 'about';
    if (path.endsWith('cv.html')) return 'cv';
    if (path.includes('/admin/')) return 'admin';
    return 'index';
}

// 기본 정보 업데이트 (모든 페이지에 공통)
function updateBasicInfo(data) {
    // 로고 및 페이지 제목 업데이트
    const logoElements = document.querySelectorAll('.logo');
    logoElements.forEach(el => {
        el.textContent = data.name;
    });
    
    // 문서 제목 업데이트
    document.title = document.title.replace('내 이력서', data.name + '의 이력서');
    
    // 푸터 업데이트
    const footerYear = new Date().getFullYear();
    const footerCopyright = document.querySelector('footer p');
    if (footerCopyright) {
        footerCopyright.textContent = `© ${footerYear} ${data.name}. 모든 권리 보유.`;
    }
    
    // 소셜 링크 업데이트
    const githubLink = document.querySelector('.social-links a[href*="github.com"]');
    const linkedinLink = document.querySelector('.social-links a[href*="linkedin.com"]');
    const emailLink = document.querySelector('.social-links a[href*="mailto"]');
    
    if (githubLink && data.social.github) {
        githubLink.href = data.social.github;
    }
    
    if (linkedinLink && data.social.linkedin) {
        linkedinLink.href = data.social.linkedin;
    }
    
    if (emailLink && data.email) {
        emailLink.href = `mailto:${data.email}`;
    }
}

// 인덱스 페이지 업데이트
function updateIndexPage(data) {
    // 영웅 섹션 업데이트
    const heroTitle = document.querySelector('.hero-content h1');
    const heroSubtitle = document.querySelector('.hero-content p');
    
    if (heroTitle) {
        heroTitle.innerHTML = `안녕하세요, 저는 <span class="highlight">${data.name}</span>입니다`;
    }
    
    if (heroSubtitle) {
        heroSubtitle.textContent = data.title;
    }
    
    // 스킬 카드 업데이트
    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer && data.skills && data.skills.length > 0) {
        skillsContainer.innerHTML = '';
        
        data.skills.forEach(skillCategory => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            
            skillCard.innerHTML = `
                <h3>${skillCategory.category}</h3>
                <p>${skillCategory.items.join(', ')}</p>
            `;
            
            skillsContainer.appendChild(skillCard);
        });
    }
}

// 어바웃 페이지 업데이트
function updateAboutPage(data) {
    // 자기소개 업데이트
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        aboutText.innerHTML = '';
        
        data.about.paragraphs.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            aboutText.appendChild(p);
        });
    }
    
    // 경력 업데이트
    const timeline = document.querySelector('.timeline');
    if (timeline && data.experience && data.experience.length > 0) {
        timeline.innerHTML = '';
        
        data.experience.forEach(exp => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            timelineItem.innerHTML = `
                <div class="timeline-date">${exp.period}</div>
                <div class="timeline-content">
                    <h3>${exp.company}</h3>
                    <p class="job-title">직책: ${exp.title}</p>
                    <ul class="job-responsibilities">
                        ${exp.responsibilities.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });
    }
    
    // 프로젝트 업데이트
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid && data.projects && data.projects.length > 0) {
        projectsGrid.innerHTML = '';
        
        data.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <h3>${project.title}</h3>
                <p class="project-date">${project.period}</p>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
    }
    
    // 학력 업데이트
    const educationSection = document.querySelector('.education-section');
    if (educationSection && data.education && data.education.length > 0) {
        const educationItems = educationSection.querySelector('.education-items') || educationSection;
        if (educationItems !== educationSection) {
            educationItems.innerHTML = '';
        } else {
            // h2 제목 이후의 내용을 지우고 다시 생성
            const h2 = educationSection.querySelector('h2');
            educationSection.innerHTML = '';
            educationSection.appendChild(h2);
            
            const educationItems = document.createElement('div');
            educationItems.className = 'education-items';
            educationSection.appendChild(educationItems);
        }
        
        data.education.forEach(edu => {
            const educationItem = document.createElement('div');
            educationItem.className = 'education-item';
            
            educationItem.innerHTML = `
                <h3>${edu.institution}</h3>
                <p>전공: ${edu.major}</p>
                <p>기간: ${edu.period}</p>
                <p>학위: ${edu.degree}</p>
            `;
            
            educationItems.appendChild(educationItem);
        });
    }
    
    // 자격증 업데이트
    const certificationsList = document.querySelector('.certifications-list');
    if (certificationsList && data.certifications && data.certifications.length > 0) {
        certificationsList.innerHTML = '';
        
        data.certifications.forEach(cert => {
            const certItem = document.createElement('li');
            
            certItem.innerHTML = `
                <h3>${cert.title}</h3>
                <p>${cert.issuer}, ${cert.date}</p>
            `;
            
            certificationsList.appendChild(certItem);
        });
    }
}

// 기본 프로필 데이터 (초기값)
function getDefaultProfileData() {
    return {
        name: '홍길동',
        title: '소프트웨어 개발자 | 웹 디자이너 | 문제 해결사',
        email: 'example@example.com',
        social: {
            github: 'https://github.com/yourusername',
            linkedin: 'https://linkedin.com/in/yourprofile',
        },
        about: {
            paragraphs: [
                '안녕하세요, 저는 홍길동입니다. 소프트웨어 개발 분야에서 5년의 경험을 가지고 있습니다.',
                '서울대학교에서, 컴퓨터 공학을 전공했으며, 웹 개발 및 인공지능에 전문성을 갖추고 있습니다.',
                '프로젝트 협업이나 채용 기회에 관심이 있으시면 언제든지 연락 주세요!'
            ]
        },
        skills: [
            {
                category: '프론트엔드',
                items: ['HTML', 'CSS', 'JavaScript', 'React']
            },
            {
                category: '백엔드',
                items: ['Node.js', 'Express', 'Python']
            },
            {
                category: '기타',
                items: ['Git', 'AWS', 'UI/UX 디자인']
            }
        ],
        experience: [
            {
                company: '기술 혁신 기업',
                title: '시니어 개발자',
                period: '2020 - 현재',
                responsibilities: [
                    '프론트엔드 팀 리드 및 아키텍처 설계',
                    '주요 기능 개발 및 성능 최적화',
                    '주니어 개발자 멘토링 및 코드 리뷰'
                ]
            },
            {
                company: '웹 솔루션 회사',
                title: '웹 개발자',
                period: '2018 - 2020',
                responsibilities: [
                    'React 기반 사용자 인터페이스 개발',
                    'RESTful API 연동 및 데이터 처리',
                    '사용자 경험 개선 및 버그 수정'
                ]
            }
        ],
        projects: [
            {
                title: '온라인 학습 플랫폼',
                period: '2022.01 - 2022.06',
                description: '학생들이 온라인으로 강의를 수강하고 과제를 제출할 수 있는 웹 플랫폼 개발',
                technologies: ['React', 'Node.js', 'MongoDB']
            },
            {
                title: '전자상거래 웹사이트',
                period: '2021.07 - 2021.12',
                description: '사용자 맞춤형 상품 추천 기능이 있는 온라인 쇼핑몰 구축',
                technologies: ['Python', 'Django', 'PostgreSQL']
            }
        ],
        education: [
            {
                institution: '서울대학교',
                major: '컴퓨터 공학',
                period: '2014 - 2018',
                degree: '학사'
            }
        ],
        certifications: [
            {
                title: 'AWS 인증 솔루션스 아키텍트',
                issuer: 'Amazon Web Services',
                date: '2021'
            },
            {
                title: '정보처리기사',
                issuer: '한국산업인력공단',
                date: '2018'
            }
        ]
    };
} 