---
title: "Micromouse"
blurb: "An autonomous maze-solving robot built in Simulink/Stateflow"
period: "June-October 2025"
order: 4
featured: false
role: "Engineered the software to make the robot solve the maze"
domain: embedded
stack:
  - "MATLAB / Simulink"
  - "Stateflow"
  - "STM32"
  - "ToF distance sensors"
  - "Wheel encoders (8 stripes/rev)"
  - "MPU gyroscope (evaluated, not used)"
keyResult: "Watch the video :)"
hero: ../../assets/placeholders/hero-16x9.svg
heroAlt: "Overhead shot of the micromouse mid-run in the 4x6 maze, walls visible, mouse centred in a corridor"
videoLoop: "/videos/micromouse-loop.webm"
videoAlt: "Micromouse solving the maze — 14-second silent loop"
videoAsHero: true
---

## PROBLEM

A micromouse has to map and traverse an unknown maze on its own. It gets no
prior map and no external positioning — only what its onboard sensors read at
the moment it reads them. The robot must therefore build its own map as it
drives, decide where to go next from that partial map, and keep track of where
it is well enough that the map stays correct.

## CONSTRAINTS

- 4x6 maze, 0.2 m cells; start at the bottom-left corner, no known goal cell —
  the run is scored on covering the maze, not on reaching a target.
- Three ToF sensors only (front, left, right). No rear or diagonal sensing, so
  walls behind the robot can never be re-checked.
- Wheel encoders with 8 stripes per revolution — 45° of wheel rotation per
  count. A 90° pivot falls between counts, so encoders alone cannot close a turn
  accurately.
- Control logic had to live in Simulink/Stateflow rather than hand-written C.
- Onboard gyro available but too noisy to integrate reliably over a turn.

## WHAT I BUILT

A Stateflow chart running the full navigation loop, with the maze reasoning in a
MATLAB Function block.

**Navigation.** Flood-fill over a 4x6 wall map. Every unvisited cell is seeded
as a goal at distance 0, distances propagate outward through known openings, and
the robot moves to the lowest-valued reachable neighbour. This gives frontier-
seeking exploration: it heads for the nearest unexplored cell, and when a dead
end forces a retreat, the same flood values route it back out. The map is
updated symmetrically — a wall seen on the robot's north face is also written as
the south wall of the cell above it.

**Discretised motion.** Rather than sensing continuously while driving, the
robot advances exactly one cell, stops, and re-reads the ToF sensors while
stationary. This trades run time for readings that aren't smeared by motion, and
was a deliberate accuracy-first choice.

**Straight-line correction.** Proportional control on ToF error. With both side
walls visible it centres on the difference between them; with one wall it holds
a fixed offset from that wall; with neither it runs open-loop. A deadband
suppresses correction on sensor noise, and motor commands are clamped so a
correction can't stall or reverse a wheel.

**Turning.** Gyro-based turn termination was implemented and then removed —
integrated heading drifted enough that turns ended at inconsistent angles.
TODO: state what you finally landed on (more encoder stripes? two-stage
fast-then-slow turn? timed turn?) and how you close a 90° pivot now.



## WHAT I'D DO DIFFERENTLY

To improve upon this project I would definitely consider improving the hardware of the micromouse to be able to have more accurate sensors. More accurate hardware would greatly improve the performance of the software that is used to drive the motor.

