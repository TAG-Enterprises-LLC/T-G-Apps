/* Dedicated worker: public/own-private packets only. No Firebase calls. */
importScripts('canasta.js');
const moduleReady = createCanasta();
let tail = Promise.resolve();
onmessage = event => {
  const msg = event.data;
  tail = tail.then(async () => {
    let mod, input = 0, output = 0;
    try {
      mod = await moduleReady;
      input = mod._malloc(msg.input.length * 4);
      output = mod._malloc(4096 * 4);
      mod.HEAP32.set(msg.input, input / 4);
      const n = mod._cai_canasta_decide(input, msg.input.length,
        msg.seed >>> 0, msg.samples, msg.horizon, msg.millis, output, 4096);
      if (n < 0) throw Error(`Canasta decision failed (${n})`);
      const result = new Int32Array(mod.HEAP32.subarray(output / 4, output / 4 + n));
      postMessage({id: msg.id, ok: true, result}, [result.buffer]);
    } catch (error) { postMessage({id: msg.id, ok: false, error: String(error)}); }
    finally { if (input) mod._free(input); if (output) mod._free(output); }
  });
};
