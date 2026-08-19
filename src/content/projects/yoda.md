---
title: "Project YODA"
blurb: "Neural Inference Accelerator co-processor for the StarCore-1 CPU — autonomously computes vector dot products in hardware at 5.2× the speed of software."
period: "May 2026"
order: 6
featured: false
role: "I designed and implemented the NIA co-processor in Verilog — the MAC datapath, control FSM, internal memory, and a three-level testbench verification stack."
domain: digital-hardware
stack:
  - "Verilog (Icarus iVerilog)"
  - "GTKWave"
  - "Yosys"
  - "Python"
  - "Make"
keyResult: "5.2× speedup over StarCore-1 software — verified across N = 1 to 128 elements at all three testbench levels against an independent Python gold standard"
hero: ../../assets/placeholders/hero-16x9.svg
heroAlt: "GTKWave waveform showing the NIA accumulator building up across a 4-element dot product, with the done signal pulsing at completion"
---

## PROBLEM

The StarCore-1 is a 16-bit single-cycle RISC processor with no hardware multiplier. A single 16-bit multiplication requires approximately 20 cycles of shift-and-add in software. Neural network inference is dominated by one operation — the dot product Σ A[i]·B[i] — which means an N-element inference pass costs **26N + 3 cycles** on the base CPU, with the processor fully occupied and unable to execute any other logic for the duration.

The EEE4120F HPES project brief required groups to evolve the StarCore-1 baseline using Amdahl's Law principles — either by extending the ISA or attaching an external co-processor. The MAC loop is the dominant bottleneck in inference workloads, making it the highest-leverage target for acceleration.

## CONSTRAINTS

- **ISA compatibility:** The StarCore-1 ISA must remain unchanged for non-ML workloads — only the reserved opcode `1010` may be used
- **Simulation only:** No physical FPGA — full verification must be achieved through iVerilog simulation and GTKWave waveform analysis
- **Modularity:** Each hardware block must be a separate `.v` file corresponding to a distinct physical unit
- **Verification:** Hardware results must match an independent software gold standard across all test vector sizes
- **Data width:** Operands are 16-bit; accumulator must be 32-bit to hold full-precision 16×16 products without overflow

## WHAT I BUILT

A fully autonomous NIA co-processor in Verilog, structured as five hardware modules wired together at the top level with no logic in the interconnect:

- **`nia_memory.v`** — 256×16-bit single-port synchronous RAM storing both vector A and vector B in separate address ranges, with a DMA write port for testbench preloading
- **`nia_mac.v`** — combinational 16×16 multiplier feeding a 32-bit accumulator register; clears on the first element of each dot product and accumulates thereafter
- **`nia_controller.v`** — 7-state FSM (`IDLE → FETCH_A → LATCH_A → FETCH_B → COMPUTE → CHECK → FINISH`) that sequences the entire dot product loop autonomously; because the RAM is single-port, A[i] is read and latched internally before B[i] is fetched, giving **5 cycles per element + 2 overhead**
- **`nia_output_reg.v`** — output latch that captures the 32-bit accumulator onto the 16-bit co-processor result bus when the FSM asserts `done`
- **`nia_top.v`** — purely structural top-level that instantiates and wires all four submodules; contains no combinational or sequential logic of its own

The StarCore-1 was extended with two instruction variants under opcode `1010`: **DISPATCH** (passes base addresses and vector length to the NIA, pulses `start`, PC advances immediately) and **RECEIVE** (stalls the PC until `done` is asserted, then writes the result into a register). This gives an asynchronous co-processor API — the CPU can overlap other work between dispatch and receive.

Verification was implemented at three levels, all checked against an independent Python gold standard (`gold = (Σ A[i]·B[i]) & 0xFFFF`):

1. **`tb_mac.v`** — MAC unit in isolation, hand-crafted test cases including large-value overflow verification
2. **`tb_nia_top.v`** — full NIA pipeline across N = 1, 2, 4, 8, 16, 32, 64, 128
3. **`tb_soc.v`** — full SoC integration: StarCore executes a real program (LD / LD / LD / DISPATCH / RECEIVE / JMP) and the result is verified in the register file

A Python benchmark script (`scripts/benchmark_auto.py`) sweeps N and compares hardware cycle counts against the software model, producing the speedup curve. Yosys + netlistsvg were used to generate SVG schematic views of each NIA module.

A real hardware bug was caught during development: the single-port RAM means A[i] is overwritten by B[i] on the memory output bus before the MAC unit can consume it. The fix was an internal latch register in the controller that captures A[i] in the `LATCH_A` state before the B[i] read is issued — a decision that added one FSM state but eliminated a subtle data hazard.

## RESULT

- **Speedup:** 5.2× asymptotic over StarCore-1 software (NIA: 5N+2 cycles vs software: 26N+3 cycles)
- **N=32:** 162 cycles vs 835 cycles — 5.15× faster
- **N=128:** 642 cycles vs 3331 cycles — 5.19× faster
- All three testbench levels pass for every N in {1, 2, 4, 8, 16, 32, 64, 128}
- Full SoC demo: StarCore program executes correctly, R3 holds the correct dot product at halt

## WHAT I'D DO DIFFERENTLY

The single-port memory is the primary bottleneck — fetching A[i] and B[i] on separate cycles is what drives the 5-cycle-per-element cost rather than the theoretical 1-cycle minimum. A dual-port RAM would allow simultaneous A[i] and B[i] reads, cutting the per-element cost roughly in half and pushing the speedup toward 10×. I would also implement signed arithmetic from the start — the current design treats all operands as unsigned, which is a significant limitation for real neural network weights that are typically signed fixed-point values. Finally, a DMA engine that transfers vectors directly from the StarCore data memory into the NIA RAM would remove the need for testbench-level memory preloading and make the DISPATCH instruction fully self-contained.