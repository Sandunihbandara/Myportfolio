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
    const progress = Math.min(scrollY / (homeHeight - viewHeight), 1);

    let scale = 1;
    let img1Opacity = 1;
    let videoOpacity = 0;
    let imgEndOpacity = 0;
    let imgTranslateX = 0; // Baseline centering inside the media wrapper

    // Phase 1: Zoom In into first image face (Centered)
    if (progress <= 0.4) {
        scale = 1 + (progress / 0.4) * 2.0; 
        img1Opacity = 1;
        videoOpacity = 0;
        imgEndOpacity = 0;

        if (person) person.style.justifyContent = "center";
        if (aboutSplitContent) {
            aboutSplitContent.style.display = "none";
            aboutSplitContent.style.opacity = "0";
        }
    } 
    // Phase 2: Zoom out & Crossfade into Waving Video (Centered)
    else if (progress > 0.4 && progress <= 0.8) {
        const phaseProgress = (progress - 0.4) / 0.4; 
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
    // Phase 3: Move layout to separate elements and slide profile-end left
    else {
        scale = 1; 
        const phaseProgress = (progress - 0.8) / 0.2; 
        
        img1Opacity = 0;
        videoOpacity = 1 - phaseProgress; 
        imgEndOpacity = phaseProgress; 
        
        // Nudge the image left inside its half of the frame
        imgTranslateX = -40 * phaseProgress; 

        // Split the parent layout open to make room for the right-hand text
        if (person) {
            person.style.justifyContent = "space-between";
        }

        // Activate layout visibility and reveal text smoothly
        if (aboutSplitContent) {
            aboutSplitContent.style.display = "block";
            // Allow display change to resolve before applying opacity transitions
            setTimeout(() => {
                aboutSplitContent.style.opacity = phaseProgress;
                aboutSplitContent.style.transform = `translateX(${0 - (1 - phaseProgress) * 25}px)`;
            }, 10);
        }
    }

    // Apply the clean zoom tracking changes directly on the container frame
    if (person) person.style.transform = `translateX(-50%) translateY(-50%) scale(${scale})`;
    
    // Slide ONLY the profile end asset slightly left during Phase 3
    if (profileEnd) {
        profileEnd.style.transform = `translateX(${imgTranslateX}px)`;
        profileEnd.style.opacity = imgEndOpacity;
    }

    // Update opacity layers
    if (profileImage) profileImage.style.opacity = img1Opacity;
    if (waveVideo)    waveVideo.style.opacity = videoOpacity;

    /* Text & Indicator updates */
    let textOpacity = 1 - (scrollY / (viewHeight * 0.4));
    homeContent.style.opacity = Math.max(0, textOpacity);

    if (scrollY > viewHeight * 0.2) {
        scrollIndicator.style.opacity = "0";
    } else {
        scrollIndicator.style.opacity = "1";
    }
});


// --- ADD THIS CODE TO THE VERY BOTTOM OF YOUR SCRIPT.JS FILE ---

const aboutNavLink = document.querySelector('[data-scroll="about"]');

if (aboutNavLink) {
    aboutNavLink.addEventListener('click', (event) => {
        event.preventDefault(); // Stop the default broken browser jump

        if (homeSection) {
            const homeHeight = homeSection.offsetHeight;
            const viewHeight = window.innerHeight;

            /* 
               Calculates the sweet spot (roughly 90% down your 300vh track) 
               where the final image has slid left and the text is fully faded in.
            */
            const targetScrollPosition = homeSection.offsetTop + (homeHeight - viewHeight) * 0.92;

            // Force a clean, smooth scroll directly to the animation frame
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