import React, { useState, useEffect, useRef } from 'react';
import { themes } from './data/themes';
import { quotes } from './data/quotes';

function App() {
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [currentText, setCurrentText] = useState("");
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // 初始化或隨機產生時，隨機選一個文案
  useEffect(() => {
    generateRandom();
  }, []);

  // 當任何屬性改變時，執行合成
  useEffect(() => {
    if (currentTheme && currentText) {
      updateImageAndDraw();
    }
  }, [currentTheme, currentText]);

  const generateRandom = () => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    const category = randomTheme.quoteCategory;
    const items = quotes[category];
    const randomText = items[Math.floor(Math.random() * items.length)];
    
    setCurrentTheme(randomTheme);
    setCurrentText(randomText);
  };

  const updateImageAndDraw = () => {
    let finalUrl = currentTheme.bgUrl;
    
    // 如果主題支援 AI 繪圖且目前沒有背景圖或需要重新產生
    if (currentTheme.aiPromptSuffix) {
        // 使用 Pollinations.ai 進行繪圖
        const prompt = encodeURIComponent(`${currentText}, ${currentTheme.aiPromptSuffix}`);
        const seed = Math.floor(Math.random() * 1000000);
        finalUrl = `https://image.pollinations.ai/prompt/${prompt}?nologo=true&width=1080&height=1080&seed=${seed}`;
    }

    setImageUrl(finalUrl);
    drawCanvas(finalUrl, currentTheme, currentText);
  };

  const drawCanvas = (src, theme, text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "Anonymous"; 
    img.src = src;
    
    setLoading(true);
    img.onload = () => {
      setLoading(false);
      canvas.width = 1080;
      canvas.height = 1080;

      if (theme.layoutType === 'composite') {
        renderCompositeLayout(ctx, img, theme, text);
      } else {
        renderFullLayout(ctx, img, theme, text);
      }
    };
    img.onerror = () => {
        setLoading(false);
        // Fallback or error handling
    };
  };

  // 全螢幕佈局 (現有的經典風格)
  const renderFullLayout = (ctx, img, theme, text) => {
    const scale = Math.max(1080 / img.width, 1080 / img.height);
    const x = (1080 - img.width * scale) / 2;
    const y = (1080 - img.height * scale) / 2;
    
    ctx.filter = theme.filter || 'none';
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    ctx.filter = 'none';

    ctx.fillStyle = theme.overlayColor || 'transparent';
    ctx.fillRect(0, 0, 1080, 1080);

    drawMainText(ctx, 1080 / 2, 1080 / 2, 800, theme, text);
  };

  // 複合佈局 (吉卜力/龍貓風格：頂部色塊 + 底部 AI 圖片)
  const renderCompositeLayout = (ctx, img, theme, text) => {
    // 1. 繪製頂部半透明/色塊區域 (40%)
    ctx.fillStyle = theme.headerBg || "#3498db";
    ctx.fillRect(0, 0, 1080, 500);

    // 2. 繪製底部 AI 圖片 (60%)
    const scale = Math.max(1080 / img.width, 580 / img.height);
    const x = (1080 - img.width * scale) / 2;
    const y = 500;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

    // 3. 繪製特殊標題 "早安" (參照附件)
    ctx.fillStyle = "white";
    ctx.font = `bold 160px ${theme.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText("早安", 540, 200);

    // 4. 繪製英文副標
    ctx.font = `40px sans-serif`;
    ctx.fillText("Be rich and happiness", 540, 270);

    // 5. 繪製主金句
    drawMainText(ctx, 540, 400, 900, theme, text);
  };

  const drawMainText = (ctx, x, y, maxWidth, theme, text) => {
    ctx.fillStyle = theme.textColor;
    ctx.font = `${theme.fontSize}px ${theme.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (theme.textShadow && theme.textShadow !== "none") {
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    } else {
      ctx.shadowColor = "transparent";
    }

    const lineHeight = theme.fontSize * 1.5;
    wrapText(ctx, text, x, y, maxWidth, lineHeight);
  };

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

    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    for (let k = 0; k < lines.length; k++) {
      context.fillText(lines[k], x, startY + (k * lineHeight));
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `早安圖-AI-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>溫馨晨光</h1>
        <p>AI 智慧繪圖 · 為長輩量身打造</p>
      </header>

      <div className="preview-section">
        <canvas ref={canvasRef}></canvas>
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p style={{fontWeight:'bold', color: '#0369A1'}}>AI 畫家中...</p>
          </div>
        )}
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
            placeholder="輸入想說的話..."
          ></textarea>
        </div>
        
        <div className="action-row">
          <button className="btn-generate" onClick={generateRandom}>
            ✨ 隨機產生
          </button>
          <button className="btn-download" onClick={handleDownload} disabled={loading}>
            💾 儲存分享
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
