// PDF 뷰어 기능
document.addEventListener('DOMContentLoaded', function() {
    // CV 페이지에서만 실행
    if (window.location.pathname.includes('cv.html')) {
        initPdfViewer();
    }
});

async function initPdfViewer() {
    try {
        // PDF.js 워커 설정
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
            
            // PDF 로드
            const pdfUrl = 'assets/resume.pdf';
            const container = document.getElementById('pdf-viewer');
            
            if (container) {
                // PDF 렌더링
                await loadPdf(pdfUrl, container);
            }
        } else {
            console.error('PDF.js 라이브러리가 로드되지 않았습니다.');
            document.getElementById('error-message').style.display = 'block';
        }
    } catch (error) {
        console.error('PDF 뷰어 초기화 에러:', error);
        document.getElementById('error-message').style.display = 'block';
    }
}

async function loadPdf(pdfUrl, container) {
    try {
        const loadingMessage = document.getElementById('loading-message');
        loadingMessage.style.display = 'block';
        
        // PDF 문서 로드
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        // 총 페이지 수
        const numPages = pdf.numPages;
        loadingMessage.style.display = 'none';
        
        // 각 페이지 렌더링
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            
            // 캔버스 생성
            const canvas = document.createElement('canvas');
            container.appendChild(canvas);
            
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: 1.5 });
            
            // 캔버스 크기 설정
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            // 페이지 렌더링
            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            
            await page.render(renderContext).promise;
            
            // 페이지 사이 여백 추가
            if (pageNum < numPages) {
                const spacer = document.createElement('div');
                spacer.className = 'page-spacer';
                container.appendChild(spacer);
            }
        }
    } catch (error) {
        console.error('PDF 로딩 에러:', error);
        document.getElementById('error-message').style.display = 'block';
    }
} 