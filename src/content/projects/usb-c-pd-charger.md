---
title: "USB-C PD charger"
blurb: "TODO: one-sentence blurb (max 160 chars)"
period: "Mar – Jun 2025"
order: 3
featured: false
role: "Co-designed a compact 2-layer USB-C PD power subsystem with 9V negotiation, dual-mode Li-ion charging, load switching, and motor control"
# TODO: verify domain — guessed from slug; adjust to hardware | embedded | software | ml | rf
domain: hardware
stack:
  - "KiCAD"
  - "LTSpice"
keyResult: "USB-C PD negotiated to 8.95 V; 856 mA delivered at 4.2 V"
hero: ../../assets/projects/usb-c-pd-charger/hero.png
heroAlt: "USB-C PD charger PCB — 3D render of the assembled green board with USB-C connector, tactile switch, and labelled test points"
---

## PROBLEM

Designed the power subsystem for an autonomous micromouse, providing USB-C battery charging, regulated 3V3 and 5V rails, independently switchable external loads, and motor control within strict PCB size, budget, and component-sourcing constraints.

## CONSTRAINTS

9V USB-C PD input
200mA slow charging mode
600mA fast charging mode
Two independently switchable 5V loads rated for 1A each
3V3 and 5V regulated output rails
Bidirectional control of 4 motors
Compact 2-layer PCB
Components sourced through JLCPCB
Approximately 3-month development period
BOM cost of $25

## WHAT I BUILT

Designed and implemented a 2-layer PCB integrating a USB-C connector and HUSB237 PD sink controller for 9V negotiation, a BQ24074RGT Li-ion charging IC with GPIO-controlled charging modes, RT9742 high-side switches for external loads, power regulation, test points, status LEDs, and interfaces to the processor and motor circuitry.

## RESULT

USB-C output: 8.95V
Slow charging current: 180mA
Fast charging current: 180mA
Load 1: 856mA at 4.2V
Load 2: 840mA at 4.0V

## WHAT I'D DO DIFFERENTLY

I would design with greater thermal and electrical headroom from the beginning. The fast-charge path was limited by thermal regulation in the charging IC, while the load switches could not sustain the required current at the target voltage. I would improve thermal management, add current limiting and fault feedback, leave more copper and physical space around high-current components, and validate component selection against worst-case operating conditions before fabrication.
