const person = document.querySelector(".cinematic-person");
const homeContent = document.querySelector(".home-content");
const scrollIndicator = document.querySelector(".scroll-indicator");
const homeSection = document.querySelector(".cinematic-home");
const waveVideo = document.querySelector(".wave-video");
const profileImage = document.getElementById("profile-image");
const profileEnd = document.getElementById("profile-end");
const aboutSplitContent = document.querySelector(".about-split-content");

if (waveVideo) {
    waveVideo.play().catch(error => console.log("Video auto-play ready"));
}

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const homeHeight = homeSection.offsetHeight;
    const viewHeight = window.innerHeight;
    
    // Calculate progress between 0 and 1
    const maxScroll = Math.max(1, homeHeight - viewHeight);
    const progress = Math.min(Math.max(0, scrollY / maxScroll), 1);

    // Keep person visible so #skills can scroll over it naturally
    if (person) {
        person.style.opacity = "1";
        person.style.pointerEvents = "auto";
    }

    let scale = 1;
    let img1Opacity = 1;
    let videoOpacity = 0;
    let imgEndOpacity = 0;
    let imgTranslateX = 0; 

    // Phase 1: Zoom in (0% -> 30%)
    if (progress <= 0.3) {
        scale = 1 + (progress / 0.3) * 2.0; 
        img1Opacity = 1;
        videoOpacity = 0;
        imgEndOpacity = 0;

        if (person) person.style.justifyContent = "center";
        if (aboutSplitContent) {
            aboutSplitContent.style.display = "none";
            aboutSplitContent.style.opacity = "0";
        }
    } 
    // Phase 2: Zoom out & Video crossfade (30% -> 60%)
    else if (progress > 0.3 && progress <= 0.6) {
        const phaseProgress = (progress - 0.3) / 0.3; 
        scale = 3.0 - (phaseProgress * 2.0); 
        
        img1Opacity = 1 - phaseProgress;
        videoOpacity = phaseProgress;
        imgEndOpacity = 0;

        if (person) person.style.justifyContent = "center";
        if (aboutSplitContent) {
            aboutSplitContent.style.display = "none";
            aboutSplitContent.style.opacity = "0";
        }
    } 
    // Phase 3: Split layout & reveal About text (60% -> 100%)
    else {
        scale = 1; 
        const phaseProgress = Math.min(1, (progress - 0.6) / 0.25); // Fully visible by 85% progress
        
        img1Opacity = 0;
        videoOpacity = 1 - phaseProgress; 
        imgEndOpacity = phaseProgress; 
        
        imgTranslateX = -40 * phaseProgress; 

        if (person) {
            person.style.justifyContent = "space-between";
        }

        if (aboutSplitContent) {
            aboutSplitContent.style.display = "block";
            aboutSplitContent.style.opacity = phaseProgress;
            aboutSplitContent.style.transform = `translateX(${0 - (1 - phaseProgress) * 25}px)`;
        }
    }

    if (person) person.style.transform = `translateX(-50%) translateY(-50%) scale(${scale})`;
    
    if (profileEnd) {
        profileEnd.style.transform = `translateX(${imgTranslateX}px)`;
        profileEnd.style.opacity = imgEndOpacity;
    }

    if (profileImage) profileImage.style.opacity = img1Opacity;
    if (waveVideo)    waveVideo.style.opacity = videoOpacity;

    /* Hero Text Fade Out */
    let textOpacity = 1 - (scrollY / (viewHeight * 0.3));
    if (homeContent) homeContent.style.opacity = Math.max(0, textOpacity);

    /* Scroll Indicator */
    if (scrollIndicator) {
        scrollIndicator.style.opacity = scrollY > viewHeight * 0.2 ? "0" : "1";
    }
});

// --- ADD THIS CODE TO THE VERY BOTTOM OF YOUR SCRIPT.JS FILE ---


const aboutNavLink = document.querySelector('[data-scroll="about"]');

if (aboutNavLink) {
    aboutNavLink.addEventListener('click', (event) => {
        event.preventDefault();

        if (homeSection) {
            const homeHeight = homeSection.offsetHeight;
            const viewHeight = window.innerHeight;

            // Updated multiplier from 0.92 to 0.75 for 180vh track
            const targetScrollPosition = homeSection.offsetTop + (homeHeight - viewHeight) * 0.75;

            window.scrollTo({
                top: targetScrollPosition,
                behavior: 'smooth'
            });
        }
    });
}



// ---------- SYSTEM DASHBOARD GRAPH ENGINE ----------
function drawLines() {
  const svg = document.getElementById('lines');
  const wrap = document.querySelector('.hub-wrap');
  if (!svg || !wrap) return;
  
  if (window.innerWidth <= 1150) { 
    svg.innerHTML = ''; 
    return; 
  }
  
  const center = document.querySelector('.hub-center');
  const wrapRect = wrap.getBoundingClientRect();
  const cRect = center.getBoundingClientRect();
  const cx = cRect.left - wrapRect.left + cRect.width / 2;
  const cy = cRect.top - wrapRect.top + cRect.height / 2;

  svg.innerHTML = '';
  document.querySelectorAll('[data-node]').forEach(node => {
    const r = node.getBoundingClientRect();
    const nx = r.left - wrapRect.left + r.width / 2;
    const ny = r.top - wrapRect.top + r.height / 2;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx); line.setAttribute('y1', cy);
    line.setAttribute('x2', nx); line.setAttribute('y2', ny);
    line.dataset.target = node.dataset.id;
    svg.appendChild(line);
  });
}

window.addEventListener('resize', drawLines);
window.addEventListener('load', drawLines);
// Run initial build setup once code triggers
setTimeout(drawLines, 200);

// Line connector node hover transitions
document.querySelectorAll('[data-node]').forEach(node => {
  const card = node.querySelector('.node-card') || node;
  card.addEventListener('mouseenter', () => {
    const line = document.querySelector(`.lines line[data-target="${node.dataset.id}"]`);
    if (line) line.classList.add('line-active');
  });
  card.addEventListener('mouseleave', () => {
    const line = document.querySelector(`.lines line[data-target="${node.dataset.id}"]`);
    if (line) line.classList.remove('line-active');
  });
});

// Dynamic intersection skill progress meter
const bars = document.querySelectorAll('.bar-fill');
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { 
      e.target.style.width = e.target.dataset.fill + '%'; 
    }
  });
}, { threshold: 0.2 });
bars.forEach(b => skillObserver.observe(b));