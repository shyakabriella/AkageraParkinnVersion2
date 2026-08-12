const fs = require('fs');

function htmlToJsx(html) {
  let jsx = html;
  
  // Remove multiline comments
  jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');
  
  // class -> className
  jsx = jsx.replace(/class=/g, 'className=');
  
  // for -> htmlFor
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  
  // Self-closing tags
  jsx = jsx.replace(/<(img|input|br|hr)([^>]*?)(?<!\/)>/ig, '<$1$2 />');
  
  // style="background-image: url('...')" -> style={{ backgroundImage: "url('...')" }}
  jsx = jsx.replace(/style="background-image:\s*url\('?(.*?)'?\)"/g, 'style={{ backgroundImage: "url(\'$1\')" }}');
  
  // viewBox -> viewBox (already correct, just making sure svg attributes are camelCased)
  jsx = jsx.replace(/stroke-width=/g, 'strokeWidth=');
  jsx = jsx.replace(/stroke-linecap=/g, 'strokeLinecap=');
  jsx = jsx.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
  jsx = jsx.replace(/fill-rule=/g, 'fillRule=');
  jsx = jsx.replace(/clip-rule=/g, 'clipRule=');
  
  // other styles if any
  jsx = jsx.replace(/style="height:\s*(.*?);?"/g, 'style={{ height: "$1" }}');
  jsx = jsx.replace(/style="width:\s*(.*?);?"/g, 'style={{ width: "$1" }}');

  return jsx;
}

const htmlFile = 'src/pages/Home/home.html';
const html = fs.readFileSync(htmlFile, 'utf8');
const jsxBody = htmlToJsx(html);

const jsxContent = `import React, { useEffect } from 'react';
import { usePageInit } from '../../hooks/usePageInit';

const Home = () => {
  usePageInit();

  useEffect(() => {
    const setupPoolCarousel = () => {
      const prevBtn = document.querySelector('button[aria-label="Previous photo"]');
      const nextBtn = document.querySelector('button[aria-label="Next photo"]');
      const thumbBtns = document.querySelectorAll('button[aria-label^="Open photo"]');
      const counter = document.querySelector('.absolute.top-3.right-3');

      if (!prevBtn || !nextBtn || thumbBtns.length === 0) return;

      const poolImages = Array.from(thumbBtns).map(btn => btn.querySelector('img')?.src).filter(Boolean);
      let poolIdx = 0;

      const mainImgContainer = prevBtn.closest('.relative');
      const mainImg = mainImgContainer?.querySelector('img.absolute, img');

      const updatePool = (idx) => {
        if (mainImg && poolImages[idx]) mainImg.src = poolImages[idx];
        if (counter) counter.textContent = idx + 1 + '/' + poolImages.length;
        thumbBtns.forEach((btn, i) => {
          btn.style.borderColor = i === idx ? 'rgb(17,24,39)' : 'rgb(229,231,235)';
        });
      };

      prevBtn.addEventListener('click', () => { poolIdx = (poolIdx - 1 + poolImages.length) % poolImages.length; updatePool(poolIdx); });
      nextBtn.addEventListener('click', () => { poolIdx = (poolIdx + 1) % poolImages.length; updatePool(poolIdx); });
      thumbBtns.forEach((btn, i) => btn.addEventListener('click', () => { poolIdx = i; updatePool(i); }));
    };

    setTimeout(setupPoolCarousel, 400);
  }, []);

  return (
    <>
` + jsxBody + `
    </>
  );
};

export default Home;
`;

fs.writeFileSync('src/pages/Home/Home.jsx', jsxContent);
