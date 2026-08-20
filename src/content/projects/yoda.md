---
title: "Project YODA"
blurb: "Neural Inference Accelerator co-processor for the StarCore-1 CPU. Computes vector dot products in hardware at 5.2x software speed."
period: "May 2026"
order: 6
featured: false
role: "Designed and implemented the NIA co-processor in Verilog: MAC datapath, control FSM, internal memory, and a three-level verification stack."
domain: digital-hardware
stack:
  - "Verilog (Icarus iVerilog)"
  - "GTKWave"
  - "Yosys"
  - "Python"
  - "Make"
keyResult: "5.2x speedup over StarCore-1 software, verified across N = 1 to 128 against an independent Python gold standard."
hero: ../../assets/projects/yoda/hero.jpg
heroAlt: "Project YODA flyer showing the NIA co-processor architecture and results"
heroFit: contain
---

## PROBLEM

The StarCore-1 is a 16-bit single-cycle RISC with no hardware multiplier. A 16-bit multiply takes ~20 cycles of shift-and-add. Neural inference is dominated by one operation, the dot product Σ A[i]·B[i], costing **26N + 3 cycles** per pass on the base CPU with the processor fully occupied. The EEE4120F HPES brief required Amdahl-style acceleration of this bottleneck.

## CONSTRAINTS

- Reserved opcode `1010` only; ISA otherwise unchanged.
- Simulation only, via iVerilog and GTKWave.
- Each block in its own `.v` file for a distinct physical unit.
- Hardware results must match an independent software gold standard for every N.
- 16-bit operands, 32-bit accumulator to hold full-precision products.

## WHAT I BUILT

A fully autonomous NIA co-processor in Verilog, five modules with no logic in the top-level:

- **`nia_memory.v`**: 256x16-bit single-port RAM holding vectors A and B, with a DMA write port for testbench preloading.
- **`nia_mac.v`**: combinational 16x16 multiplier feeding a 32-bit accumulator; clears on the first element, accumulates thereafter.
- **`nia_controller.v`**: 7-state FSM (`IDLE, FETCH_A, LATCH_A, FETCH_B, COMPUTE, CHECK, FINISH`) that sequences the dot product loop. Single-port RAM forces A[i] to be latched before B[i] is fetched, giving 5 cycles per element plus 2 overhead.
- **`nia_output_reg.v`**: captures the 32-bit accumulator onto the 16-bit result bus when `done` fires.
- **`nia_top.v`**: purely structural wiring.

StarCore-1 gained two opcode-`1010` variants: **DISPATCH** (pass base addresses and length, pulse `start`, PC advances) and **RECEIVE** (stall PC until `done`, write result to a register). The CPU can overlap other work between the two.

Verification ran at three levels against a Python gold standard `gold = (Σ A[i]·B[i]) & 0xFFFF`:

1. `tb_mac.v`: MAC in isolation, including overflow cases.
2. `tb_nia_top.v`: full NIA across N = 1, 2, 4, 8, 16, 32, 64, 128.
3. `tb_soc.v`: full SoC running a real program (LD, LD, LD, DISPATCH, RECEIVE, JMP), result checked in the register file.

A benchmark script sweeps N and plots the speedup curve. Yosys plus netlistsvg render each module's schematic.

The single-port RAM caused a real bug: A[i] was overwritten by B[i] on the bus before the MAC could consume it. Fix: an internal latch in the controller captures A[i] in the `LATCH_A` state, at the cost of one extra FSM state.

## RESULT

- 5.2x asymptotic speedup (NIA: 5N+2 vs software: 26N+3).
- N=32: 162 vs 835 cycles, 5.15x.
- N=128: 642 vs 3331 cycles, 5.19x.
- All three testbenches pass for every N in {1, 2, 4, 8, 16, 32, 64, 128}.
- SoC demo: R3 holds the correct dot product at halt.

## WHAT I'D DO DIFFERENTLY

Move to dual-port RAM so A[i] and B[i] are fetched in the same cycle. That halves the per-element cost and pushes speedup toward 10x. Add signed arithmetic from the start, since real weights are signed fixed-point. Add a DMA engine that transfers vectors from StarCore memory into the NIA RAM so DISPATCH is self-contained.
