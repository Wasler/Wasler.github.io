(function() {
  const textElements = document.querySelectorAll(".js-text-animation-color-1");
  const animatedElements = new Map();

  const colors = [
    "#FF5733", 
    "#33FF57", 
    "#3357FF", 
    "#FF33A8", 
    "#33FFF5", 
    "#F5FF33", 
    "#FF8C00", 
    "#8A2BE2"  
  ];
  
 
  const colorChangeInterval = 300; 

  function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedElements.get(entry.target)) {
        
        (function(element) {
          const originalContent = element.cloneNode(true);
          element.innerHTML = "";
          
          const childClassName = "js-text-animation-color-1-child";
          const appearanceDelay = 0.05; 
          let delay = 0;

          const charSpans = [];
          
          const walker = document.createTreeWalker(originalContent, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
          let node;
          
          while (node = walker.nextNode()) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              let textContent = node.textContent;

              if (charSpans.length === 0) textContent = textContent.trimStart(); 
              
              textContent.split("").forEach(char => {
                const charSpan = document.createElement("span");
                charSpan.className = childClassName;
                if (char === " ") charSpan.classList.add("space-char");
                charSpan.textContent = char;
                
                charSpan.style.color = getRandomElement(colors);
                
                charSpan.style.animation = `fadeInChar 0.5s forwards ${delay}s`;
                
                delay += appearanceDelay;
                element.appendChild(charSpan);
                charSpans.push(charSpan);
              });
            } else if (node.tagName === "BR") {
              element.appendChild(document.createElement("br"));
            }
          }
          
          requestAnimationFrame(() => {
            element.style.visibility = "visible";
          });


          setTimeout(() => {
            setInterval(() => {

              const randomSpan = getRandomElement(charSpans);
              
              if (randomSpan.classList.contains('space-char')) return;

              const currentColor = randomSpan.style.color;
              let newColor;
              do {
                newColor = getRandomElement(colors);
              } while (newColor === currentColor);

              randomSpan.style.color = newColor;

            }, colorChangeInterval);
          }, delay * 100);

        })(entry.target);
        
        animatedElements.set(entry.target, true);
      }
    });
  }, { threshold: 0.25 });
        
  textElements.forEach(element => {
    observer.observe(element);
  });
})();