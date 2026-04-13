export const themes = [
  {
    id: "ghibli",
    name: "吉卜力藝術",
    thumb: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=150&q=80",
    layoutType: "composite",
    headerBg: "#3498db",
    fontFamily: "'ZCOOL XiaoWei', serif",
    textColor: "#ffffff",
    fontSize: 54,
    quoteCategory: "禪意",
    aiPromptSuffix: "in Studio Ghibli art style, Totoro inspiration, lush greenery, soft watercolor lighting, masterpiece, hand-drawn texture, high quality"
  },
  {
    id: "disney",
    name: "迪士尼夢幻",
    thumb: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=150&q=80",
    layoutType: "full",
    bgUrl: "", // Dynamic AI
    fontFamily: "'Noto Serif TC', serif",
    textColor: "#ffffff",
    overlayColor: "rgba(106, 17, 203, 0.3)",
    textShadow: "2px 2px 10px rgba(0,0,0,0.8)",
    fontSize: 60,
    quoteCategory: "可愛",
    aiPromptSuffix: "in Disney animation movie style, magical sparklings, vibrant colors, kingdom scenery, 3d render style, cinematic lighting, 8k"
  },
  {
    id: "classic",
    name: "經典花語",
    bgUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=150&q=80",
    layoutType: "full",
    fontFamily: "'Noto Serif TC', serif",
    textColor: "#ffffff",
    overlayColor: "rgba(0,0,0,0.2)",
    textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
    fontSize: 48,
    quoteCategory: "經典"
  },
  {
    id: "zen",
    name: "山水禪意",
    bgUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    thumb: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80",
    layoutType: "full",
    fontFamily: "'Noto Serif TC', serif",
    textColor: "#333333",
    overlayColor: "transparent",
    textShadow: "none",
    fontSize: 42,
    quoteCategory: "禪意",
    filter: "brightness(1.1) contrast(0.9) grayscale(0.2)"
  }
];
