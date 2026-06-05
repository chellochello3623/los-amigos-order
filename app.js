
import { useState } from "react";

const LOCATIONS = ["Brookline", "Newton", "West Roxbury", "Brighton", "Somerville"];

const PRODUCTS = [
  { code: "650", desc: "APPLE RED DEL 88ct USA", unit: "lbs" },
  { code: "640", desc: "AVOCADO 48ct *RIPE*", unit: "case" },
  { code: "2220", desc: "AVOCADO 60ct", unit: "case" },
  { code: "87062", desc: "BEAN BLACK *DRIED* 50# BAG", unit: "case" },
  { code: "87069", desc: "BEANS PINTO *DRIED* 50# BAG", unit: "case" },
  { code: "365", desc: "BROCCOLI CROWN 20# USA", unit: "case" },
  { code: "101", desc: "CABBAGE GREEN *BAG* USA", unit: "case" },
  { code: "8754", desc: "CILANTRO *BULK* 60ct", unit: "case" },
  { code: "1801", desc: "CILANTRO **JJ LOOP** CLEAN 30#", unit: "case" },
  { code: "400", desc: "EGGPLANT 20# USA", unit: "lbs" },
  { code: "455", desc: "GARLIC PEELED 4x5#", unit: "case" },
  { code: "127", desc: "JALAPENO *BUSHEL*", unit: "case" },
  { code: "748", desc: "LEMON JUICE QUART 16/32oz", unit: "case" },
  { code: "220", desc: "LETTUCE ROMAINE 24ct USA", unit: "case" },
  { code: "230", desc: "LETTUCE ROMAINE *HEART* 12/3ct", unit: "case" },
  { code: "9841", desc: "LETTUCE ROMAINE HRT 48ct LOOSE", unit: "case" },
  { code: "215", desc: "LETTUCE ICEBURG 24ct *LINER*", unit: "case" },
  { code: "746", desc: "LIME BUSHEL 200ct *VERDE* MEX", unit: "case" },
  { code: "805", desc: "MANGO 7/10ct MEX", unit: "case" },
  { code: "803", desc: "MILK GALLON WHOLE (4ct)", unit: "case" },
  { code: "600", desc: "ONION RED JUMBO 25# USA", unit: "case" },
  { code: "590", desc: "ONION SPANISH 50# USA", unit: "case" },
  { code: "405", desc: "PEPPER GREEN LG 25# USA", unit: "case" },
  { code: "446", desc: "PEPPER HABANERO 8#", unit: "case" },
  { code: "247", desc: "PEPPER POBLANO 10# USA", unit: "case" },
  { code: "437", desc: "PEPPER RED 25#", unit: "case" },
  { code: "407", desc: "PEPPER RED *HOLLAND* 11#", unit: "case" },
  { code: "449", desc: "PEPPER SERANO 10# USA", unit: "case" },
  { code: "9130", desc: "PEPPER SERANO *BUSHEL*", unit: "case" },
  { code: "415", desc: "PEPPER SUNTAN 20# USA", unit: "case" },
  { code: "1618", desc: "RICE LONGGRAIN 4% RICELAND 50#", unit: "case" },
  { code: "345", desc: "SCALLIONS 48ct ICELESS USA", unit: "case" },
  { code: "270", desc: "SPINACH BABY 4# USA", unit: "case" },
  { code: "992", desc: "SPINACH POPEYE 4/2.5# USA", unit: "case" },
  { code: "2349", desc: "SPINACH SAVOY *BUNCHED*", unit: "case" },
  { code: "610", desc: "TOMATO 5X6 25# USA", unit: "case" },
  { code: "901", desc: "SPECK TOMATOES 20# 4x5 2 layer", unit: "case" },
  { code: "625", desc: "TOMATO PLUM 25# MEX", unit: "case" },
  { code: "9741", desc: "TOMATILLO BUSHELL 35# avg", unit: "case" },
  { code: "4702", desc: "TORTILLA WHITE CORN 6\"", unit: "case" },
  { code: "6600", desc: "YELLOW SQUASH *BUSHEL*", unit: "case" },
  { code: "385", desc: "YELLOW SQUASH 20# USA", unit: "case" },
  { code: "395", desc: "ZUCCHINI SQUASH 20# USA", unit: "case" },
  { code: "5302", desc: "ZUCCHINI SQUASH *BUSHEL*", unit: "case" },
  { code: "347", desc: "HIBISCUS PETALS *DRIED* 5# BAG", unit: "case" },
];

const YOUR_PHONE = "6175939180";

export default function LosAmigosOrder() {
  const initOrders = () => {
    const o = {};
    LOCATIONS.forEach(loc => {
      o[loc] = {};
      PRODUCTS.forEach(p => { o[loc][p.code] = ""; });
    });
    return o;
  };

  const [orders, setOrders] = useState(initOrders);
  const [activeTab, setActiveTab] = useState(LOCATIONS[0]);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");

  const handleQty = (loc, code, val) => {
    setOrders(prev => ({
      ...prev,
      [loc]: { ...prev[loc], [code]: val }
    }));
  };

  const copyFromPrev = () => {
    const idx = LOCATIONS.indexOf(activeTab);
    if (idx === 0) return;
    const prevLoc = LOCATIONS[idx - 1];
    setOrders(prev => ({
      ...prev,
      [activeTab]: { ...prev[prevLoc] }
    }));
  };

  const clearLocation = () => {
    setOrders(prev => {
      const cleared = {};
      PRODUCTS.forEach(p => { cleared[p.code] = ""; });
      return { ...prev, [activeTab]: cleared };
    });
  };

  const locationHasItems = (loc) =>
    PRODUCTS.some(p => orders[loc][p.code] && orders[loc][p.code] !== "0");

  const totalItemsOrdered = () =>
    LOCATIONS.reduce((sum, loc) =>
      sum + PRODUCTS.filter(p => orders[loc][p.code] && orders[loc][p.code] !== "0").length, 0);

  const buildSMS = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    let msg = `📦 LOS AMIGOS ORDER — ${today}\n`;
    msg += `────────────────────\n`;

    LOCATIONS.forEach(loc => {
      const items = PRODUCTS.filter(p => orders[loc][p.code] && orders[loc][p.code] !== "0");
      if (items.length === 0) return;
      msg += `\n📍 ${loc.toUpperCase()}\n`;
      items.forEach(p => {
        msg += `  [${p.code}] ${p.desc} — ${orders[loc][p.code]} ${p.unit}\n`;
      });
    });

    if (notes.trim()) {
      msg += `\n────────────────────\n📝 NOTES: ${notes.trim()}`;
    }

    return encodeURIComponent(msg);
  };

  const handleSend = () => {
    if (totalItemsOrdered() === 0) return;
    const sms = buildSMS();
    window.open(`sms:${YOUR_PHONE}&body=${sms}`, "_blank");
    setSubmitted(true);
  };

  const handleReset = () => {
    setOrders(initOrders());
    setNotes("");
    setSubmitted(false);
    setActiveTab(LOCATIONS[0]);
    setSearch("");
  };

  const filtered = PRODUCTS.filter(p =>
    p.desc.toLowerCase().includes(search.toLowerCase()) ||
    p.code.includes(search)
  );

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>Order Sent!</h2>
          <p style={styles.successSub}>Your text message app should have opened with the full order ready to send to Holden.</p>
          <button style={styles.resetBtn} onClick={handleReset}>Start New Order</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <div style={styles.brandLabel}>HOLDEN FRUIT & PRODUCE</div>
            <h1 style={styles.title}>Los Amigos <span style={styles.titleAccent}>Order Form</span></h1>
          </div>
          <div style={styles.badge}>{totalItemsOrdered()} items</div>
        </div>

        {/* Location tabs */}
        <div style={styles.tabRow}>
          {LOCATIONS.map(loc => (
            <button
              key={loc}
              style={{ ...styles.tab, ...(activeTab === loc ? styles.tabActive : {}) }}
              onClick={() => setActiveTab(loc)}
            >
              {loc}
              {locationHasItems(loc) && <span style={styles.tabDot} />}
            </button>
          ))}
        </div>
      </div>

      {/* Location controls */}
      <div style={styles.locBar}>
        <span style={styles.locTitle}>📍 {activeTab}</span>
        <div style={styles.locActions}>
          {LOCATIONS.indexOf(activeTab) > 0 && (
            <button style={styles.ghostBtn} onClick={copyFromPrev}>
              Copy from {LOCATIONS[LOCATIONS.indexOf(activeTab) - 1]}
            </button>
          )}
          <button style={styles.ghostBtn} onClick={clearLocation}>Clear</button>
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <input
          style={styles.searchInput}
          placeholder="Search product or code..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Product list */}
      <div style={styles.productList}>
        {filtered.map((p, i) => {
          const val = orders[activeTab][p.code];
          const hasVal = val && val !== "0";
          return (
            <div key={p.code} style={{ ...styles.productRow, ...(hasVal ? styles.productRowActive : {}), animationDelay: `${i * 0.02}s` }}>
              <div style={styles.productInfo}>
                <span style={styles.productCode}>{p.code}</span>
                <span style={styles.productDesc}>{p.desc}</span>
                <span style={styles.productUnit}>{p.unit}</span>
              </div>
              <select
                value={val || ""}
                onChange={e => handleQty(activeTab, p.code, e.target.value)}
                style={{ ...styles.qtyInput, ...(hasVal ? styles.qtyInputActive : {}) }}
              >
                <option value="">—</option>
                {[1,2,3,4,5,6,7,8,9].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div style={styles.notesWrap}>
        <label style={styles.notesLabel}>Order Notes (optional)</label>
        <textarea
          style={styles.notesInput}
          placeholder="Delivery instructions, substitutions, urgent items..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {/* Summary footer */}
      <div style={styles.footer}>
        <div style={styles.footerSummary}>
          {LOCATIONS.map(loc => locationHasItems(loc) && (
            <span key={loc} style={styles.footerTag}>{loc}</span>
          ))}
        </div>
        <button
          style={{ ...styles.sendBtn, ...(totalItemsOrdered() === 0 ? styles.sendBtnDisabled : {}) }}
          onClick={handleSend}
          disabled={totalItemsOrdered() === 0}
        >
          📱 Send Order via Text
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f0f0f",
    color: "#f0ece4",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    paddingBottom: 120,
  },
  header: {
    background: "linear-gradient(135deg, #1a1a1a 0%, #0f1a0f 100%)",
    borderBottom: "1px solid #2a3a2a",
    padding: "20px 16px 0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  brandLabel: {
    fontSize: 10,
    letterSpacing: "0.2em",
    color: "#5a8a5a",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 0,
    color: "#f0ece4",
    lineHeight: 1.2,
  },
  titleAccent: {
    color: "#7ab87a",
    fontStyle: "italic",
  },
  badge: {
    background: "#2d5a2d",
    color: "#a8d4a8",
    fontSize: 12,
    fontFamily: "monospace",
    padding: "4px 10px",
    borderRadius: 20,
    border: "1px solid #3d7a3d",
    minWidth: 60,
    textAlign: "center",
  },
  tabRow: {
    display: "flex",
    gap: 4,
    overflowX: "auto",
    paddingBottom: 0,
  },
  tab: {
    padding: "8px 14px",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    color: "#888",
    fontSize: 13,
    fontFamily: "'Georgia', serif",
    cursor: "pointer",
    whiteSpace: "nowrap",
    position: "relative",
    transition: "all 0.15s",
  },
  tabActive: {
    color: "#7ab87a",
    borderBottomColor: "#7ab87a",
  },
  tabDot: {
    display: "inline-block",
    width: 5,
    height: 5,
    background: "#7ab87a",
    borderRadius: "50%",
    position: "absolute",
    top: 6,
    right: 4,
  },
  locBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    background: "#161616",
    borderBottom: "1px solid #222",
  },
  locTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#c8e8c8",
  },
  locActions: {
    display: "flex",
    gap: 8,
  },
  ghostBtn: {
    background: "transparent",
    border: "1px solid #333",
    color: "#888",
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 4,
    cursor: "pointer",
    fontFamily: "monospace",
  },
  searchWrap: {
    padding: "10px 16px",
    background: "#111",
    borderBottom: "1px solid #1e1e1e",
  },
  searchInput: {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    padding: "8px 12px",
    color: "#f0ece4",
    fontSize: 13,
    fontFamily: "'Georgia', serif",
    boxSizing: "border-box",
    outline: "none",
  },
  productList: {
    padding: "8px 0",
  },
  productRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    borderBottom: "1px solid #1a1a1a",
    transition: "background 0.15s",
    animation: "fadeIn 0.3s ease both",
  },
  productRowActive: {
    background: "#0d1f0d",
    borderLeft: "3px solid #5a9a5a",
    paddingLeft: 13,
  },
  productInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginRight: 12,
  },
  productCode: {
    fontSize: 10,
    color: "#5a8a5a",
    fontFamily: "monospace",
    letterSpacing: "0.05em",
  },
  productDesc: {
    fontSize: 13,
    color: "#e0dcd4",
    lineHeight: 1.3,
  },
  productUnit: {
    fontSize: 10,
    color: "#666",
    fontStyle: "italic",
  },
  qtyInput: {
    width: 64,
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    padding: "7px 6px",
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "monospace",
    outline: "none",
    flexShrink: 0,
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
  },
  qtyInputActive: {
    background: "#1a2e1a",
    border: "1px solid #4a8a4a",
    color: "#a8d4a8",
  },
  notesWrap: {
    padding: "16px",
    borderTop: "1px solid #1e1e1e",
  },
  notesLabel: {
    fontSize: 11,
    color: "#666",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: 8,
  },
  notesInput: {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    borderRadius: 6,
    padding: "10px 12px",
    color: "#f0ece4",
    fontSize: 13,
    fontFamily: "'Georgia', serif",
    resize: "none",
    outline: "none",
    boxSizing: "border-box",
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#0f0f0f",
    borderTop: "1px solid #2a3a2a",
    padding: "12px 16px",
    zIndex: 200,
  },
  footerSummary: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
    minHeight: 20,
  },
  footerTag: {
    background: "#1a2e1a",
    color: "#7ab87a",
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 10,
    border: "1px solid #2d5a2d",
  },
  sendBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #2d6a2d, #3d8a3d)",
    color: "#e8f5e8",
    border: "none",
    borderRadius: 10,
    padding: "14px",
    fontSize: 16,
    fontFamily: "'Georgia', serif",
    fontWeight: "bold",
    cursor: "pointer",
    letterSpacing: "0.03em",
  },
  sendBtnDisabled: {
    background: "#1a1a1a",
    color: "#444",
    cursor: "not-allowed",
  },
  successCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: 32,
    textAlign: "center",
  },
  successIcon: {
    fontSize: 64,
    color: "#7ab87a",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    color: "#a8d4a8",
    margin: "0 0 12px",
  },
  successSub: {
    color: "#888",
    fontSize: 14,
    lineHeight: 1.6,
    maxWidth: 280,
    marginBottom: 32,
  },
  resetBtn: {
    background: "#1a2e1a",
    color: "#7ab87a",
    border: "1px solid #3d6a3d",
    borderRadius: 8,
    padding: "12px 28px",
    fontSize: 15,
    fontFamily: "'Georgia', serif",
    cursor: "pointer",
  },
};
