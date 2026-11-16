const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const publicRoot = fs.existsSync(path.join(root, 'dist')) ? path.join(root, 'dist') : root;
const ctx = {
  matchMedia: () => ({ matches: true }), ptColors: [], rfColors: [], m72Blues: [],
  rfPointCards: () => '<shared/>', activeRoute: 'Puntos', ptFormat: String,
  ptTotal: key => key ? 0.76 : 120, recognitionDegree: () => 'Diamante',
  view: () => {}, m72PersonIcon: '<svg/>', icon: () => '<svg/>', nxEsc: String,
};
ctx.rfRing = rows => rows.map((_, i) => ctx.m72Blues[i]);
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(publicRoot, 'assets/js/desktop/points.js'), 'utf8'), ctx);
assert.equal((ctx.rfPointCards().match(/dn-stat-card"/g) || []).length, 6);
assert(ctx.rfPointCards().includes('No Calificado'));
for (const count of [2, 3, 5, 8]) {
  const colors = ctx.rfRing(Array.from({ length: count }, () => ({})));
  assert.equal(colors[0], '#0b224b'); assert.equal(colors.at(-1), '#eceef2');
}
ctx.activeRoute = 'Inicio'; assert.equal(ctx.rfPointCards(), '<shared/>');
const code = fs.readFileSync(path.join(publicRoot, 'assets/js/desktop/dashboard.js'), 'utf8');
const from = code.indexOf('rfSixMonths=function(){');
const to = code.indexOf('function dn10RefreshSummary()', from);
let months = [{ name: 'Octubre', short: 'Oct', team: 60 }, { name: 'Noviembre', short: 'Nov', team: 120 }];
const chart = { desktop: { matches: true }, dn12OriginalSix: () => '<mobile/>', m76TrendMonths: () => months, nxEsc: String, ptFormat: String };
vm.createContext(chart); vm.runInContext(code.slice(from, to), chart);
assert.equal((chart.rfSixMonths().match(/dn-points-column/g) || []).length, 2);
assert(!chart.rfSixMonths().includes('<polyline'));
months = [{ name: 'Noviembre', short: 'Nov', team: 0 }]; assert(!chart.rfSixMonths().includes('NaN'));
months = []; assert(chart.rfSixMonths().includes('Sin datos'));
chart.desktop.matches = false; assert.equal(chart.rfSixMonths(), '<mobile/>');
console.log('Point contracts passed: six cards, real values, ordered doughnut scale, monthly columns, empty/zero cases and platform isolation.');
