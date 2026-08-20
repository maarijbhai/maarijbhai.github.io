---
title: "USB-C PD charger"
blurb: "Compact 2-layer PD power subsystem with 9V negotiation, dual-mode Li-ion charging, load switching, and motor control."
period: "Mar – Jun 2025"
order: 3
featured: false
role: "Co-designed a compact 2-layer USB-C PD power subsystem for an autonomous micromouse."
domain: hardware
stack:
  - "KiCAD"
  - "LTSpice"
keyResult: "USB-C PD negotiated to 8.95V; 856mA delivered at 4.2V."
hero: ../../assets/projects/usb-c-pd-charger/hero.png
heroAlt: "USB-C PD charger PCB: 3D render of the assembled green board with USB-C connector, tactile switch, and labelled test points"
teamPhoto: ../../assets/projects/usb-c-pd-charger/saeed.jpg
teamAlt: "Project partner Saeed holding the assembled USB-C PD charger PCB fresh from JLCPCB"
teamCaption: "The actual PCB we received from JLCPCB, held by my project partner Saeed."
---

## PROBLEM

Design the power subsystem for an autonomous micromouse: USB-C battery charging, regulated 3V3 and 5V rails, independently switchable external loads, and motor control, all within tight size, budget, and sourcing limits.

## CONSTRAINTS

- 9V USB-C PD input.
- 200mA slow and 600mA fast Li-ion charging modes.
- Two independently switchable 5V loads, 1A each.
- 3V3 and 5V regulated rails.
- Bidirectional control of 4 motors.
- 2-layer PCB, components via JLCPCB, ~3 months, $25 BOM.

## WHAT I BUILT

A 2-layer PCB with a USB-C connector and HUSB237 PD sink for 9V negotiation, a BQ24074RGT Li-ion charger with GPIO-selectable modes, RT9742 high-side switches for the external loads, regulation for the 3V3 and 5V rails, status LEDs, test points, and the processor and motor interfaces.

## RESULT

- USB-C output: 8.95V.
- Slow charge: 180mA. Fast charge: 180mA.
- Load 1: 856mA at 4.2V. Load 2: 840mA at 4.0V.

## WHAT I'D DO DIFFERENTLY

Design with more thermal and electrical headroom from the start. Fast-charge was limited by the charger IC's thermal regulation, and the load switches couldn't sustain the target current at voltage. Next time: better thermal management, current limiting with fault feedback, more copper around high-current parts, and worst-case validation of every part before fabrication.
