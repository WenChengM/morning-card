import React, { useState, useEffect, useRef } from 'react';
import { themes } from './data/themes';
import { quotes } from './data/quotes';

function App() {
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [currentText, setCurrentText] = useState("");
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // 初始化或隨機產生時，隨機選一個文案
  useEffect(() => {
    generateRandom();
  }, []);

  // 當主題或內容改變時，重繪 Canvas
  useEffect(() => {
    drawCanvas();
  }, [currentTheme, currentText]);

  const generateRandom = () => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const category = randomTheme.quoteCategory;
    const items = quotes[category];
    const randomText = items[Math.floor(Math.random() * items.length)];
    
    setCurrentTheme(randomTheme);
    setCurrentText(randomText);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "Anonymous"; 
    img.src = currentTheme.bgUrl;
    
    setLoading(true);
    img.onload = () => {
      setLoading(false);
      // 設定畫布大小 (1080px 高畫質)
      canvas.width = 1080;
      canvas.height = 1080;

      // 1. 繪製背景
      ctx.clearRect(0, 0, 1080, 1080);
      
      // 計算圖片縮放以填充畫布 (Cover effect)
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      
      // 套用濾鏡 (如有)
      ctx.filter = currentTheme.filter || 'none';
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.filter = 'none';

      // 2. 繪製遮罩層 (Overlay)
      ctx.fillStyle = currentTheme.overlayColor;
      ctx.fillRect(0, 0, 1080, 1080);

      // 3. 繪製框線 (Magazine Style 如有)
      if (currentTheme.border) {
          ctx.strokeStyle = "white";
          ctx.lineWidth = 60;
          ctx.strokeRect(30, 30, 1020, 1020);
      }

      // 4. 繪製文字
      ctx.fillStyle = currentTheme.textColor;
      ctx.font = `${currentTheme.fontSize}px ${currentTheme.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (currentTheme.textShadow !== "none") {
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      } else {
        ctx.shadowColor = "transparent";
      }

      // 智慧換行
      const maxWidth = 800;
      const lineHeight = currentTheme.fontSize * 1.5;
      wrapText(ctx, currentText, 540, 540, maxWidth, lineHeight);
    };
  };

  // 輔助函式：文字自動換行
  const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    const words = text.split('');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n];
      let metrics = context.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n];
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // 垂直中心對齊計算
    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    for (let k = 0; k < lines.length; k++) {
      context.fillText(lines[k], x, startY + (k * lineHeight));
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `早安圖-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>溫馨晨光</h1>
        <p>點選風格，為愛的人送上祝福</p>
      </header>

      <div className="preview-section">
        <canvas ref={canvasRef}></canvas>
        {loading && <div style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)'}}>載入中...</div>}
      </div>

      <div className="style-picker">
        {themes.map((t) => (
          <div 
            key={t.id} 
            className={`style-item ${currentTheme.id === t.id ? 'active' : ''}`}
            onClick={() => setCurrentTheme(t)}
          >
            <div className="style-thumb" style={{backgroundImage: `url(${t.thumb})`}}></div>
            <span className="style-name">{t.name}</span>
          </div>
        ))}
      </div>

      <div className="action-panel">
        <div className="input-area">
          <textarea 
            rows="3" 
            value={currentText} 
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="輸入你想說的話..."
          ></textarea>
        </div>
        
        <div className="action-row">
          <button className="btn-generate" onClick={generateRandom}>
            ✨ 隨機產生
          </button>
          <button className="btn-download" onClick={handleDownload}>
            💾 儲存分享
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
