import { expect, test, vi } from "vitest";
import { chooseOrbRenderer, createFpsGuard } from "@/lib/orb-capability";

test("shader só com WebGL, sem reduzir movimento e sem economia de dados", () => {
  expect(chooseOrbRenderer({ webgl: true, reducedMotion: false, saveData: false })).toBe("shader");
  expect(chooseOrbRenderer({ webgl: false, reducedMotion: false, saveData: false })).toBe("css");
  expect(chooseOrbRenderer({ webgl: true, reducedMotion: true, saveData: false })).toBe("css");
  expect(chooseOrbRenderer({ webgl: true, reducedMotion: false, saveData: true })).toBe("css");
});

/** Quadros a `fps` por `ms` milissegundos, a partir de `start`. Devolve o instante final. */
function run(guard: { tick(now: number): void }, fps: number, ms: number, start = 0) {
  const step = 1000 / fps;
  let t = start;
  for (; t <= start + ms; t += step) guard.tick(t);
  return t;
}

test("guarda de fps: 2 s a 30 fps (mínimo 40) falha uma vez", () => {
  const onFail = vi.fn();
  run(createFpsGuard({ minFps: 40, windowMs: 2000, onFail }), 30, 2200);
  expect(onFail).toHaveBeenCalledTimes(1);
});

test("guarda de fps: 60 fps estáveis nunca falha", () => {
  const onFail = vi.fn();
  run(createFpsGuard({ minFps: 40, windowMs: 2000, onFail }), 60, 6000);
  expect(onFail).not.toHaveBeenCalled();
});

test("guarda de fps: depois de falhar, não chama de novo", () => {
  const onFail = vi.fn();
  const guard = createFpsGuard({ minFps: 40, windowMs: 2000, onFail });
  const end = run(guard, 30, 2200);
  run(guard, 20, 4000, end);
  expect(onFail).toHaveBeenCalledTimes(1);
});

test("guarda de fps: não julga antes de completar a janela", () => {
  const onFail = vi.fn();
  run(createFpsGuard({ minFps: 40, windowMs: 2000, onFail }), 10, 1500);
  expect(onFail).not.toHaveBeenCalled();
});

test("guarda de fps: reset descarta a medição (ex.: aba voltou do segundo plano)", () => {
  const onFail = vi.fn();
  const guard = createFpsGuard({ minFps: 40, windowMs: 2000, onFail });
  run(guard, 30, 1800);
  guard.reset();
  run(guard, 60, 2500, 10_000);
  expect(onFail).not.toHaveBeenCalled();
});

test("guarda de fps: janela boa reinicia a medição e a seguinte, ruim, falha", () => {
  const onFail = vi.fn();
  const guard = createFpsGuard({ minFps: 40, windowMs: 2000, onFail });
  const end = run(guard, 60, 2100);
  expect(onFail).not.toHaveBeenCalled();
  run(guard, 30, 2200, end);
  expect(onFail).toHaveBeenCalledTimes(1);
});
