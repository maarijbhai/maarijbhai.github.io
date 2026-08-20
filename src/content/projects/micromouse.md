---
title: "Micromouse"
blurb: "Autonomous maze-solving robot built in Simulink/Stateflow."
period: "June-October 2025"
order: 4
featured: true
role: "Wrote the navigation and control software that drives the robot through the maze."
domain: embedded
stack:
  - "MATLAB / Simulink"
  - "Stateflow"
  - "STM32"
  - "ToF distance sensors"
  - "Wheel encoders (8 stripes/rev)"
  - "MPU gyroscope (evaluated, not used)"
keyResult: "Watch the video :)"
hero: ../../assets/projects/micromouse/uctmm.png
heroAlt: "UCT micromouse"
heroFit: contain
videoLoop: "/videos/micromouse-loop.webm"
videoAlt: "Micromouse solving the maze, 14-second silent loop"
---

## PROBLEM

The mouse has to map and traverse an unknown 4x6 maze on its own, with no prior map and no external positioning. It must build the map as it drives, decide where to go from a partial view, and stay localised well enough for the map to remain correct.

## CONSTRAINTS

- 4x6 maze, 0.2m cells, start at bottom-left. Scored on coverage, not on reaching a target.
- Three ToF sensors (front, left, right). No rear or diagonal sensing.
- Wheel encoders at 8 stripes/rev, so a 90° pivot falls between counts.
- Control logic in Simulink/Stateflow, not hand-written C.
- Onboard gyro too noisy to integrate over a turn.

## WHAT I BUILT

A Stateflow chart running the full navigation loop, with maze reasoning in a MATLAB Function block.

**Navigation.** Flood-fill over a 4x6 wall map. Unvisited cells seed at distance 0 and propagate outward; the robot moves to the lowest-valued reachable neighbour. Dead ends fall out for free, since the same flood routes it back. Walls are written symmetrically to both adjacent cells.

**Discretised motion.** The robot advances one cell, stops, and re-reads the ToF sensors while stationary. This trades run time for readings that aren't smeared by motion.

**Straight-line correction.** Proportional control on ToF error. Two walls: centre on the difference. One wall: hold a fixed offset. No walls: open loop. A deadband ignores sensor noise, and motor commands are clamped so a correction can't stall a wheel.

**Turning.** Gyro-based turn termination was implemented and removed; integrated heading drifted too much. TODO: describe the final turn method.

## WHAT I'D DO DIFFERENTLY

Upgrade the hardware. More accurate sensors and finer encoders would remove most of the compromises the software had to work around.
