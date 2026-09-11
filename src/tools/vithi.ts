import { settings } from "../state.js";
import { t } from "../i18n.js";
import { registerToolModule } from "./tools.js";

interface VithiStep {
  id: string;
  label: string;
  labelEn: string;
  labelPt: string;
  abbrev: string;
  type: string;
  color: string;
  count: number;
}

interface Door {
  id: string;
  label: string;
  labelEn: string;
  labelPt: string;
  icon: string;
  sequence: VithiStep[];
}

interface CittaInfo {
  cetasikas: string[];
  cetasikaCount: number;
}

interface VithiData {
  doors: Door[];
  cittaInfo: Record<string, CittaInfo>;
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function initVithi(container: HTMLElement): void {
  container.innerHTML = `<div class="mm-loading">${t("srsLoading", settings.uiLang)}</div>`;

  Promise.all([
    fetch("data/tools/vithi.json").then((r) => r.json()),
    fetch("data/tools/citta_cetasika.json").then((r) => r.json())
  ]).then(([data, cetData]: [VithiData, any]) => {
      const lang = settings.translationLang;
      container.innerHTML = "";

      // Create cetasika lookup dictionary
      const cetLookup: Record<string, any> = {};
      if (cetData && cetData.cetasikas) {
        for (const c of cetData.cetasikas) {
          const key = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          cetLookup[key] = c;
        }
      }

      // Door selector
      const doorBar = document.createElement("div");
      doorBar.className = "vithi-doors";
      container.appendChild(doorBar);

      // Sequence display
      const seqWrap = document.createElement("div");
      seqWrap.className = "vithi-seq-wrap";
      container.appendChild(seqWrap);

      // Info panel
      const infoPanel = document.createElement("div");
      infoPanel.className = "vithi-info";
      container.appendChild(infoPanel);

      // Controls
      const controls = document.createElement("div");
      controls.className = "vithi-controls";
      controls.innerHTML = `
        <button class="vithi-btn" id="vithi-play">▶ ${t("toolVithiPlay", settings.uiLang)}</button>
        <button class="vithi-btn" id="vithi-pause" style="display:none">⏸ ${t("toolVithiPause", settings.uiLang)}</button>
        <button class="vithi-btn" id="vithi-reset">⟲ Reset</button>
        <label class="vithi-speed-label">${t("toolVithiSpeed", settings.uiLang)}
          <input type="range" id="vithi-speed" min="1" max="10" value="5" />
        </label>
      `;
      container.appendChild(controls);

      let currentDoor: Door = data.doors[0]!;
      let animIndex = -1;
      let animTimer: number | null = null;
      let playing = false;

      // Build door buttons
      for (const door of data.doors) {
        const btn = document.createElement("button");
        btn.className = "vithi-door-btn";
        btn.dataset.door = door.id;
        btn.innerHTML = `${door.icon} ${lang === "pt" && door.labelPt ? door.labelPt : door.labelEn}`;
        btn.addEventListener("click", () => selectDoor(door));
        doorBar.appendChild(btn);
      }

      function selectDoor(door: Door): void {
        currentDoor = door;
        stopAnim();
        animIndex = -1;
        renderSequence();
        doorBar.querySelectorAll<HTMLElement>(".vithi-door-btn").forEach((b) => {
          b.classList.toggle("active", b.dataset.door === door.id);
        });
      }

      function renderSequence(): void {
        // Expand steps with count > 1
        const expanded: { step: VithiStep; idx: number }[] = [];
        let idx = 0;
        for (const step of currentDoor.sequence) {
          for (let c = 0; c < step.count; c++) {
            expanded.push({ step, idx: idx++ });
          }
        }

        seqWrap.innerHTML = "";
        const strip = document.createElement("div");
        strip.className = "vithi-strip";

        for (const { step, idx: i } of expanded) {
          const box = document.createElement("div");
          box.className = `vithi-box ${i === animIndex ? "vithi-active" : ""}`;
          box.style.borderColor = step.color;
          if (i === animIndex) box.style.backgroundColor = step.color + "33";
          
          const labelTrans = lang === "pt" && step.labelPt ? step.labelPt : step.labelEn;
          box.innerHTML = `
            <div class="vithi-abbrev" style="color:${step.color}">${escHtml(step.abbrev)}</div>
            <div class="vithi-label">${escHtml(step.label)}</div>
            <div class="vithi-trans">${escHtml(labelTrans)}</div>
          `;
          box.addEventListener("click", () => showInfo(step));
          strip.appendChild(box);

          // Arrow between boxes
          if (i < expanded.length - 1) {
            const arrow = document.createElement("span");
            arrow.className = "vithi-arrow";
            arrow.textContent = "→";
            strip.appendChild(arrow);
          }
        }

        seqWrap.appendChild(strip);

        // Auto-scroll to active box
        if (animIndex >= 0) {
          const activeBox = strip.querySelector('.vithi-active');
          if (activeBox) {
            activeBox.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      }

      function showInfo(step: VithiStep): void {
        const info = data.cittaInfo?.[step.id];
        const label = lang === "pt" && step.labelPt ? step.labelPt : step.labelEn;
        let html = `<h4>${escHtml(step.label)}</h4><p>${escHtml(label)}</p>`;
        if (info) {
          html += `<p class="vithi-cetasika-count">${info.cetasikaCount} cetasikas</p>`;
          html += `<div class="vithi-cetasika-list">${info.cetasikas.map((cName: string) => {
            const cet = cetLookup[cName.toLowerCase()];
            const pali = cet ? cet.name : cName;
            const trans = cet ? (lang === "pt" ? cet.namePt : cet.nameEn) : "";
            if (trans) {
              return '<span class="vithi-cetasika-tag">' +
                '<span class="cet-tag-pali">' + escHtml(pali) + '</span>' +
                '<span class="cet-tag-trans">' + escHtml(trans) + '</span>' +
              '</span>';
            }
            return '<span class="vithi-cetasika-tag cet-tag-pali">' + escHtml(pali) + '</span>';
          }).join(" ")}</div>`;
        }
        infoPanel.innerHTML = html;
      }

      function stepForward(): void {
        const total = currentDoor.sequence.reduce((s, st) => s + st.count, 0);
        animIndex++;
        if (animIndex >= total) {
          stopAnim();
          return;
        }
        renderSequence();
        // Show info for current step
        let cumulative = 0;
        for (const step of currentDoor.sequence) {
          cumulative += step.count;
          if (animIndex < cumulative) {
            showInfo(step);
            break;
          }
        }
      }

      function startAnim(): void {
        if (playing) return;
        playing = true;
        const playBtn = container.querySelector("#vithi-play") as HTMLElement;
        const pauseBtn = container.querySelector("#vithi-pause") as HTMLElement;
        playBtn.style.display = "none";
        pauseBtn.style.display = "";
        const speed = parseInt((container.querySelector("#vithi-speed") as HTMLInputElement).value, 10);
        const ms = 1200 - speed * 100;
        animTimer = window.setInterval(stepForward, ms);
      }

      function stopAnim(): void {
        playing = false;
        if (animTimer !== null) {
          clearInterval(animTimer);
          animTimer = null;
        }
        const playBtn = container.querySelector("#vithi-play") as HTMLElement;
        const pauseBtn = container.querySelector("#vithi-pause") as HTMLElement;
        if (playBtn) playBtn.style.display = "";
        if (pauseBtn) pauseBtn.style.display = "none";
      }

      container.querySelector("#vithi-play")!.addEventListener("click", startAnim);
      container.querySelector("#vithi-pause")!.addEventListener("click", stopAnim);
      container.querySelector("#vithi-reset")!.addEventListener("click", () => {
        stopAnim();
        animIndex = -1;
        renderSequence();
        infoPanel.innerHTML = "";
      });

      // Init
      selectDoor(data.doors[0]!);
    })
    .catch(() => {
      container.innerHTML = `<div class="mm-loading">${t("srsNoData", settings.uiLang)}</div>`;
    });
}

registerToolModule("vithi", initVithi);
