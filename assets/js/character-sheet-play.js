// Bathys temporary play controls v1 - memory only; no storage, network, or source writes.
(() => {
  "use strict";
  const root = document.querySelector(".cs2024");
  const status = document.getElementById("cs-play-status");
  if (!root || !status) return;
  const original = root.innerHTML;
  const limit = Number.MAX_SAFE_INTEGER;
  const units = [
    { code: "PP", name: "Platinum", factor: 1000, decimals: 3 },
    { code: "GP", name: "Gold", factor: 100, decimals: 2 },
    { code: "SP", name: "Silver", factor: 10, decimals: 1 },
    { code: "CP", name: "Copper", factor: 1, decimals: 0 },
  ];
  const bindings = [];
  let state;
  const report = (message, error = false) => {
    status.textContent = message;
    status.setAttribute("role", error ? "alert" : "status");
  };
  const integer = (value, min = 0, max = limit) => {
    if (!Number.isSafeInteger(value) || value < min || value > max) throw new Error(`Enter a whole number from ${min} to ${max}.`);
    return value;
  };
  const parseInteger = (text, signed = false) => {
    if (!(signed ? /^[+-]?\d+$/ : /^\d+$/).test(text.trim())) throw new Error("Enter a valid whole number.");
    return integer(Number(text.trim()), signed ? -limit : 0);
  };
  const maximumHP = s => {
    integer(s.hpBase, 1); integer(s.hpAid, 0, 40); integer(s.hpManual, -limit);
    if (s.hpAid % 5) throw new Error("Aid must be a multiple of 5.");
    const max = BigInt(s.hpBase) + BigInt(s.hpAid) + BigInt(s.hpManual);
    if (max < 1n || max > BigInt(limit)) throw new Error("Effective maximum HP must be positive and within safe limits.");
    return Number(max);
  };
  const validate = s => {
    if (s.version !== 1 || typeof s.inspiration !== "boolean") throw new Error("Unsupported play-state snapshot.");
    const max = maximumHP(s);
    integer(s.currencyCP); integer(s.leaderTemp);
    if (!Array.isArray(s.resources)) throw new Error("Missing resource snapshot.");
    const keys = new Set();
    for (const r of s.resources) {
      if (!/^[a-z0-9_]+$/.test(r.key) || keys.has(r.key) || typeof r.label !== "string") throw new Error("Invalid resource identity.");
      keys.add(r.key);
      if (r.maximum !== null) integer(r.maximum);
      integer(r.current, 0, r.maximum ?? limit);
    }
    if (resource(s, "current_hp").maximum !== max || resource(s, "temp_hp").maximum !== null) throw new Error("Inconsistent HP snapshot.");
  };
  const resource = (s, key) => {
    const result = s.resources.find(r => r.key === key);
    if (!result) throw new Error(`Missing resource: ${key}.`);
    return result;
  };
  const currencyText = (total, unit) => {
    const cp = BigInt(total), factor = BigInt(unit.factor);
    const whole = (cp / factor).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const fraction = (cp % factor).toString().padStart(unit.decimals, "0").replace(/0+$/, "");
    return whole + (fraction ? `.${fraction}` : "");
  };
  const parseCurrency = (text, unit) => {
    const match = text.trim().match(/^(\d+)(?:\.(\d+))?$/);
    if (!match || text.length > 64) throw new Error("Enter a nonnegative balance without commas.");
    const fraction = (match[2] ?? "").replace(/0+$/, "");
    if (fraction.length > unit.decimals) throw new Error("The smallest supported amount is one Copper.");
    const cp = BigInt(match[1]) * BigInt(unit.factor) + BigInt(fraction.padEnd(unit.decimals, "0") || "0");
    if (cp > BigInt(limit)) throw new Error("Balance exceeds safe limits.");
    return Number(cp);
  };
  const element = (parent, tag, text, className) => {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    parent.append(el);
    return el;
  };
  const mount = key => {
    const el = root.querySelector(`[data-cs-interactive="${key}"]`);
    if (!el) throw new Error(`Missing control area: ${key}.`);
    return el;
  };
  const button = (parent, text, label, action) => {
    const el = element(parent, "button", text);
    el.type = "button"; el.setAttribute("aria-label", label); el.title = label;
    el.addEventListener("click", action);
    return el;
  };
  const input = (parent, label, value, signed = false) => {
    const field = element(parent, "label", label);
    const el = element(field, "input");
    el.type = "text"; el.inputMode = signed ? "text" : "numeric";
    el.value = String(value); el.autocomplete = "off";
    el.setAttribute("aria-label", label);
    return el;
  };
  const update = () => { for (const render of bindings) render(); };
  const change = (action, message) => {
    try {
      const next = structuredClone(state);
      action(next); validate(next); state = next; update();
      report(`${message} Temporary only; refresh resets all changes.`);
    } catch (error) {
      report(error.message, true);
    }
  };
  const adjustMaximum = (s, aid, manual) => {
    const previousAid = s.hpAid;
    s.hpAid = aid; s.hpManual = manual;
    const hp = resource(s, "current_hp"), max = maximumHP(s);
    const increased = BigInt(hp.current) + BigInt(Math.max(0, aid - previousAid));
    hp.current = Number(increased > BigInt(max) ? BigInt(max) : increased);
    hp.maximum = max;
  };
  try {
    state = JSON.parse(document.getElementById("cs-play-state").textContent);
    validate(state);
    root.classList.add("cs-temporary-play");
    const targets = [...root.querySelectorAll("[data-cs-control]")];
    if (targets.length !== state.resources.length) throw new Error("Resource controls do not match the snapshot.");
    for (const r of state.resources) {
      const matches = targets.filter(el => el.dataset.csControl === r.key);
      if (matches.length !== 1) throw new Error(`Missing or duplicate resource display: ${r.label}.`);
      const target = matches[0];
      target.replaceChildren();
      const stepper = element(target, "div", undefined, "trial-resource-stepper");
      const down = button(stepper, "-", `Decrease ${r.label}`, () => change(s => { resource(s, r.key).current--; }, `${r.label} decreased.`));
      const value = element(stepper, "output");
      value.setAttribute("aria-label", r.label);
      const up = button(stepper, "+", `Increase ${r.label}`, () => change(s => { resource(s, r.key).current++; }, `${r.label} increased.`));
      bindings.push(() => {
        const current = resource(state, r.key);
        value.textContent = `${current.current}${current.maximum === null ? "" : ` / ${current.maximum}`}`;
        down.disabled = current.current === 0; up.disabled = current.current === (current.maximum ?? limit);
      });
    }
    const inspiration = button(mount("inspiration"), "", "Heroic Inspiration", () => change(s => { s.inspiration = !s.inspiration; }, "Heroic Inspiration updated."));
    inspiration.classList.add("cs-inspiration-button");
    bindings.push(() => {
      inspiration.textContent = state.inspiration ? "Use Inspiration" : "Gain Inspiration";
      inspiration.setAttribute("aria-pressed", String(state.inspiration));
      root.querySelector(".cs-inspiration-field strong").textContent = state.inspiration ? "Available" : "Not available";
    });
    const health = element(mount("health"), "div", undefined, "trial-hp-controls");
    const amount = input(health, "Amount", 0);
    button(health, "Damage", "Apply damage, using Temp HP first", () => change(s => {
      const damage = parseInteger(amount.value), temp = resource(s, "temp_hp"), hp = resource(s, "current_hp");
      const absorbed = Math.min(temp.current, damage);
      temp.current -= absorbed; hp.current = Math.max(0, hp.current - (damage - absorbed));
    }, "Damage applied."));
    button(health, "Heal", "Heal current HP up to its maximum", () => change(s => {
      const healing = parseInteger(amount.value), hp = resource(s, "current_hp");
      hp.current += Math.min(healing, hp.maximum - hp.current);
    }, "Healing applied."));
    const grantTemp = (s, value) => { const temp = resource(s, "temp_hp"); temp.current = Math.max(temp.current, value); };
    button(health, "Temp HP", "Grant Temp HP without stacking", () => change(s => grantTemp(s, parseInteger(amount.value)), "Temp HP granted."));
    button(health, `Inspiring Leader: ${state.leaderTemp} Temp HP`, "Grant your Inspiring Leader Temp HP; adjust its reminder separately", () => change(s => grantTemp(s, s.leaderTemp), "Inspiring Leader Temp HP granted to you only."));
    element(health, "small", "Manual effects: slots, free casts, reminders and consumables are independent. No automatic rolls, rests or companion effects.");
    const adjustment = element(health, "details", undefined, "trial-hp-adjustments");
    const summary = element(adjustment, "summary", "Maximum HP");
    const aidRow = element(adjustment, "div", undefined, "trial-hp-adjustment-row");
    const aidLabel = element(aidRow, "label", "Effective Aid");
    const aid = element(aidLabel, "select"); aid.setAttribute("aria-label", "Effective Aid");
    for (const level of [0, 2, 3, 4, 5, 6, 7, 8, 9]) {
      const option = element(aid, "option", level ? `Level ${level}: +${5 * (level - 1)} HP` : "No Aid");
      option.value = String(level);
    }
    aid.value = String(state.hpAid ? state.hpAid / 5 + 1 : 0);
    button(aidRow, "Apply / Update Aid", "Apply or update the effective Aid bonus", () => change(s => {
      const level = parseInteger(aid.value);
      if (level !== 0 && (level < 2 || level > 9)) throw new Error("Aid requires a slot level from 2 to 9.");
      adjustMaximum(s, level ? 5 * (level - 1) : 0, s.hpManual);
    }, "Effective Aid updated."));
    button(aidRow, "End Aid", "End Aid and clamp current HP only if above the new maximum", () => {
      change(s => adjustMaximum(s, 0, s.hpManual), "Aid ended.");
      aid.value = String(state.hpAid ? state.hpAid / 5 + 1 : 0);
    });
    const manualRow = element(adjustment, "div", undefined, "trial-hp-adjustment-row");
    const manual = input(manualRow, "Manual maximum adjustment", state.hpManual, true);
    button(manualRow, "Set adjustment", "Set manual maximum HP adjustment", () => change(s => adjustMaximum(s, s.hpAid, parseInteger(manual.value, true)), "Manual maximum HP updated."));
    element(adjustment, "p", "Aid lasts 8 hours; end it manually. Record one effective bonus, not stacked castings. Increasing Aid adds only the bonus increase to current HP. Ending/lowering Aid or changing the manual modifier only clamps current HP if above the new maximum. This is the sheet's tracker convention. No slots or companion HP are changed.");
    bindings.push(() => {
      const sign = state.hpManual >= 0 ? "+" : "";
      const text = `Maximum HP: ${maximumHP(state)} = base ${state.hpBase} + Aid ${state.hpAid} + manual ${sign}${state.hpManual}`;
      summary.textContent = text;
      root.querySelector(".cs-hp-breakdown").textContent = text;
    });
    const currency = mount("currency"); currency.replaceChildren();
    const grid = element(currency, "div", undefined, "trial-currency-grid");
    const edit = element(currency, "details", undefined, "cs-print-hide");
    element(edit, "summary", "Set total balance");
    const editors = element(edit, "div", undefined, "trial-currency-grid");
    for (const unit of units) {
      const cell = element(grid, "div", undefined, "trial-currency-cell");
      element(cell, "span", `${unit.name} (${unit.code})`);
      const value = element(cell, "output"); value.tabIndex = 0;
      const scroll = element(cell, "div", undefined, "trial-currency-scroll");
      scroll.tabIndex = 0; scroll.setAttribute("role", "group");
      scroll.setAttribute("aria-label", `${unit.name} adjustment controls; scroll horizontally on narrow panes`);
      const buttons = element(scroll, "div", undefined, "trial-currency-buttons");
      const increments = [];
      for (const step of [-1, 1]) {
        const delta = step * unit.factor;
        const control = button(buttons, `${step > 0 ? "+" : ""}${step}`, `${step < 0 ? "Spend" : "Add"} ${Math.abs(step)} ${unit.code}`, () => change(s => {
          if (delta < 0 ? s.currencyCP < -delta : limit - s.currencyCP < delta) throw new Error("The full increment exceeds balance limits.");
          s.currencyCP += delta;
        }, `${unit.code} balance adjusted.`));
        increments.push({ control, delta });
      }
      const editor = element(editors, "div", undefined, "trial-currency-cell");
      const balance = input(editor, `Total balance in ${unit.code}`, currencyText(state.currencyCP, unit).replaceAll(",", ""));
      balance.inputMode = "decimal"; balance.classList.add("trial-currency-input");
      button(editor, "Set", `Set total balance in ${unit.code}`, () => change(s => { s.currencyCP = parseCurrency(balance.value, unit); }, `${unit.code} total balance set.`));
      let saved = state.currencyCP;
      bindings.push(() => {
        value.textContent = currencyText(state.currencyCP, unit);
        for (const { control, delta } of increments) control.disabled = delta < 0 ? state.currencyCP < -delta : limit - state.currencyCP < delta;
        if (saved !== state.currencyCP) {
          balance.value = currencyText(state.currencyCP, unit).replaceAll(",", "");
          saved = state.currencyCP;
        }
      });
    }
    update();
    report("Temporary play mode ready. Changes reset on refresh; nothing is saved or synced.");
    // A back/forward-cache restoration is not a reload and retains this tab's live values.
    window.addEventListener("pageshow", event => {
      if (event.persisted) report("Temporary play resumed in this tab. Refresh to reset to the published snapshot.");
    });
  } catch (error) {
    root.innerHTML = original;
    report(`Temporary controls unavailable: ${error.message} The published snapshot is still readable.`, true);
  }
})();
